// 优化算法模块
class CostOptimizer {
    constructor() {
        this.materialDatabase = this.loadMaterialDatabase();
    }

    // 加载材料数据库
    loadMaterialDatabase() {
        const stored = localStorage.getItem('materialDatabase');
        if (stored) {
            return JSON.parse(stored);
        }
        
        // 默认材料替代数据库
        return {
            '三文鱼': [
                { name: '冰鲜三文鱼', costRatio: 0.7, qualityImpact: -0.1 },
                { name: '金枪鱼', costRatio: 0.9, qualityImpact: -0.05 },
                { name: '鲷鱼', costRatio: 0.6, qualityImpact: -0.15 }
            ],
            '黄油': [
                { name: '人造黄油', costRatio: 0.5, qualityImpact: -0.2 },
                { name: '植物黄油', costRatio: 0.6, qualityImpact: -0.15 }
            ],
            '面粉': [
                { name: '中筋面粉', costRatio: 0.8, qualityImpact: -0.05 },
                { name: '低筋面粉', costRatio: 0.9, qualityImpact: 0 }
            ],
            '鲜奶油': [
                { name: '植脂奶油', costRatio: 0.6, qualityImpact: -0.2 },
                { name: '淡奶油', costRatio: 0.85, qualityImpact: -0.1 }
            ],
            '白砂糖': [
                { name: '绵白糖', costRatio: 0.95, qualityImpact: 0 },
                { name: '红糖', costRatio: 0.9, qualityImpact: -0.05 }
            ],
            '巧克力': [
                { name: '代可可脂巧克力', costRatio: 0.5, qualityImpact: -0.25 },
                { name: '黑巧克力', costRatio: 1.1, qualityImpact: 0.1 }
            ],
            '芝士': [
                { name: '奶油芝士', costRatio: 0.9, qualityImpact: -0.05 },
                { name: '马苏里拉芝士', costRatio: 0.85, qualityImpact: -0.1 }
            ],
            '牛肉': [
                { name: '碎牛肉', costRatio: 0.7, qualityImpact: -0.15 },
                { name: '鸡肉', costRatio: 0.4, qualityImpact: -0.3 }
            ],
            '虾仁': [
                { name: '冷冻虾仁', costRatio: 0.7, qualityImpact: -0.1 },
                { name: '小虾仁', costRatio: 0.6, qualityImpact: -0.15 }
            ]
        };
    }

    // 保存材料数据库
    saveMaterialDatabase() {
        localStorage.setItem('materialDatabase', JSON.stringify(this.materialDatabase));
    }

    /**
     * 生成优化建议
     * @param {Object} recipe - 配方对象
     * @returns {Object} 优化建议列表
     */
    generateOptimizations(recipe) {
        const currentCost = costCalculator.calculateRecipeCost(recipe);
        const suggestions = [];

        // 1. 材料替代建议
        const substitutionSuggestions = this.generateSubstitutionSuggestions(recipe, currentCost);
        suggestions.push(...substitutionSuggestions);

        // 2. 用量优化建议
        const quantitySuggestions = this.generateQuantityOptimizations(recipe, currentCost);
        suggestions.push(...quantitySuggestions);

        // 3. 损耗率优化建议
        const wastageSuggestions = this.generateWastageOptimizations(recipe, currentCost);
        suggestions.push(...wastageSuggestions);

        // 4. 配方整体优化建议
        const recipeSuggestions = this.generateRecipeOptimizations(recipe, currentCost);
        suggestions.push(...recipeSuggestions);

        // 按优先级和节省金额排序
        const sortedSuggestions = this.rankSuggestions(suggestions);

        // 计算最佳优化方案
        const bestOptimization = this.calculateBestOptimization(sortedSuggestions, currentCost);

        return {
            currentCost: currentCost.unitCost,
            totalSuggestions: sortedSuggestions.length,
            suggestions: sortedSuggestions,
            bestOptimization
        };
    }

    /**
     * 生成材料替代建议
     */
    generateSubstitutionSuggestions(recipe, currentCost) {
        const suggestions = [];

        recipe.materials.forEach(material => {
            const alternatives = this.materialDatabase[material.name];
            
            if (alternatives && alternatives.length > 0) {
                alternatives.forEach(alt => {
                    const currentMaterialCost = material.unitPrice * material.quantity * (1 + (material.wastageRate || 0));
                    const newPrice = material.unitPrice * alt.costRatio;
                    const newCost = newPrice * material.quantity * (1 + (material.wastageRate || 0));
                    const savings = currentMaterialCost - newCost;
                    const savingsPercent = (savings / currentCost.unitCost * 100);

                    if (savings > 0.1) { // 只推荐节省超过0.1元的替代
                        suggestions.push({
                            type: 'substitution',
                            title: `替换材料：${material.name} → ${alt.name}`,
                            description: `将 ${material.name} 替换为 ${alt.name}，可降低材料成本。`,
                            originalMaterial: material.name,
                            newMaterial: alt.name,
                            currentCost: currentMaterialCost,
                            newCost: newCost,
                            savings: savings,
                            savingsPercent: savingsPercent,
                            qualityImpact: alt.qualityImpact,
                            feasibility: this.calculateFeasibility(alt.qualityImpact),
                            implementation: `采购 ${alt.name} 替代 ${material.name}，注意口味调整。`,
                            priority: this.calculatePriority(savings, savingsPercent, alt.qualityImpact)
                        });
                    }
                });
            }
        });

        return suggestions;
    }

    /**
     * 生成用量优化建议
     */
    generateQuantityOptimizations(recipe, currentCost) {
        const suggestions = [];

        // 分析高成本材料，建议适当减少用量
        const sortedMaterials = [...recipe.materials].sort((a, b) => {
            const costA = a.unitPrice * a.quantity;
            const costB = b.unitPrice * b.quantity;
            return costB - costA;
        });

        // 对成本最高的前3种材料提出优化建议
        sortedMaterials.slice(0, 3).forEach(material => {
            const currentMaterialCost = material.unitPrice * material.quantity * (1 + (material.wastageRate || 0));
            const materialCostRatio = currentMaterialCost / currentCost.materialCost;

            if (materialCostRatio > 0.25) { // 如果单个材料成本占比超过25%
                const reductionPercent = 10; // 建议减少10%
                const newQuantity = material.quantity * (1 - reductionPercent / 100);
                const newCost = material.unitPrice * newQuantity * (1 + (material.wastageRate || 0));
                const savings = currentMaterialCost - newCost;

                suggestions.push({
                    type: 'quantity',
                    title: `减少用量：${material.name}`,
                    description: `${material.name} 成本占比较高（${(materialCostRatio * 100).toFixed(1)}%），建议适当减少用量。`,
                    material: material.name,
                    currentQuantity: material.quantity,
                    newQuantity: newQuantity,
                    reductionPercent: reductionPercent,
                    savings: savings,
                    savingsPercent: (savings / currentCost.unitCost * 100),
                    qualityImpact: -0.05,
                    feasibility: 0.8,
                    implementation: `将 ${material.name} 用量从 ${material.quantity}${material.unit} 减少到 ${newQuantity.toFixed(2)}${material.unit}。`,
                    priority: this.calculatePriority(savings, savings / currentCost.unitCost * 100, -0.05)
                });
            }
        });

        return suggestions;
    }

    /**
     * 生成损耗率优化建议
     */
    generateWastageOptimizations(recipe, currentCost) {
        const suggestions = [];

        recipe.materials.forEach(material => {
            const wastageRate = material.wastageRate || 0;
            
            if (wastageRate > 0.1) { // 损耗率超过10%
                const currentWastage = material.unitPrice * material.quantity * wastageRate;
                const targetWastageRate = Math.max(0.03, wastageRate * 0.5); // 目标减半，最低3%
                const newWastage = material.unitPrice * material.quantity * targetWastageRate;
                const savings = currentWastage - newWastage;

                suggestions.push({
                    type: 'wastage',
                    title: `降低损耗：${material.name}`,
                    description: `${material.name} 损耗率较高（${(wastageRate * 100).toFixed(1)}%），通过改进工艺可降低损耗。`,
                    material: material.name,
                    currentWastageRate: wastageRate,
                    targetWastageRate: targetWastageRate,
                    savings: savings,
                    savingsPercent: (savings / currentCost.unitCost * 100),
                    qualityImpact: 0.05, // 改进工艺可能提升质量
                    feasibility: 0.7,
                    implementation: `优化 ${material.name} 的处理流程：提升员工技能培训、改进切割/配料方法、优化存储条件。`,
                    priority: this.calculatePriority(savings, savings / currentCost.unitCost * 100, 0.05)
                });
            }
        });

        return suggestions;
    }

    /**
     * 生成配方整体优化建议
     */
    generateRecipeOptimizations(recipe, currentCost) {
        const suggestions = [];

        // 1. 批量生产建议
        if (recipe.yield < 10) {
            const batchSavings = currentCost.unitCost * 0.15; // 批量生产可节省约15%
            suggestions.push({
                type: 'recipe',
                title: '增加批量生产',
                description: '提高产出数量，通过规模效应降低单位成本。',
                currentYield: recipe.yield,
                recommendedYield: recipe.yield * 5,
                savings: batchSavings,
                savingsPercent: 15,
                qualityImpact: 0,
                feasibility: 0.9,
                implementation: '调整生产计划，一次制作更多份数以摊薄固定成本和人工成本。',
                priority: this.calculatePriority(batchSavings, 15, 0)
            });
        }

        // 2. 人工成本优化
        if (currentCost.laborCost > 0 && currentCost.laborCostPercentage > 30) {
            const targetLaborCost = currentCost.laborCost * 0.8;
            const savings = currentCost.laborCost - targetLaborCost;
            
            suggestions.push({
                type: 'recipe',
                title: '优化人工成本',
                description: `人工成本占比较高（${currentCost.laborCostPercentage}%），可通过流程优化降低。`,
                currentLaborCost: currentCost.laborCost,
                targetLaborCost: targetLaborCost,
                savings: savings,
                savingsPercent: (savings / currentCost.unitCost * 100),
                qualityImpact: 0,
                feasibility: 0.8,
                implementation: '简化制作流程、使用辅助工具、提升员工熟练度、实施标准化作业。',
                priority: this.calculatePriority(savings, savings / currentCost.unitCost * 100, 0)
            });
        }

        return suggestions;
    }

    /**
     * 计算可行性分数
     */
    calculateFeasibility(qualityImpact) {
        // 质量影响越小，可行性越高
        if (qualityImpact >= 0) return 1.0;
        if (qualityImpact >= -0.1) return 0.9;
        if (qualityImpact >= -0.2) return 0.7;
        if (qualityImpact >= -0.3) return 0.5;
        return 0.3;
    }

    /**
     * 计算优先级
     */
    calculatePriority(savings, savingsPercent, qualityImpact) {
        // 综合评分：成本节省(40%) + 可行性(30%) + 品质影响(30%)
        const savingsScore = Math.min(savingsPercent / 20, 1) * 40; // 节省20%得满分
        const feasibilityScore = this.calculateFeasibility(qualityImpact) * 30;
        const qualityScore = (1 + qualityImpact) * 30; // 质量不降或提升得高分

        const totalScore = savingsScore + feasibilityScore + qualityScore;

        if (totalScore >= 80) return 'high';
        if (totalScore >= 60) return 'medium';
        return 'low';
    }

    /**
     * 对建议进行排序
     */
    rankSuggestions(suggestions) {
        return suggestions.sort((a, b) => {
            // 优先级高的排前面
            const priorityOrder = { high: 3, medium: 2, low: 1 };
            if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
                return priorityOrder[b.priority] - priorityOrder[a.priority];
            }
            // 同优先级按节省金额排序
            return b.savings - a.savings;
        });
    }

    /**
     * 计算最佳优化方案（组合多个建议）
     */
    calculateBestOptimization(suggestions, currentCost) {
        if (suggestions.length === 0) {
            return {
                totalSavings: 0,
                totalSavingsPercent: 0,
                optimizedCost: currentCost.unitCost,
                selectedSuggestions: []
            };
        }

        // 选择高优先级和中优先级的建议
        const selectedSuggestions = suggestions.filter(s => 
            s.priority === 'high' || s.priority === 'medium'
        ).slice(0, 5); // 最多选择5个建议

        const totalSavings = selectedSuggestions.reduce((sum, s) => sum + s.savings, 0);
        const optimizedCost = currentCost.unitCost - totalSavings;
        const totalSavingsPercent = (totalSavings / currentCost.unitCost * 100);

        return {
            totalSavings,
            totalSavingsPercent,
            optimizedCost,
            currentCost: currentCost.unitCost,
            selectedSuggestions: selectedSuggestions.map(s => ({
                title: s.title,
                savings: s.savings,
                type: s.type
            }))
        };
    }

    /**
     * 应用优化建议到配方
     */
    applyOptimization(recipe, suggestionIndex, suggestions) {
        const suggestion = suggestions[suggestionIndex];
        if (!suggestion) return null;

        const optimizedRecipe = JSON.parse(JSON.stringify(recipe)); // 深拷贝

        switch (suggestion.type) {
            case 'substitution':
                // 替换材料
                const materialIndex = optimizedRecipe.materials.findIndex(
                    m => m.name === suggestion.originalMaterial
                );
                if (materialIndex !== -1) {
                    optimizedRecipe.materials[materialIndex].name = suggestion.newMaterial;
                    optimizedRecipe.materials[materialIndex].unitPrice *= 
                        (suggestion.newCost / suggestion.currentCost);
                }
                break;

            case 'quantity':
                // 调整用量
                const qtyMaterialIndex = optimizedRecipe.materials.findIndex(
                    m => m.name === suggestion.material
                );
                if (qtyMaterialIndex !== -1) {
                    optimizedRecipe.materials[qtyMaterialIndex].quantity = suggestion.newQuantity;
                }
                break;

            case 'wastage':
                // 降低损耗率
                const wasteMaterialIndex = optimizedRecipe.materials.findIndex(
                    m => m.name === suggestion.material
                );
                if (wasteMaterialIndex !== -1) {
                    optimizedRecipe.materials[wasteMaterialIndex].wastageRate = suggestion.targetWastageRate;
                }
                break;

            case 'recipe':
                // 配方级优化
                if (suggestion.recommendedYield) {
                    optimizedRecipe.yield = suggestion.recommendedYield;
                }
                if (suggestion.targetLaborCost) {
                    optimizedRecipe.laborCost = suggestion.targetLaborCost;
                }
                break;
        }

        return optimizedRecipe;
    }

    /**
     * 批量应用多个优化建议
     */
    applyMultipleOptimizations(recipe, suggestionIndices, suggestions) {
        let optimizedRecipe = JSON.parse(JSON.stringify(recipe));

        suggestionIndices.forEach(index => {
            optimizedRecipe = this.applyOptimization(optimizedRecipe, index, suggestions) || optimizedRecipe;
        });

        return optimizedRecipe;
    }

    /**
     * 添加新的材料替代品
     */
    addMaterialAlternative(materialName, alternative) {
        if (!this.materialDatabase[materialName]) {
            this.materialDatabase[materialName] = [];
        }
        this.materialDatabase[materialName].push(alternative);
        this.saveMaterialDatabase();
    }

    /**
     * 获取材料数据库
     */
    getMaterialDatabase() {
        return this.materialDatabase;
    }
}

// 创建全局实例
const costOptimizer = new CostOptimizer();

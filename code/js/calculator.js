// 成本计算引擎
class CostCalculator {
    constructor() {
        this.recipes = this.loadRecipes();
    }

    // 从localStorage加载配方
    loadRecipes() {
        const stored = localStorage.getItem('recipes');
        return stored ? JSON.parse(stored) : [];
    }

    // 保存配方到localStorage
    saveRecipes() {
        localStorage.setItem('recipes', JSON.stringify(this.recipes));
    }

    // 添加新配方
    addRecipe(recipe) {
        recipe.id = Date.now().toString();
        recipe.createdAt = new Date().toISOString();
        this.recipes.push(recipe);
        this.saveRecipes();
        return recipe;
    }

    // 更新配方
    updateRecipe(id, updatedRecipe) {
        const index = this.recipes.findIndex(r => r.id === id);
        if (index !== -1) {
            this.recipes[index] = { ...this.recipes[index], ...updatedRecipe };
            this.saveRecipes();
            return this.recipes[index];
        }
        return null;
    }

    // 删除配方
    deleteRecipe(id) {
        const index = this.recipes.findIndex(r => r.id === id);
        if (index !== -1) {
            this.recipes.splice(index, 1);
            this.saveRecipes();
            return true;
        }
        return false;
    }

    // 获取配方
    getRecipe(id) {
        return this.recipes.find(r => r.id === id);
    }

    // 获取所有配方
    getAllRecipes() {
        return this.recipes;
    }

    /**
     * 计算单个材料的成本
     * @param {Object} material - 材料对象
     * @returns {Object} 包含成本详情的对象
     */
    calculateMaterialCost(material) {
        const {
            name,
            unit,
            unitPrice,
            quantity,
            wastageRate = 0
        } = material;

        // 实际用量 = 需求量 × (1 + 损耗率)
        const actualQuantity = quantity * (1 + wastageRate);
        
        // 材料成本 = 单价 × 实际用量
        const cost = unitPrice * actualQuantity;
        
        // 损耗成本 = 单价 × 需求量 × 损耗率
        const wastageCost = unitPrice * quantity * wastageRate;

        return {
            name,
            unit,
            unitPrice,
            requestedQuantity: quantity,
            wastageRate,
            actualQuantity,
            cost,
            wastageCost
        };
    }

    /**
     * 计算配方总成本
     * @param {Object} recipe - 配方对象
     * @returns {Object} 详细的成本分析结果
     */
    calculateRecipeCost(recipe) {
        const {
            foodType,
            recipeName,
            materials = [],
            laborCost = 0,
            yield: recipeYield = 1
        } = recipe;

        // 计算所有材料成本
        const materialDetails = materials.map(material => 
            this.calculateMaterialCost(material)
        );

        // 总材料成本
        const totalMaterialCost = materialDetails.reduce(
            (sum, m) => sum + m.cost, 
            0
        );

        // 总损耗成本
        const totalWastageCost = materialDetails.reduce(
            (sum, m) => sum + m.wastageCost,
            0
        );

        // 总成本 = 材料成本 + 人工成本
        const totalCost = totalMaterialCost + laborCost;

        // 单份成本
        const unitCost = totalCost / recipeYield;

        // 计算每个材料的成本占比
        const materialsWithPercentage = materialDetails.map(m => ({
            ...m,
            percentage: totalMaterialCost > 0 
                ? (m.cost / totalMaterialCost * 100).toFixed(2)
                : 0
        }));

        return {
            recipeId: recipe.id,
            foodType,
            recipeName,
            yield: recipeYield,
            materialCost: totalMaterialCost,
            laborCost,
            totalCost,
            unitCost,
            wastageCost: totalWastageCost,
            materials: materialsWithPercentage,
            laborCostPercentage: totalCost > 0 
                ? (laborCost / totalCost * 100).toFixed(2)
                : 0,
            materialCostPercentage: totalCost > 0
                ? (totalMaterialCost / totalCost * 100).toFixed(2)
                : 0
        };
    }

    /**
     * 批量计算多个配方
     * @param {Array} recipeIds - 配方ID数组
     * @returns {Array} 成本计算结果数组
     */
    calculateBatchRecipes(recipeIds) {
        return recipeIds.map(id => {
            const recipe = this.getRecipe(id);
            if (recipe) {
                return this.calculateRecipeCost(recipe);
            }
            return null;
        }).filter(r => r !== null);
    }

    /**
     * 对比多个配方的成本
     * @param {Array} recipeIds - 配方ID数组
     * @returns {Object} 对比分析结果
     */
    compareRecipes(recipeIds) {
        const results = this.calculateBatchRecipes(recipeIds);
        
        if (results.length === 0) {
            return null;
        }

        // 找出最低和最高成本
        const costs = results.map(r => r.unitCost);
        const minCost = Math.min(...costs);
        const maxCost = Math.max(...costs);
        const avgCost = costs.reduce((a, b) => a + b, 0) / costs.length;

        return {
            recipes: results,
            summary: {
                count: results.length,
                minCost,
                maxCost,
                avgCost,
                costRange: maxCost - minCost
            }
        };
    }

    /**
     * 生成成本趋势数据（用于图表）
     * @param {Object} costResult - 成本计算结果
     * @returns {Object} 图表数据
     */
    generateChartData(costResult) {
        const { materials, laborCost, materialCost } = costResult;
        
        // 饼图数据 - 材料分布
        const materialChartData = {
            labels: materials.map(m => m.name),
            datasets: [{
                data: materials.map(m => m.cost),
                backgroundColor: [
                    '#2563eb', '#3b82f6', '#60a5fa', '#93c5fd',
                    '#10b981', '#34d399', '#6ee7b7', '#a7f3d0',
                    '#f59e0b', '#fbbf24', '#fcd34d', '#fde68a'
                ]
            }]
        };

        // 成本构成柱状图
        const costBreakdownData = {
            labels: ['材料成本', '人工成本'],
            datasets: [{
                label: '成本（元）',
                data: [materialCost, laborCost],
                backgroundColor: ['#2563eb', '#10b981']
            }]
        };

        return {
            materialChart: materialChartData,
            costBreakdown: costBreakdownData
        };
    }

    /**
     * 导出配方为JSON
     * @param {String} recipeId - 配方ID
     * @returns {String} JSON字符串
     */
    exportRecipeJSON(recipeId) {
        const recipe = this.getRecipe(recipeId);
        if (!recipe) return null;
        
        const costResult = this.calculateRecipeCost(recipe);
        return JSON.stringify({
            recipe,
            costAnalysis: costResult,
            exportedAt: new Date().toISOString()
        }, null, 2);
    }

    /**
     * 导入配方从JSON
     * @param {String} jsonString - JSON字符串
     * @returns {Object} 导入的配方
     */
    importRecipeJSON(jsonString) {
        try {
            const data = JSON.parse(jsonString);
            const recipe = data.recipe;
            // 移除旧ID，创建新配方
            delete recipe.id;
            delete recipe.createdAt;
            return this.addRecipe(recipe);
        } catch (error) {
            console.error('导入配方失败:', error);
            return null;
        }
    }

    /**
     * 验证配方数据
     * @param {Object} recipe - 配方对象
     * @returns {Object} 验证结果
     */
    validateRecipe(recipe) {
        const errors = [];

        if (!recipe.recipeName || recipe.recipeName.trim() === '') {
            errors.push('配方名称不能为空');
        }

        if (!recipe.foodType || recipe.foodType.trim() === '') {
            errors.push('食物类型不能为空');
        }

        if (!recipe.yield || recipe.yield < 1) {
            errors.push('产出数量必须大于0');
        }

        if (!recipe.materials || recipe.materials.length === 0) {
            errors.push('至少需要添加一种材料');
        } else {
            recipe.materials.forEach((material, index) => {
                if (!material.name || material.name.trim() === '') {
                    errors.push(`材料${index + 1}名称不能为空`);
                }
                if (!material.unitPrice || material.unitPrice < 0) {
                    errors.push(`材料${index + 1}单价必须大于等于0`);
                }
                if (!material.quantity || material.quantity <= 0) {
                    errors.push(`材料${index + 1}用量必须大于0`);
                }
                if (material.wastageRate && (material.wastageRate < 0 || material.wastageRate > 1)) {
                    errors.push(`材料${index + 1}损耗率必须在0-1之间`);
                }
            });
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * 获取统计信息
     * @returns {Object} 统计数据
     */
    getStatistics() {
        const recipes = this.getAllRecipes();
        const totalRecipes = recipes.length;

        if (totalRecipes === 0) {
            return {
                totalRecipes: 0,
                byFoodType: {},
                averageCost: 0,
                totalMaterials: 0
            };
        }

        // 按食物类型分组
        const byFoodType = recipes.reduce((acc, recipe) => {
            acc[recipe.foodType] = (acc[recipe.foodType] || 0) + 1;
            return acc;
        }, {});

        // 计算平均成本
        const costs = recipes.map(r => {
            const result = this.calculateRecipeCost(r);
            return result.unitCost;
        });
        const averageCost = costs.reduce((a, b) => a + b, 0) / costs.length;

        // 统计材料总数
        const totalMaterials = recipes.reduce((sum, r) => 
            sum + (r.materials ? r.materials.length : 0), 0
        );

        return {
            totalRecipes,
            byFoodType,
            averageCost,
            totalMaterials,
            avgMaterialsPerRecipe: (totalMaterials / totalRecipes).toFixed(1)
        };
    }
}

// 创建全局实例
const costCalculator = new CostCalculator();

// Excel文件处理模块
class FileHandler {
    constructor() {
        this.currentImportData = null;
    }

    /**
     * 处理文件上传
     * @param {File} file - 上传的文件
     * @returns {Promise} 解析结果
     */
    async handleFileUpload(file) {
        const fileExtension = file.name.split('.').pop().toLowerCase();
        
        if (!['xlsx', 'xls', 'csv'].includes(fileExtension)) {
            throw new Error('不支持的文件格式。请上传Excel (.xlsx, .xls) 或CSV文件。');
        }

        try {
            if (fileExtension === 'csv') {
                return await this.parseCSV(file);
            } else {
                return await this.parseExcel(file);
            }
        } catch (error) {
            console.error('文件解析失败:', error);
            throw new Error(`文件解析失败: ${error.message}`);
        }
    }

    /**
     * 解析Excel文件
     */
    async parseExcel(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const data = new Uint8Array(e.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });
                    
                    // 读取第一个工作表
                    const firstSheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[firstSheetName];
                    
                    // 转换为JSON
                    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                    
                    // 解析数据
                    const parsedRecipes = this.parseRecipeData(jsonData);
                    
                    this.currentImportData = parsedRecipes;
                    resolve(parsedRecipes);
                } catch (error) {
                    reject(error);
                }
            };
            
            reader.onerror = () => reject(new Error('文件读取失败'));
            reader.readAsArrayBuffer(file);
        });
    }

    /**
     * 解析CSV文件
     */
    async parseCSV(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const text = e.target.result;
                    const lines = text.split('\n').map(line => 
                        line.split(',').map(cell => cell.trim())
                    );
                    
                    const parsedRecipes = this.parseRecipeData(lines);
                    
                    this.currentImportData = parsedRecipes;
                    resolve(parsedRecipes);
                } catch (error) {
                    reject(error);
                }
            };
            
            reader.onerror = () => reject(new Error('文件读取失败'));
            reader.readAsText(file, 'UTF-8');
        });
    }

    /**
     * 解析配方数据
     * 期望格式：
     * 配方名称 | 食物类型 | 产出数量 | 人工成本 | 材料名称 | 单位 | 单价 | 用量 | 损耗率
     */
    parseRecipeData(data) {
        const recipes = [];
        let currentRecipe = null;

        // 跳过标题行
        for (let i = 1; i < data.length; i++) {
            const row = data[i];
            
            if (!row || row.length === 0 || !row[0]) continue;

            const recipeName = row[0]?.toString().trim();
            const foodType = row[1]?.toString().trim();
            const recipeYield = parseFloat(row[2]) || 1;
            const laborCost = parseFloat(row[3]) || 0;
            const materialName = row[4]?.toString().trim();
            const unit = row[5]?.toString().trim() || '克';
            const unitPrice = parseFloat(row[6]) || 0;
            const quantity = parseFloat(row[7]) || 0;
            const wastageRate = parseFloat(row[8]) || 0;

            // 检查是否是新配方（配方名称不为空）
            if (recipeName && foodType) {
                // 保存当前配方
                if (currentRecipe && currentRecipe.materials.length > 0) {
                    recipes.push(currentRecipe);
                }
                
                // 创建新配方
                currentRecipe = {
                    recipeName: recipeName,
                    foodType: foodType,
                    yield: recipeYield,
                    laborCost: laborCost,
                    materials: []
                };
            }

            // 添加材料到当前配方
            if (currentRecipe && materialName && quantity > 0) {
                currentRecipe.materials.push({
                    name: materialName,
                    unit: unit,
                    unitPrice: unitPrice,
                    quantity: quantity,
                    wastageRate: wastageRate
                });
            }
        }

        // 保存最后一个配方
        if (currentRecipe && currentRecipe.materials.length > 0) {
            recipes.push(currentRecipe);
        }

        return recipes;
    }

    /**
     * 导出单个配方为Excel
     */
    exportRecipeToExcel(recipeId) {
        const recipe = costCalculator.getRecipe(recipeId);
        if (!recipe) {
            throw new Error('配方不存在');
        }

        const costResult = costCalculator.calculateRecipeCost(recipe);
        
        // 创建工作簿
        const wb = XLSX.utils.book_new();
        
        // 基本信息工作表
        const basicInfo = [
            ['配方名称', recipe.recipeName],
            ['食物类型', recipe.foodType],
            ['产出数量', recipe.yield],
            ['人工成本', recipe.laborCost],
            ['总成本', costResult.totalCost.toFixed(2)],
            ['单份成本', costResult.unitCost.toFixed(2)],
            ['创建时间', recipe.createdAt ? new Date(recipe.createdAt).toLocaleString('zh-CN') : '-']
        ];
        const wsBasic = XLSX.utils.aoa_to_sheet(basicInfo);
        XLSX.utils.book_append_sheet(wb, wsBasic, '基本信息');

        // 材料明细工作表
        const materialData = [
            ['材料名称', '单位', '单价', '用量', '损耗率', '成本', '占比']
        ];
        costResult.materials.forEach(m => {
            materialData.push([
                m.name,
                m.unit,
                m.unitPrice.toFixed(2),
                m.requestedQuantity,
                ((m.wastageRate || 0) * 100).toFixed(1) + '%',
                m.cost.toFixed(2),
                m.percentage + '%'
            ]);
        });
        const wsMaterials = XLSX.utils.aoa_to_sheet(materialData);
        XLSX.utils.book_append_sheet(wb, wsMaterials, '材料明细');

        // 生成文件
        const fileName = `${recipe.recipeName}_成本分析_${new Date().toISOString().split('T')[0]}.xlsx`;
        XLSX.writeFile(wb, fileName);
    }

    /**
     * 导出多个配方为Excel
     */
    exportMultipleRecipesToExcel(recipeIds) {
        const wb = XLSX.utils.book_new();
        
        // 汇总工作表
        const summaryData = [
            ['配方名称', '食物类型', '产出数量', '材料成本', '人工成本', '总成本', '单份成本']
        ];

        recipeIds.forEach(id => {
            const recipe = costCalculator.getRecipe(id);
            if (recipe) {
                const costResult = costCalculator.calculateRecipeCost(recipe);
                summaryData.push([
                    recipe.recipeName,
                    recipe.foodType,
                    recipe.yield,
                    costResult.materialCost.toFixed(2),
                    costResult.laborCost.toFixed(2),
                    costResult.totalCost.toFixed(2),
                    costResult.unitCost.toFixed(2)
                ]);
            }
        });

        const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
        XLSX.utils.book_append_sheet(wb, wsSummary, '成本汇总');

        // 为每个配方创建详细工作表
        recipeIds.forEach((id, index) => {
            const recipe = costCalculator.getRecipe(id);
            if (!recipe || index >= 10) return; // 最多10个工作表

            const costResult = costCalculator.calculateRecipeCost(recipe);
            
            const detailData = [
                ['配方信息'],
                ['名称', recipe.recipeName],
                ['类型', recipe.foodType],
                ['产出', recipe.yield],
                ['人工成本', recipe.laborCost],
                [],
                ['材料名称', '单位', '单价', '用量', '损耗率', '成本', '占比']
            ];

            costResult.materials.forEach(m => {
                detailData.push([
                    m.name,
                    m.unit,
                    m.unitPrice.toFixed(2),
                    m.requestedQuantity,
                    ((m.wastageRate || 0) * 100).toFixed(1) + '%',
                    m.cost.toFixed(2),
                    m.percentage + '%'
                ]);
            });

            const wsDetail = XLSX.utils.aoa_to_sheet(detailData);
            XLSX.utils.book_append_sheet(wb, wsDetail, recipe.recipeName.substring(0, 30));
        });

        // 生成文件
        const fileName = `配方成本分析汇总_${new Date().toISOString().split('T')[0]}.xlsx`;
        XLSX.writeFile(wb, fileName);
    }

    /**
     * 生成并下载Excel模板
     */
    downloadTemplate() {
        const templateData = [
            ['配方名称', '食物类型', '产出数量', '人工成本', '材料名称', '单位', '单价', '用量', '损耗率'],
            ['三文鱼寿司', '寿司', 2, 2, '三文鱼', '克', 0.08, 30, 0.05],
            ['', '', '', '', '米饭', '克', 0.005, 150, 0.02],
            ['', '', '', '', '海苔', '片', 0.5, 1, 0],
            ['', '', '', '', '酱油', '毫升', 0.01, 10, 0],
            [],
            ['巧克力蛋糕', '蛋糕', 1, 3, '面粉', '克', 0.01, 200, 0.03],
            ['', '', '', '', '鸡蛋', '个', 0.8, 3, 0.1],
            ['', '', '', '', '糖', '克', 0.01, 150, 0.02],
            ['', '', '', '', '黄油', '克', 0.03, 100, 0.05],
            ['', '', '', '', '巧克力', '克', 0.05, 80, 0.03],
            [],
            ['牛肉汉堡', '汉堡', 1, 2.5, '牛肉饼', '个', 5, 1, 0.05],
            ['', '', '', '', '面包', '个', 1.5, 1, 0.02],
            ['', '', '', '', '生菜', '片', 0.3, 2, 0.1],
            ['', '', '', '', '番茄', '个', 1, 1, 0.15],
            ['', '', '', '', '芝士', '片', 1, 1, 0]
        ];

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet(templateData);
        
        // 设置列宽
        ws['!cols'] = [
            { wch: 15 }, { wch: 10 }, { wch: 10 }, { wch: 10 },
            { wch: 12 }, { wch: 8 }, { wch: 8 }, { wch: 8 }, { wch: 8 }
        ];

        XLSX.utils.book_append_sheet(wb, ws, '配方模板');
        
        // 添加说明工作表
        const instructionData = [
            ['Excel模板使用说明'],
            [],
            ['1. 基本规则'],
            ['   - 第一行为标题，请勿修改'],
            ['   - 每个配方的第一行需填写：配方名称、食物类型、产出数量、人工成本'],
            ['   - 材料行的配方名称等字段留空，仅填写材料信息'],
            ['   - 不同配方之间可以用空行分隔（可选）'],
            [],
            ['2. 字段说明'],
            ['   - 配方名称：配方的名称，如"三文鱼寿司"'],
            ['   - 食物类型：寿司/蛋糕/面包/披萨/汉堡/其他'],
            ['   - 产出数量：一次制作的份数'],
            ['   - 人工成本：每次制作的人工成本（元）'],
            ['   - 材料名称：材料的名称'],
            ['   - 单位：克/毫升/个/片等'],
            ['   - 单价：材料的单价（元/单位）'],
            ['   - 用量：该材料的用量'],
            ['   - 损耗率：0-1之间的小数，如0.05表示5%'],
            [],
            ['3. 示例'],
            ['   请参考"配方模板"工作表中的三个示例配方'],
            [],
            ['4. 导入步骤'],
            ['   - 按照模板格式填写数据'],
            ['   - 保存文件'],
            ['   - 在工具中选择"导入Excel"'],
            ['   - 上传文件并确认导入']
        ];

        const wsInstruction = XLSX.utils.aoa_to_sheet(instructionData);
        wsInstruction['!cols'] = [{ wch: 80 }];
        XLSX.utils.book_append_sheet(wb, wsInstruction, '使用说明');

        XLSX.writeFile(wb, '食品成本计算工具_导入模板.xlsx');
    }

    /**
     * 导出优化报告为Excel
     */
    exportOptimizationReport(recipeId, optimizationResult) {
        const recipe = costCalculator.getRecipe(recipeId);
        if (!recipe) {
            throw new Error('配方不存在');
        }

        const wb = XLSX.utils.book_new();

        // 优化概览
        const summaryData = [
            ['优化分析报告'],
            ['配方名称', recipe.recipeName],
            ['当前成本', optimizationResult.currentCost.toFixed(2) + '元'],
            ['优化后成本', optimizationResult.bestOptimization.optimizedCost.toFixed(2) + '元'],
            ['节省金额', optimizationResult.bestOptimization.totalSavings.toFixed(2) + '元'],
            ['节省比例', optimizationResult.bestOptimization.totalSavingsPercent.toFixed(2) + '%'],
            [],
            ['建议总数', optimizationResult.totalSuggestions]
        ];

        const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
        XLSX.utils.book_append_sheet(wb, wsSummary, '优化概览');

        // 优化建议明细
        const suggestionsData = [
            ['优先级', '类型', '建议标题', '描述', '节省金额', '节省比例', '可行性', '实施方法']
        ];

        optimizationResult.suggestions.forEach(s => {
            suggestionsData.push([
                s.priority === 'high' ? '高' : s.priority === 'medium' ? '中' : '低',
                s.type === 'substitution' ? '材料替换' :
                    s.type === 'quantity' ? '用量优化' :
                    s.type === 'wastage' ? '损耗优化' : '配方优化',
                s.title,
                s.description,
                s.savings.toFixed(2),
                s.savingsPercent.toFixed(2) + '%',
                (s.feasibility * 100).toFixed(0) + '%',
                s.implementation
            ]);
        });

        const wsSuggestions = XLSX.utils.aoa_to_sheet(suggestionsData);
        wsSuggestions['!cols'] = [
            { wch: 8 }, { wch: 12 }, { wch: 25 }, { wch: 35 },
            { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 50 }
        ];
        XLSX.utils.book_append_sheet(wb, wsSuggestions, '优化建议');

        const fileName = `${recipe.recipeName}_优化报告_${new Date().toISOString().split('T')[0]}.xlsx`;
        XLSX.writeFile(wb, fileName);
    }

    /**
     * 导出所有配方数据为JSON备份
     */
    exportAllDataJSON() {
        const allRecipes = costCalculator.getAllRecipes();
        const materialDB = costOptimizer.getMaterialDatabase();
        
        const backupData = {
            version: '1.0',
            exportDate: new Date().toISOString(),
            recipes: allRecipes,
            materialDatabase: materialDB
        };

        const dataStr = JSON.stringify(backupData, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `食品成本数据备份_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
    }

    /**
     * 从JSON恢复数据
     */
    async importDataJSON(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const backupData = JSON.parse(e.target.result);
                    
                    if (!backupData.recipes) {
                        throw new Error('无效的备份文件格式');
                    }

                    // 确认是否覆盖现有数据
                    const confirm = window.confirm(
                        '导入数据将覆盖现有的所有配方，是否继续？\n' +
                        `备份包含 ${backupData.recipes.length} 个配方`
                    );

                    if (confirm) {
                        localStorage.setItem('recipes', JSON.stringify(backupData.recipes));
                        if (backupData.materialDatabase) {
                            localStorage.setItem('materialDatabase', JSON.stringify(backupData.materialDatabase));
                        }
                        resolve(backupData);
                    } else {
                        reject(new Error('用户取消导入'));
                    }
                } catch (error) {
                    reject(error);
                }
            };
            
            reader.onerror = () => reject(new Error('文件读取失败'));
            reader.readAsText(file, 'UTF-8');
        });
    }
}

// 创建全局实例
const fileHandler = new FileHandler();

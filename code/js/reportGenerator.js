// 报告生成模块
class ReportGenerator {
    constructor() {
        this.charts = {};
    }

    /**
     * 生成成本汇总报告
     */
    generateSummaryReport(recipeIds) {
        const recipes = recipeIds.map(id => costCalculator.getRecipe(id)).filter(r => r);
        
        if (recipes.length === 0) {
            return '<p class="no-data">暂无数据</p>';
        }

        const results = recipes.map(recipe => ({
            recipe,
            cost: costCalculator.calculateRecipeCost(recipe)
        }));

        // 统计数据
        const totalCosts = results.reduce((sum, r) => sum + r.cost.totalCost, 0);
        const avgCost = totalCosts / results.length;
        const maxCost = Math.max(...results.map(r => r.cost.unitCost));
        const minCost = Math.min(...results.map(r => r.cost.unitCost));

        let html = `
            <div class="report-header">
                <h2>成本汇总报告</h2>
                <p class="report-date">生成日期：${new Date().toLocaleString('zh-CN')}</p>
            </div>

            <div class="report-statistics">
                <div class="stat-item">
                    <span class="stat-label">配方总数</span>
                    <span class="stat-value">${recipes.length}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">平均单份成本</span>
                    <span class="stat-value">¥${avgCost.toFixed(2)}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">最高成本</span>
                    <span class="stat-value">¥${maxCost.toFixed(2)}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">最低成本</span>
                    <span class="stat-value">¥${minCost.toFixed(2)}</span>
                </div>
            </div>

            <table class="report-table">
                <thead>
                    <tr>
                        <th>配方名称</th>
                        <th>类型</th>
                        <th>产出</th>
                        <th>材料成本</th>
                        <th>人工成本</th>
                        <th>总成本</th>
                        <th>单份成本</th>
                    </tr>
                </thead>
                <tbody>
        `;

        results.forEach(({ recipe, cost }) => {
            html += `
                <tr>
                    <td>${recipe.recipeName}</td>
                    <td>${recipe.foodType}</td>
                    <td>${recipe.yield}份</td>
                    <td>¥${cost.materialCost.toFixed(2)}</td>
                    <td>¥${cost.laborCost.toFixed(2)}</td>
                    <td>¥${cost.totalCost.toFixed(2)}</td>
                    <td><strong>¥${cost.unitCost.toFixed(2)}</strong></td>
                </tr>
            `;
        });

        html += `
                </tbody>
            </table>
        `;

        return html;
    }

    /**
     * 生成详细分析报告
     */
    generateDetailedReport(recipeIds) {
        const recipes = recipeIds.map(id => costCalculator.getRecipe(id)).filter(r => r);
        
        if (recipes.length === 0) {
            return '<p class="no-data">暂无数据</p>';
        }

        let html = `
            <div class="report-header">
                <h2>详细分析报告</h2>
                <p class="report-date">生成日期：${new Date().toLocaleString('zh-CN')}</p>
            </div>
        `;

        recipes.forEach(recipe => {
            const cost = costCalculator.calculateRecipeCost(recipe);
            
            html += `
                <div class="recipe-detail-section">
                    <h3>${recipe.recipeName} (${recipe.foodType})</h3>
                    
                    <div class="cost-summary">
                        <div class="summary-item">
                            <span>产出数量：</span>
                            <strong>${recipe.yield}份</strong>
                        </div>
                        <div class="summary-item">
                            <span>材料成本：</span>
                            <strong>¥${cost.materialCost.toFixed(2)} (${cost.materialCostPercentage}%)</strong>
                        </div>
                        <div class="summary-item">
                            <span>人工成本：</span>
                            <strong>¥${cost.laborCost.toFixed(2)} (${cost.laborCostPercentage}%)</strong>
                        </div>
                        <div class="summary-item primary">
                            <span>单份成本：</span>
                            <strong>¥${cost.unitCost.toFixed(2)}</strong>
                        </div>
                    </div>

                    <h4>材料明细</h4>
                    <table class="material-detail-table">
                        <thead>
                            <tr>
                                <th>材料</th>
                                <th>用量</th>
                                <th>单价</th>
                                <th>损耗率</th>
                                <th>成本</th>
                                <th>占比</th>
                            </tr>
                        </thead>
                        <tbody>
            `;

            cost.materials.forEach(m => {
                html += `
                    <tr>
                        <td>${m.name}</td>
                        <td>${m.requestedQuantity} ${m.unit}</td>
                        <td>¥${m.unitPrice.toFixed(2)}/${m.unit}</td>
                        <td>${((m.wastageRate || 0) * 100).toFixed(1)}%</td>
                        <td>¥${m.cost.toFixed(2)}</td>
                        <td>${m.percentage}%</td>
                    </tr>
                `;
            });

            html += `
                        </tbody>
                    </table>
                </div>
            `;
        });

        return html;
    }

    /**
     * 生成优化建议报告
     */
    generateOptimizationReport(recipeIds) {
        const recipes = recipeIds.map(id => costCalculator.getRecipe(id)).filter(r => r);
        
        if (recipes.length === 0) {
            return '<p class="no-data">暂无数据</p>';
        }

        let html = `
            <div class="report-header">
                <h2>优化建议报告</h2>
                <p class="report-date">生成日期：${new Date().toLocaleString('zh-CN')}</p>
            </div>
        `;

        recipes.forEach(recipe => {
            const optimization = costOptimizer.generateOptimizations(recipe);
            
            html += `
                <div class="optimization-section">
                    <h3>${recipe.recipeName}</h3>
                    
                    <div class="optimization-overview">
                        <div class="overview-item">
                            <span>当前成本：</span>
                            <strong>¥${optimization.currentCost.toFixed(2)}</strong>
                        </div>
                        <div class="overview-item success">
                            <span>优化后成本：</span>
                            <strong>¥${optimization.bestOptimization.optimizedCost.toFixed(2)}</strong>
                        </div>
                        <div class="overview-item">
                            <span>可节省：</span>
                            <strong>¥${optimization.bestOptimization.totalSavings.toFixed(2)} 
                            (${optimization.bestOptimization.totalSavingsPercent.toFixed(1)}%)</strong>
                        </div>
                    </div>

                    <h4>优化建议 (共${optimization.totalSuggestions}条)</h4>
            `;

            if (optimization.suggestions.length > 0) {
                optimization.suggestions.slice(0, 5).forEach((s, index) => {
                    const priorityClass = s.priority === 'high' ? 'high-priority' : 
                                        s.priority === 'medium' ? 'medium-priority' : '';
                    const priorityBadge = s.priority === 'high' ? 'badge-high' :
                                        s.priority === 'medium' ? 'badge-medium' : 'badge-low';
                    const priorityText = s.priority === 'high' ? '高' :
                                        s.priority === 'medium' ? '中' : '低';
                    
                    html += `
                        <div class="suggestion-item ${priorityClass}">
                            <div class="suggestion-header">
                                <span class="suggestion-title">${index + 1}. ${s.title}</span>
                                <span class="suggestion-badge ${priorityBadge}">优先级: ${priorityText}</span>
                            </div>
                            <div class="suggestion-details">
                                <p>${s.description}</p>
                                <p class="implementation"><strong>实施方法：</strong>${s.implementation}</p>
                            </div>
                            <div class="suggestion-savings">
                                💰 可节省：¥${s.savings.toFixed(2)} (${s.savingsPercent.toFixed(1)}%)
                            </div>
                        </div>
                    `;
                });
            } else {
                html += '<p class="no-suggestions">暂无优化建议</p>';
            }

            html += '</div>';
        });

        return html;
    }

    /**
     * 生成配方对比报告
     */
    generateComparisonReport(recipeIds) {
        const recipes = recipeIds.map(id => costCalculator.getRecipe(id)).filter(r => r);
        
        if (recipes.length < 2) {
            return '<p class="no-data">请选择至少2个配方进行对比</p>';
        }

        const results = recipes.map(recipe => ({
            recipe,
            cost: costCalculator.calculateRecipeCost(recipe)
        }));

        // 找出最优和最差
        const sortedByCost = [...results].sort((a, b) => a.cost.unitCost - b.cost.unitCost);
        const best = sortedByCost[0];
        const worst = sortedByCost[sortedByCost.length - 1];

        let html = `
            <div class="report-header">
                <h2>配方对比报告</h2>
                <p class="report-date">生成日期：${new Date().toLocaleString('zh-CN')}</p>
            </div>

            <div class="comparison-highlights">
                <div class="highlight-card success">
                    <h4>🏆 成本最优</h4>
                    <p class="recipe-name">${best.recipe.recipeName}</p>
                    <p class="cost-value">¥${best.cost.unitCost.toFixed(2)}/份</p>
                </div>
                <div class="highlight-card warning">
                    <h4>💡 待优化</h4>
                    <p class="recipe-name">${worst.recipe.recipeName}</p>
                    <p class="cost-value">¥${worst.cost.unitCost.toFixed(2)}/份</p>
                    <p class="potential">优化潜力：¥${(worst.cost.unitCost - best.cost.unitCost).toFixed(2)}</p>
                </div>
            </div>

            <h3>成本对比表</h3>
            <table class="comparison-table">
                <thead>
                    <tr>
                        <th>配方名称</th>
                        <th>单份成本</th>
                        <th>材料成本</th>
                        <th>材料占比</th>
                        <th>人工成本</th>
                        <th>产出数量</th>
                        <th>性价比</th>
                    </tr>
                </thead>
                <tbody>
        `;

        results.forEach(({ recipe, cost }) => {
            const efficiency = (cost.materialCost / cost.unitCost * 100).toFixed(0);
            html += `
                <tr>
                    <td><strong>${recipe.recipeName}</strong></td>
                    <td>¥${cost.unitCost.toFixed(2)}</td>
                    <td>¥${cost.materialCost.toFixed(2)}</td>
                    <td>${cost.materialCostPercentage}%</td>
                    <td>¥${cost.laborCost.toFixed(2)}</td>
                    <td>${recipe.yield}份</td>
                    <td>${efficiency}%</td>
                </tr>
            `;
        });

        html += `
                </tbody>
            </table>

            <h3>材料用量对比</h3>
        `;

        // 收集所有材料
        const allMaterials = new Set();
        results.forEach(({ cost }) => {
            cost.materials.forEach(m => allMaterials.add(m.name));
        });

        html += `
            <table class="material-comparison-table">
                <thead>
                    <tr>
                        <th>材料名称</th>
        `;

        results.forEach(({ recipe }) => {
            html += `<th>${recipe.recipeName}</th>`;
        });

        html += `
                    </tr>
                </thead>
                <tbody>
        `;

        Array.from(allMaterials).forEach(materialName => {
            html += `<tr><td>${materialName}</td>`;
            
            results.forEach(({ cost }) => {
                const material = cost.materials.find(m => m.name === materialName);
                if (material) {
                    html += `<td>${material.requestedQuantity} ${material.unit}<br/>
                            <small>¥${material.cost.toFixed(2)}</small></td>`;
                } else {
                    html += '<td>-</td>';
                }
            });
            
            html += '</tr>';
        });

        html += `
                </tbody>
            </table>
        `;

        return html;
    }

    /**
     * 生成PDF格式报告（使用浏览器打印功能）
     */
    generatePDFReport(reportHtml, reportTitle) {
        const printWindow = window.open('', '_blank');
        
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>${reportTitle}</title>
                <style>
                    body {
                        font-family: 'Microsoft YaHei', sans-serif;
                        line-height: 1.6;
                        color: #333;
                        max-width: 1200px;
                        margin: 0 auto;
                        padding: 20px;
                    }
                    .report-header {
                        text-align: center;
                        border-bottom: 3px solid #2563eb;
                        padding-bottom: 20px;
                        margin-bottom: 30px;
                    }
                    .report-header h2 {
                        color: #2563eb;
                        margin-bottom: 10px;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin: 20px 0;
                    }
                    th, td {
                        border: 1px solid #ddd;
                        padding: 12px;
                        text-align: left;
                    }
                    th {
                        background-color: #f8fafc;
                        font-weight: bold;
                    }
                    tr:nth-child(even) {
                        background-color: #f9f9f9;
                    }
                    .suggestion-item {
                        border-left: 4px solid #2563eb;
                        padding: 15px;
                        margin: 15px 0;
                        background: #f8fafc;
                    }
                    .suggestion-header {
                        font-weight: bold;
                        margin-bottom: 10px;
                    }
                    @media print {
                        body { font-size: 12px; }
                        .no-print { display: none; }
                    }
                </style>
            </head>
            <body>
                ${reportHtml}
                <div class="no-print" style="text-align: center; margin-top: 30px;">
                    <button onclick="window.print()" style="padding: 10px 20px; font-size: 16px; cursor: pointer;">
                        打印/保存为PDF
                    </button>
                    <button onclick="window.close()" style="padding: 10px 20px; font-size: 16px; cursor: pointer; margin-left: 10px;">
                        关闭
                    </button>
                </div>
            </body>
            </html>
        `);
        
        printWindow.document.close();
    }

    /**
     * 清理图表实例
     */
    destroyChart(chartId) {
        if (this.charts[chartId]) {
            this.charts[chartId].destroy();
            delete this.charts[chartId];
        }
    }

    /**
     * 清理所有图表
     */
    destroyAllCharts() {
        Object.keys(this.charts).forEach(id => {
            this.charts[id].destroy();
        });
        this.charts = {};
    }
}

// 创建全局实例
const reportGenerator = new ReportGenerator();

// 预置的产品配方模板，作为无法加载外部模板时的兜底数据
const BUILT_IN_PRODUCT_TEMPLATES = {
    "寿司": {
        name: "寿司",
        materials: [
            { name: "寿司米", unit: "克", defaultPrice: 0.008, category: "主料" },
            { name: "海苔", unit: "张", defaultPrice: 0.5, category: "主料" },
            { name: "寿司醋", unit: "毫升", defaultPrice: 0.02, category: "调料" },
            { name: "三文鱼", unit: "克", defaultPrice: 0.08, category: "配料" },
            { name: "金枪鱼", unit: "克", defaultPrice: 0.06, category: "配料" },
            { name: "鳗鱼", unit: "克", defaultPrice: 0.12, category: "配料" },
            { name: "虾仁", unit: "克", defaultPrice: 0.05, category: "配料" },
            { name: "蟹棒", unit: "根", defaultPrice: 0.8, category: "配料" },
            { name: "飞鱼籽", unit: "克", defaultPrice: 0.15, category: "配料" },
            { name: "黄瓜", unit: "克", defaultPrice: 0.006, category: "蔬菜" },
            { name: "牛油果", unit: "克", defaultPrice: 0.03, category: "蔬菜" },
            { name: "芥末", unit: "克", defaultPrice: 0.2, category: "调料" },
            { name: "酱油", unit: "毫升", defaultPrice: 0.01, category: "调料" },
            { name: "姜片", unit: "克", defaultPrice: 0.02, category: "调料" },
            { name: "芝麻", unit: "克", defaultPrice: 0.03, category: "装饰" }
        ]
    },
    "蛋糕": {
        name: "蛋糕",
        materials: [
            { name: "低筋面粉", unit: "克", defaultPrice: 0.01, category: "主料" },
            { name: "鸡蛋", unit: "个", defaultPrice: 1.2, category: "蛋品" },
            { name: "白砂糖", unit: "克", defaultPrice: 0.006, category: "主料" },
            { name: "黄油", unit: "克", defaultPrice: 0.04, category: "油脂类" },
            { name: "牛奶", unit: "毫升", defaultPrice: 0.012, category: "液体" },
            { name: "鲜奶油", unit: "克", defaultPrice: 0.03, category: "奶制品" },
            { name: "泡打粉", unit: "克", defaultPrice: 0.08, category: "辅料" },
            { name: "香草精", unit: "毫升", defaultPrice: 0.5, category: "调料" },
            { name: "巧克力", unit: "克", defaultPrice: 0.05, category: "配料" },
            { name: "可可粉", unit: "克", defaultPrice: 0.08, category: "配料" },
            { name: "果酱", unit: "克", defaultPrice: 0.02, category: "配料" },
            { name: "芝士", unit: "克", defaultPrice: 0.045, category: "奶制品" },
            { name: "水果", unit: "克", defaultPrice: 0.015, category: "装饰" }
        ]
    },
    "面包": {
        name: "面包",
        materials: [
            { name: "高筋面粉", unit: "克", defaultPrice: 0.008, category: "主料" },
            { name: "酵母", unit: "克", defaultPrice: 0.06, category: "主料" },
            { name: "白砂糖", unit: "克", defaultPrice: 0.006, category: "主料" },
            { name: "盐", unit: "克", defaultPrice: 0.003, category: "调料" },
            { name: "黄油", unit: "克", defaultPrice: 0.04, category: "油脂类" },
            { name: "牛奶", unit: "毫升", defaultPrice: 0.012, category: "液体" },
            { name: "鸡蛋", unit: "个", defaultPrice: 1.2, category: "蛋品" },
            { name: "橄榄油", unit: "毫升", defaultPrice: 0.03, category: "油脂类" },
            { name: "蜂蜜", unit: "克", defaultPrice: 0.05, category: "调料" },
            { name: "芝麻", unit: "克", defaultPrice: 0.03, category: "装饰" },
            { name: "坚果", unit: "克", defaultPrice: 0.06, category: "配料" }
        ]
    },
    "披萨": {
        name: "披萨",
        materials: [
            { name: "高筋面粉", unit: "克", defaultPrice: 0.008, category: "主料" },
            { name: "酵母", unit: "克", defaultPrice: 0.06, category: "主料" },
            { name: "番茄酱", unit: "克", defaultPrice: 0.015, category: "酱料" },
            { name: "马苏里拉芝士", unit: "克", defaultPrice: 0.045, category: "奶制品" },
            { name: "橄榄油", unit: "毫升", defaultPrice: 0.03, category: "油脂类" },
            { name: "盐", unit: "克", defaultPrice: 0.003, category: "调料" },
            { name: "白砂糖", unit: "克", defaultPrice: 0.006, category: "调料" },
            { name: "培根", unit: "克", defaultPrice: 0.04, category: "肉类" },
            { name: "火腿", unit: "克", defaultPrice: 0.035, category: "肉类" },
            { name: "牛肉", unit: "克", defaultPrice: 0.05, category: "肉类" },
            { name: "虾仁", unit: "克", defaultPrice: 0.05, category: "海鲜" },
            { name: "洋葱", unit: "克", defaultPrice: 0.004, category: "蔬菜" },
            { name: "青椒", unit: "克", defaultPrice: 0.008, category: "蔬菜" },
            { name: "番茄", unit: "克", defaultPrice: 0.006, category: "蔬菜" },
            { name: "蘑菇", unit: "克", defaultPrice: 0.02, category: "蔬菜" },
            { name: "黑橄榄", unit: "克", defaultPrice: 0.06, category: "配料" },
            { name: "罗勒叶", unit: "克", defaultPrice: 0.15, category: "调料" }
        ]
    },
    "汉堡": {
        name: "汉堡",
        materials: [
            { name: "汉堡面包", unit: "个", defaultPrice: 1.5, category: "主料" },
            { name: "牛肉饼", unit: "片", defaultPrice: 3.5, category: "肉类" },
            { name: "芝士片", unit: "片", defaultPrice: 0.8, category: "奶制品" },
            { name: "生菜", unit: "片", defaultPrice: 0.2, category: "蔬菜" },
            { name: "番茄", unit: "片", defaultPrice: 0.3, category: "蔬菜" },
            { name: "洋葱", unit: "克", defaultPrice: 0.004, category: "蔬菜" },
            { name: "酸黄瓜", unit: "片", defaultPrice: 0.3, category: "配料" },
            { name: "培根", unit: "片", defaultPrice: 1.2, category: "肉类" },
            { name: "鸡蛋", unit: "个", defaultPrice: 1.2, category: "蛋品" },
            { name: "番茄酱", unit: "克", defaultPrice: 0.015, category: "酱料" },
            { name: "沙拉酱", unit: "克", defaultPrice: 0.02, category: "酱料" },
            { name: "芥末酱", unit: "克", defaultPrice: 0.025, category: "酱料" }
        ]
    },
    "沙拉": {
        name: "沙拉",
        materials: [
            { name: "生菜", unit: "克", defaultPrice: 0.008, category: "蔬菜" },
            { name: "紫甘蓝", unit: "克", defaultPrice: 0.006, category: "蔬菜" },
            { name: "番茄", unit: "克", defaultPrice: 0.006, category: "蔬菜" },
            { name: "黄瓜", unit: "克", defaultPrice: 0.006, category: "蔬菜" },
            { name: "胡萝卜", unit: "克", defaultPrice: 0.004, category: "蔬菜" },
            { name: "玉米粒", unit: "克", defaultPrice: 0.01, category: "蔬菜" },
            { name: "鸡胸肉", unit: "克", defaultPrice: 0.025, category: "肉类" },
            { name: "虾仁", unit: "克", defaultPrice: 0.05, category: "海鲜" },
            { name: "鸡蛋", unit: "个", defaultPrice: 1.2, category: "蛋品" },
            { name: "牛油果", unit: "克", defaultPrice: 0.03, category: "水果" },
            { name: "芝士碎", unit: "克", defaultPrice: 0.045, category: "奶制品" },
            { name: "坚果", unit: "克", defaultPrice: 0.06, category: "配料" },
            { name: "沙拉酱", unit: "克", defaultPrice: 0.02, category: "酱料" },
            { name: "橄榄油", unit: "毫升", defaultPrice: 0.03, category: "油脂类" },
            { name: "柠檬汁", unit: "毫升", defaultPrice: 0.05, category: "调料" },
            { name: "盐", unit: "克", defaultPrice: 0.003, category: "调料" },
            { name: "黑胡椒", unit: "克", defaultPrice: 0.08, category: "调料" }
        ]
    },
    "三明治": {
        name: "三明治",
        materials: [
            { name: "吐司面包", unit: "片", defaultPrice: 0.8, category: "主料" },
            { name: "火腿", unit: "片", defaultPrice: 1.5, category: "肉类" },
            { name: "培根", unit: "片", defaultPrice: 1.2, category: "肉类" },
            { name: "鸡胸肉", unit: "克", defaultPrice: 0.025, category: "肉类" },
            { name: "芝士片", unit: "片", defaultPrice: 0.8, category: "奶制品" },
            { name: "鸡蛋", unit: "个", defaultPrice: 1.2, category: "蛋品" },
            { name: "生菜", unit: "片", defaultPrice: 0.2, category: "蔬菜" },
            { name: "番茄", unit: "片", defaultPrice: 0.3, category: "蔬菜" },
            { name: "黄瓜", unit: "片", defaultPrice: 0.2, category: "蔬菜" },
            { name: "洋葱", unit: "克", defaultPrice: 0.004, category: "蔬菜" },
            { name: "黄油", unit: "克", defaultPrice: 0.04, category: "油脂类" },
            { name: "沙拉酱", unit: "克", defaultPrice: 0.02, category: "酱料" },
            { name: "芥末酱", unit: "克", defaultPrice: 0.025, category: "酱料" }
        ]
    },
    "炒饭": {
        name: "炒饭",
        materials: [
            { name: "米饭", unit: "克", defaultPrice: 0.006, category: "主料" },
            { name: "鸡蛋", unit: "个", defaultPrice: 1.2, category: "蛋品" },
            { name: "火腿", unit: "克", defaultPrice: 0.035, category: "肉类" },
            { name: "虾仁", unit: "克", defaultPrice: 0.05, category: "海鲜" },
            { name: "青豆", unit: "克", defaultPrice: 0.008, category: "蔬菜" },
            { name: "玉米粒", unit: "克", defaultPrice: 0.01, category: "蔬菜" },
            { name: "胡萝卜", unit: "克", defaultPrice: 0.004, category: "蔬菜" },
            { name: "葱花", unit: "克", defaultPrice: 0.01, category: "调料" },
            { name: "蒜末", unit: "克", defaultPrice: 0.015, category: "调料" },
            { name: "酱油", unit: "毫升", defaultPrice: 0.01, category: "调料" },
            { name: "盐", unit: "克", defaultPrice: 0.003, category: "调料" },
            { name: "食用油", unit: "毫升", defaultPrice: 0.012, category: "油脂类" }
        ]
    },
    "面条": {
        name: "面条",
        materials: [
            { name: "挂面", unit: "克", defaultPrice: 0.008, category: "主料" },
            { name: "猪肉", unit: "克", defaultPrice: 0.03, category: "肉类" },
            { name: "牛肉", unit: "克", defaultPrice: 0.05, category: "肉类" },
            { name: "鸡蛋", unit: "个", defaultPrice: 1.2, category: "蛋品" },
            { name: "青菜", unit: "克", defaultPrice: 0.005, category: "蔬菜" },
            { name: "葱花", unit: "克", defaultPrice: 0.01, category: "调料" },
            { name: "姜丝", unit: "克", defaultPrice: 0.02, category: "调料" },
            { name: "蒜末", unit: "克", defaultPrice: 0.015, category: "调料" },
            { name: "酱油", unit: "毫升", defaultPrice: 0.01, category: "调料" },
            { name: "醋", unit: "毫升", defaultPrice: 0.008, category: "调料" },
            { name: "盐", unit: "克", defaultPrice: 0.003, category: "调料" },
            { name: "香油", unit: "毫升", defaultPrice: 0.06, category: "油脂类" },
            { name: "辣椒油", unit: "毫升", defaultPrice: 0.03, category: "调料" }
        ]
    },
    "咖啡": {
        name: "咖啡",
        materials: [
            { name: "咖啡豆", unit: "克", defaultPrice: 0.12, category: "主料" },
            { name: "牛奶", unit: "毫升", defaultPrice: 0.012, category: "液体" },
            { name: "白砂糖", unit: "克", defaultPrice: 0.006, category: "调料" },
            { name: "糖浆", unit: "毫升", defaultPrice: 0.04, category: "调料" },
            { name: "鲜奶油", unit: "克", defaultPrice: 0.03, category: "奶制品" },
            { name: "巧克力酱", unit: "克", defaultPrice: 0.05, category: "配料" },
            { name: "焦糖酱", unit: "克", defaultPrice: 0.045, category: "配料" },
            { name: "香草糖浆", unit: "毫升", defaultPrice: 0.06, category: "调料" },
            { name: "肉桂粉", unit: "克", defaultPrice: 0.15, category: "调料" }
        ]
    },
    "奶茶": {
        name: "奶茶",
        materials: [
            { name: "红茶", unit: "克", defaultPrice: 0.08, category: "主料" },
            { name: "绿茶", unit: "克", defaultPrice: 0.1, category: "主料" },
            { name: "牛奶", unit: "毫升", defaultPrice: 0.012, category: "液体" },
            { name: "植脂末", unit: "克", defaultPrice: 0.02, category: "配料" },
            { name: "白砂糖", unit: "克", defaultPrice: 0.006, category: "调料" },
            { name: "珍珠", unit: "克", defaultPrice: 0.015, category: "配料" },
            { name: "椰果", unit: "克", defaultPrice: 0.012, category: "配料" },
            { name: "布丁", unit: "克", defaultPrice: 0.025, category: "配料" },
            { name: "果酱", unit: "克", defaultPrice: 0.02, category: "配料" },
            { name: "鲜奶油", unit: "克", defaultPrice: 0.03, category: "奶制品" },
            { name: "冰块", unit: "克", defaultPrice: 0.001, category: "辅料" }
        ]
    },
    "果汁": {
        name: "果汁",
        materials: [
            { name: "橙子", unit: "克", defaultPrice: 0.008, category: "水果" },
            { name: "苹果", unit: "克", defaultPrice: 0.007, category: "水果" },
            { name: "西瓜", unit: "克", defaultPrice: 0.004, category: "水果" },
            { name: "芒果", unit: "克", defaultPrice: 0.012, category: "水果" },
            { name: "草莓", unit: "克", defaultPrice: 0.02, category: "水果" },
            { name: "蓝莓", unit: "克", defaultPrice: 0.06, category: "水果" },
            { name: "柠檬", unit: "克", defaultPrice: 0.01, category: "水果" },
            { name: "白砂糖", unit: "克", defaultPrice: 0.006, category: "调料" },
            { name: "蜂蜜", unit: "克", defaultPrice: 0.05, category: "调料" },
            { name: "冰块", unit: "克", defaultPrice: 0.001, category: "辅料" },
            { name: "薄荷叶", unit: "克", defaultPrice: 0.1, category: "装饰" }
        ]
    }
};

// 主应用逻辑
class App {
    constructor() {
        this.currentTab = 'input';
        this.currentInputMode = 'manual';
        this.currentRecipeId = null;
        this.costChart = null;
        this.comparisonChart = null;
        this.productTemplates = null;
        this.currentFoodType = '';
        
        this.init();
    }

    async init() {
        await this.loadProductTemplates();
        this.initEventListeners();
        this.loadSavedRecipes();
        
        // 检查食品类型选择框的初始值
        const foodTypeSelect = document.getElementById('foodType');
        if (foodTypeSelect && foodTypeSelect.value) {
            // 如果已经有选中的食品类型，自动载入材料
            this.currentFoodType = foodTypeSelect.value;
            this.updateMaterialOptions();
        } else {
            // 否则添加一个空行
            this.addInitialMaterialRow();
        }
    }

    // 加载产品配方模板
    async loadProductTemplates() {
        const fallbackTemplates = this.getBuiltInTemplates();
        const candidatePaths = [
            '../inputdata/产品配方模板.json',
            'inputdata/产品配方模板.json',
            './inputdata/产品配方模板.json'
        ];

        for (const path of candidatePaths) {
            try {
                const response = await fetch(path);
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }
                const data = await response.json();
                this.productTemplates = data.templates || fallbackTemplates;
                if (this.productTemplates && Object.keys(this.productTemplates).length > 0) {
                    if (path !== candidatePaths[0]) {
                        console.warn(`使用备用路径加载产品模板: ${path}`);
                    }
                    return;
                }
            } catch (error) {
                console.warn(`从 ${path} 加载产品模板失败:`, error);
            }
        }

        this.productTemplates = fallbackTemplates;
        this.showToast('使用内置模板数据，未找到外部模板文件', 'warning');
    }

    // 初始化事件监听器
    initEventListeners() {
        // 食品类型选择
        document.getElementById('foodType').addEventListener('change', (e) => {
            this.currentFoodType = e.target.value;
            this.updateMaterialOptions();
        });

        // 标签页切换
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // 输入模式切换
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchInputMode(e.target.dataset.mode);
            });
        });

        // 材料管理
        document.getElementById('addMaterial').addEventListener('click', () => {
            this.addMaterialRow();
        });

        // 配方操作
        document.getElementById('saveRecipe').addEventListener('click', () => {
            this.saveRecipe();
        });

        document.getElementById('clearForm').addEventListener('click', () => {
            this.clearForm();
        });

        // 文件操作
        document.getElementById('selectFile').addEventListener('click', () => {
            document.getElementById('fileInput').click();
        });

        document.getElementById('fileInput').addEventListener('change', (e) => {
            this.handleFileSelect(e.target.files[0]);
        });

        document.getElementById('downloadTemplate').addEventListener('click', () => {
            fileHandler.downloadTemplate();
            this.showToast('模板下载成功', 'success');
        });

        document.getElementById('confirmImport').addEventListener('click', () => {
            this.confirmImport();
        });

        // 拖放上传
        const uploadArea = document.getElementById('uploadArea');
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('drag-over');
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('drag-over');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('drag-over');
            const file = e.dataTransfer.files[0];
            this.handleFileSelect(file);
        });

        // 成本计算
        document.getElementById('calculateBtn').addEventListener('click', () => {
            this.calculateCost();
        });

        // 优化分析
        document.getElementById('optimizeBtn').addEventListener('click', () => {
            this.generateOptimization();
        });

        // 报告生成
        document.getElementById('generateReport').addEventListener('click', () => {
            this.generateReport();
        });

        document.getElementById('exportExcel').addEventListener('click', () => {
            this.exportReport();
        });

        document.getElementById('exportPDF').addEventListener('click', () => {
            this.exportPDF();
        });
    }

    // 切换标签页
    switchTab(tabName) {
        this.currentTab = tabName;
        
        // 更新标签按钮状态
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.tab === tabName) {
                btn.classList.add('active');
            }
        });

        // 更新面板显示
        document.querySelectorAll('.panel').forEach(panel => {
            panel.classList.remove('active');
        });
        document.getElementById(`${tabName}-panel`).classList.add('active');

        // 更新选择器
        if (tabName === 'calculate') {
            this.updateRecipeSelectors('calculateRecipeSelect');
        } else if (tabName === 'optimize') {
            this.updateRecipeSelectors('optimizeRecipeSelect');
        } else if (tabName === 'report') {
            this.updateReportRecipeSelection();
        }
    }

    // 切换输入模式
    switchInputMode(mode) {
        this.currentInputMode = mode;
        
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.mode === mode) {
                btn.classList.add('active');
            }
        });

        document.querySelectorAll('.input-mode').forEach(modeDiv => {
            modeDiv.classList.remove('active');
        });
        document.getElementById(`${mode}-input`).classList.add('active');
    }

    // 更新材料选项
    updateMaterialOptions() {
        // 清空现有材料行
        document.getElementById('materialsList').innerHTML = '';
        
        if (this.currentFoodType && this.productTemplates && this.productTemplates[this.currentFoodType]) {
            // 显示该产品的所有默认材料
            const template = this.productTemplates[this.currentFoodType];
            
            // 自动填充默认配方名称（如果配方名称为空）
            const recipeNameInput = document.getElementById('recipeName');
            if (!recipeNameInput.value.trim() && !this.currentRecipeId) {
                recipeNameInput.value = `${template.name}配方`;
            }
            
            // 添加所有默认材料
            template.materials.forEach(material => {
                this.addMaterialRow(material, true);
            });
            
            this.showToast(`已载入${template.name}的${template.materials.length}种默认材料`, 'success');
        } else {
            // 没有选择产品类型或没有模板，添加空行
            this.addMaterialRow();
        }
    }

    // 添加材料行
    addMaterialRow(material = null, isTemplate = false) {
        const materialsList = document.getElementById('materialsList');
        const row = document.createElement('div');
        row.className = 'material-row';
        
        // 获取当前食品类型的材料列表
        const availableMaterials = this.currentFoodType && this.productTemplates && this.productTemplates[this.currentFoodType] 
            ? this.productTemplates[this.currentFoodType].materials 
            : [];

        // 创建材料选择下拉菜单
        let materialOptions = '<option value="">请选择材料...</option>';
        if (availableMaterials.length > 0) {
            // 按类别分组
            const categories = {};
            availableMaterials.forEach(m => {
                if (!categories[m.category]) {
                    categories[m.category] = [];
                }
                categories[m.category].push(m);
            });

            // 生成分组选项
            Object.keys(categories).forEach(category => {
                materialOptions += `<optgroup label="${category}">`;
                categories[category].forEach(m => {
                    const selected = material && m.name === material.name ? 'selected' : '';
                    materialOptions += `<option value="${m.name}" ${selected} data-unit="${m.unit}" data-price="${m.defaultPrice}" data-category="${m.category}">${m.name}</option>`;
                });
                materialOptions += `</optgroup>`;
            });
        }

        const materialName = material?.name || '';
        const materialUnit = material?.unit || (isTemplate ? material?.unit : '克');
        const materialPrice = material?.unitPrice !== undefined ? material.unitPrice : (isTemplate && material?.defaultPrice !== undefined ? material.defaultPrice : '');
        const materialQuantity = material?.quantity || '';
        const materialWastage = material?.wastageRate || 0;
        
        row.innerHTML = `
            <div class="input-group">
                <label>材料名称</label>
                ${availableMaterials.length > 0 ? `
                    <select class="material-select" onchange="app.onMaterialSelect(this)">
                        ${materialOptions}
                    </select>
                ` : `
                    <input type="text" class="material-name" value="${materialName}" placeholder="例如：三文鱼">
                `}
            </div>
            <div class="input-group">
                <label>单位</label>
                <input type="text" class="material-unit" value="${materialUnit}" placeholder="克" ${isTemplate ? 'readonly' : ''}>
            </div>
            <div class="input-group">
                <label>单价(元)</label>
                <input type="number" class="material-price" value="${materialPrice}" step="0.01" min="0" placeholder="参考价">
            </div>
            <div class="input-group">
                <label>用量</label>
                <input type="number" class="material-quantity" value="${materialQuantity}" step="0.1" min="0">
            </div>
            <div class="input-group">
                <label>损耗率</label>
                <input type="number" class="material-wastage" value="${materialWastage}" step="0.01" min="0" max="1">
            </div>
            <button class="btn-remove" onclick="app.removeMaterialRow(this)">删除</button>
        `;
        
        materialsList.appendChild(row);
    }

    // 材料选择事件处理
    onMaterialSelect(selectElement) {
        const row = selectElement.closest('.material-row');
        const selectedOption = selectElement.options[selectElement.selectedIndex];
        
        if (selectedOption.value) {
            const unit = selectedOption.dataset.unit;
            const price = selectedOption.dataset.price;
            
            // 填充单位和默认单价
            row.querySelector('.material-unit').value = unit || '克';
            row.querySelector('.material-price').value = price || '';
        }
    }

    // 添加初始材料行
    addInitialMaterialRow() {
        if (document.getElementById('materialsList').children.length === 0) {
            this.addMaterialRow();
        }
    }

    // 删除材料行
    removeMaterialRow(button) {
        const row = button.closest('.material-row');
        row.remove();
        
        // 确保至少有一行
        if (document.getElementById('materialsList').children.length === 0) {
            this.addMaterialRow();
        }
    }

    // 保存配方
    saveRecipe() {
        const foodType = document.getElementById('foodType').value;
        const recipeName = document.getElementById('recipeName').value.trim();
        const recipeYield = parseInt(document.getElementById('yield').value);
        const laborCost = parseFloat(document.getElementById('laborCost').value) || 0;

        // 收集材料
        const materials = [];
        document.querySelectorAll('.material-row').forEach(row => {
            // 尝试获取下拉选择的材料名称，如果不存在则使用输入框
            const selectElement = row.querySelector('.material-select');
            const inputElement = row.querySelector('.material-name');
            const name = selectElement ? selectElement.options[selectElement.selectedIndex].value : (inputElement ? inputElement.value.trim() : '');
            
            const unit = row.querySelector('.material-unit').value.trim();
            const unitPrice = parseFloat(row.querySelector('.material-price').value) || 0;
            const quantity = parseFloat(row.querySelector('.material-quantity').value) || 0;
            const wastageRate = parseFloat(row.querySelector('.material-wastage').value) || 0;

            if (name && quantity > 0) {
                materials.push({ name, unit, unitPrice, quantity, wastageRate });
            }
        });

        // 验证
        const recipe = {
            foodType,
            recipeName,
            yield: recipeYield,
            laborCost,
            materials
        };

        const validation = costCalculator.validateRecipe(recipe);
        
        if (!validation.isValid) {
            this.showToast(validation.errors.join('\n'), 'error');
            return;
        }

        // 保存
        if (this.currentRecipeId) {
            costCalculator.updateRecipe(this.currentRecipeId, recipe);
            this.showToast('配方更新成功', 'success');
            this.currentRecipeId = null;
        } else {
            costCalculator.addRecipe(recipe);
            this.showToast('配方保存成功', 'success');
        }

        this.clearForm();
        this.loadSavedRecipes();
    }

    // 清空表单
    clearForm() {
        document.getElementById('recipeName').value = '';
        document.getElementById('yield').value = '1';
        document.getElementById('laborCost').value = '0';
        document.getElementById('materialsList').innerHTML = '';
        this.currentRecipeId = null;
        this.addMaterialRow();
    }

    // 加载已保存的配方
    loadSavedRecipes() {
        const recipes = costCalculator.getAllRecipes();
        const recipesList = document.getElementById('recipesList');
        
        if (recipes.length === 0) {
            recipesList.innerHTML = '<p style="text-align: center; color: #64748b;">暂无配方，请添加新配方</p>';
            return;
        }

        recipesList.innerHTML = '';
        recipes.forEach(recipe => {
            const card = this.createRecipeCard(recipe);
            recipesList.appendChild(card);
        });
    }

    // 创建配方卡片
    createRecipeCard(recipe) {
        const card = document.createElement('div');
        card.className = 'recipe-card';
        
        const cost = costCalculator.calculateRecipeCost(recipe);
        
        card.innerHTML = `
            <span class="recipe-type">${recipe.foodType}</span>
            <h4>${recipe.recipeName}</h4>
            <div class="recipe-info">产出：${recipe.yield}份</div>
            <div class="recipe-info">成本：¥${cost.unitCost.toFixed(2)}/份</div>
            <div class="recipe-info">材料：${recipe.materials.length}种</div>
            <div class="recipe-card-actions">
                <button class="btn-small btn-edit" onclick="app.editRecipe('${recipe.id}')">编辑</button>
                <button class="btn-small btn-delete" onclick="app.deleteRecipe('${recipe.id}')">删除</button>
            </div>
        `;
        
        return card;
    }

    // 编辑配方
    editRecipe(id) {
        const recipe = costCalculator.getRecipe(id);
        if (!recipe) return;

        this.currentRecipeId = id;
        
        document.getElementById('foodType').value = recipe.foodType;
        this.currentFoodType = recipe.foodType;
        
        document.getElementById('recipeName').value = recipe.recipeName;
        document.getElementById('yield').value = recipe.yield;
        document.getElementById('laborCost').value = recipe.laborCost;

        // 清空并重新添加材料行
        document.getElementById('materialsList').innerHTML = '';
        recipe.materials.forEach(material => {
            this.addMaterialRow(material, false);
        });

        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.showToast('可以编辑配方了', 'success');
    }

    // 删除配方
    deleteRecipe(id) {
        const recipe = costCalculator.getRecipe(id);
        if (!recipe) return;

        if (confirm(`确定要删除配方"${recipe.recipeName}"吗？`)) {
            costCalculator.deleteRecipe(id);
            this.loadSavedRecipes();
            this.showToast('配方已删除', 'success');
        }
    }

    // 处理文件选择
    async handleFileSelect(file) {
        if (!file) return;

        try {
            const recipes = await fileHandler.handleFileUpload(file);
            this.showImportPreview(recipes);
        } catch (error) {
            this.showToast(error.message, 'error');
        }
    }

    // 显示导入预览
    showImportPreview(recipes) {
        const previewDiv = document.getElementById('importPreview');
        const contentDiv = document.getElementById('previewContent');
        
        let html = `<p>将导入 <strong>${recipes.length}</strong> 个配方：</p><ul>`;
        recipes.forEach(recipe => {
            html += `<li>${recipe.recipeName} (${recipe.foodType}) - ${recipe.materials.length}种材料</li>`;
        });
        html += '</ul>';
        
        contentDiv.innerHTML = html;
        previewDiv.style.display = 'block';
    }

    // 确认导入
    confirmImport() {
        const importData = fileHandler.currentImportData;
        if (!importData || importData.length === 0) {
            this.showToast('没有可导入的数据', 'error');
            return;
        }

        importData.forEach(recipe => {
            costCalculator.addRecipe(recipe);
        });

        this.showToast(`成功导入${importData.length}个配方`, 'success');
        this.loadSavedRecipes();
        
        document.getElementById('importPreview').style.display = 'none';
        document.getElementById('fileInput').value = '';
        fileHandler.currentImportData = null;
    }

    // 更新配方选择器
    updateRecipeSelectors(selectId) {
        const select = document.getElementById(selectId);
        const recipes = costCalculator.getAllRecipes();
        
        select.innerHTML = '<option value="">请选择配方</option>';
        recipes.forEach(recipe => {
            const option = document.createElement('option');
            option.value = recipe.id;
            option.textContent = `${recipe.recipeName} (${recipe.foodType})`;
            select.appendChild(option);
        });
    }

    // 计算成本
    calculateCost() {
        const recipeId = document.getElementById('calculateRecipeSelect').value;
        if (!recipeId) {
            this.showToast('请选择配方', 'warning');
            return;
        }

        const recipe = costCalculator.getRecipe(recipeId);
        const costResult = costCalculator.calculateRecipeCost(recipe);

        // 显示结果
        document.getElementById('materialCost').textContent = `¥${costResult.materialCost.toFixed(2)}`;
        document.getElementById('laborCostDisplay').textContent = `¥${costResult.laborCost.toFixed(2)}`;
        document.getElementById('totalCost').textContent = `¥${costResult.totalCost.toFixed(2)}`;
        document.getElementById('unitCost').textContent = `¥${costResult.unitCost.toFixed(2)}`;

        // 填充材料表格
        const tbody = document.getElementById('materialTableBody');
        tbody.innerHTML = '';
        costResult.materials.forEach(m => {
            const row = tbody.insertRow();
            row.innerHTML = `
                <td>${m.name}</td>
                <td>${m.requestedQuantity} ${m.unit}</td>
                <td>¥${m.unitPrice.toFixed(2)}</td>
                <td>${((m.wastageRate || 0) * 100).toFixed(1)}%</td>
                <td>¥${m.cost.toFixed(2)}</td>
                <td>${m.percentage}%</td>
            `;
        });

        // 绘制图表
        this.drawCostChart(costResult);

        document.getElementById('calculationResult').style.display = 'block';
        this.showToast('成本计算完成', 'success');
    }

    // 绘制成本图表
    drawCostChart(costResult) {
        const canvas = document.getElementById('costChart');
        const ctx = canvas.getContext('2d');

        if (this.costChart) {
            this.costChart.destroy();
        }

        const chartData = costCalculator.generateChartData(costResult);

        this.costChart = new Chart(ctx, {
            type: 'pie',
            data: chartData.materialChart,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    },
                    title: {
                        display: true,
                        text: '材料成本分布'
                    }
                }
            }
        });
    }

    // 生成优化建议
    generateOptimization() {
        const recipeId = document.getElementById('optimizeRecipeSelect').value;
        if (!recipeId) {
            this.showToast('请选择配方', 'warning');
            return;
        }

        const recipe = costCalculator.getRecipe(recipeId);
        const optimization = costOptimizer.generateOptimizations(recipe);

        // 显示优化统计
        document.getElementById('currentCostOpt').textContent = `¥${optimization.currentCost.toFixed(2)}`;
        document.getElementById('optimizedCost').textContent = `¥${optimization.bestOptimization.optimizedCost.toFixed(2)}`;
        document.getElementById('savedAmount').textContent = `¥${optimization.bestOptimization.totalSavings.toFixed(2)}`;
        document.getElementById('savedPercent').textContent = `${optimization.bestOptimization.totalSavingsPercent.toFixed(1)}%`;

        // 显示建议列表
        const suggestionsList = document.getElementById('suggestionsList');
        suggestionsList.innerHTML = '';
        
        if (optimization.suggestions.length === 0) {
            suggestionsList.innerHTML = '<p>暂无优化建议，当前配方已经很优化了！</p>';
        } else {
            optimization.suggestions.forEach((s, index) => {
                const priorityClass = s.priority === 'high' ? 'high-priority' : 
                                    s.priority === 'medium' ? 'medium-priority' : '';
                const priorityBadge = s.priority === 'high' ? 'badge-high' :
                                    s.priority === 'medium' ? 'badge-medium' : 'badge-low';
                const priorityText = s.priority === 'high' ? '高' :
                                    s.priority === 'medium' ? '中' : '低';
                
                const div = document.createElement('div');
                div.className = `suggestion-item ${priorityClass}`;
                div.innerHTML = `
                    <div class="suggestion-header">
                        <span class="suggestion-title">${index + 1}. ${s.title}</span>
                        <span class="suggestion-badge ${priorityBadge}">优先级: ${priorityText}</span>
                    </div>
                    <div class="suggestion-details">
                        <p>${s.description}</p>
                        <p style="margin-top: 10px;"><strong>实施方法：</strong>${s.implementation}</p>
                    </div>
                    <div class="suggestion-savings">
                        💰 可节省：¥${s.savings.toFixed(2)} (${s.savingsPercent.toFixed(1)}%)
                    </div>
                `;
                suggestionsList.appendChild(div);
            });
        }

        // 绘制对比图表
        this.drawComparisonChart(optimization);

        document.getElementById('optimizationResult').style.display = 'block';
        this.showToast('优化分析完成', 'success');
    }

    // 绘制对比图表
    drawComparisonChart(optimization) {
        const canvas = document.getElementById('comparisonChart');
        const ctx = canvas.getContext('2d');

        if (this.comparisonChart) {
            this.comparisonChart.destroy();
        }

        this.comparisonChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['当前成本', '优化后'],
                datasets: [{
                    label: '成本（元）',
                    data: [
                        optimization.currentCost,
                        optimization.bestOptimization.optimizedCost
                    ],
                    backgroundColor: ['#ef4444', '#10b981']
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: '成本优化对比'
                    }
                }
            }
        });
    }

    // 更新报告配方选择
    updateReportRecipeSelection() {
        const container = document.getElementById('reportRecipeSelection');
        const recipes = costCalculator.getAllRecipes();
        
        container.innerHTML = '';
        recipes.forEach(recipe => {
            const div = document.createElement('div');
            div.className = 'recipe-checkbox';
            div.innerHTML = `
                <input type="checkbox" id="report-recipe-${recipe.id}" value="${recipe.id}">
                <label for="report-recipe-${recipe.id}">${recipe.recipeName} (${recipe.foodType})</label>
            `;
            container.appendChild(div);
        });
    }

    // 生成报告
    generateReport() {
        const reportType = document.getElementById('reportType').value;
        const selectedRecipes = Array.from(document.querySelectorAll('#reportRecipeSelection input:checked'))
            .map(cb => cb.value);

        if (selectedRecipes.length === 0) {
            this.showToast('请至少选择一个配方', 'warning');
            return;
        }

        let html = '';
        switch (reportType) {
            case 'summary':
                html = reportGenerator.generateSummaryReport(selectedRecipes);
                break;
            case 'detailed':
                html = reportGenerator.generateDetailedReport(selectedRecipes);
                break;
            case 'optimization':
                html = reportGenerator.generateOptimizationReport(selectedRecipes);
                break;
            case 'comparison':
                html = reportGenerator.generateComparisonReport(selectedRecipes);
                break;
        }

        document.getElementById('reportContent').innerHTML = html;
        document.getElementById('reportPreview').style.display = 'block';
        
        this.showToast('报告生成成功', 'success');
    }

    // 导出报告
    exportReport() {
        const selectedRecipes = Array.from(document.querySelectorAll('#reportRecipeSelection input:checked'))
            .map(cb => cb.value);

        if (selectedRecipes.length === 0) {
            this.showToast('请至少选择一个配方', 'warning');
            return;
        }

        if (selectedRecipes.length === 1) {
            fileHandler.exportRecipeToExcel(selectedRecipes[0]);
        } else {
            fileHandler.exportMultipleRecipesToExcel(selectedRecipes);
        }

        this.showToast('Excel导出成功', 'success');
    }

    // 导出PDF
    exportPDF() {
        const reportHtml = document.getElementById('reportContent').innerHTML;
        if (!reportHtml) {
            this.showToast('请先生成报告', 'warning');
            return;
        }

        const reportType = document.getElementById('reportType').value;
        const titles = {
            'summary': '成本汇总报告',
            'detailed': '详细分析报告',
            'optimization': '优化建议报告',
            'comparison': '配方对比报告'
        };

        reportGenerator.generatePDFReport(reportHtml, titles[reportType]);
    }

    // 获取内置模板副本，避免直接修改常量
    getBuiltInTemplates() {
        return JSON.parse(JSON.stringify(BUILT_IN_PRODUCT_TEMPLATES));
    }

    // 显示提示消息
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
}

// 初始化应用
const app = new App();

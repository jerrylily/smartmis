// Controller - 主控：公共按钮统一处理函数放置于此
Ext.define('Smart.controller.Main', {
    extend: 'Ext.app.Controller',
    requires: [
        'Ext.toolbar.Paging',
        'Smart.extend.data.Store',
        'Smart.extend.data.RestProxy',
        'Smart.extend.data.JsonWriter'
    ],
    models: [],
    stores: [],
    views: [],
    init: function() {
        this.control(
            {
                '#s_tlbtn_logout': { click: this.logout }, // 退出按钮
                'viewport > sm_main': { afterrender: this.createNavList }, // 主窗体渲染后创建导航菜单
                '#s_nav dataview': { itemclick: this.onNavItemclick}, // 导航栏项目点击后打开相应page
                'viewport tool[type=help]': {click: this.help} // 顶部工具按钮，统一打开help面板
            }
        );
    },
    // 退出系统
    logout: function() {
        window.location.replace('/logout');
    },
    // 统一获取帮助处理函数
    help: function(tool) {
        var parent = tool.up('grid, panel'),
            hid = parent.itemId;
        // TODO: add help json data
        console.log('关于'+hid+'的帮助');
    },
    
    // 打开导航菜单对应的page，如果存在则显示，否则创建后显示
    onNavItemclick: function(dataview, record, item, index, e) {
        var tabPanel = dataview.up('sm_main').down('#s_tab');
        this.openTabPanel(tabPanel, record.data);
    },
    
    openTabPanel: function(tabPanel, data) {
        var nav = tabPanel.up('sm_main').down('#s_nav'),
            pid = data.code,
            tab = tabPanel.getComponent(pid),
            cpath = 'Smart.view.'+data.code;
        nav.collapse(); // 打开tab后,关闭左侧导航栏
        if (tab) {
            tabPanel.setActiveTab(tab);
        } else {
            var page = Ext.create(cpath, {
                itemId: pid,
                title: data.name,
                glyph: data.glyph,
                closable: true
            });
            tabPanel.add(page);
            tabPanel.setActiveTab(page);
            
        }
    },
    // 创建左侧导航栏，根据用户权限创建
    createNavList: function(main) {
        var controller = this,
            nav = main.down('#s_nav'),
            tlb = main.down('#s_tl'),
            tabPanel = main.down('#s_tab'),
            tlb_index = 0;
        // 获取导航功能集合
        Ext.Ajax.request({
            url: '/navlist',
            success: function(response){
                //nav.removeAll();    // 清空导航栏
                //tlb.removeAll();    // 清空顶部
                var navlist = Ext.decode(response.responseText, true);
                Ext.Array.each(navlist, function(nl) {
                    if (nl.pages.length < 1) return;
                    // 左侧面板
                    var panel = Ext.create('Ext.panel.Panel', {
                        itemId: 's_nav_'+nl.code,
                        title: nl.name,
                        glyph: nl.glyph+'@smart',
                        layout: 'fit',
                        items: []
                    });
                    var dw = Ext.create('Ext.view.View', {
                        itemId: 's_nav_dataview',
                        trackOver: true,
                        cls: 'nav-list',
                        itemSelector: '.nav-list-item',
                        tpl: '<tpl for="."><span class="nav-list-item"><span class="{icon}"></span>{name}</span></tpl>',
                        autoScroll: true
                    });
                    var store = Ext.create('Ext.data.Store', {
                        fields: ['name', 'code', 'icon','glyph'],
                        data: nl.pages
                    });
                    dw.bindStore(store);
                    panel.add(dw);
                    nav.add(panel);
                    //console.log(panel);
                    // 顶部图标
                    var t_index = 1;
                    Ext.Array.each(nl.pages, function(p) {
                        if (p.is_top) {
                            var btn = Ext.create('Ext.button.Button', {
                                scale: 'large',
                                ui: 'plain',
                                glyph: p.glyph,
                                handler: function() {
                                    controller.openTabPanel(tabPanel, p);
                                }
                            });
                            //tlb.add(btn);
                            tlb.insert(t_index++, btn);
                        }
                    });
                });
                /*
                tlb.add('->');
                // 退出按钮
                tlb.add({
                    itemId: 's_tlbtn_logout',
                    scale: 'large',
                    ui: 'plain',
                    glyph: 'xe001'
                });
                */
            }
        });//Ext.Ajax.request
    }// createNavList
});

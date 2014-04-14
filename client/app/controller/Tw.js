Ext.define('Smart.controller.Tw', {
    extend: 'Ext.app.Controller',
    models: [
        'tw.District',
        'tw.DistrictDetail',
        'tw.Photo',
        'tw.Tags',
        'tw.Article',
        'tw.ArticleDetail',
        'tw.Poi',
        'tw.PoiDetail',
        'tw.Article_poi',
        'tw.PoiCombobox'
    ],
    stores: [
        'tw.District',
        'tw.Photo',
        'tw.Tags',
        'tw.ArticlePclass',     // 文章类pclass类别
        'tw.PoiPclass',         // Poi类pclass类别
        'tw.Article',
        'tw.Poi',
        'tw.Article_poi',
        'tw.PoiCombobox'
    ],
    views: [
        'tw.District',
        'tw.Article',
        'tw.Poi',
        'tw.Tag'
    ],
    refs: [
        //{ref: 'page_page', selector: '#s_page_config_pages_pages'}
    ],
    init: function() {
        this.control(
            {
            }
        );
    }
});

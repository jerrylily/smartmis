// view.widget.Avatar
/* 
    flash头像剪裁组件
*/

Ext.define('Smart.view.widget.Avatar', {
    extend: 'Ext.flash.Component',
    alias : 'widget.sm_avatar',
    width: 600,
    height: 400,
    url: 'resources/plugins/avatar/avatar.swf',
    flashVars : {
        "jsfunc":"uploadevent", // 处理返回结果的回调函数
        "imgUrl":"resources/images/smart-theme-bg.jpg",
        "uploadSrc":true,
        "uploadUrl":"/saveavater/?action=uploadavatar"
    }
    
});
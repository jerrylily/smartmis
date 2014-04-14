/* Load this script using conditional IE comments if you need to support IE 7 and IE 6. */

window.onload = function() {
	function addIcon(el, entity) {
		var html = el.innerHTML;
		el.innerHTML = '<span style="font-family: \'smart\'">' + entity + '</span>' + html;
	}
	var icons = {
			'icon-store' : '&#xe000;',
			'icon-power' : '&#xe001;',
			'icon-circleadd' : '&#xe002;',
			'icon-brush' : '&#xe003;',
			'icon-trash' : '&#xe004;',
			'icon-circledelete' : '&#xe005;',
			'icon-circleselect' : '&#xe006;',
			'icon-lock' : '&#xe007;',
			'icon-unlock' : '&#xe008;',
			'icon-user' : '&#xe009;',
			'icon-key' : '&#xe00a;',
			'icon-uniF008' : '&#xe00b;',
			'icon-mimetype' : '&#xe00c;',
			'icon-certificate' : '&#xe00d;',
			'icon-treediagram' : '&#xe00e;',
			'icon-friends' : '&#xe00f;',
			'icon-affiliate' : '&#xe010;',
			'icon-uniF00F' : '&#xe011;',
			'icon-faq' : '&#xe012;',
			'icon-foldertree' : '&#xe013;',
			'icon-men' : '&#xe014;',
			'icon-stocks' : '&#xe015;',
			'icon-appointment' : '&#xe016;',
			'icon-phone2' : '&#xe017;',
			'icon-businesscard2' : '&#xe018;',
			'icon-creditcard' : '&#xe019;',
			'icon-invoice' : '&#xe01a;',
			'icon-airplane' : '&#xe01b;',
			'icon-shoppingcart' : '&#xe01c;',
			'icon-alarm' : '&#xe01d;',
			'icon-incomingcall' : '&#xe01e;',
			'icon-undo' : '&#xe01f;',
			'icon-save' : '&#xe020;',
			'icon-image' : '&#xe021;',
			'icon-uniF47A' : '&#xe022;',
			'icon-island' : '&#xe023;',
			'icon-mailinglists' : '&#xe024;',
			'icon-checkin' : '&#xe025;',
			'icon-uniF482' : '&#xe026;'
		},
		els = document.getElementsByTagName('*'),
		i, attr, c, el;
	for (i = 0; ; i += 1) {
		el = els[i];
		if(!el) {
			break;
		}
		attr = el.getAttribute('data-icon');
		if (attr) {
			addIcon(el, attr);
		}
		c = el.className;
		c = c.match(/icon-[^\s'"]+/);
		if (c && icons[c[0]]) {
			addIcon(el, icons[c[0]]);
		}
	}
};
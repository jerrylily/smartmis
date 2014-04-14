$(document).ready(function() {
    function getBrowser() {
        var ua = navigator.userAgent.toLowerCase();
        var match = /(chrome)[ \/]([\w.]+)/.exec( ua ) ||
            /(webkit)[ \/]([\w.]+)/.exec( ua ) ||
            /(opera)(?:.*version|)[ \/]([\w.]+)/.exec( ua ) ||
            /(msie) ([\w.]+)/.exec( ua ) ||
            ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec( ua ) ||
            [];
        return {
            typ: match[ 1 ] || "",
            ver: match[ 2 ] || "0"
        };
    }
    var sbType = {
        'msie':     {'name': '微软IE浏览器', 'deny': ['6.0', '7.0', '8.0']},
        'chrome':   {'name': '谷歌Chrome浏览器', 'deny': []},
        'webkit':   {'name': '苹果Safari浏览器', 'deny': []},
        'mozilla':  {'name': '火狐Firefox浏览器', 'deny': []},
        'opera':    {'name': '欧鹏Opera浏览器', 'deny': []}
    };
    s_b = getBrowser();
    console.log(s_b);
    if($.inArray(s_b.ver, sbType[s_b.typ].deny) > -1)
    {
        $('#browser_ver').text(sbType[s_b.typ].name + '[' + s_b.ver + '版]');
        $('#limit_notice').fadeIn(2000);
        return;
    };
    
    // fadeIn login panel
    $('#login_panel').fadeIn(3000);

    // set data in localStorage
    // @ return true/false
    function setLocaldata(key, value) {
        if (typeof(localStorage) == 'undefined' ) {
            console.log('Browser does not support HTML5 localStorage');
            return false;
        } else {
            try {
                localStorage.setItem(key, value);
                return true;
            } catch (e) {
                console.log(e);
                return false;
            }
        }
    }
    // get data in localStorage
    // @ return value/''
    function getLocaldata(key) {
        if (typeof(localStorage) == 'undefined' ) {
            console.log('Browser does not support HTML5 localStorage');
            return null;
        } else {
            try {
                return localStorage.getItem(key);
            } catch (e) {
                console.log(e);
                return null;
            }
        }
    }
    // remove data from localStorage
    // @ return value/''
    function removeLocaldata(key) {
        if (typeof(localStorage) == 'undefined' ) {
            console.log('Browser does not support HTML5 localStorage');
            return false;
        } else {
            try {
                localStorage.removeItem(key);
                return true;
            } catch (e) {
                console.log(e);
                return false;
            }
        }
    }
    
    // lock / unlock toggle
    // @sp: span lock icon
    function lockToggle(sp) {
        sp.toggleClass('icon-lock');
        sp.toggleClass('icon-unlock');
    }
    // set lock or unlock
    // @sp: span lock icon
    // @lock: boolean, true=lock , false=unlock
    function setLock(sp, lock) {
        sp.toggleClass('icon-lock', true && lock);
        sp.toggleClass('icon-unlock', !(true && lock));
    }
    $('#sm_user_lock').click(function() {
        lockToggle($(this));
    });
    $('#sm_pswd_lock').click(function() {
        lockToggle($(this));
    });
    
    // ajax login post
    $('#sm_login_submit').click(function() {
        var usr_name = $('#sm_user').val();
        var usr_pswd = $('#sm_pswd').val();
        if (usr_name == '') { sTop('用户名不能为空！'); return; }
        if (usr_pswd == '') { sTop('密码不能为空！'); return; }
        // set the login data
        var loginData = {'name':{'lock':false, 'value':''}, 'passwd':{'lock':false, 'value':''}};
        if ($('#sm_user_lock').hasClass('icon-lock')) {
            loginData.name.lock = true;
            loginData.name.value = $('#sm_user').val();
        }
        if ($('#sm_pswd_lock').hasClass('icon-lock')) {
            loginData.passwd.lock = true;
            loginData.passwd.value = $('#sm_pswd').val();
        }
        

        // ajax post login
        $.getJSON(
            '/login',
            {
                sm_user: usr_name,
                sm_pswd: usr_pswd
            },
            function(data,success) {
                console.log(data);
                status = data.status ? data.status : 0 ;
                console.log(status);
                if (status == 0) sTop('无法登陆服务器！');
                if (status == 1) sTop('用户名不存在！');
                if (status == 2) sTop('密码错误！');
                if (status == 3) sTop('用户【' + sm_user + '】已被禁止登录本系统！');
                if (status == 4) {
                    setLocaldata('login',JSON.stringify(loginData));    // write the login data to the localStorage
                    window.location.replace('/');
                }
            }
        );
    });
    // reset action
    $('#sm_login_reset').click(function() {
        setLock($('#sm_user_lock'), true);
        setLock($('#sm_pswd_lock'), false);
        $('#sm_user').val('');
        $('#sm_pswd').val('');
        var hh = removeLocaldata('login'); // clear the login data
        console.log(hh);
    });
    

    // init login data
    var userLogindata = JSON.parse(getLocaldata('login'));  // get login data from localStorage
    console.log(userLogindata);
    if (userLogindata) {
        if ('name' in userLogindata) {
            $('#sm_user').val(userLogindata.name.value);
            setLock($('#sm_user_lock'), userLogindata.name.lock);
        }
        if ('passwd' in userLogindata) {
            $('#sm_pswd').val(userLogindata.passwd.value);
            setLock($('#sm_pswd_lock'), userLogindata.passwd.lock);
        }
    }

    
});
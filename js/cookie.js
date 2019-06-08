function setCookie(a, b, c) {
    var d = new Date();
    d.setDate(d.getDate() + c);
    var e = escape(b) + (null == c ? "" : "; expires=" + d.toUTCString());
    document.cookie = a + "=" + e;
}

function doesCookieExist(a) {
    var b = getCookie(a);
    if (null != b && "" != b) return true; else return false;
}

function getCookieValue(a) {
    var b = getCookie(a);
    if (null != b && "" != b) return b.split(",")[0]; else return null;
}

function deleteCookie(a) {
    setCookie(a, "", -1);
}

function getCookie(a) {
    var b = document.cookie;
    var c = b.indexOf(" " + a + "=");
    if (c == -1) c = b.indexOf(a + "=");
    if (c == -1) b = null; else {
        c = b.indexOf("=", c) + 1;
        var d = b.indexOf(";", c);
        if (d == -1) d = b.length;
        b = unescape(b.substring(c, d));
    }
    return b;
}
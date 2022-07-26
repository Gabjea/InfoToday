export default class CookieManager {
    static setCookie(cname, cvalue, exsecs = 1e10) {
        const date = new Date();
        //if (exsecs === null) exsecs = 99999999999999;
        date.setTime(date.getTime() + (exsecs * 1e3));
        let expires = "expires=" + date.toGMTString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    static getCookie(cname) {
        let name = cname + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }
        return null;
    }

    static deleteCookie(cname) {
        console.log(window.location.hostname)
        document.cookie = `${cname}=; Max-Age=0; path=/; domain=${window.location.hostname}`;
    }
}

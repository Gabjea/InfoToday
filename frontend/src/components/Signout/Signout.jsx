import React from 'react';
import CookieManager from "./../../utils/CookieManager";
export default function Signout()  {

    React.useEffect(() => {
        document.cookie =
        "jwt=; Max-Age=0; path=/; domain=" + window.location.hostname;
        window.location.reload();
    })
    React.useEffect(() => {
        if (CookieManager.getCookie('jwt') == null) {
            window.location.assign('/login');
            return;
        }
    }, [])

    return (
        <div>
            
        </div>
    );
};


import React from 'react';
import CookieManager from "./../../utils/CookieManager";

export default function Signout()  {

    React.useEffect(() => {
        if (CookieManager.getCookie('jwt') == null) {
            window.location.assign('/login');
            return;
        }else {
             CookieManager.deleteCookie('jwt');
       // window.location.reload();
        }
    }, [])

    return (
        <div>
            
        </div>
    );
};


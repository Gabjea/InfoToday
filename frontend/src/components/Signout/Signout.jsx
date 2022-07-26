import React from 'react';
import CookieManager from "./../../utils/CookieManager";

export default function Signout()  {

    
    React.useEffect(() => {
        CookieManager.deleteCookie('jwt');
        if (CookieManager.getCookie('jwt') == null) {
            window.location.assign('/login');
            return;
        }
        
    })

    return (
        <div>
            
        </div>
    );
};


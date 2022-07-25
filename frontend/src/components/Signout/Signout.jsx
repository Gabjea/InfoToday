import React from 'react';
import CookieManager from "./../../utils/CookieManager";

export default function Signout()  {

    
    React.useEffect(() => {
        window.location.assign('/login');
         CookieManager.deleteCookie('jwt');
          return; 
        
    })

    return (
        <div>
            
        </div>
    );
};


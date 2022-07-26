import React from 'react';
import CookieManager from "./../../utils/CookieManager";

export default function Signout()  {

   
    React.useEffect(() => {
      
             CookieManager.deleteCookie('jwt');
              
    })

    return (
        <div>
            
        </div>
    );
};


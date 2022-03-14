import React from 'react';
import CookieManager from "./../../utils/CookieManager";

export default function Dashboard(props) {
    React.useEffect(() => {
        if (CookieManager.getCookie('jwt') == null) {
            window.location.assign('/login');
            return;
        }
    }, [])


    return (
        <div style={{ 'overflow': 'hidden' }}>

        </div>
    );
}
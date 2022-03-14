import React from 'react';
import { formatDate } from '../../utils/DateTime';
import { axiosAuthInstanceToAPI } from '../../utils/serverAPI';
import CookieManager from "./../../utils/CookieManager";

export default function Dashboard(props) {
    React.useEffect(() => {
        if (CookieManager.getCookie('jwt') == null) {
            window.location.assign('/login');
            return;
        }
    }, [])

    const [sessions, setSessions] = React.useState([]);

    React.useEffect(() => {
        axiosAuthInstanceToAPI.get('/user/sessions').then(res => {
            //console.log(res.data);
            setSessions(res.data);
        }, err => {
            alert("ERROR!");
        })
    }, [])

    return (
        <div style={{ 'overflow': 'hidden' }}>
            {
                sessions.map(session => <div key={session._id}>{session.name},
                    {session.session.startDate}, {session.session.endDate} </div>)
            }
        </div>
    );
}
import React from 'react';
import { axiosAuthInstanceToAPI } from '../../../utils/serverAPI';
import Session from './Session';

function Sessions(props) {
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
        <div>
            <p>Sesiuni viitoare:</p>

            {
                sessions.map(session => <Session key={Math.random()} session={session} />)
            }
        </div>
    );
}

export default Sessions;
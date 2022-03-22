import React from 'react';
import { axiosAuthInstanceToAPI } from '../../../utils/serverAPI';
import Session from './Session';

function Sessions({ socket }) {
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
                sessions.map(session => <Session socket={socket} key={Math.random()} session={session} />)
            }
        </div>
    );
}

export default Sessions;
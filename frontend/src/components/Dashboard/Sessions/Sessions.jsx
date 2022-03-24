import React from 'react';
import { axiosAuthInstanceToAPI } from '../../../utils/serverAPI';
import Session from './Session';

function Sessions() {
    const [sessions, setSessions] = React.useState([]);

    React.useEffect(() => {
        axiosAuthInstanceToAPI.get('/user/sessions').then(res => {
            //console.log(res.data);
            setSessions(res.data.reverse());
        }, err => {
            alert("ERROR!");
        })
    }, [])

    return (
        <div className="flex flex-wrap mt-6">
            <div className="w-full lg:w-1/2 pr-0 lg:pr-2">
                <p className="text-2xl pb-3 flex items-center">
                    Sesiuni viitoare:
                </p>
                <div className="w-full p-1 bg-white">
                    {
                        sessions.map(session => <Session key={Math.random()} session={session} />)

                    }
                </div>
            </div>
        </div>
    );
}

export default Sessions;
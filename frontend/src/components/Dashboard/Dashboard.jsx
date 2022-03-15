import React from 'react';
import { axiosAuthInstanceToAPI } from '../../utils/serverAPI';

export default function Dashboard(props) {

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
        <div style={{ 'overflow': 'hidden' }} className='text-lg'>
            <p>Sesiuni viitoare:</p>

            {
                sessions.map(session => <div
                    className='w-1/2 lg:flex-row rounded overflow-hidden h-auto border border-gray-300 shadow shadow-lg'
                    key={session._id}>
                    <p>cu: <i>{'  '}{session.name}</i></p>
                    <div>inteval: {'  '}
                        {session.session.startDate} <span className='text-3xl'>&#8594;</span> {session.session.endDate}
                    </div>
                </div>)
            }
        </div>
    );
}
import React from 'react';
import SolvedPb from './SolvedPb';
import {axiosAuthInstanceToAPI} from './../../../utils/serverAPI';

export default function SolvedPbs(props) {
    const [problems, setProblems] = React.useState([]);

    React.useEffect(() => {
        axiosAuthInstanceToAPI.get('/user/problems/mine').then( res => {
            console.log(res.data);
            setProblems(res.data);
        }, err => {
            console.error(err);
        })
    }, [])

    return (
        <div className=' justify-end ml-80'>
            Probleme rezolvate: <br />

            <div id='name-cols' className='text-2xl'>
                <span>nume</span>
                <span className='ml-28'>data</span>
                <span className='ml-40'>scor</span>
            </div>

            {
                problems.map(problem => <SolvedPb key={Math.random()} problem={problem} />)
            }
        </div>
    );
}
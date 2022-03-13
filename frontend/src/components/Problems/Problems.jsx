import React from 'react';
import { Link } from "react-router-dom";
import { axiosAuthInstanceToAPI } from '../../utils/serverAPI';
import ProblemBox from './ProblemBox';

export default function Problems({ isSession }) {
    const [problems, setProblems] = React.useState([]);

    React.useEffect(() => {
        axiosAuthInstanceToAPI.get('/user/problems').then(res => {
            //console.log(res.data);
            setProblems(res.data);
        }, err => {
            alert("ERROR!");
        })
    }, [])

    return (
        <div className='px-6'>
            <p>Probleme:</p>
            {
                problems.map(problem => <ProblemBox isSession={isSession} name={problem.name} text={problem.text} />)
            }
        </div>
    );
}
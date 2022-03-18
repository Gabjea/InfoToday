import React from 'react';
import SolvedPb from './SolvedPb';

export default function SolvedPbs(props) {
    const [problems, setProblems] = React.useState([{ name: 'suma', user: 'stana', data: '14/03/2022, 23:36:00', score: '50' }]);

    React.useEffect(() => {
        console.log('efngjgfe');
    }, [])

    return (
        <div className=' justify-end ml-80'>
            Probleme rezolvate: <br />

            <div id='name-cols' className='text-2xl'>
                <span>nume</span>
                <span className='ml-20'>utilizator</span>
                <span className='ml-28'>data</span>
                <span className='ml-40'>scor</span>
            </div>


            {
                problems.map(problem => <SolvedPb key={Math.random()} problem={problem} />)
            }
        </div>
    );
}
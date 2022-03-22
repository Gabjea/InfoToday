import React from 'react';
import { formatDate } from '../../../utils/DateTime';

function SolvedPb({ problem }) {
    const pbBoxRef = React.createRef();
    const [color] = React.useState(() => {
        const score= Number(problem.score);
        console.log(typeof score);
        if (score === 0) {
            return 'bg-red-600';
        } else if (score < 100) {
            return 'bg-yellow-400';
        } else {
            return 'bg-green-600';
        }
    });

    /*
    React.useEffect(() => console.log('0'), [])

    React.useEffect(() => {
        const idx = Math.floor(problem.score / (100 / (ProcToColor.length - 1)));
        console.log(String(ProcToColor[idx]));
        //setColor(`bg-${String(ProcToColor[idx])}-600`);
        //pbBoxRef.current.classList.add(`bg-${String(ProcToColor[idx])}-600`);
    }, [pbBoxRef, problem.score])//*/

    return (
        <div>
            <div ref={pbBoxRef} className={`${color} w-full lg:flex-row rounded overflow-hidden h-auto border border-gray-300 shadow shadow-lg `}>
                <span>{problem.name}</span>
                <span className='ml-32'>{''}{formatDate(problem.date)}</span>
                <span className='ml-48'>{' '}{problem.score}</span>
            </div>
        </div>
    );
}

export default SolvedPb;
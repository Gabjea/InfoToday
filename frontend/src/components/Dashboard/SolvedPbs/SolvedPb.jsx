import React from 'react';
import { formatDate } from './../../../utils/DateTime';

function SolvedPb({ problem }) {

    const [color] = React.useState(() => {
        const score = Number(problem.score);
        //console.log(typeof score);
        if (score === 0) {
            return 'text-red-600';
        } else if (score < 100) {
            return 'text-yellow-600';
        } else {
            return 'text-green-600';
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
        <tr className={`rounded bg-white `}>
            <td className="w-1/3  py-3 border border-slate-500 text-2xl text-center	">
                {problem.name}
            </td>
            <td className={`w-1/3 py-3 border border-slate-500 ${color} text-center	 text-2xl `}>
                {problem.score}
            </td>
            <td className="py-3 border border-slate-500 text-center text-xl	">
                {formatDate(problem.date)}
            </td>
        </tr>
    );
}

export default SolvedPb;
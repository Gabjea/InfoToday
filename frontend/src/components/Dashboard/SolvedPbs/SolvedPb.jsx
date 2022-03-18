import React from 'react';
const ProcToColor = ['red', 'orange', 'blue', 'yellow', 'green'];

function SolvedPb({ problem }) {
    const pbBoxRef = React.createRef();
    const [color, setColor] = React.useState('');

    React.useEffect(() => console.log('0'), [])

    React.useEffect(() => {
        const idx = Math.floor(problem.score / (100 / (ProcToColor.length - 1)));
        console.log(String(ProcToColor[idx]));
        setColor(`bg-${String(ProcToColor[idx])}-600`);
        //pbBoxRef.current.classList.add(`bg-${String(ProcToColor[idx])}-600`);
    }, [pbBoxRef, problem.score])

    return (
        <div>
            <div ref={pbBoxRef} className={`${color} w-full lg:flex-row rounded overflow-hidden h-auto border border-gray-300 shadow shadow-lg `}>
                <span>{problem.name}</span>
                <span className='ml-24'>{problem.user}</span>
                <span className='ml-40'>{' '}{problem.data}</span>
                <span className='ml-10'>{problem.score}</span>
            </div>
        </div>
    );
}

export default SolvedPb;
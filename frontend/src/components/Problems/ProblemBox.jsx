import React from 'react';

export default function ProblemBox({ problem, setDisplayed, socket }) {

    React.useEffect(() => {
        socket?.on('display-problem', pbName => {
            setDisplayed(pbName);
        })
        
    }, [socket, setDisplayed])

    const handleClick = event => {
        event.preventDefault();
        setDisplayed(problem.name);
        socket?.emit('display-problem', problem.name);
    }

    return (
        <div className=' w-1/2 lg:flex-row rounded overflow-hidden h-auto border border-gray-300 shadow shadow-lg '>
            
            <p className='mb-5 px-3 mt-3 text-2xl border-b border-gray-300 bold'>
                {problem.name}
            </p>
            
            <div className='px-3'>

                <p className='text-md'>
                    {problem.text}
                    </p>
            </div>
            <div className='flex justify-end'>

            <button type="button" onClick={handleClick} className="text-white bg-purple-500 hover:bg-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">Rezolva</button>
            </div>
        </div>
    );
}
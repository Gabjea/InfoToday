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

                <p className='text-md'>Se dă o tablă dreptunghiulară formată din n linii și m coloane, definind n*m zone, unele dintre ele fiind libere, altele conținând obstacole. În zona aflată la poziția is, js se află un șoarece care se poate deplasa pe tablă trecând din zona curentă în zona învecinată cu aceasta pe linie sau pe coloană. Scopul sau este să ajungă la o bucată de brânză aflată în zona de la poziția ib, jb, fără a părăsi tabla, fără a trece prin zone care conțin obstacole și fără a trece de două ori prin aceeași zonă.

                    Determinați câte modalități prin care șoarecele poate ajunge de la poziția inițială la cea a bucății de brânză există.</p>
            </div>
            <div className='flex justify-end'>

            <button type="button" onClick={handleClick} className="text-white bg-purple-500 hover:bg-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">Rezolva</button>
            </div>
        </div>
    );
}
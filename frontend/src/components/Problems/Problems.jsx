import React from 'react';
import { useParams } from "react-router-dom";
import { axiosAuthInstanceToAPI } from '../../utils/serverAPI';
import Problem from './Problem';
import ProblemBox from './ProblemBox';
import { CATEGORIES } from './../../utils/constants';

export default function Problems({ socket }) {
    const { id: sessionId } = useParams();

    const [fetchedData, setfetchedData] = React.useState([]);
    const [problems, setProblems] = React.useState([]);
    const [displayedPb, setDisplayed] = React.useState('');
    const [srcInp, setSrcInp] = React.useState('');
    const [selInp, setSelInp] = React.useState('*');

    React.useEffect(() => {
        

        axiosAuthInstanceToAPI.get('/user/problems').then(res => {
            //console.log(res.data);
            setfetchedData(res.data);
            setProblems(res.data);
        }, err => {
            console.error(err);
            alert("ERROR!");
        })
    }, [])

    const filterData = React.useCallback(() => {
        setProblems(fetchedData.filter(problem => {
            let ok = true;
            ok &= problem.name.startsWith(srcInp);
            if (selInp !== '*') {
                ok &= problem.category === selInp;
            }
            return ok;
        }));
    }, [srcInp, selInp, fetchedData])

    React.useEffect(() => filterData(), [srcInp, selInp, filterData])

    const handleInputChange = event => {
        event.preventDefault();
        const { value: prefix } = event.target;
        setSrcInp(prefix);
    }

    const handleSelChange = event => {
        event.preventDefault();
        const { value: category } = event.target;
        setSelInp(category);
    }

    React.useEffect(() => {
        socket?.on('back', () => {
            setDisplayed('');
            setSrcInp('');
            setSelInp('*');
            setTimeout(() => {
                window.location.reload();
            }, 500);
        })
    }, [socket])

    const handleBackClick = event => {
        event.preventDefault();
        if(socket) {
            
            socket?.emit('back');
        }else {
            setDisplayed('');
            setSrcInp('');
            setSelInp('*');
        }
        //window.location.reload();
    }

    return (
        <div className='px-6 mt-10'>
            
            
            {displayedPb && <button onClick={handleBackClick}
                className=" bg-purple-500 hover:bg-purple-800 text-white font-bold py-2 px-4 rounded mt-5"
            >
                back
            </button>}
            
            <br />
            {(displayedPb && <Problem
                socket={socket}
                problem={problems.find(problem => problem.name === displayedPb)}
            />)
                ||
                <div className='px-6 py-10 '>
                    <p className='text-xl'>Probleme:</p>
                    <input type="text" placeholder='search by name'
                        className='appearance-none  block bg-white text-gray-700 border border-gray-400 shadow-inner rounded-md py-3 px-4 leading-tight focus:outline-none  focus:border-gray-500' onChange={handleInputChange} /> <br />
                    <p className='text-xl'>Categorie:</p>
                    <select  className=' block bg-white text-gray-700 border border-gray-400 shadow-inner rounded-md  px-4 leading-tight focus:outline-none  focus:border-gray-500' name="category" id="category" onChange={handleSelChange}>
                    
                    
                        {
                            
                            CATEGORIES.map(category =>{ 
                                if(selInp === category)
                                    return <option selected key={Math.random()} className='' value={category}>{category}</option>
                                
                                else return <option key={Math.random()} className='' value={category}>{category}</option>
                            })
                        }
                    </select>
                    <br />
                    {
                        problems.map(problem => <div key={Math.random()} className='flex justify-center mb-5'><ProblemBox socket={socket} setDisplayed={setDisplayed} problem={problem} /> </div>)
                    }
                </div>
            }
        </div>
    )
}//*/
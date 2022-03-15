import React from 'react';
import CookieManager from '../../utils/CookieManager';
import { axiosAuthInstanceToAPI } from '../../utils/serverAPI';
import RtcStream from '../RtcStream/RtcStream';
import Problem from './Problem';
import ProblemBox from './ProblemBox';
import { CATEGORIES } from './../../utils/constants';

export default function Problems({ socket }) {

    const [fetchedData, setfetchedData] = React.useState([]);
    const [problems, setProblems] = React.useState([]);
    const [displayedPb, setDisplayed] = React.useState('');
    const [srcInp, setSrcInp] = React.useState('');
    const [selInp, setSelInp] = React.useState('*');

    React.useEffect(() => {
        if (CookieManager.getCookie('jwt') == null) {
            window.location.assign('/login');
            return;
        }
    }, [])

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

    const filterData = () => {
        setProblems(fetchedData.filter(problem => {
            let ok = true;
            //console.log(srcInp);
            ok &= problem.name.startsWith(srcInp) ;
            if (selInp !== '*') {
                ok &= problem.category === selInp;
            }
            return ok;
        }));
    }

    React.useEffect(() => {
        filterData();
    }, [srcInp, selInp])

    const handleInputChange = event => {
        event.preventDefault();
        const { value: prefix } = event.target;
        setSrcInp(prev => prefix);
    }

    const handleSelChange = event => {
        event.preventDefault();
        const { value: category } = event.target;
        setSelInp(category);
    }

    return (
        <div>
            <RtcStream />
            <hr />
            {displayedPb && <button onClick={() => setDisplayed('')}
                class="bg-purple-500 hover:bg-purple-800 text-white font-bold py-2 px-4 rounded"
            >
                back
            </button>}
            <hr />
            <br />
            {(displayedPb && <Problem socket={socket} problem={problems.find(problem => problem.name === displayedPb)} />)
                ||
                <div className='px-6 py-10 '>
                    <p>Probleme:</p>
                    <input type="text" placeholder='search by name'
                        className='appearance-none block bg-white text-gray-700 border border-gray-400 shadow-inner rounded-md py-3 px-4 leading-tight focus:outline-none  focus:border-gray-500' onChange={handleInputChange} /> <br />
                    Categorie:
                    <select className=' block bg-white text-gray-700 border border-gray-400 shadow-inner rounded-md  px-4 leading-tight focus:outline-none  focus:border-gray-500' name="category" id="category" onChange={handleSelChange}>
                        {
                            
                            ['*', ...CATEGORIES].map(category => <option className='' value={category}>{category}</option>)
                        }
                    </select>
                    <br />
                    {
                        problems.map(problem => <div className='flex justify-center mb-5'><ProblemBox setDisplayed={setDisplayed} problem={problem} /> </div>)
                    }
                </div>
            }
        </div>
    )
}//*/
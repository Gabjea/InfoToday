import React from 'react';
import SolvedPb from './SolvedPb';
import { axiosAuthInstanceToAPI } from './../../../utils/serverAPI';

export default function SolvedPbs(props) {
    const [problems, setProblems] = React.useState([]);

    React.useEffect(() => {
        axiosAuthInstanceToAPI.get('/user/problems/mine').then(res => {
            //console.log(res.data);
            setProblems(res.data.reverse());
        }, err => {
            console.error(err);
        })
    }, [])

    return (
        <div className="w-full mt-12">
            <p className="text-2xl pb-3 flex items-center">
                Probleme rezolvate:
            </p>
            <div className="bg-white overflow-auto shadow shadow-lg">
                <table className="min-w-full bg-white ">
                    <thead className="bg-gradient-to-r from-purple-600 via-purple-500 to-purple-600 text-white 	">
                        <tr>
                            <th className="w-1/3 text-left py-3 px-4 uppercase font-semibold  text-center  border-l border-slate-500	">
                                Nume
                            </th>
                            <th className="w-1/3 text-left py-3 px-4 uppercase font-semibold   text-center	">
                                Punctaj
                            </th>
                            <th className="text-left py-3 px-4 uppercase font-semibold  border-r border-slate-500 text-center	">
                                Data
                            </th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700">

                        {
                            problems.map(problem => <SolvedPb key={Math.random()} problem={problem} />)

                        }

                    </tbody>
                </table>
            </div>
        </div>

    );
}
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
        <div class="w-full mt-12">
            <p class="text-xl pb-3 flex items-center">
                Probleme rezolvate
            </p>
            <div class="bg-white overflow-auto">
                <table class="min-w-full bg-white">
                    <thead class="bg-purple-600 text-white">
                        <tr>
                            <th class="w-1/3 text-left py-3 px-4 uppercase font-semibold text-sm">Nume</th>
                            <th class="w-1/3 text-left py-3 px-4 uppercase font-semibold text-sm">Punctaj</th>
                            <th class="text-left py-3 px-4 uppercase font-semibold text-sm"></th>
                            <th class="text-left py-3 px-4 uppercase font-semibold text-sm">Data</th>
                        </tr>
                    </thead>
                    <tbody class="text-gray-700">

                        {
                            problems.map(problem => <SolvedPb key={Math.random()} problem={problem} />)

                        }

                    </tbody>
                </table>
            </div>
        </div>

    );
}
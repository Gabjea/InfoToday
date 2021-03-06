import React from 'react';
import { axiosAuthInstanceToAPI } from './../../../utils/serverAPI';

export default function AplliesStudent(props) {
    const [resFromTeachers, setResFromTeachers] = React.useState([])
    const statusToCol = {
        pending: 'yellow',
        accepted: 'green',
        declined: 'red'
    };

    React.useEffect(() => {
        axiosAuthInstanceToAPI.get('/user/applies').then(res => {
            //console.log(res.data);
            setResFromTeachers(res.data);
        }, err => {
            //alert("ERROR!");
        })//*/
    }, []);

    return (
        <div className=''>
            {
                resFromTeachers.map(resFromTeacher => {
                    return (
                        <div key={Math.random()} className='flex items-center flex-col mt-5'>
                            <div className="flex flex-row rounded-md py-6 p-3 w-1/2 shadow-lg items-center">
                                <img style={{}} width={50} src={resFromTeacher.pic} alt="" />
                                <div className='font-bold text-center ml-2'>{resFromTeacher.name}</div>

                                <div className={`ml-auto text-${statusToCol[resFromTeacher.status]}-600`}>
                                    {resFromTeacher.status}
                                </div>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    );
}

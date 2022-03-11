import React from 'react';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { axiosAuthInstanceToAPI } from '../../../../utils/serverAPI';

export default function Accept({ id, name, pic }) {

    const handleDelClick = event => {
        event.preventDefault();
        
        axiosAuthInstanceToAPI.delete(`/teacher/student/${id}`).then(res => {
            window.location.reload();
        },  err => {
            alert("ERROR!");
        })
    }

    return (
        <div className='flex items-center flex-col'>
            <div className="flex flex-row rounded-md py-6 p-3 w-1/2 shadow-lg">
                <img style={{}} width={50} src={pic} alt="" />
                <div className='font-bold'>{name}</div>

                <div className='ml-auto'>
                    <button onClick={handleDelClick} type="button" className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">
                        <FontAwesomeIcon
                            icon={faXmark}
                        />
                    </button>
                </div>
            </div>
        </div>
    );
}
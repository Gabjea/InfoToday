import React from 'react';
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { axiosAuthInstanceToAPI } from '../../../../utils/serverAPI';

export default function Pendig({ id, name, pic }) {
    const handleAcceptClick = event => {
        event.preventDefault();
        axiosAuthInstanceToAPI.post(`/teacher/apply/accept/${id}`).then(res => {
            window.location.reload();
        }, err => {
            alert('ERROR!');
        })
    }

    const handleDeclineClick = event => {
        event.preventDefault();
        axiosAuthInstanceToAPI.post(`/teacher/apply/decline/${id}`).then(res => {
            window.location.reload();
        }, err => {
            alert("ERROR!");
        })
    }

    return (
        <div className='flex items-center flex-col'>
            <div className="flex flex-row rounded-md py-6 p-3 w-1/2 shadow-lg">
                <img style={{}} width={50} src={pic} alt="" />
                <div className='font-bold ml-5'>{name}</div>

                <div className='flex ml-auto'>
                    <button onClick={handleAcceptClick} type="button" className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">
                        <FontAwesomeIcon
                            icon={faCheck}
                        />
                    </button>
                    <button onClick={handleDeclineClick} type="button" className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">
                        <FontAwesomeIcon
                            icon={faXmark}
                        />
                    </button>
                </div>
            </div>
        </div>
    );
}

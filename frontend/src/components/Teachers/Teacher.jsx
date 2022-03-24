import React from 'react';
import { axiosAuthInstanceToAPI } from '../../utils/serverAPI';
//import CookieManager from '../../utils/CookieManager';

export default function Teacher({ id, pic, name, desc }) {

    const handleApplyClick = event => {
        event.preventDefault();

        axiosAuthInstanceToAPI.post(`/teacher/apply/${id}`).then(res => {
            //console.log(res.data);
            alert(res.data);
        }, err => {
            alert('Error!');
        })//*/
    }

    const handleMessageClick = event => {
        event.preventDefault();

        axiosAuthInstanceToAPI.post(`/user/chat/conversation/${id}`).then(res => {
            console.log(res.data);
            //alert(res.data);
            return window.location.assign('/messages');
        }, err => {
            alert("ERROR!");
        })
    }

    return (
        <div id='teacher' className='mb-3 '>
            <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
                <div className="md:flex">
                    <div className="md:shrink-0">
                        <img className="h-48 w-full object-cover md:h-full md:w-48"
                            src={pic}
                            alt="Man looking at item at a store" />
                    </div>
                    <div className="p-8">
                        <div className="uppercase tracking-wide text-lg text-indigo-500 font-bold">{name}</div>
                        <p className="block mt-1 text-md leading-tight font-medium text-black">{desc}</p>
                    </div>
                </div>
                <div className='flex justify-center'>
                    <button onClick={handleMessageClick}
                    type="button" className="text-white bg-gradient-to-r from-blue-500
                     via-blue-600 to-blue-700 hover:bg-gradient-to-br
                      focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800
                       font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">Message</button>
                    <button onClick={handleApplyClick}
                    type="button" className="text-white bg-gradient-to-r from-purple-500
                     via-purple-600 to-purple-700 hover:bg-gradient-to-br
                      focus:ring-4 focus:ring-purple-300 dark:focus:ring-purple-800
                       font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">Apply</button>
                </div>
            </div>
        </div>
    );
}
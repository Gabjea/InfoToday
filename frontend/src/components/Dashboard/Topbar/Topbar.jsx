import React from 'react';
import { getUserDataFromJwtReq } from '../../../utils/serverAPI';

export default function Topbar(props) {
    const [data, setData] = React.useState({});

    React.useEffect(() => {
        getUserDataFromJwtReq().then(data => {
            setData(data);
        }, err => {
            console.error(err);
        })
    }, [])

    return (
        <div className='flex  w-full '>
            <div className="flex justify-end rounded-md items-center p-3 shadow-lg w-full h-20 ">
                <div className='flex flex-col text-center'>
                    <div className='font-bold'>{`${data.name} ${data.surname}`}</div>
                    <div>
                        {data.coins + ' '}
                        lei
                    </div>
                </div>
                <img className='rounded-full w-10 h-10' src={data.profile_pic} alt="" />
            </div>
        </div>
    );
}
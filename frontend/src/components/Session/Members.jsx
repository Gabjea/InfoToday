import React from 'react';

export default function Members({ members }) {

    return (
        <div>
            members:
            {
                <div className="flex">{
                members.map(member => 
                    <div className="mr-10 grid justify-items-center" key={Math.random()}>
                        <img className='rounded-full w-10 h-10' src={member.profile_pic} alt="*" />
                        {member.name}
                    </div>    
                )}
                </div>
            }
        </div>
    );
}
import React from 'react';

export default function Members({ members }) {

    return (
        <div>
            members:
            {
                members.map(member => 
                    <div>
                        <img className='rounded-full w-10 h-10' src={member.profile_pic} alt="" />
                        {member.name}
                    </div>    
                )
            }
        </div>
    );
}
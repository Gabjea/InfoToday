import React from 'react';

export default function RtcStream({ socket, x }) {
    React.useEffect(() => {
        //console.log(x);
    }, [socket, x])

    return (
        <div>
            RtcStream
        </div>
    );
}
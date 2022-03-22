import React from 'react';
import Peer from 'peerjs';
//import { host } from '../../utils/serverAPI';
const myPeer = new Peer(undefined, {
    host: '79.113.205.105',
    port: '3001'
})
const peers = {}
const myVideo = document.createElement('video')
myVideo.muted = true


export default function RtcStream({ socket }) {
    React.useEffect(() => {
        console.log(myPeer == null);
    }, [])
    const videoGridRef = React.createRef();

    const addVideoStream = React.useCallback((video, stream) => {
        video.srcObject = stream
        video.addEventListener('loadedmetadata', () => {
            video.play()
        })
        videoGridRef.current?.append(video)//
    }, [videoGridRef])

    const connectToNewUser = React.useCallback((userId, stream) => {
        const call = myPeer.call(userId, stream)
        const video = document.createElement('video')
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream)
        })
        call.on('close', () => {
            video.remove()
        })

        peers[userId] = call
    }, [addVideoStream])


    React.useEffect(() => {
        navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        }).then(stream => {
            addVideoStream(myVideo, stream)

            myPeer.on('call', call => {
                call.answer(stream)
                const video = document.createElement('video')
                call.on('stream', userVideoStream => {
                    addVideoStream(video, userVideoStream)
                })
            })

            socket?.on('session-user-connected', userId => {
                connectToNewUser(userId, stream)//
            })
        })
    }, [socket, addVideoStream, connectToNewUser])

    return (
        <div>
            RtcStream
            <div ref={videoGridRef} id="video-grid"></div>

        </div>
    );
}
import React, { useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom";
import CookieManager from '../../utils/CookieManager';
import { baseWsURL } from './../../utils/serverAPI';
import Peer from "simple-peer"
import io from 'socket.io-client';
//import Problems from '../Problems/Problems';
import './Session.css'
const socket = io(baseWsURL);

export default function Session() {
    const { id: sessionId } = useParams();
    const [connected, setConnected] = React.useState();

    React.useEffect(() => {

        socket.on('connected', message => {
            setConnected(message);
        })

        socket.on('connect-user', message => {
            //console.log(message);
            const jwt = CookieManager.getCookie('jwt');
            if (jwt) {
                //console.log(jwt);
                socket.emit('connect-user', jwt);
            }
        })
        //console.log('here');
        return () => socket.close();
    }, [sessionId])
    const [idToCall, setIdToCall] = useState("")
    const [me, setMe] = useState("")
    const [stream, setStream] = useState()
    const [receivingCall, setReceivingCall] = useState(false)
    const [caller, setCaller] = useState("")
    const [callerSignal, setCallerSignal] = useState()
    const [callAccepted, setCallAccepted] = useState(false)
    const [callEnded, setCallEnded] = useState(false)
    const [name, setName] = useState("")
    const myVideo = useRef()
    const userVideo = useRef()
    const connectionRef = useRef()

    const callUser = React.useCallback(id => {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream: stream
        })
        peer.on("signal", (data) => {

            socket.emit("callUser", {
                userToCall: id,
                signalData: data,
                from: me,
                name: name
            })
        })
        peer.on("stream", (stream) => {
            //console.log(stream);
            userVideo.current.srcObject = stream

        })
        socket.on("callAccepted", (signal) => {
            //console.log(signal);

            setCallAccepted(true)
            peer.signal(signal)
        })

        connectionRef.current = peer
    }, [me, name, stream])

    React.useEffect(() => {
        if (connected) {
            socket.emit('join-session', '');
        } else {
            return;
        }

        //console.log('join room');
        socket.emit('join-room', sessionId);

        socket.on('all-connected', res => {
            console.log(res);
            setIdToCall(res);
            ;
        })//*/
    }, [connected, sessionId])

    React.useEffect(() => {
        callUser(idToCall)

    }, [idToCall, callUser])
    //------------------------------------------------------------


    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
            setStream(stream)
            myVideo.current.srcObject = stream
        })

        socket.on("me", (id) => {
            setMe(id)
        })

        socket.on("callUser", (data) => {
            //console.log(data);
            setCaller(data.from)
            setName(data.name)
            setCallerSignal(data.signal)
            setReceivingCall(true)
        })

        socket.on('callEnded', res => {
            leaveCall();
            window.location.reload();
        })
    }, [])

    const answerCall = () => {
        setCallAccepted(true)
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream: stream
        })
        peer.on("signal", (data) => {
            //console.log(data);
            socket.emit("answerCall", { signal: data, to: caller })
        })
        peer.on("stream", (stream) => {
            //console.log(stream);
            userVideo.current.srcObject = stream
        })

        console.log(stream);
        peer.signal(callerSignal)
        connectionRef.current = peer
    }

    const leaveCall = () => {
        setCallEnded(true)
        connectionRef.current.destroy()
    }

    return (
        <>
            <div className="container">
                <div className="video-container">
                    <div className="video">
                        {stream && <video playsInline muted ref={myVideo} autoPlay style={{ width: "300px" }} />}
                    </div>
                    <div className="video">
                        {callAccepted && !callEnded ?
                            <video playsInline ref={userVideo} autoPlay style={{ width: "300px" }} /> :
                            null}
                    </div>
                </div>
                <div>
                    {receivingCall && !callAccepted ? (
                        <div className="caller"
                        >
                            <button
                                className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                                color="primary" onClick={() => answerCall()}>
                                Answer
                            </button>
                        </div>
                    ) : null}
                </div>
            </div>
        </>
    )
}
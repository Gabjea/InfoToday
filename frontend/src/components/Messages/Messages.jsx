import React from "react";
import CookieManager from "../../utils/CookieManager";
import { axiosAuthInstanceToAPI, getUserDataFromJwtReq } from "../../utils/serverAPI";
import ChatHead from "./ChatHead/ChatHead";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FromMessage from "./ChatHead/MessageBox/FromMessage";
import MyMessage from "./ChatHead/MessageBox/MyMessage";
import { baseWsURL } from './../../utils/serverAPI';
import io from 'socket.io-client';
const MAX_CHARS = 250;
const socket = io(baseWsURL);


export default function Messages() {

    React.useEffect(() => {

        socket.on('connected', message => {
            //console.log(message);
        })

        socket.on('connect-user', message => {
            //console.log(message);
            const jwt = CookieManager.getCookie('jwt');
            if (jwt) {
                //console.log(jwt);
                console.log(1);
                socket.emit('connect-user', jwt);
            }
        })
        //console.log('here');


        return () => socket.close();
    }, [])

    const [chatHeads, setChatHeads] = React.useState([]);
    const [messages, setMessages] = React.useState([]);
    const [myId, setMyId] = React.useState('');
    const [myPic, setMyPic] = React.useState('');
    const txtInputRef = React.createRef();
    const [userChatData, setUserChatData] = React.useState();

    const openChat = React.useCallback(async id => {
        socket.emit('join-room', chatHeads[id].room);

        axiosAuthInstanceToAPI.get(`/user/chat/${chatHeads[id].id}`).then(res => {
            setMessages(res.data);
            setUserChatData({
                currChatUserPic: chatHeads[id].pic,
                otherName: chatHeads[id].name,
                otherId: chatHeads[id].id
            });
        }, err => {
            console.error(err);
        })
    }, [chatHeads])

    React.useEffect(() => {
        getUserDataFromJwtReq().then(data => {
            //console.log(data);
            setMyId(data._id);
            setMyPic(data.profile_pic);
        }, err => {
            console.error(err);
        })
    }, [])

    const handleClick = event => {
        event.preventDefault();
        console.log('pressed on: ' + event.target.id);
        const { id } = event.target;
        openChat(id);
    }

    React.useEffect(() => {
        axiosAuthInstanceToAPI.get('/user/chats').then(res => {
            setChatHeads(res.data.reverse());
        }, err => {
            console.error(err);
        })//*/

        socket.on('send-message', message => {
            console.log(message);
            setMessages(preMessages => [...preMessages, message]);
        })
    }, []);

    const handleSendCLick = event => {
        event.preventDefault();
        const mesText = txtInputRef.current.value.trimEnd();
        txtInputRef.current.value = '';
        txtInputRef.current?.focus();
        setRemChars(MAX_CHARS);
        if (!mesText) {
            alert('mesajul e gol!');
            return;
        }
        //setMessages(preMessages => [...preMessages, mesText]);
        
        if (userChatData?.otherId) {
            const otherId = userChatData?.otherId;
            let index = chatHeads.findIndex(chatHead => chatHead.id === otherId);
            let deleted = chatHeads[index];
            chatHeads.splice(index, 1);
            setChatHeads([deleted, ...chatHeads]);
        }
        //*/
        socket.emit('send-message', { otherId: userChatData?.otherId, message: mesText });
    }

    React.useEffect(() => {
        if (chatHeads?.length) {
            openChat(0);
        }
    }, [chatHeads, openChat]);

    const mesGridRef = React.createRef();
    const [remChars, setRemChars] = React.useState(MAX_CHARS);
    React.useEffect(() => {
        txtInputRef.current?.focus();
        mesGridRef.current.scrollTop = mesGridRef.current.scrollHeight;
    }, [mesGridRef, txtInputRef])


    const handleInpChange = event => {
        event.preventDefault();
        const { length } = event.target.value;
        setRemChars(MAX_CHARS - length);
    }

    const handleKeyDown = event => {
        if (!remChars && event.key.toUpperCase() !== 'BACKSPACE') {
            event.preventDefault();
        }
    }

    let id = 0;
    return (
        <div className="flex h-screen antialiased text-gray-800" >
            <div className="flex flex-row h-full w-full overflow-x-hidden" >
                <div className="flex flex-col mt-2 pl-6 pr-2 w-40 lg:w-64 bg-white flex-shrink-0" >

                    <div
                        className="flex flex-col items-center bg-indigo-100 border border-gray-200 mt-4 w-full py-6 px-4 rounded-lg"
                    >
                        <div className="h-20 w-20 rounded-full border overflow-hidden">
                            {userChatData?.currChatUserPic &&
                                <img
                                    src={userChatData?.currChatUserPic}
                                    alt="Avatar"
                                    className="h-full w-full"
                                />}
                        </div>
                        <div className="text-sm font-semibold mt-2 text-center">{userChatData?.otherName}</div>
                        {userChatData?.currChatUserPic && <div className="flex flex-row items-center mt-3">
                            <div
                                className="flex flex-col justify-center h-4 w-8 rounded-full"
                            >
                                
                            </div>
                            
                        </div>}
                    </div>
                    <div className="flex flex-col mt-8">
                        <div className="flex flex-row items-center justify-between text-xs">
                            <span className="font-bold">Conversations</span>
                            <span
                                className="flex items-center justify-center bg-gray-300 h-4 w-4 rounded-full"
                            >
                                {chatHeads.length}
                            </span>
                        </div>
                        <div className="flex flex-col space-y-1 mt-4 -mx-2 h-48 overflow-y-auto" id="chatheads">
                            <ul>
                                {
                                    chatHeads.map(chatHead => {
                                        return <li key={chatHead.id}> <ChatHead handleClick={handleClick} id={id++} name={chatHead.name} pic={chatHead.pic} /> </li>
                                    })
                                }
                            </ul>
                        </div>


                    </div>
                </div>
                <div className="flex flex-col flex-auto h-full p-6">
                    <div
                        className="flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-gray-100 h-full p-4"
                    >
                        <div ref={mesGridRef} className="flex flex-col h-full overflow-x-auto mb-4"
                        
                        >
                            <div className="flex flex-col h-full" >
                                <div className="grid grid-cols-12 gap-y-2" >
                                    {
                                        messages.map(message => {
                                            if (message.sender === myId) {
                                                return <MyMessage key={Math.random()} pic={myPic} message={message.message} />
                                            } else {
                                                return <FromMessage key={Math.random()} pic={userChatData?.currChatUserPic} message={message.message} />
                                            }
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                        {userChatData?.currChatUserPic && <div id="text-zone"
                            className="flex flex-row items-center h-16 rounded-xl bg-white w-full px-4"
                        >
                            <div>
                                <button
                                    className="flex items-center justify-center text-gray-400 hover:text-gray-600"
                                >
                                    
                                    <span>{remChars}</span>
                                </button>
                            </div>
                            <div className="flex-grow ml-4">
                                <div className="relative w-full">
                                    <input
                                        onKeyDown={handleKeyDown}
                                        onChange={handleInpChange}
                                        placeholder={`type message here(max ${MAX_CHARS} characters)`}
                                        ref={txtInputRef}
                                        type="text"
                                        className="flex w-full border rounded-xl focus:outline-none focus:border-indigo-300 pl-4 h-10"
                                    />
                                    
                                </div>
                            </div>
                            <div className="ml-4">
                                <button onClick={handleSendCLick}
                                    className="bg-purple-500 hover:bg-purple-800 flex items-center justify-center  rounded-xl text-white px-4 py-1 flex-shrink-0"
                                >
                                    <span className="mr-2">Send</span>
                                    <FontAwesomeIcon icon={faPaperPlane} />
                                </button>
                            </div>
                        </div>}
                    </div>
                </div>
            </div>
        </div>
    )
}
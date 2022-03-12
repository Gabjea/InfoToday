import React from "react";
import { axiosAuthInstanceToAPI, getUserDataFromJwtReq } from "../../utils/serverAPI";
import ChatHead from "./ChatHead/ChatHead";
import FromMessage from "./ChatHead/MessageBox/FromMessage";
import MyMessage from "./ChatHead/MessageBox/MyMessage";

export default function Messages({ socket }) {
    const [chatHeads, setChatHeads] = React.useState([]);
    const [messages, setMessages] = React.useState([]);
    const [currChatUserPic, setCurrChatUserPic] = React.useState('');
    const [myId, setMyId] = React.useState('');
    const [myPic, setMyPic] = React.useState('');
    const [otherName, setOhterName] = React.useState('');
    const [otherId, setOtherId] = React.useState('');
    const txtInputRef = React.createRef();

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
        //console.log(event.target.id);
        const { id } = event.target;
        axiosAuthInstanceToAPI.get(`/user/chat/${chatHeads[id].id}`).then(res => {
            setMessages(res.data);
            setCurrChatUserPic(chatHeads[id].pic);
            setOhterName(chatHeads[id].name);
            setOtherId(chatHeads[id].id);
        }, err => {
            console.error(err);
        })

    }

    React.useEffect(() => {
        axiosAuthInstanceToAPI.get('/user/chats').then(res => {
            //console.log(res.data);
            setChatHeads(res.data);
        }, err => {
            console.error(err);
        })//*/

        socket.on('send-message', message => {
            setMessages(preMessages => [...preMessages, message]);
            //console.log(messages);
        })
    }, []);

    const handleSendCLick = event => {
        event.preventDefault();
        const { value: mesText } = txtInputRef.current;
        txtInputRef.current.value = '';
        if (!mesText) {
            alert('mesajul e gol!');
            return;
        }
        //console.log(mesText);
        //setMessages(preMessages => [...preMessages, mesText]);
        socket.emit('send-message', { otherId, message: mesText });
    }

    return (
        <div class="flex h-screen antialiased text-gray-800">
            <div class="flex flex-row h-full w-full overflow-x-hidden">
                <div class="flex flex-col py-8 pl-6 pr-2 w-64 bg-white flex-shrink-0">
                    <div class="flex flex-row items-center justify-center h-12 w-full">
                        <div
                            class="flex items-center justify-center rounded-2xl text-indigo-700 bg-indigo-100 h-10 w-10"
                        >
                            <svg
                                class="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                                ></path>
                            </svg>
                        </div>
                        <div class="ml-2 font-bold text-2xl">QuickChat</div>
                    </div>
                    <div
                        class="flex flex-col items-center bg-indigo-100 border border-gray-200 mt-4 w-full py-6 px-4 rounded-lg"
                    >
                        <div class="h-20 w-20 rounded-full border overflow-hidden">
                            {currChatUserPic &&
                                <img
                                    src={currChatUserPic}
                                    alt="Avatar"
                                    class="h-full w-full"
                                />}
                        </div>
                        <div class="text-sm font-semibold mt-2">{otherName}</div>
                        {currChatUserPic && <div class="flex flex-row items-center mt-3">
                            <div
                                class="flex flex-col justify-center h-4 w-8 rounded-full"
                            >
                                <div class="h-3 w-3 bg-gradient-to-r from-green-400 via-green-500 to-green-600
 rounded-full self-end mr-1"></div>
                            </div>
                            <div class="leading-none text-xs">Active</div>
                        </div>}
                    </div>
                    <div class="flex flex-col mt-8">
                        <div class="flex flex-row items-center justify-between text-xs">
                            <span class="font-bold">Conversations</span>
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
                                        let id = 0;
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
                        <div className="flex flex-col h-full overflow-x-auto mb-4">
                            <div className="flex flex-col h-full">
                                <div className="grid grid-cols-12 gap-y-2">
                                    {
                                        messages.map(message => {
                                            if (message.sender === myId) {
                                                return <MyMessage pic={myPic} message={message.message} />
                                            } else {
                                                return <FromMessage pic={currChatUserPic} message={message.message} />
                                            }
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                        {currChatUserPic && <div id="text-zone"
                            className="flex flex-row items-center h-16 rounded-xl bg-white w-full px-4"
                        >
                            <div>
                                <button
                                    className="flex items-center justify-center text-gray-400 hover:text-gray-600"
                                >
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                                        ></path>
                                    </svg>
                                </button>
                            </div>
                            <div className="flex-grow ml-4">
                                <div className="relative w-full">
                                    <input
                                        ref={txtInputRef}
                                        type="text"
                                        className="flex w-full border rounded-xl focus:outline-none focus:border-indigo-300 pl-4 h-10"
                                    />
                                    <button
                                        className="absolute flex items-center justify-center h-full w-12 right-0 top-0 text-gray-400 hover:text-gray-600"
                                    >
                                        <svg
                                            class="w-6 h-6"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                                d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                            ></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <div class="ml-4">
                                <button onClick={handleSendCLick}
                                    class="bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 rounded-xl text-white px-4 py-1 flex-shrink-0"
                                >
                                    <span>Send</span>
                                    <span class="ml-2">
                                        <svg
                                            class="w-4 h-4 transform rotate-45 -mt-px"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                                            ></path>
                                        </svg>
                                    </span>
                                </button>
                            </div>
                        </div>}
                    </div>
                </div>
            </div>
        </div>
    )
}
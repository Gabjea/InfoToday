import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBook, faXmark, faClipboard, faChalkboardTeacher,
    faLaptopCode, faEllipsis, faCalendarPlus, faCreditCard,
    faUser, faChartLine, faUserCheck, faComment, faArrowRightFromBracket
} from "@fortawesome/free-solid-svg-icons";
import CookieManager from "./../../utils/CookieManager";
import { getUserDataFromJwtReq } from "../../utils/serverAPI";

export default function Sidebar({ socket }) {
    const [open, setOpen] = useState(false);

    const [Menus, setMenus] = React.useState([
        { title: "Dashboard", src: faChartLine, route: '/dashboard' },
        { title: "Probleme", src: faBook, route: '/probleme' },
        { title: "Account", src: CookieManager.getCookie('jwt') ? faUserCheck : faUser, route: '/account' },
        { title: 'Mesaje', src: faComment, route: '/messages' },
        { title: 'aplicari', src: faClipboard, route: '/applies' },
        { title: 'Sign out', src: faArrowRightFromBracket, route: '/signout', gap: true }
    ]);

    React.useEffect(() => {
        getUserDataFromJwtReq().then(({ role }) => {
            if (role === 'student') {
                setMenus(prev => {
                    prev.splice(Menus.length - 1, 0, { title: 'Profesori', src: faChalkboardTeacher, route: '/teachers' });
                    return prev;
                })
                setMenus(prev => {
                    prev.splice(Menus.length - 1, 0, { title: 'Payment', src: faCreditCard, route: '/pay' });
                    return prev;
                })
            } else if (role === 'teacher') {
                setMenus(prev => {
                    prev.splice(Menus.length - 1, 0, { title: 'Creaza sesiune', src: faCalendarPlus, route: '/create-session' });
                    return prev;
                })
            }
            setOpen(true);
        });
    }, [Menus])

    return (
        <div
            className={` ${open ? "w-50" : "w-20 "
                }  bg-gradient-to-r from-purple-500 via-purple-600 to-purple-800 min-h-screen p-5`}
        >

            <div className={`duration-500 ${open ? "translate-x-full mr-5" : "ml-1"} `}>

                <FontAwesomeIcon
                    icon={open ? faXmark : faEllipsis}
                    className={`cursor-pointer w-8 h-8 duration-500 
                    ${open ? "rotate-[360deg] " : ""}`}
                    onClick={() => setOpen(!open)}
                />

            </div>
            <br />


            <div className="flex gap-x-4 items-center w-15 ">
                <FontAwesomeIcon
                    size={open ? "3x" : "2x"}
                    icon={faLaptopCode}
                    onClick={() => window.location.assign('/')}
                    className={`cursor-pointer duration-500 ${open && "rotate-[360deg] mr-2"
                        }`}
                />
                <h1
                    className={`text-white origin-left font-medium text-2xl duration-200 ${!open && "scale-0"
                        }`}
                >
                    InfoToday
                </h1>
            </div>
            <ul className="pt-6">
                {Menus.map((Menu, index) => (
                    <li onClick={() => window.location.assign(Menu.route)}
                        key={index}
                        className={`flex rounded-md p-2 cursor-pointer hover:bg-light-white text-gray-200 text-sm items-center gap-x-3 
              ${Menu.gap ? "mt-10" : "mt-2"} ${Menu.route === window.location.pathname && "bg-light-white"
                            } `}
                    >
                        <FontAwesomeIcon icon={Menu.src} size="2x" />
                        <span className={`${!open && "hidden"} origin-left duration-200`}>
                            {Menu.title}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    )
}
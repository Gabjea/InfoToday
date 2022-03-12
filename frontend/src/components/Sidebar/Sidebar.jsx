import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBook, faXmark,
    faLaptopCode, faEllipsis,
    faUser, faChartLine, faUserCheck, faComment
} from "@fortawesome/free-solid-svg-icons";
import CookieManager from "./../../utils/CookieManager";

export default function Sidebar({ socket }) {
    const [open, setOpen] = useState(true);
    const Menus = [
        { title: "Dashboard", src: faChartLine, route: '/dashboard' },
        { title: "Probleme", src: faBook, route: '/probleme' },
        { title: "Account", src: CookieManager.getCookie('jwt') ? faUserCheck : faUser, route: '/account' },
        { title: 'Messages', src: faComment, route: '/messages' },
    ];

    return (
        

            <div
                className={` ${open ? "w-50" : "w-20 "
                    }  bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 h-screen p-5`}
            >
               
                <div className={`duration-500 ${open ? "translate-x-full mr-5" : "ml-1"} ` }>

                <FontAwesomeIcon
                    icon={open ? faXmark : faEllipsis}
                    className={`cursor-pointer w-8 h-8 duration-500 
                    ${open ? "rotate-[360deg] " : ""}`}
                    onClick={() => setOpen(!open)}
                    />
               
                </div>
                <br />
                <br />

                <div className="flex gap-x-4 items-center w-15 ">
                    <FontAwesomeIcon
                        size= {open ? "3x" : "2x"} 
                        icon={faLaptopCode}
                        className={`cursor-pointer duration-500 ${open && "rotate-[360deg] mr-5"
                            }`}
                    />
                    <h1
                        className={`text-white origin-left font-medium text-xl duration-200 ${!open && "scale-0"
                            }`}
                    >
                        InfoToday
                    </h1>
                </div>
                <ul className="pt-6">
                    {Menus.map((Menu, index) => (
                        <li onClick={() => window.location.assign(Menu.route)}
                            key={index}
                            className={`flex  rounded-md p-2 cursor-pointer hover:bg-light-white text-gray-300 text-sm items-center gap-x-3 
              ${Menu.gap ? "mt-9" : "mt-2"} ${Menu.route === window.location.pathname && "bg-light-white"
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
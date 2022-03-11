import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBook, faX,
    faLaptopCode, faEllipsis,
    faUser, faChartLine, faUserCheck
} from "@fortawesome/free-solid-svg-icons";
import CookieManager from "./../../utils/CookieManager";


export default function Sidebar(props) {
    const [open, setOpen] = useState(true);
    const Menus = [
        { title: "Dashboard", src: faChartLine },
        { title: "Probleme", src: faBook },
        { title: "Account", src: CookieManager.getCookie('jwt') ? faUserCheck : faUser },
    ];

    return (
        <div className="flex" style={{'userSelect': 'none'}}>

            <div
                className={` ${open ? "w-50" : "w-20 "
                    } bg-purple-500 h-screen p-5  pt-8 relative duration-300`}
            >
                <FontAwesomeIcon
                    icon={open ? faX : faEllipsis}
                    className={`absolute cursor-pointer left-2 top-2 w-6 h-6 border-dark-purple
           border-2 rounded-full  ${!open && "rotate-180"}`}
                    onClick={() => setOpen(!open)}
                />
                <br /><br />
                <div className="flex gap-x-4 items-center w-15">
                    <FontAwesomeIcon
                        size="3x"
                        icon={faLaptopCode}
                        className={`cursor-pointer duration-500 ${open && "rotate-[360deg] "
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
                        <li
                            key={index}
                            className={`flex  rounded-md p-2 cursor-pointer hover:bg-light-white text-gray-300 text-sm items-center gap-x-3 
              ${Menu.gap ? "mt-9" : "mt-2"} ${index === 0 && "bg-light-white"
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

        </div>



    )
}
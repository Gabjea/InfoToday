import React from 'react'
import { LockClosedIcon } from '@heroicons/react/solid'
import { axiosInstanceToAPI } from '../../utils/serverAPI'
import CookieManager from '../../utils/CookieManager';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLaptopCode } from "@fortawesome/free-solid-svg-icons";
export default function Login() {
    const emailAdressRef = React.createRef();
    const passwordRef = React.createRef();

    const handleFormSubmit = event => {
        event.preventDefault();
        const { value: email } = emailAdressRef.current;
        const { value: password } = passwordRef.current;

        axiosInstanceToAPI.post("/user/login", {
            email, password
        }).then(res => {
            //console.log(res.data);
            CookieManager.setCookie('jwt', res.data.token, 86400);
            window.location.assign('/dashboard');
        }, err => {
            alert('login failed!');
            console.error(err);
        })//*/
    }

    return (
        <>
            <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                <div className={`flex  justify-center`}>
                        <FontAwesomeIcon
                            size={'5x'}
                            icon={faLaptopCode}
                            className="text-indigo-800"
                        />
                        <h2 className="mt-6 ml-3 text-center text-3xl font-extrabold text-gray-900">Autentificare</h2>
                        <p className="mt-2 text-center text-sm text-gray-600">

                        </p>
                    </div>
                    <form className="mt-8 space-y-6" onSubmit={handleFormSubmit}>
                        <input type="hidden" name="remember" defaultValue="true" />
                        <div className="rounded-md shadow-sm -space-y-px">
                            <div>
                                <label htmlFor="email-address" className="sr-only">
                                    Email address
                                </label>
                                <input
                                    ref={emailAdressRef}
                                    id="email-address"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="Email address"
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="sr-only">
                                    Password
                                </label>
                                <input
                                    ref={passwordRef}
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="Password"
                                />
                            </div>
                        </div>

                        

                        <div>
                            <button
                                type="submit"
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                    <LockClosedIcon className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" aria-hidden="true" />
                                </span>
                                Sign in
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}
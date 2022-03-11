import React from 'react';
import { getUserDataFromJwtReq, axiosAuthInstanceToAPI } from '../../utils/serverAPI';
import CookieManager from './../../utils/CookieManager';

export default function Account() {
    const [userData, setUserData] = React.useState(null);
    const [userProfilePic, setUserProfilePic] = React.useState(null);

    const nameRef = React.createRef();
    const surnameRef = React.createRef();
    const emailRef = React.createRef();
    const passwordRef = React.createRef();
    const descRef = React.createRef();
/*
    React.useEffect(() => {
        console.clear()
        console.log('====================================');
        console.log(userData?.role);
        console.log('====================================');
    }, [userData])//*/

    React.useEffect(() => {
        
        if (!CookieManager.getCookie('jwt')) {
            window.location.assign('/login');
            return;
        }
    }, []);

    React.useEffect(() => {
        getUserDataFromJwtReq()
            .then(data => {
                setUserData({
                    name: data.name,
                    surname: data.surname,
                    email: data.email,
                    role: data.role,
                    desc: data.desc
                });
            })
            .catch(err => {
                console.error(err);
                alert('error1!');
            });
    }, []);

    const handleSubmitForm = async event => {
        event.preventDefault();
        const { value: name } = nameRef.current;
        const { value: surname } = surnameRef.current;
        const { value: email } = emailRef.current;
        const { value: desc } = descRef.current;
        const { value: password } = passwordRef.current;

        if (!name || !surname || !email || !password) {
            alert('fields must be filled!');
            return;
        }

        axiosAuthInstanceToAPI
            .patch(
                '/user/profile',
                {
                    name,
                    surname,
                    email,
                    desc,
                    password
                }
            )
            .then(
                res => {
                    alert('updated successfully');
                    window.location.reload();
                },
                err => {
                    console.error(err);
                    alert('error123!');
                }
            );
    };

    const handleImgSubm = event => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('file', userProfilePic);
        console.log(formData);
        axiosAuthInstanceToAPI.post('/user/profile/picture', formData)
            .then(
                res => {
                    //console.log(res.data);
                    alert('img uploaded!');
                    window.location.reload();
                },
                err => {
                    console.error(err);
                    alert('error!pp');
                }
            )
            .catch(err => {
                console.error(err);
                alert('error!pp');
            });
    };

    const handleChange = event => {
        event.preventDefault();
        setUserProfilePic(event.target.files[0]);
        console.log(event.target.files[0]);
    };

    const logout = () => {
        document.cookie = 'jwt=; Max-Age=0; path=/; domain=' + window.location.hostname;
        window.location.reload();
    };

    return (
        <div className="Profile">
            <div className="container">
                <div className="left">
                    <h2>Actualizare informații</h2>
                    <p>Pentru a modifica informațiile tale personale completează formularul de mai jos.</p>
                    <br />
                    <form onSubmit={handleSubmitForm} className=''>

                        <input ref={nameRef} type="text" defaultValue={userData?.name} name="name" placeholder="Nume" />
                        <br />
                        <input
                            ref={surnameRef}
                            type="text"
                            defaultValue={userData?.surname}
                            name="surname"
                            placeholder="Prenume"
                        />
                        <br />
                        <input
                            ref={emailRef}
                            type="email"
                            defaultValue={userData?.email}
                            name="email"
                            placeholder="E-mail"
                        />
                        <br />
                        {userData?.role === 'teacher' && <input defaultValue={userData?.desc} ref={descRef} type="text" name="desc" placeholder="desc" /> }
                        <br />
                        <input ref={passwordRef} type="password" name="psw" placeholder="Schimbă parola" />
                        <br />
                        <button type="submit">Trimite</button>
                    </form>
                </div>

                <div className="right">
                    <h2>Fotografie de profil</h2>
                    <p>Pentru a-ți actualiza fotografie de profil încarcă o fotografie cu butonul de mai jos.</p>
                    <br />
                    <form onSubmit={handleImgSubm} method="POST" enctype="multipart/form-data">
                        <label for="file" className="file-label">
                            <input onChange={handleChange} type="file" name="file" id="file" />
                            Încarcă o fotografie
                        </label>
                        <br />
                        <br />
                        <button type="submit">Trimite</button>

                        <br />
                        <br />
                        <p style={{ color: 'rgb(184, 44, 44)', cursor: 'pointer', fontWeight: '700' }} onClick={logout}>
                            Ieși din cont
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}
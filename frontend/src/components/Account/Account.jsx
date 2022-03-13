import React from "react";
import {
  getUserDataFromJwtReq,
  axiosAuthInstanceToAPI,
} from "../../utils/serverAPI";
import CookieManager from "./../../utils/CookieManager";

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
    if (!CookieManager.getCookie("jwt")) {
      window.location.assign("/login");
      return;
    }
  }, []);

  React.useEffect(() => {
    getUserDataFromJwtReq()
      .then((data) => {
        setUserData({
          name: data.name,
          surname: data.surname,
          email: data.email,
          role: data.role,
          desc: data.desc,
        });
      })
      .catch((err) => {
        console.error(err);
        alert("error1!");
      });
  }, []);

  const handleSubmitForm = async (event) => {
    event.preventDefault();
    const { value: name } = nameRef.current;
    const { value: surname } = surnameRef.current;

    const { value: email } = emailRef.current;
    const { value: desc } = userData?.role === "teacher" ? descRef.current : "";

    const { value: password } = passwordRef.current;

    if (!name || !surname || !email || !password) {
      alert("fields must be filled!");
      return;
    }

    axiosAuthInstanceToAPI
      .patch("/user/profile", {
        name,
        surname,
        email,
        desc,
        password,
      })
      .then(
        (res) => {
          alert("updated successfully");
          window.location.reload();
        },
        (err) => {
          console.error(err);
          alert("error123!");
        }
      );
  };

  const handleImgSubm = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("file", userProfilePic);
    console.log(formData);
    axiosAuthInstanceToAPI
      .post("/user/profile/picture", formData, { timeout: 5000 })
      .then(
        (res) => {
          //console.log(res.data);
          alert("img uploaded!");
          window.location.reload();
        },
        (err) => {
          console.error(err);
          alert("error!pp");
        }
      );
  };

  const handleChange = (event) => {
    event.preventDefault();
    setUserProfilePic(event.target.files[0]);
    console.log(event.target.files[0]);
  };

  
  return (
    <div className="px-6 py-10">
      <h2 class="text-2xl text-gray-900 ml-3 mt-4">Setari cont</h2>
      <br />
      <form onSubmit={handleSubmitForm} className="border-t border-gray-400">
        <div class="flex mt-4">
          <div class="w-full md:w-1/2 mb-6 mr-4">
            <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              nume
            </label>
            <input
              class="appearance-none block w-full bg-white text-gray-700 border border-gray-400 shadow-inner rounded-md py-3 px-4 leading-tight focus:outline-none  focus:border-gray-500"
              ref={surnameRef}
              type="text"
              defaultValue={userData?.surname}
              name="surname"
              placeholder="Nume"
            />
          </div>
          <div class="w-full md:w-1/2 mb-6">
            <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              prenume
            </label>
            <input
              class="appearance-none block w-full bg-white text-gray-700 border border-gray-400 shadow-inner rounded-md py-3 px-4 leading-tight focus:outline-none  focus:border-gray-500"
              ref={nameRef}
              type="text"
              defaultValue={userData?.name}
              name="name"
              placeholder="Prenume"
            />
          </div>
        </div>
        <div class="w-full md:w-full mb-6">
          <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
            email
          </label>
          <input
            class="appearance-none block w-full bg-white text-gray-700 border border-gray-400 shadow-inner rounded-md py-3 px-4 leading-tight focus:outline-none  focus:border-gray-500"
            ref={emailRef}
            type="email"
            defaultValue={userData?.email}
            name="email"
            placeholder="E-mail"
          />
        </div>

        {userData?.role === "teacher" && (
          <div class="w-full md:w-full mb-6">
            <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              Descriere
            </label>
            <textarea
              class="bg-gray-100 px-4 rounded-md border leading-normal resize-none w-full h-20 py-2  shadow-inner border border-gray-400 font-medium placeholder-gray-700 focus:outline-none focus:bg-white"
              defaultValue={userData?.desc}
              ref={descRef}
              type="text"
              name="desc"
              placeholder="desc"
            ></textarea>
          </div>
        )}

        <div class="w-full md:w-full mb-6">
          <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
            parola
          </label>
          <input
            class="appearance-none block w-full bg-white text-gray-700 border border-gray-400 shadow-inner rounded-md py-3 px-4 leading-tight focus:outline-none  focus:border-gray-500"
            ref={passwordRef}
            type="password"
            name="psw"
            placeholder="Schimbă parola"
          />
        </div>

        <div class="flex justify-center">
          <button
            type="submit"
            class="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
          >
            Salveaza
          </button>
        </div>
      </form>

      <br />
      <div className="">
        <h2 class="text-2xl text-gray-900 ml-3 mt-4">Poza Profil</h2>
        <br />
        <form
          className="border-t border-gray-400"
          onSubmit={handleImgSubm}
          method="POST"
          enctype="multipart/form-data"
        >
          <br />
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="file"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                >
                  <span>Upload a file</span>

                  <input
                    onChange={handleChange}
                    type="file"
                    className="sr-only"
                    name="file"
                    id="file"
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
            </div>
          </div>
          <br />
          <div class="flex justify-center">
            <button
              type="submit"
              class="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
            >
              Salveaza
            </button>
          </div>

          <br />
          <br />
          
        </form>
      </div>
    </div>
  );
}

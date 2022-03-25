import React from "react";
import {
  axiosAuthInstanceToAPI,
  getUserDataFromJwtReq,
} from "../../../utils/serverAPI";

function Session({ session }) {
  const [role, setRole] = React.useState('');

  React.useEffect(() => {
    getUserDataFromJwtReq().then(({ role }) => {
      setRole(role);
    });
  }, []);

  const handleClick = (event) => {
    event.preventDefault();
    const id = session.session._id;

    getUserDataFromJwtReq().then(({ coins }) => {
      if (coins >= session.session.cost) {
        window.location.assign(`/session/${id}`);
      } else {
        alert("Nu ai bani suficienti!");
      }
    });
  };

  const handleAcceptClick = (event) => {
    event.preventDefault();
    const id = session.session._id;
    axiosAuthInstanceToAPI.post(`/user/session/accept/${id}`).then((res) => {
      window.location.reload();
    });
  };

  return (
    <div
      className="w-full px-3 py-3 rounded overflow-hidden h-auto border border-gray-300 shadow shadow-lg"
      key={session._id}
    >
      <p>
        cu:{" "}
        <i>
          {"  "}
          {session.name}
        </i>
      </p>
      <div>
        inteval: {"  "}
        {session.session.startDate} <span className="text-3xl">&#8594;</span>{" "}
        {session.session.endDate}
      </div>
      <div>cost: {session.session.cost} lei</div>
      <div className="flex justify-end">
        {((session.session.accepted || role === 'teacher') && (
          <button
            type="button"
            onClick={handleClick}
            className=" text-white bg-purple-500 hover:bg-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
          >
            Join
          </button>
        )) || (
          <button
            type="button"
            onClick={handleAcceptClick}
            className=" text-white bg-purple-500 hover:bg-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
          >
            Accept
          </button>
        )}
        
      </div>
    </div>
  );
}

export default Session;

import React from "react";
import CodingGround from "../CodingGround/CodingGround";

function Problem({ problem, socket }) {
  React.useEffect(() => {}, []);

  return (
    <div className="flex mt-5">
      <div className="w-1/3">
        <p className="text-3xl">{problem.name}</p>
        <br /><br />
        <div className="text-xl">{problem.text}</div>
        
        <div className="">
          <p className="text-xl font-bold">Exemplu 1:</p>
        
          <div className="bg-gray-100 mt-2">
            <p className="text-lg">Input: {problem.tests[0].input}</p>
            <p className="text-lg">Output: {problem.tests[0].output}</p>
          </div>
        </div>
        <br />
        <div className="">
          <p className="text-xl font-bold">Exemplu 2:</p>
        
          <div className="bg-gray-100 mt-2">
            <p className="text-lg">Input: {problem.tests[1].input}</p>
            <p className="text-lg">Output: {problem.tests[1].output}</p>
          </div>
        </div>
        <br />
        <div className="">
          <p className="text-xl font-bold">Exemplu 3:</p>
        
          <div className="bg-gray-100 mt-2">
            <p className="text-lg">Input: {problem.tests[2].input}</p>
            <p className="text-lg">Output: {problem.tests[2].output}</p>
          </div>
        </div>
        <br />
       
       
        <br />
      </div>
      <div className="w-2/3 flex justify-end">
        <CodingGround pbName={problem.name} socket={socket} />
      </div>
    </div>
  );
}

export default Problem;

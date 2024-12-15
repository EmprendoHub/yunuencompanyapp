"use client";
import React, { useState } from "react";
import "./live.css";
import LogoComponent from "@/components/logos/LogoComponent";

interface WinnerData {
  ticketNumber: string;
  name?: string;
  prize: string;
}

const LivePicker = ({ data }: { data?: string }) => {
  const messages = JSON.parse(data || "[]");

  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [winningNumber, setWinningNumber] = useState<string | null>(null);
  const [winnerData, setWinnerData] = useState<WinnerData | null>(null);
  const [spinDegrees, setSpinDegrees] = useState<number>(0);
  const [showModal, setShowModal] = useState<boolean>(false);

  return (
    <div className="flex items-center h-full ">
      <div className="w-3/4">
        <div className="bg-card  p-3 rounded-md h-screen overflow-y-auto">
          <h3 className=" font-bold text-2xl">Yuny y Mis Chulas</h3>
          <hr className="my-3 maxmd:my-1 " />
          {messages &&
            messages.map((message: any, i: number) => (
              <div key={i} className="text-xs flex flex-col">
                <div className="text-[10px] text-muted">{message.id}</div>
                <div>{message.message}</div>
                <div className="text-[12px] text-bold text-blue-500">
                  {message.from?.name}
                </div>
                <div className="text-[10px] text-bold">
                  {message.created_time}
                </div>
                <hr className="my-3 maxmd:my-1 " />
              </div>
            ))}
        </div>
      </div>
      <div className="w-full winner-picker flex items-center justify-center flex-col min-h-screen relative overflow-hidden">
        <LogoComponent className=" self-center mx-auto" />

        <button
          disabled={isSpinning}
          className="bg-purple-800 text-white px-6 py-3 rounded-lg"
        >
          {isSpinning ? "..." : "Girar Ruleta"}
        </button>
        <div
          className="relative mt-10"
          style={{ width: "600px", height: "600px" }}
        >
          <div
            style={{
              position: "absolute",
              top: "-20px",
              left: "50%",
              transform: "translateX(-50%)",
              width: 0,
              height: 0,
              borderLeft: "20px solid transparent",
              borderRight: "20px solid transparent",
              borderTop: "30px solid red",
              zIndex: 10,
            }}
          />
        </div>
        {showModal && (
          <>
            {winnerData?.name && (
              <div className="fixed top-0 left-0 w-full min-h-screen flex items-center justify-center z-50 bg-black bg-opacity-50">
                <div className="max-w-[500px] relative m-auto text-center bg-slate-300 p-6 rounded-lg shadow-lg">
                  <LogoComponent className=" self-center mx-auto" />
                  <div className="text-black">
                    <h2 className="text-3xl font-bold text-green-600 mb-4">
                      🎉 FELICIDADES! 🎉
                    </h2>
                    <p className="text-xl">Numero Ganador: </p>
                    <p className="text-4xl font-bold">{winningNumber}</p>
                    <p className="text-xl">Ganador:</p>
                    <p className="text-4xl font-bold">{winnerData.name}</p>
                  </div>
                  <button
                    className="absolute top-2 right-2 text-red-700 hover:text-red-500 z-[999]"
                    onClick={() => setShowModal(false)}
                  >
                    X
                  </button>
                  <div
                    className="relative cursor-pointer text-white bg-emerald-700 px-6 py-3 mt-3 z-[999]"
                    onClick={() => setShowModal(false)}
                  >
                    Finalizar
                  </div>
                </div>
                <div className="firework"></div>
                <div className="firework"></div>
                <div className="firework"></div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default LivePicker;

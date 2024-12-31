"use client";
import React, { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import "./pickerwinner.css";
import LogoComponent from "@/components/logos/LogoComponent";
import { useClients } from "@/hooks/useClients";

interface WinnerPickerProps {
  postId: string;
}

interface WinnerData {
  ticketNumber: string;
  name?: string;
  prize: string;
}

const WinnerPicker: React.FC<WinnerPickerProps> = ({ postId }) => {
  const { getClients, clients, subscribeToClients } = useClients();

  subscribeToClients();

  useEffect(() => {
    getClients(postId);
  }, []);

  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [winningNumber, setWinningNumber] = useState<string | null>(null);
  const [winnerData, setWinnerData] = useState<WinnerData | null>(null);
  const [spinDegrees, setSpinDegrees] = useState<number>(0);
  const [showModal, setShowModal] = useState<boolean>(false);

  const totalNumber = clients.length;

  const calculateRotation = useCallback(
    (selectedNumber: number) => {
      const segmentRotation = 360 / totalNumber;
      const segmentIndex = selectedNumber - 1; // Zero-based index

      // Calculate rotation to align the selected segment with the top
      // Subtract an additional 90 degrees to rotate to top
      const randomOffset =
        Math.random() * segmentRotation - segmentRotation / 2;

      const fullRotations = 5;
      const finalRotation =
        -(fullRotations * 360) -
        segmentIndex * segmentRotation -
        segmentRotation / 2 +
        randomOffset;

      return finalRotation;
    },
    [totalNumber]
  );

  const handleSpin = useCallback(() => {
    if (isSpinning) return;

    setIsSpinning(true);
    setWinningNumber(null);
    setWinnerData(null);
    setShowModal(false);

    // Select a random winner, ensuring the number is never 1
    const selectedNumber = Math.floor(Math.random() * (totalNumber - 1)) + 2;
    const winner = clients[selectedNumber - 1];

    // Calculate precise rotation
    const rotation = calculateRotation(selectedNumber);
    setSpinDegrees(rotation);

    // Reset and show results after spin
    setTimeout(() => {
      setWinningNumber(String(selectedNumber));
      setWinnerData(
        winner || { ticketNumber: String(selectedNumber), prize: "N/A" }
      );
      setShowModal(true);
      setIsSpinning(false);
    }, 5000);
  }, [isSpinning, clients, totalNumber, calculateRotation]);

  return (
    <div className="flex items-center">
      <div className="w-auto flex mr-2">
        <div className="bg-card  p-3 rounded-md  max-h-[80vh] overflow-y-auto">
          <h3 className=" font-bold text-2xl">Compartidos</h3>
          <p className="text-center">{clients.length}</p>
          <hr className="my-3 maxmd:my-1 " />
          {[...clients].reverse().map((customer: any, index: number) => (
            <div
              key={customer.id}
              className={`${
                winningNumber === (clients.length - index).toString()
                  ? "bg-emerald-700 text-white text-2xl"
                  : "text-xs "
              }`}
            >
              {clients.length - index}.-
              {customer.name !== "SUCURSAL" ? customer.name : ""}
            </div>
          ))}
        </div>
      </div>
      <div className="w-full winner-picker flex items-center justify-center flex-col min-h-screen relative overflow-hidden">
        <button
          onClick={handleSpin}
          disabled={isSpinning}
          className="bg-purple-800 text-white px-6 py-3 rounded-lg"
        >
          {isSpinning ? "..." : "Girar Ruleta"}
        </button>
        <div
          className="relative mt-10"
          style={{ width: "500px", height: "500px" }}
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
          <motion.div
            key={spinDegrees}
            className="wheel"
            animate={{ rotate: spinDegrees }}
            transition={{
              duration: 5,
              ease: "easeInOut",
            }}
            style={{
              width: "500px",
              height: "500px",
              borderRadius: "50%",
              overflow: "hidden",
              position: "absolute",
            }}
          >
            <svg
              viewBox="0 0 100 100"
              style={{ width: "100%", height: "100%" }}
            >
              {Array.from({ length: totalNumber }, (_, index) => {
                // Adjusted to start from -90 degrees (top of circle)
                const startAngle = (index / totalNumber) * 360 - 90;
                const endAngle = ((index + 1) / totalNumber) * 360 - 90;
                const midAngle = (startAngle + endAngle) / 2;

                const midRadians = (midAngle * Math.PI) / 180;

                const textX = 50 + 42 * Math.cos(midRadians);
                const textY = 50 + 42 * Math.sin(midRadians);

                const rangeStart =
                  index * Math.ceil(totalNumber / totalNumber) + 1;
                const segmentRange = `${rangeStart.toString()}`;

                const colors = [
                  "#FF5733",
                  "#33C1FF",
                  "#F1C40F",
                  "#2ECC71",
                  "#C1ff21",
                ];
                const color = colors[index % colors.length];

                return (
                  <g key={index}>
                    <path
                      d={`M50 50 L ${
                        50 + 50 * Math.cos((startAngle * Math.PI) / 180)
                      } ${50 + 50 * Math.sin((startAngle * Math.PI) / 180)}
                       A 50 50 0 ${endAngle - startAngle > 180 ? 1 : 0} 1 ${
                        50 + 50 * Math.cos((endAngle * Math.PI) / 180)
                      } ${50 + 50 * Math.sin((endAngle * Math.PI) / 180)} Z`}
                      fill={color}
                      stroke="#fff"
                      strokeWidth="0.0"
                    />
                    <text
                      x={textX}
                      y={textY}
                      fontSize="1.9"
                      fill="#000"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      style={{
                        pointerEvents: "none",
                      }}
                    >
                      {segmentRange}
                    </text>
                  </g>
                );
              })}
            </svg>
          </motion.div>
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

export default WinnerPicker;

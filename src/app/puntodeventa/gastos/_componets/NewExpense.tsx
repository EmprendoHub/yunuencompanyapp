"use client";
import React from "react";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { Router } from "lucide-react";
import { useRouter } from "next/navigation";

const NewExpense = () => {
  const router = useRouter();
  const [notification, setNotification] = useState("");

  const [type, setType] = useState("");
  const [amount, setAmount] = useState("");
  const [reference, setReference] = useState("");
  const [method, setMethod] = useState("");
  const [comment, setComment] = useState("");
  const [activeButton, setActiveButton] = useState(false);
  const [formStatus, setFormStatus] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (type === "") {
      toast({
        variant: "destructive",
        title: "Por favor agregar el tipo de gasto antes de continuar. ",
      });
      return;
    }

    if (amount === "") {
      toast({
        variant: "destructive",
        title:
          "Por favor agregue una cantidad válida de gasto antes de continuar. ",
      });
      return;
    }
    if (method === "") {
      toast({
        variant: "destructive",
        title: "Por favor agregue un método de pago antes de continuar.",
      });
      return;
    }

    setActiveButton(true);

    try {
      const res: any = await fetch(`/api/expense`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          type,
          amount,
          reference,
          method,
          comment,
        }),
      });

      if (res.status === 400) {
        toast({
          variant: "destructive",
          title: "Error al crear gasto intenta nuevamente",
        });
        setActiveButton(true);

        setError("Error al crear gasto intenta nuevamente");
      }
      if (res.ok) {
        setFormStatus(true);
        toast({
          title: "El gasto se creo exitosamente",
        });

        router.push("/puntodeventa/tienda");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleAmountChange = (e: any) => {
    const inputAmount = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
    setAmount(inputAmount);
  };

  return (
    <div className="relative flex fle-col py-7  pr-7 m-auto w-full rounded-xl z-10">
      {!formStatus ? (
        <form onSubmit={handleSubmit} className="flex flex-col w-full gap-y-4">
          <input
            type="text"
            placeholder={"Tipo de Pago"}
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="p-2 border-black border-b font-playfair-display bg-white bg-opacity-0"
          />
          <input
            type="text"
            placeholder={"Método de Pago"}
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="p-2 border-black border-b font-playfair-display appearance-none bg-white bg-opacity-0 "
          />
          <input
            className="p-2 border-black border-b font-playfair-display appearance-none bg-white bg-opacity-0 "
            type="text"
            placeholder="Cantidad"
            value={amount}
            onChange={handleAmountChange}
          />
          <textarea
            cols={30}
            rows={3}
            placeholder="Nota"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="p-2 border-black border-b font-playfair-display bg-white bg-opacity-0"
          ></textarea>
          <button type="submit" className="mt-5" disabled={activeButton}>
            <p className=" bg-black  text-white py-3">{"Agregar Gasto"}</p>
          </button>
        </form>
      ) : (
        <div className="w-full h-screen flex flex-col items-center justify-center text-green-700">
          El gasto se creo exitosamente
        </div>
      )}
    </div>
  );
};

export default NewExpense;

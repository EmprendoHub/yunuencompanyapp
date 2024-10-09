"use client";
import React from "react";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

    if (comment === "") {
      toast({
        variant: "destructive",
        title:
          "Por favor agregue una nota breve para explicar el pago antes de continuar.",
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

        setError("Error al crear gasto intenta nuevamente");
      }
      if (res.ok) {
        setFormStatus(true);
        toast({
          title: "El gasto se creo exitosamente",
        });
      }
      setActiveButton(true);

      router.refresh();
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
          <div className="flex items-center gap-5">
            <Select value={type} onValueChange={(value) => setType(value)}>
              <SelectTrigger className="w-[300px] text-2xl">
                <SelectValue placeholder="Tipo de Pago" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem className="text-2xl" value="NOMINA">
                  NOMINA
                </SelectItem>
                <SelectItem className="text-2xl" value="COMIDA">
                  COMIDA
                </SelectItem>
                <SelectItem className="text-2xl" value="PROVEEDOR">
                  PROVEEDOR
                </SelectItem>
                <SelectItem className="text-2xl" value="OTRO">
                  OTRO
                </SelectItem>
              </SelectContent>
            </Select>

            <Select value={method} onValueChange={(value) => setMethod(value)}>
              <SelectTrigger className="w-[300px] text-2xl">
                <SelectValue placeholder="Método de Pago" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem className="text-2xl" value="EFECTIVO">
                  EFECTIVO
                </SelectItem>
                <SelectItem className="text-2xl" value="TRANSFERENCIA">
                  TRANSFERENCIA
                </SelectItem>
                <SelectItem className="text-2xl" value="TARJETA">
                  TARJETA
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <input
            className="p-2 border-black border-b font-playfair-display appearance-none bg-white bg-opacity-0 text-6xl"
            type="text"
            placeholder="$0"
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
          <button
            type="submit"
            className={`${activeButton ? "hidden" : ""}`}
            disabled={activeButton}
          >
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

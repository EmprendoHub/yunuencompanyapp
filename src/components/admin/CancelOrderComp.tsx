"use client";
import React, { useState } from "react";
import { FaCircleCheck, FaCircleExclamation } from "react-icons/fa6";
import { runRevalidationTo } from "@/app/_actions";
import { toast } from "../ui/use-toast";

const CancelOrderComp = ({
  pathname,
  setShowModal,
  orderId,
  isPaid,
  pendingTotal,
  branchId,
}: {
  pathname: string;
  setShowModal: any;
  orderId: string;
  isPaid: boolean;
  pendingTotal: number;
  branchId: string;
}) => {
  const [note, setNote] = useState("");
  const [isSending, setIsSending] = useState(false);
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (note === "" || note.length < 5) {
      toast({
        duration: 2000,
        className: "bg-destructive text-slate-100",
        title:
          "Por favor agregar una razón detallada de cancelación para continuar.",
      });
      return;
    }
    setIsSending(true);

    try {
      const formData = new FormData();
      formData.set("orderId", orderId);
      formData.set("branchId", branchId);
      try {
        const res = await fetch(`/api/order`, {
          method: "DELETE",
          body: formData,
        });
        await runRevalidationTo(`/${pathname}/pedidos`);
        setShowModal(false);
      } catch (error) {
        toast({
          duration: 2000,
          className: "bg-destructive text-slate-100",
          title: "Error cancelando el pedido. Por favor Intenta de nuevo.",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col w-full h-full items-center justify-center">
      <div className="w-1/2 maxmd:w-5/6 bg-background pl-4 rounded-lg">
        <section className=" p-6 w-full">
          <h2 className="text-xl maxmd:text-5xl font-semibold text-foreground mb-8 font-EB_Garamond">
            Cancelar Venta
          </h2>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-start gap-5 justify-start w-full "
          >
            <div className="flex-col flex justify-start px-2 gap-y-5 w-full">
              <div className="gap-y-5 flex-col flex px-2 w-full">
                <div className="mb-4">
                  <label className="block mb-1">Razón de Cancelación ? </label>
                  <textarea
                    rows={5}
                    className="appearance-none border bg-gray-100 rounded-md py-2 px-3 border-gray-300 focus:outline-none focus:border-gray-400 w-full"
                    placeholder="Nota"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    name="note"
                  />
                </div>
              </div>
            </div>
            {/* Buttons */}

            {!isSending ? (
              <div className="flex flex-row items-center justify-between w-full gap-2">
                <div
                  onClick={() => setShowModal(false)}
                  className="my-2 px-4 py-2 text-center text-white bg-red-700 border border-transparent rounded-md hover:bg-red-800 w-full flex flex-row items-center justify-center gap-1 cursor-pointer"
                >
                  <FaCircleExclamation className="text-xl" />
                  Cancelar
                </div>
                <button
                  type="submit"
                  className="my-2 px-4 py-2 text-center text-white bg-emerald-700 border border-transparent rounded-md hover:bg-emerald-900 w-full flex flex-row items-center justify-center gap-1"
                >
                  <FaCircleCheck className="text-xl" /> Aceptar
                </button>
              </div>
            ) : (
              <div className="flex flex-row items-center justify-center w-full gap-2">
                <div className="loader flex self-center" />
              </div>
            )}
          </form>
        </section>
      </div>
    </div>
  );
};

export default CancelOrderComp;

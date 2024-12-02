"use client";
import React, { useState } from "react";
import { isValidPhone } from "@/backend/helpers";
import { toast } from "sonner";
import LogoComponent from "@/components/logos/LogoComponent";

const RaffleRegister = () => {
  const [honeypot, setHoneypot] = useState("");
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (name === "") {
      toast("Por favor complete el nombre de usuario para registrarse.");
      return;
    }

    if (lastName === "") {
      toast("Por favor agregue su correo electrónico para registrarse.");
      return;
    }

    if (!isValidPhone(phone)) {
      toast("Utilice un teléfono válido.");
      return;
    }

    try {
      const res: any = await fetch(`/api/registerraffles`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          name,
          lastName,
          phone,
          honeypot,
        }),
      });

      if (res.status === 400) {
        toast("Este teléfono ya esta en uso");
        setError("Este teléfono ya esta en uso");
      }
      if (res.ok) {
        setName("");
        setLastName("");
        setPhone("");
        toast("Se registró exitosamente al usuario");
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handlePhoneChange = (e: any) => {
    const inputPhone = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
    let formattedPhone = "";

    if (inputPhone.length <= 10) {
      formattedPhone = inputPhone.replace(
        /(\d{3})(\d{0,3})(\d{0,4})/,
        "$1$2$3"
      );
    } else {
      // If the phone number exceeds 10 digits, truncate it
      formattedPhone = inputPhone
        .slice(0, 10)
        .replace(/(\d{3})(\d{0,3})(\d{0,4})/, "$1 $2 $3");
    }

    setPhone(formattedPhone);
  };

  return (
    <main className="flex min-h-screen maxsm:min-h-[70vh] flex-col items-center justify-center">
      <div className="w-fit flex flex-col items-center bg-primary maxsm:p-8 p-20 shadow-xl text-center mx-auto rounded-lg">
        {/* <LogoComponent /> */}
        <LogoComponent className={"ml-5 mt-4 w-[200px] maxsm:w-[120px]"} />
        <h2 className="my-4 text-foreground font-bold font-EB_Garamond text-2xl">
          Registro Nuevo
        </h2>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col justify-center items-center text-center gap-y-4 text-foreground"
        >
          <input
            className="text-center py-2"
            type="text"
            placeholder="Nombre..."
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="text-center py-2"
            type="lastName"
            placeholder="Apellidos..."
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <input
            className="text-center py-2"
            type="text"
            placeholder="Teléfono"
            value={phone}
            onChange={handlePhoneChange}
          />

          <input
            hidden
            className="text-center py-2"
            type="text"
            placeholder="Honeypot"
            onChange={(e) => setHoneypot(e.target.value)}
          />

          <button
            type="submit"
            className={`bg-black text-white py-2 px-8 text-xl hover:bg-slate-200 hover:text-foreground ease-in-out duration-700 rounded-md`}
          >
            Registrarme
          </button>
        </form>
      </div>
    </main>
  );
};

export default RaffleRegister;

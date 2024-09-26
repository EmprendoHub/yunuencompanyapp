"use client";
import GoogleCaptchaWrapper from "@/components/forms/GoogleCaptchaWrapper";
import React, { useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

const SubscribeComponent = ({
  cookie,
  setShowModal,
}: {
  cookie: string;
  setShowModal?: any;
}) => {
  const [notification, setNotification] = useState("");
  const { executeRecaptcha } = useGoogleReCaptcha();

  const [honeypot, setHoneypot] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const isValidEmail = (email: string) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: any) => {
    setError("");
    e.preventDefault();

    if (email === "") {
      setError("Por favor agregue su correo electrónico para registrarse.");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Utilice un correo electrónico válido.");
      return;
    }

    if (!executeRecaptcha) {
      setNotification("Ejecutar recaptcha aún no está disponible");
      return;
    }
    executeRecaptcha("enquiryFormSubmit").then(async (gReCaptchaToken) => {
      try {
        const res: any = await fetch(`/api/subscribe`, {
          headers: {
            "Content-Type": "application/json",
            Cookie: cookie,
          },
          method: "POST",
          body: JSON.stringify({
            email,
            recaptcha: gReCaptchaToken,
            honeypot,
          }),
        });

        if (res?.data?.success === true) {
          setNotification(`Éxito con la puntuación: ${res?.data?.score}`);
        } else {
          setNotification(`Fallo con puntuación: ${res?.data?.score}`);
        }

        if (res.status === 400) {
          setError("Este correo ya esta suscrito!");
        }
        if (res.ok) {
          setError("El correo quedo suscrito exitosamente");
          setShowModal(false);
          return;
        }
      } catch (error) {
        console.log(error);
      }
    });
  };
  return (
    <GoogleCaptchaWrapper>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col justify-center items-center text-center gap-y-4 text-foreground"
      >
        {notification && (
          <p className="text-sm text-blue-600">{notification}</p>
        )}
        <div className="flex flex-row items-center justify-center gap3">
          <input
            className="text-center py-2"
            type="email"
            placeholder="Correo Electrónico..."
            onChange={(e) => setEmail(e.target.value)}
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
            Suscribir
          </button>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}
      </form>
    </GoogleCaptchaWrapper>
  );
};
export default SubscribeComponent;

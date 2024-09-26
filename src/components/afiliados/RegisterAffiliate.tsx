"use client";
import React, { useContext, useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { IoLogoGoogle } from "react-icons/io";
import { useRouter } from "next/navigation";
import WhiteLogoComponent from "../logos/WhiteLogoComponent";
import Swal from "sweetalert2";
import { generateRandomPassword } from "@/backend/helpers";
import AuthContext from "@/context/AuthContext";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { toast } from "sonner";

const RegisterAffiliate = () => {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const router = useRouter();
  const session = useSession();
  const { registerAffiliateUser, clearErrors, error } = useContext(AuthContext);

  useEffect(() => {
    if (session?.status === "authenticated") {
      router.replace("/");
    }
  }, [session, router]);

  useEffect(() => {
    if (error) {
      let timerInterval: any;
      Swal.fire({
        icon: "error",
        title: "Error!",
        html: error,
        timer: 5000,
        timerProgressBar: true,
        didOpen: () => {
          Swal.showLoading(null);
        },
        willClose: () => {
          clearInterval(timerInterval);
        },
      }).then((result) => {
        /* Read more about handling dismissals below */
        if (result.dismiss === Swal.DismissReason.timer) {
          console.log("I was closed by the timer");
        }
      });
    }
  }, [error]);

  const [name, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [suggestedPassword, setSuggestedPassword] = useState(
    generateRandomPassword(16)
  );
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [honeypot, setHoneypot] = useState("");

  const handlePhoneChange = (e: any) => {
    const inputPhone = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
    let formattedPhone = "";

    if (inputPhone.length <= 10) {
      formattedPhone = inputPhone.replace(
        /(\d{3})(\d{0,3})(\d{0,4})/,
        "$1 $2 $3"
      );
    } else {
      // If the phone number exceeds 10 digits, truncate it
      formattedPhone = inputPhone
        .slice(0, 10)
        .replace(/(\d{3})(\d{0,3})(\d{0,4})/, "$1 $2 $3");
    }

    setPhone(formattedPhone);
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };

  const handleUseSuggestedPass = async () => {
    setPassword(suggestedPassword);
  };

  const handleSubmit = async (e: any) => {
    const phoneRegex = /^(\+\d{2}\s?)?(\d{3}[-\s]?\d{3}[-\s]?\d{4})$/;
    e.preventDefault();

    if (name === "") {
      toast("Por favor complete el nombre de usuario para registrarse.");
      return;
    }

    if (email === "") {
      toast("Por favor agregue su correo electrónico para registrarse.");
      return;
    }

    if (!isValidEmail(email)) {
      toast("Utilice un correo electrónico válido.");
      return;
    }

    if (phone === "" || !phoneRegex.test(phone)) {
      toast(
        "Por favor agregar un teléfono válido para continuar. El formato correcto es: 331 235 4455"
      );
      return;
    }

    if (!password || password.length < 10) {
      toast("La contraseña debe tener al menos 10 caracteres");
      return;
    }
    // Check if password contains at least one letter
    if (!/[a-zA-Z]/.test(password)) {
      toast("La contraseña debe contener al menos una letra");
      return;
    }

    // Check if password contains at least one number
    if (!/\d/.test(password)) {
      toast("La contraseña debe contener al menos un número");
      return;
    }

    // Check if password contains at least one special character
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      toast(
        "La contraseña debe contener al menos un carácter especial !@#$%&*-_=+"
      );
      return false;
    }

    if (!executeRecaptcha) {
      console.log("Execute recaptcha not available yet");
      return;
    }
    executeRecaptcha("enquiryFormSubmit").then(async (gReCaptchaToken) => {
      try {
        const res: any = await fetch(`/api/affiliate/register`, {
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({
            name,
            email,
            phone,
            password,
            recaptcha: gReCaptchaToken,
            honeypot,
          }),
        });
        if (res?.data?.success === true) {
          toast(`Success with score: ${res?.data?.score}`);
        } else {
          toast(`Failure with score: ${res?.data?.score}`);
        }
        if (res.status === 400) {
          toast("This email is already in use");
          //setError('This email is already in use');
        }
        if (res.status === 401) {
          toast("Bots no se permiten");
          //setError('This email is already in use');
        }
        if (res.ok) {
          toast("Se registro el afiliado con éxito");
          setTimeout(() => {
            const callback = `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/registro/affiliate/stripe`;
            router.replace(`/iniciar?callbackUrl=${callback}`);
          }, 200);
          return;
        }
      } catch (error) {
        console.log(error);
      }
    });
  };

  return (
    <main className="flex min-h-screen maxsm:min-h-[70vh] flex-col items-center justify-center">
      <div className="w-fit flex flex-col items-center bg-slate-200 maxsm:p-8 p-20 shadow-xl text-center mx-auto">
        {/* <LogoComponent /> */}
        <WhiteLogoComponent className={"ml-5 mt-4 w-[200px] maxsm:w-[120px]"} />
        <h2 className="my-4 text-foreground font-bold font-EB_Garamond text-2xl">
          Registro de Afiliado
        </h2>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col justify-center items-center text-center gap-y-4 text-foreground"
        >
          <input
            className="text-center py-2"
            type="text"
            placeholder="Nombre y Apellidos..."
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            className="text-center py-2"
            type="email"
            placeholder="Correo Electrónico..."
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="text-center py-2"
            type="text"
            placeholder="Honeypot"
            onChange={(e) => setHoneypot(e.target.value)}
          />
          <p className="text-red-600">{error}</p>
          <div className="mb-4 md:col-span-1">
            <label className="block mb-1"> Teléfono </label>
            <input
              className="appearance-none border border-gray-200 bg-gray-100 rounded-md py-2 px-3 hover:border-gray-400 focus:outline-none focus:border-gray-400 w-full text-center"
              type="tel"
              placeholder="Ingresa tu teléfono"
              value={phone}
              onChange={handlePhoneChange}
            />
            <p className="text-sm text-slate-500">331 235 4455</p>
          </div>
          <p className="text-xs text-slate-500 my-0">Contraseña sugerida</p>
          <p onClick={handleUseSuggestedPass} className="cursor-pointer">
            {suggestedPassword}
          </p>

          <input
            className="text-center py-2"
            type="password"
            placeholder="Contraseña..."
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
          <button
            type="submit"
            className={`bg-black text-white py-2 px-8 text-xl hover:bg-slate-200 hover:text-foreground ease-in-out duration-700 rounded-md`}
          >
            Registrarme
          </button>
        </form>
        <button className={`text-foreground mt-3`} onClick={() => signIn()}>
          ¿Ya tienes cuenta? <br /> Iniciar Session
        </button>
      </div>
    </main>
  );
};

export default RegisterAffiliate;

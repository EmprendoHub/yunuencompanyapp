"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { IoLogoGoogle } from "react-icons/io";
import { useSelector } from "react-redux";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import Image from "next/image";
import { toast } from "sonner";
import SquareLogo from "../logos/SquareLogo";

const LoginComponent = ({ cookie }: { cookie: any }) => {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const { loginAttempts } = useSelector((state: any) => state?.compras);
  const session = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const callback = searchParams.get("callbackUrl");
  const [honeypot, setHoneypot] = useState("");

  useEffect(() => {
    if (session?.status === "authenticated") {
      router.replace("/");
    }
  }, [session, router]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (password === "" || email === "") {
      toast("Fill all fields!");
      return;
    }

    if (password.length < 8) {
      toast("Password must be at least 8 characters long");
      return;
    }
    if (!executeRecaptcha) {
      console.log("Execute recaptcha not available yet");

      return;
    }
    executeRecaptcha("enquiryFormSubmit").then(async (gReCaptchaToken) => {
      try {
        const res: any = await signIn("credentials", {
          email,
          password,
          recaptcha: gReCaptchaToken,
          honeypot,
          cookie,
        });

        if (res?.data?.success === true) {
          console.log(`Success with score: ${res?.data?.score}`);
        } else {
          console.log(`Failure with score: ${res?.data?.score}`);
        }

        if (res.status === 400) {
          toast("This email is already in use");
        }
        if (res.ok) {
          toast("Iniciar ");
          return;
        }
      } catch (error) {
        toast("Error occured while loggin");
        console.log(error);
      }
    });
  };

  return (
    <main className="flex  min-h-screen flex-col items-center justify-center ">
      {loginAttempts > 30 ? (
        <div>Excediste el limite de inicios de session</div>
      ) : (
        <div className="flex maxlg:flex-col items-center justify-center bg-primary h-screen w-full">
          <div className="w-full flex flex-col items-center justify-center">
            <Image
              src={"/logos/yunuen_logo_Horixontal.webp"}
              alt="Yunuen Company"
              width={500}
              height={500}
              className="w-[200px] maxmd:w-[150px] h-auto"
            />
            <Image
              src={"/logos/login_pic.png"}
              alt="Yunuen Company"
              width={500}
              height={500}
              className="w-[400px] maxmd:w-[300px] h-auto"
            />
          </div>
          <div className="w-1/2 maxlg:w-[70%] bg-background h-screen maxlg:h-auto p-20 maxlg:p-5 shadow-xl text-center text-primary mx-auto flex flex-col items-center justify-center">
            <SquareLogo className={"ml-5 my-4 w-[120px] maxlg:hidden"} />
            <button
              className="w-auto px-5 text-white hover:text-foreground hover:bg-slate-300 duration-500 ease-in-out text-foreground text-xs bg-black flex flex-row gap-4 items-center py-4 justify-center"
              onClick={() => {
                signIn("google");
              }}
            >
              <IoLogoGoogle />
              Iniciar con Google
            </button>
            <div className="text-center text-slate-900 my-1 ">- O -</div>
            <form
              className="flex flex-col justify-center items-center text-center text-xs gap-y-2"
              onSubmit={handleSubmit}
            >
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
              <input
                className="text-center py-2"
                type="password"
                placeholder="contraseña..."
                onChange={(e) => setPassword(e.target.value)}
              />
              <button className="bg-primary text-white w-[150px] p-2 rounded-sm mt-5">
                Iniciar
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default LoginComponent;

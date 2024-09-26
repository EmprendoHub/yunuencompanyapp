"use client";
import { useState, useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";

import Feedback from "./Feedback";
import Result from "./Results";
import { useDispatch, useSelector } from "react-redux";
import { sleep } from "@/backend/helpers";
import { resetEmailReceiver } from "@/redux/shoppingSlice";
import { useRouter } from "next/navigation";

export default function TabOne() {
  // Form States
  const router = useRouter();
  const dispatch = useDispatch();
  const [senderName, setSenderName] = useState("");
  const [greeting, setGreeting] = useState("");
  const [subject, setSubject] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState("");
  const [bestRegards, setBestRegards] = useState("");
  const [loading, setLoading] = useState(false);
  const [counter, setCounter] = useState(0);
  const [success, setSuccess] = useState(false);
  const [processedEmail, setProcessedEmail] = useState({
    successfulEmails: [],
    unsuccessfulEmails: [],
  });
  // MUI states
  const { emailListData } = useSelector((state: any) => state?.compras);
  useEffect(() => {
    if (emailListData.length <= 0) {
      return router.push("/admin/clientes");
    }
    //eslint-disable-next-line
  }, [emailListData]);

  const [checked, setChecked] = useState(false);
  const handleChange = (event: any) => {
    setChecked(event.target.checked);
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    setError("");
    setSuccess(false);

    if (!subject || !body) {
      setError(
        "Asegúrate de agregar el asunto y un mensaje antes de enviar el correo."
      );
    }

    if (emailListData.length === 0) {
      setError(
        "Asegúrate de agregar clientes o afiliados antes de enviar el correo."
      );
    }

    setLoading(true);

    async function delayedLoop() {
      const delay = 2000;

      let successfulEmails: any = [];
      let unsuccessfulEmails: any = [];

      for (let i = 0; i < emailListData.length; i++) {
        setCounter(i + 1);
        const URL = `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/bulkemail`;
        const response = await fetch(URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            subject: checked ? senderName : emailListData[i].name,
            body,
            title,
            greeting,
            bestRegards,
            recipient_email: emailListData[i].email,
            sender_email: "yunuencompany01@gmail.com",
            name: senderName,
          }),
        });

        if (!response.ok) {
          unsuccessfulEmails.push(emailListData[i]);
        } else {
          successfulEmails.push(emailListData[i]);
        }

        await sleep(delay);
      }

      setLoading(false);

      setProcessedEmail({
        successfulEmails: successfulEmails,
        unsuccessfulEmails: unsuccessfulEmails,
      });
      setSuccess(true);
      dispatch(resetEmailReceiver());
    }

    delayedLoop();
  };

  return (
    <div>
      <span className="space-y-5 w-full">
        <div className="flex flex-row maxsm:flex-col gap-2 items-center justify-between gap-x-10">
          {/* Sender Name */}
          <div className="w-1/3 maxsm:w-full">
            <input
              type="text"
              className="login_subject p-4 w-full text-sm text-gray-900 bg-gray-50 rounded-lg shadow-sm border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              placeholder="Nombre del Remitente"
              onChange={(e) => setSenderName(e.target.value)}
            ></input>
          </div>

          {/* Subject */}
          <div className="w-1/2  maxsm:w-full flex flex-row maxsm:flex-col">
            <input
              type="text"
              className="login_subject p-4 text-sm text-gray-900 bg-gray-50 rounded-lg shadow-sm border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              placeholder="Agrega el Asunto"
              onChange={(e) => setSubject(e.target.value)}
            ></input>

            <span>
              <Checkbox checked={checked} onChange={handleChange} />
              <span className="ml-1 my-2 maxsm:text-[10px]">
                Usar el nombre del Remitente como el Asunto
              </span>
            </span>
          </div>
        </div>
        <div className="flex flex-row maxsm:flex-col  maxsm:gap-y-2 items-center gap-x-10">
          {/* Greeting */}
          <input
            type="text"
            className="login_subject w-full p-4 text-sm text-gray-900 bg-gray-50 rounded-lg shadow-sm border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            placeholder="Saludo"
            onChange={(e) => setGreeting(e.target.value)}
          ></input>

          {/* Title */}
          <input
            type="text"
            className="login_subject p-4 w-full text-sm text-gray-900 bg-gray-50 rounded-lg shadow-sm border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            placeholder="Titulo"
            onChange={(e) => setTitle(e.target.value)}
          ></input>
        </div>

        {/* Message */}
        <textarea
          id="Body"
          rows={6}
          onChange={(e) => setBody(e.target.value)}
          className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg shadow-sm border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
          placeholder="Mensaje"
        ></textarea>

        {/* Closing */}
        <input
          type="text"
          className="login_subject  p-4 text-sm text-gray-900 bg-gray-50 rounded-lg shadow-sm border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
          placeholder="Fin e.g Mejores Deseos"
          onChange={(e) => setBestRegards(e.target.value)}
        ></input>

        {error && (
          <Alert>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading && <Feedback counter={counter} />}

        {success && <Result emails={processedEmail.unsuccessfulEmails} />}
        <div>
          <button
            onClick={handleSubmit}
            className="py-3 px-5 mt-5 text-sm font-medium text-center text-white bg-black rounded-lg bg-primary-700 sm:w-fit  focus:ring-4 focus:outline-none focus:ring-primary-300"
          >
            Enviar Mensajes
          </button>
        </div>
      </span>
      <h3 className="mt-10">
        <b>{emailListData.length}</b> Contactos Seleccionados
      </h3>
      <div className="mt-5 w-1/3 maxsm:w-full">
        {emailListData.map((client: any) => (
          <div
            key={client.id}
            className="flex flex-wrap justify-between gap-x-10 items-center "
          >
            <div className="font-semibold">{client.name}</div>
            <div>{client.email}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";
import { useState, useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";

import MessageFeedback from "./MessageFeedback";
import MessageResult from "./MessageResults";
import { useDispatch, useSelector } from "react-redux";
import { sleep } from "@/backend/helpers";
import { resetEmailReceiver } from "@/redux/shoppingSlice";
import { useRouter } from "next/navigation";
import { sendSMSMessage } from "@/app/_actions";

export default function MessagesTabOne() {
  // Form States
  const router = useRouter();
  const dispatch = useDispatch();
  const [body, setBody] = useState("");
  const [error, setError] = useState("");
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

  const handleSubmit = (event: any) => {
    event.preventDefault();
    setError("");
    setSuccess(false);

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
        const URL = `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/bulkmessage`;

        const success = await sendSMSMessage(body, emailListData[i].phone);
        if (success) {
          console.log("SMS sent successfully!");
          successfulEmails.push(emailListData[i]);
        } else {
          console.log("Failed to send SMS.");
          unsuccessfulEmails.push(emailListData[i]);
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
    <div className="h-full">
      <span className="space-y-5 w-full h-full">
        {/* Message */}
        <textarea
          id="Body"
          rows={6}
          onChange={(e) => setBody(e.target.value)}
          className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg shadow-sm border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
          placeholder="Mensaje"
        ></textarea>

        {error && (
          <Alert>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading && <MessageFeedback counter={counter} />}

        {success && (
          <MessageResult emails={processedEmail.unsuccessfulEmails} />
        )}
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
            <div>{client.phone}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

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
import {
  sendSMSMessage,
  sendWAMediaMessage,
  sendWATemplateMessage,
  sendWATextMessage,
} from "@/app/_actions";
import Image from "next/image";

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
  const [mainImage, setMainImage] = useState(
    "/images/product-placeholder-minimalist.jpg"
  );

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
      setError("Asegúrate de agregar clientes antes de enviar el correo.");
    }

    setLoading(true);

    async function delayedLoop() {
      const delay = 2000;

      let successfulEmails: any = [];
      let unsuccessfulEmails: any = [];

      for (let i = 0; i < emailListData.length; i++) {
        setCounter(i + 1);

        // const success = await sendSMSMessage(body, emailListData[i].phone, emailListData[i].name);

        let success;
        if (
          mainImage === "/images/product-placeholder-minimalist.jpg" &&
          body.length <= 0
        ) {
          success = await sendWATemplateMessage(
            emailListData[i].phone,
            emailListData[i].name
          );
        } else if (
          mainImage === "/images/product-placeholder-minimalist.jpg" &&
          body.length > 0
        ) {
          success = await sendWATextMessage(
            body,
            emailListData[i].phone,
            emailListData[i].name
          );
        } else {
          success = await sendWAMediaMessage(
            body,
            emailListData[i].phone,
            mainImage,
            emailListData[i].name
          );
        }

        if (success) {
          console.log("WA Text message sent successfully!");
          successfulEmails.push(emailListData[i]);
        } else {
          console.log("Failed to send WA Text message.");
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

  // *******main images**********  //
  // functions
  const upload = async (e: any) => {
    // Get selected files from the input element.
    let files = e?.target.files;
    let section = e?.target.id;
    if (files) {
      for (var i = 0; i < files?.length; i++) {
        var file = files[i];
        // Retrieve a URL from our server.
        retrieveNewURL(file, (file, url) => {
          const parsed = JSON.parse(url);
          url = parsed.url;
          // Compress and optimize the image before upload
          compressAndOptimizeMainImage(file, url);
        });
      }
    }
  };

  // generate a pre-signed URL for use in uploading that file:
  async function retrieveNewURL(
    file: { name: any },
    cb: {
      (file: any, url: string): void;
      (file: any, url: any): void;
      (arg0: any, arg1: string): void;
    }
  ) {
    const endpoint = `/api/minio/`;
    fetch(endpoint, {
      method: "PUT",
      headers: {
        "Access-Control-Allow-Origin": "*",
        Name: file.name,
      },
    })
      .then((response) => {
        response.text().then((url) => {
          cb(file, url);
        });
      })
      .catch((e) => {
        console.error(e);
      });
  }
  async function compressAndOptimizeMainImage(
    file: Blob | MediaSource,
    url: any
  ) {
    // Create an HTML Image element
    const img = document.createElement("img");

    // Load the file into the Image element
    img.src = URL.createObjectURL(file);

    // Wait for the image to load
    img.onload = async () => {
      // Create a canvas element
      const canvas = document.createElement("canvas");
      const ctx: any = canvas.getContext("2d");

      // Set the canvas dimensions to the image dimensions
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw the image onto the canvas
      ctx.drawImage(img, 0, 0);

      // Compress and set quality (adjust quality value as needed)
      const quality = 0.8; // Adjust quality value as needed
      const compressedImageData = canvas.toDataURL("image/jpeg", quality);

      // Convert base64 data URL to Blob
      const blobData = await fetch(compressedImageData).then((res) =>
        res.blob()
      );

      // Upload the compressed image
      uploadFile(blobData, url);
    };
  }

  // to upload this file to S3 at `https://minio.salvawebpro.com:9000` using the URL:
  async function uploadFile(blobData: Blob, url: any | URL | Request) {
    fetch(url, {
      method: "PUT",
      body: blobData,
    })
      .then(() => {
        const newUrl = url.split("?");

        setMainImage(newUrl[0]);
      })
      .catch((e) => {
        console.error(e);
      });
  }

  return (
    <div className="h-full flex justify-start gap-5">
      <div className="space-y-5 w-full h-full">
        {/* Message */}
        <textarea
          id="Body"
          rows={6}
          onChange={(e) => setBody(e.target.value)}
          className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg shadow-sm border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
          placeholder="Mensaje"
        ></textarea>
        {/*  Imagen principal */}
        <div className="gap-y-1 flex-col flex px-2 w-full">
          <div className="relative aspect-video hover:opacity-80 bg-background border-4 border-gray-300">
            <label htmlFor="selectorMain" className="cursor-pointer">
              <Image
                id="blogImage"
                alt="blogBanner"
                src={mainImage}
                width={1280}
                height={1280}
                className="w-full h-full object-cover z-20"
              />
              <input
                id="selectorMain"
                type="file"
                accept=".png, .jpg, .jpeg, .webp"
                hidden
                onChange={upload}
              />
            </label>
          </div>
        </div>
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
      </div>
      <div className="w-full ">
        <div className="relative w-full h-full flex justify-center">
          <div className="absolute  z-10 bg-red-100 p-5 mx-5 rounded-md mt-10">
            {mainImage !== "/images/product-placeholder-minimalist.jpg" ? (
              <Image
                id="blogImage"
                alt="blogBanner"
                src={mainImage}
                width={1280}
                height={1280}
                className=" w-[400px] h-[400px] rounded-t-md"
              />
            ) : (
              ""
            )}
            {body.length > 0 ? (
              <div className="bg-slate-100 text-black text-sm p-1 rounded-b-md">
                {body}
              </div>
            ) : (
              <div className="bg-slate-100 text-black text-sm p-1 rounded-b-md">
                ¡OFERTA - Por Tiempo Limitado! ¡No te pierdas esta oportunidad
                única! Aprovecha nuestras increíbles ofertas antes de que se
                acaben. ¡Solo por tiempo limitado! 🔥 👉 ¡Haz clic aquí para más
                detalles y asegura tu descuento! #OfertaEspecial #TiempoLimitado
                ¿Listo para ahorrar? ¡Contáctanos ahora! 🚀
              </div>
            )}
          </div>
          <Image
            id="WAWallPaper"
            alt="WAWallPaper"
            src={"/images/WAWallpaper.jpeg"}
            width={735}
            height={1593}
            className="w-full h-full absolute object-cover z-1"
          />
        </div>
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
    </div>
  );
}

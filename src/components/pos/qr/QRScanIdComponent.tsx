"use client";
import React, { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { usePathname, useRouter } from "next/navigation";
import "./qrstyles.scss";
import { useDebounce } from "use-debounce";
import { FaQrcode } from "react-icons/fa6";

// Define type for scan result
type ScanResult = string | null;

const QRScanIdComponent: React.FC = () => {
  const [scanResult, setScanResult] = useState<ScanResult>(null);
  const pathname = usePathname();
  const initialRender = useRef<boolean>(true);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [text, setText] = useState<string>("");
  const [query] = useDebounce<string>(text, 750);
  const router = useRouter();

  useEffect(() => {
    // Create the scanner instance with verbose set to false
    const scanner = new Html5QrcodeScanner(
      "reader",
      {
        qrbox: {
          width: 500,
          height: 500,
        },
        fps: 10,
      },
      false
    );

    const success = (result: string) => {
      const parts = result.split(/[-']/)[0];
      const variationId = parts;
      setScanResult(variationId);
      scanner.clear();
    };

    const error = (err: any) => {
      console.warn(err);
    };

    scanner.render(success, error);

    return () => {
      scanner.clear();
    };
  }, []);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }

    if (scanResult) {
      if (pathname.includes("admin")) {
        router.push(`/admin/pos/scanid/${scanResult}`);
      } else if (pathname.includes("puntodeventa")) {
        router.push(`/puntodeventa/scanid/${scanResult}`);
      } else if (pathname.includes("socials")) {
        router.push(`/socials/scanid/${scanResult}`);
      }
    }

    if (!query) {
      console.log("no hay resultados");
    } else {
      const id_part = text.split(/[-']/)[0];
      if (pathname.includes("admin")) {
        router.push(`/admin/pos/scanid/${id_part}`);
      } else if (pathname.includes("puntodeventa")) {
        router.push(`/puntodeventa/scanid/${id_part}`);
      } else if (pathname.includes("socials")) {
        router.push(`/socials/scanid/${id_part}`);
      }
    }
    //eslint-disable-next-line
  }, [scanResult, query]);

  return (
    <div className="container flex flex-col h-screen items-center justify-start mt-2 mx-auto">
      <div className="flex flex-row w-full items-center justify-center">
        <h2 className="text-slate-700 text-center w-full uppercase font-semibold tracking-wide text-2xl font-EB_Garamond">
          Identificador de Artículos
        </h2>
      </div>
      <div className="relative rounded-md shadow-sm w-full">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <FaQrcode className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </div>
        <input
          ref={inputRef}
          value={text}
          placeholder="Esperando Escaneo..."
          onChange={(e) => setText(e.target.value)}
          className="block w-full rounded-md border-0 py-1.5 pl-10 maxsm:pl-1 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
        />
      </div>
      <div className="flex flex-row items-start justify-center text-center mt-8 gap-5 px-10">
        <div className="card w-full">
          <hr className="border border-slate-300 my-3" />
          {scanResult && scanResult !== null ? (
            <div>
              Success:{" "}
              <a
                href={`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/${scanResult}`}
              >{`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/${scanResult}`}</a>
            </div>
          ) : (
            <div
              id="reader"
              className="w-[500px] min-h-[500px] maxsm:w-[200px] maxsm:h-[250px]"
            ></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QRScanIdComponent;

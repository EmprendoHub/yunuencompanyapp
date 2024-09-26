"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { useDropzone, DropzoneOptions, FileRejection } from "react-dropzone";
import { FaWindowClose, FaArrowUp } from "react-icons/fa";
import { cstDateTimeClient } from "@/backend/helpers";
import { useRouter } from "next/navigation";
import { addNewPost } from "@/app/_actions";

interface ValidationError {
  [key: string]: {
    _errors: string[];
  };
}

const NewPostComponent = () => {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [rejected, setRejected] = useState<FileRejection[]>([]);
  const available_categories = [
    "Moda",
    "Estilo",
    "Tendencias",
    "Esenciales",
    "Salud",
  ];
  const [title, setTitle] = useState<string>("");
  const [summary, setSummary] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [category, setCategory] = useState<string>("Moda");
  const [createdAt, setCreatedAt] = useState<string>(
    cstDateTimeClient().toLocaleString()
  );
  const [validationError, setValidationError] =
    useState<ValidationError | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      if (acceptedFiles.length > 0) {
        setFiles((previousFiles) => [
          ...previousFiles,
          ...acceptedFiles.map(
            (file) =>
              Object.assign(file, {
                preview: URL.createObjectURL(file),
              }) as File
          ),
        ]);
      }

      if (rejectedFiles?.length) {
        setRejected((previousFiles) => [...previousFiles, ...rejectedFiles]);
      }
    },
    []
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/*": [],
    },
    maxSize: 1024 * 1000,
    maxFiles: 3,
    onDrop,
  });

  useEffect(() => {
    // Revoke the data uris to avoid memory leaks
    return () =>
      files.forEach((file: any) => URL.revokeObjectURL(file.preview));
  }, [files]);

  const removeFile = (name: any) => {
    setFiles((files) => files.filter((file: any) => file.name !== name));
  };

  const removeAll = () => {
    setFiles([]);
    setRejected([]);
  };

  const removeRejected = (name: any) => {
    setRejected((files) => files.filter((file: any) => file.name !== name));
  };

  async function action() {
    const file = files[0];
    if (!file) {
      const noFileError: any = {
        images: { _errors: ["Se requiere una imagen "] },
      };
      setValidationError(noFileError);
      return;
    }
    if (!title) {
      const noTitleError: any = {
        title: { _errors: ["Se requiere un titulo "] },
      };
      setValidationError(noTitleError);
      return;
    }
    if (!content) {
      const noContentError: any = {
        content: { _errors: ["Se requiere contenido "] },
      };
      setValidationError(noContentError);
      return;
    }
    if (!summary) {
      const noSummaryError: any = {
        summary: { _errors: ["Se requiere un resumen breve "] },
      };
      setValidationError(noSummaryError);
      return;
    }

    const imageFormData = new FormData();
    files.forEach((file) => {
      imageFormData.append("images", file);
    });
    const endpoint = `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/minio`;
    const data = await fetch(endpoint, {
      method: "POST",
      headers: {
        Type: "posts",
      },
      body: imageFormData,
    }).then((res) => res.json());

    let images: any[] = [];
    await data.images.forEach((element: any) => {
      images.push(element);
    });

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("category", category);
    formData.append("summary", summary);
    formData.append("images", JSON.stringify(images));
    formData.append("createdAt", createdAt);
    // write to database using server actions

    const result: any = await addNewPost(formData);
    if (result?.error) {
      setValidationError(result.error);
    } else {
      setValidationError(null);
      //reset the form
      formRef.current?.reset();
      router.push("/admin/blog");
    }
  }
  const handleCategoryChange = async (e: any) => {
    setCategory(e);
  };

  return (
    <main className="w-full pl-4 maxsm:pl-0">
      <section className="w-full ">
        <h1 className="text-xl maxmd:text-3xl font-semibold text-foreground mb-8">
          Crear Nueva Publicación
        </h1>

        <form action={action} ref={formRef}>
          <div className="gap-y-5 flex-col flex px-2 w-full">
            <div className="mb-4">
              <label className="block mb-1"> Titulo de la Publicación</label>
              <input
                type="text"
                className="appearance-none border bg-gray-100 rounded-md py-2 px-3 border-gray-300 focus:outline-none focus:border-gray-400 w-full"
                placeholder="Titulo de la Publicación"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                name="title"
              />
              {validationError?.title && (
                <p className="text-sm text-red-400">
                  {validationError.title._errors.join(", ")}
                </p>
              )}
            </div>
            <div className="mb-4">
              <label className="block mb-1"> Contenido </label>
              <textarea
                rows={10}
                className="appearance-none border  bg-gray-100 rounded-md py-2 px-3 border-gray-300 focus:outline-none focus:border-gray-400 w-full"
                placeholder="Contenido de la Publicación"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                name="content"
              ></textarea>
              {validationError?.content && (
                <p className="text-sm text-red-400">
                  {validationError.content._errors.join(", ")}
                </p>
              )}
            </div>
            <div className="mb-4">
              <label className="block mb-1"> Resumen del Publicación</label>
              <input
                type="text"
                className="appearance-none border bg-gray-100 rounded-md py-2 px-3 border-gray-300 focus:outline-none focus:border-gray-400 w-full"
                placeholder="Resumen del Publicación"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                name="summary"
              />
              {validationError?.summary && (
                <p className="text-sm text-red-400">
                  {validationError.summary._errors.join(", ")}
                </p>
              )}
            </div>
          </div>

          <div className="flex-col flex justify-start px-2 gap-y-5">
            <div className="mb-4">
              <label className="block mb-1"> Categoría </label>
              <div className="relative">
                <select
                  className="block appearance-none border border-gray-300 bg-gray-100 rounded-md py-2 px-3 focus:outline-none focus:border-gray-400 w-full"
                  name="category"
                  onChange={(e) => handleCategoryChange(e.target.value)}
                >
                  {available_categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                {validationError?.category && (
                  <p className="text-sm text-red-400">
                    {validationError.category._errors.join(", ")}
                  </p>
                )}
                <i className="absolute inset-y-0 right-0 p-2 text-gray-400">
                  <svg
                    width="22"
                    height="22"
                    className="fill-current"
                    viewBox="0 0 20 20"
                  >
                    <path d="M7 10l5 5 5-5H7z"></path>
                  </svg>
                </i>
              </div>
            </div>
          </div>

          <div {...getRootProps({})}>
            <input {...getInputProps({ name: "file" })} />

            <div className="flex flex-col items-center justify-center gap-4 min-h-44">
              <FaArrowUp className="h-5 w-5 fill-current" />
              {isDragActive ? (
                <p>Suelta los archivos aquí...</p>
              ) : (
                <p>
                  Arrastre y suelte archivos aquí, o haga clic para seleccionar
                  archivos
                </p>
              )}
              {validationError?.images && (
                <p className="text-sm text-red-400">
                  {validationError.images._errors.join(", ")}
                </p>
              )}
            </div>
          </div>

          {/* Preview */}
          <section className="mt-10">
            <div className="flex gap-4">
              <h2 className="title text-3xl font-semibold">Vista previa</h2>
              <button
                type="button"
                onClick={removeAll}
                className="mt-1 rounded-md border border-rose-400 px-3 text-[12px] font-bold uppercase tracking-wider text-stone-500 transition-colors hover:bg-rose-400 hover:text-white"
              >
                Eliminar todos los archivos
              </button>
            </div>
            {/* Accepted files */}
            <h3 className="title mt-10 border-b pb-3 text-lg font-semibold text-stone-600">
              Archivos aceptados
            </h3>
            <ul className="mt-6 grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
              {files.map((file: any) => (
                <li
                  key={file.name}
                  className="relative h-32 rounded-md shadow-lg"
                >
                  <Image
                    src={file.preview}
                    alt={file.name}
                    width={100}
                    height={100}
                    onLoad={() => {
                      URL.revokeObjectURL(file.preview);
                    }}
                    className="h-full w-full rounded-md object-contain"
                  />
                  <button
                    type="button"
                    className="absolute -right-3 -top-3 flex h-7 w-7 items-center justify-center rounded-full border border-rose-400 bg-rose-400 transition-colors hover:bg-background"
                    onClick={() => removeFile(file.name)}
                  >
                    <FaWindowClose className="h-5 w-5 fill-white transition-colors hover:fill-rose-400" />
                  </button>
                  <p className="mt-2 text-[12px] font-medium text-stone-500">
                    {file.name}
                  </p>
                </li>
              ))}
            </ul>

            {/* Rejected Files */}
            <h3 className="title mt-24 border-b pb-3 text-lg font-semibold text-stone-600">
              Archivos rechazados
            </h3>
            <ul className="mt-6 flex flex-col">
              {rejected.map(({ file, errors }) => (
                <li
                  key={file.name}
                  className="flex items-start justify-between"
                >
                  <div>
                    <p className="mt-2 text-sm font-medium text-stone-500">
                      {file.name}
                    </p>
                    <ul className="text-[12px] text-red-400">
                      {errors.map((error) => (
                        <li key={error.code}>{error.message}</li>
                      ))}
                    </ul>
                  </div>
                  <button
                    type="button"
                    className="mt-1 rounded-md border border-rose-400 px-3 py-1 text-[12px] font-bold uppercase tracking-wider text-stone-500 transition-colors hover:bg-rose-400 hover:text-white"
                    onClick={() => removeRejected(file.name)}
                  >
                    remove
                  </button>
                </li>
              ))}
            </ul>
          </section>

          <button
            type="submit"
            className="my-2 px-4 py-2 text-center inline-block text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 w-full"
          >
            Guardar Publicación
          </button>
        </form>
      </section>
    </main>
  );
};

export default NewPostComponent;

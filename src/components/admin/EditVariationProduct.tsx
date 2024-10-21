"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { cstDateTimeClient } from "@/backend/helpers";
import { updateRevalidateProduct } from "@/app/_actions";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import ToggleSwitch from "../forms/ToggleSwitch";

export interface ValidationError {
  [key: string]: {
    _errors: string[];
  };
}

const EditVariationProduct = ({
  product,
  currentCookies,
  branchId,
  branches,
}: {
  product: any;
  currentCookies: string;
  branchId: string;
  branches: any[];
}) => {
  const getPathname = usePathname();
  let pathname: string = "";
  if (getPathname.includes("admin")) {
    pathname = "admin";
  } else if (getPathname.includes("puntodeventa")) {
    pathname = "puntodeventa";
  }
  const searchParams = useSearchParams();
  const searchValue = searchParams.get("callback");
  const [callBack, setCallBack] = useState<string>("");

  useEffect(() => {
    if (searchValue !== null) {
      setCallBack(searchValue);
    } else {
      setCallBack(""); // or any default value you prefer
    }
  }, [searchValue]);

  const router = useRouter();
  const [title, setTitle] = useState(product?.title);
  const [isSending, setIsSending] = useState(false);
  const [featured, setFeatured] = useState(product?.featured);
  const [branchAvailability, setBranchAvailability] = useState(
    product?.availability?.branch
  );

  const [updatedAt, setUpdatedAt] = useState(
    cstDateTimeClient().toLocaleString()
  );

  const [validationError, setValidationError] =
    useState<ValidationError | null>(null);

  const [mainImage, setMainImage] = useState(product?.images[0].url);

  const [variations, setVariations] = useState(product?.variations);

  console.log("variations", variations);

  const handlePriceChange = (index: number, newPrice: string) => {
    const newVariations = [...variations];
    newVariations[index].price = newPrice;
    setVariations(newVariations);
  };

  const handleCostChange = (index: number, newCost: string) => {
    const newVariations = [...variations];
    newVariations[index].cost = newCost;
    setVariations(newVariations);
  };

  const handleStockChange = (
    variationIndex: number,
    branchId: string,
    newStock: string
  ) => {
    const updatedVariations = [...variations];
    const variationStockIndex = updatedVariations[
      variationIndex
    ].stock.findIndex((stockItem: any) => stockItem.branch === branchId);

    if (variationStockIndex >= 0) {
      // Update the existing stock for the branch
      updatedVariations[variationIndex].stock[variationStockIndex].amount =
        parseInt(newStock);
    } else {
      // Add new stock for the branch
      updatedVariations[variationIndex].stock.push({
        branch: branchId,
        amount: parseInt(newStock),
      });
    }

    setVariations(updatedVariations);
  };

  // generate a pre-signed URL for use in uploading that file:
  async function retrieveNewURL(
    file: File,
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

  // ***************** main images //
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
          compressAndOptimizeMainImage(file, url, section);
        });
      }
    }
  };

  async function compressAndOptimizeMainImage(
    file: Blob | MediaSource,
    url: any,
    section: any
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
      uploadFile(blobData, url, section);
    };
  }

  // to upload this file to S3 at `https://minio.salvawebpro.com:9000` using the URL:
  async function uploadFile(
    blobData: Blob,
    url: any | URL | Request,
    section: string
  ) {
    fetch(url, {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      method: "PUT",
      body: blobData,
    })
      .then(() => {
        // If multiple files are uploaded, append upload status on the next line.
        // document.querySelector(
        //   '#status'
        // ).innerHTML += `<br>Uploaded ${file.name}.`;
        const newUrl = url.split("?");
        if (section === "selectorMain") {
          setMainImage(newUrl[0]);
        }
      })
      .catch((e) => {
        console.error(e);
      });
  }

  async function hanldeFormSubmit(e: any) {
    e.preventDefault();
    if (
      !mainImage ||
      mainImage === "/images/product-placeholder-minimalist.jpg"
    ) {
      const noMainImageError = {
        mainImage: { _errors: ["Se requiere una imagen "] },
      };
      setValidationError(noMainImageError);
      return;
    }
    if (!title) {
      const noTitleError = { title: { _errors: ["Se requiere un titulo "] } };
      setValidationError(noTitleError);
      return;
    }

    if (!variations[0]?.cost) {
      const noCostError = {
        cost: { _errors: ["Se requiere un costo de producto "] },
      };
      setValidationError(noCostError);
      return;
    }
    if (!variations[0]?.price) {
      const noPriceError = {
        price: { _errors: ["Se requiere un precio de producto "] },
      };
      setValidationError(noPriceError);
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("featured", featured);
    formData.append("branchAvailability", branchAvailability);
    formData.append("mainImage", mainImage);
    formData.append("variations", JSON.stringify(variations));
    formData.append("updatedAt", updatedAt);
    formData.append("_id", product?._id);
    formData.append("branchId", branchId);
    // write to database using server actions

    setIsSending(true);
    const endpoint = `/api/newproduct`;
    const result: any = await fetch(endpoint, {
      method: "PUT",
      headers: {
        Cookie: currentCookies,
      },
      body: formData,
    });

    if (result?.error) {
      setValidationError(result.error);
      setIsSending(false);
    } else {
      setValidationError(null);
      //reset the form

      //formRef.current.reset();
      await updateRevalidateProduct();
      router.push(`/${pathname}/productos?&page=${callBack}`);
    }
  }

  return (
    <main className="w-full p-4 maxsm:p-2 bg-background">
      {!isSending ? (
        <div className="flex flex-col items-start gap-5 justify-start w-full">
          <section className="w-full ">
            <div className="flex flex-row maxmd:flex-col items-center justify-between">
              <h1 className="w-full text-2xl font-semibold text-foreground mb-8 font-EB_Garamond">
                Actualizar Producto Con Variaciones
              </h1>
              {/* Availability */}
              <div className="mb-4 w-full flex flex-row gap-4 items-center uppercase">
                <ToggleSwitch
                  label="Destacado"
                  enabled={featured}
                  setEnabled={setFeatured}
                />

                <ToggleSwitch
                  label="Sucursal"
                  enabled={branchAvailability}
                  setEnabled={setBranchAvailability}
                />
              </div>
            </div>

            <div className="flex flex-row maxmd:flex-col items-start gap-3 justify-between w-full">
              <div className="gap-y-1 flex-col flex px-2 w-full">
                {/*  Imagen principal del Producto */}
                <div className="relative hover:opacity-80 bg-background border-4 border-gray-300">
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

                    {validationError?.mainImage && (
                      <p className="text-sm text-red-400">
                        {validationError.mainImage._errors.join(", ")}
                      </p>
                    )}
                  </label>
                </div>
              </div>

              <div className="w-full flex-col flex justify-start px-2 gap-y-2">
                <div className="mb-1">
                  <label className="block mb-1  font-EB_Garamond">
                    Titulo del Producto
                  </label>
                  <input
                    type="text"
                    className="appearance-none border bg-gray-100 rounded-md py-2 px-3 border-gray-300 focus:outline-none focus:border-gray-400 w-full"
                    placeholder="Nombre de Producto"
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

                <div className="mb-4 w-full">
                  <label className="block mb-1  font-EB_Garamond">Precio</label>
                  <div className="relative">
                    <div className="col-span-2">
                      <input
                        type="number"
                        className="appearance-none border border-gray-300 bg-gray-100 rounded-md pl-2 remove-arrow  focus:outline-none focus:border-gray-400 w-full"
                        placeholder="0.00"
                        min="1"
                        value={variations[0]?.price}
                        onChange={(e) => handlePriceChange(0, e.target.value)}
                        name="price"
                      />
                      {validationError?.price && (
                        <p className="text-sm text-red-400">
                          {validationError.price._errors.join(", ")}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mb-4 w-full">
                  <label className="block mb-1 font-EB_Garamond"> Costo </label>
                  <div className="relative">
                    <div className="col-span-2">
                      <input
                        type="number"
                        className="appearance-none border border-gray-300 bg-gray-100 rounded-md pl-2 remove-arrow focus:outline-none focus:border-gray-400 w-full"
                        placeholder="0.00"
                        min="1"
                        value={variations[0]?.cost}
                        onChange={(e) => handleCostChange(0, e.target.value)}
                        name="cost"
                      />
                      {validationError?.cost && (
                        <p className="text-sm text-red-400">
                          {validationError.cost._errors.join(", ")}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stock per Branch */}
            <div className="w-full main-variation flex maxsm:flex-col items-center">
              <div className="flex flex-col items-center gap-3 w-2/3  maxsm:w-full">
                <div className="mb-4 w-full">
                  {variations.map((variation: any, variationIndex: number) => (
                    <div key={variationIndex}>
                      <h3>{variation.title}</h3>
                      <div>
                        {branches.map((branch: any) => (
                          <div key={branch._id}>
                            <label
                              htmlFor={`stock-${variationIndex}-${branch._id}`}
                            >
                              Stock for {branch.name}:
                            </label>
                            <input
                              id={`stock-${variationIndex}-${branch._id}`}
                              type="number"
                              value={
                                variation.stock.find(
                                  (stockItem: any) =>
                                    stockItem.branch === branch._id
                                )?.amount || ""
                              }
                              onChange={(e) =>
                                handleStockChange(
                                  variationIndex,
                                  branch._id,
                                  e.target.value
                                )
                              }
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button
              disabled={isSending}
              onClick={hanldeFormSubmit}
              className={`${
                isSending ? "cursor-wait" : ""
              } my-2 cursor-pointer px-4 py-2 text-center inline-block text-white bg-black border border-transparent rounded-md hover:bg-slate-800 w-full`}
            >
              {isSending ? "Actualizando..." : "Actualizar"}
            </button>
          </section>
        </div>
      ) : (
        <section className="w-full min-h-screen">
          <div className="flex flex-col items-center justify-center min-h-screen w-full">
            <span className="loader"></span>
            <h2 className="text-sm">Actualizando producto...</h2>
          </div>
        </section>
      )}
    </main>
  );
};

export default EditVariationProduct;

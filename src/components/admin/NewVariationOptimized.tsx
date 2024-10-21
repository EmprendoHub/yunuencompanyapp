"use client";
import React, { useState } from "react";
import Image from "next/image";
import { cstDateTimeClient } from "@/backend/helpers";
import { updateRevalidateProduct } from "@/app/_actions";
import { usePathname, useRouter } from "next/navigation";
import ToggleSwitch from "../forms/ToggleSwitch";
import { ValidationError } from "./EditVariationProduct";

const NewVariationOptimized = ({
  currentCookies,
  branchId,
  branches,
}: {
  currentCookies: string;
  branchId: string;
  branches: any[];
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [title, setTitle] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [brand, setBrand] = useState("");
  const [branchAvailability, setBranchAvailability] = useState(true);
  const [socialsAvailability, setSocialsAvailability] = useState(false);
  const [onlineAvailability, setOnlineAvailability] = useState(false);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Moda");
  const [tags, setTags] = useState([]);
  const [gender, setGender] = useState("Damas");
  const [featured, setFeatured] = useState(false);
  const [createdAt, setCreatedAt] = useState(
    cstDateTimeClient().toLocaleString()
  );
  const [salePrice, setSalePrice] = useState(0);
  const [salePriceEndDate, setSalePriceEndDate] = useState("");
  const [validationError, setValidationError] =
    useState<ValidationError | null>(null);

  const [mainImage, setMainImage] = useState(
    "/images/product-placeholder-minimalist.jpg"
  );

  const [mainVariation, setMainVariation] = useState(
    "/images/product-placeholder-minimalist.jpg"
  );

  const [variations, setVariations] = useState([
    {
      size: "",
      color: "",
      colorHex: "",
      colorHexTwo: "",
      colorHexThree: "",
      price: 0,
      cost: 0,
      stock: [{ branch: branches[0]._id, amount: 0 }],
      image: "/images/product-placeholder-minimalist.jpg",
    },
  ]);

  const handlePriceChange = (index: number, newPrice: string | number) => {
    const newVariations: any = [...variations];
    newVariations[index].price = newPrice;
    setVariations(newVariations);
  };

  const handleCostChange = (index: number, newCost: string | number) => {
    const newVariations: any = [...variations];
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
          setVariations([
            {
              size: variations[0].size,
              color: variations[0].color,
              colorHex: variations[0].colorHex,
              colorHexTwo: variations[0].colorHexTwo,
              colorHexThree: variations[0].colorHexThree,
              price: variations[0].price,
              cost: variations[0].cost,
              stock: variations[0].stock,
              image: `${newUrl[0]}`,
            },
          ]);
        }
        if (section === "selectorVarOne") {
          setMainVariation(newUrl[0]);
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

    if (!variations[0].cost) {
      const noCostError = {
        cost: { _errors: ["Se requiere un costo de producto "] },
      };
      setValidationError(noCostError);
      return;
    }
    if (!variations[0].price) {
      const noPriceError = {
        price: { _errors: ["Se requiere un precio de producto "] },
      };
      setValidationError(noPriceError);
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append(
      "featured",
      featured !== undefined ? featured.toString() : ""
    );
    formData.append(
      "branchAvailability",
      branchAvailability !== undefined ? branchAvailability.toString() : ""
    );
    formData.append(
      "socialsAvailability",
      socialsAvailability !== undefined ? socialsAvailability.toString() : ""
    );
    formData.append(
      "onlineAvailability",
      onlineAvailability !== undefined ? onlineAvailability.toString() : ""
    );
    formData.append("brand", brand);
    formData.append("gender", gender);
    formData.append("mainImage", mainImage);
    formData.append("variations", JSON.stringify(variations));
    formData.append("tags", JSON.stringify(tags));
    formData.append(
      "salePrice",
      salePrice !== undefined ? salePrice.toString() : ""
    );
    formData.append("salePriceEndDate", salePriceEndDate);
    formData.append("createdAt", createdAt);
    formData.append("branchId", branchId);

    // write to database using server actions

    //const result = await addVariationProduct(formData);
    // const result = await updateVariationProduct(formData);
    const endpoint = `/api/newproduct`;
    setIsSending(true);
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Cookie: currentCookies,
      },
      body: formData,
    });

    if (!response?.ok) {
      if (response.status === 409) {
        setValidationError({
          response: {
            _errors: ["Este Titulo de producto ya esta en uso"],
          },
        });
      }

      setIsSending(false);
    } else if (response?.ok) {
      setValidationError(null);

      await updateRevalidateProduct();
      if (pathname.includes("puntodeventa")) {
        router.push("/puntodeventa/productos");
      } else if (pathname.includes("admin")) {
        router.push("/admin/productos");
      }
    }
  }

  return (
    <main className="w-full p-4 maxsm:p-2 bg-card text-sm">
      {!isSending ? (
        <div className="flex flex-col items-start gap-5 justify-start w-full">
          <section className={`w-full ${!isSending ? "" : "grayscale"}`}>
            <h1 className="w-full text-xl font-semibold text-foreground mb-8 font-EB_Garamond">
              Nuevo Producto
            </h1>
            <div className="flex flex-row maxmd:flex-col items-start gap-2 justify-between w-full">
              <div className="flex flex-col items-start justify-center">
                <div className="flex flex-row maxmd:flex-col items-center justify-between w-full">
                  {/* Availability */}
                  <div className="mb-4 w-full flex flex-row gap-4 items-center pl-3 uppercase">
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

                      {validationError?.mainImage && (
                        <p className="text-sm text-red-400">
                          {validationError.mainImage._errors.join(", ")}
                        </p>
                      )}
                    </label>
                  </div>
                </div>
              </div>

              <div className="w-full flex-col flex justify-start px-2 gap-y-2">
                <div className="mb-1">
                  <p className="text-red-700">
                    {" "}
                    {validationError?.response?._errors.join(", ")}
                  </p>
                  <input
                    type="text"
                    className="appearance-none border bg-card text-card-foreground rounded-md py-2 px-3 border-gray-300 focus:outline-none focus:border-gray-400 w-full"
                    placeholder="Titulo de Producto"
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
                  <label className="block mb-1  font-EB_Garamond text-xs">
                    Precio
                  </label>
                  <div className="relative">
                    <div className="col-span-2">
                      <input
                        type="number"
                        className="appearance-none border border-gray-300 bg-card text-card-foreground rounded-md pl-2 py-1 remove-arrow focus:outline-none focus:border-gray-400 w-full"
                        placeholder="0.00"
                        min="1"
                        value={variations[0].price}
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
                  <label className="block mb-1 font-EB_Garamond text-xs">
                    {" "}
                    Costo{" "}
                  </label>
                  <div className="relative">
                    <div className="col-span-2">
                      <input
                        type="number"
                        className="appearance-none border border-gray-300 bg-card text-card-foreground rounded-md pl-2 py-1 remove-arrow focus:outline-none focus:border-gray-400 w-full"
                        placeholder="0.00"
                        min="1"
                        value={variations[0].cost}
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

            {/* Render additional variations */}
            {variations.map((variation: any, variationIndex: number) => (
              <div key={variationIndex}>
                <h3>{variation.title}</h3>
                <div>
                  {branches.map((branch: any) => (
                    <div key={branch._id}>
                      <label htmlFor={`stock-${variationIndex}-${branch._id}`}>
                        Existencias {branch.name}:
                      </label>
                      <input
                        id={`stock-${variationIndex}-${branch._id}`}
                        className="appearance-none border border-gray-300 bg-card text-card-foreground rounded-md pl-2 py-1 remove-arrow focus:outline-none focus:border-gray-400 w-full"
                        placeholder="0.00"
                        min="1"
                        type="number"
                        value={
                          variation.stock.find(
                            (stockItem: any) => stockItem.branch === branch._id
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

            <button
              disabled={isSending}
              onClick={hanldeFormSubmit}
              className={`${
                isSending ? "cursor-wait" : ""
              } my-2 cursor-pointer px-4 py-2 text-center inline-block text-white bg-black border border-transparent rounded-md hover:bg-slate-800 w-full`}
            >
              {isSending ? "Creando..." : "Crear Producto"}
            </button>
          </section>
        </div>
      ) : (
        <section className="w-full min-h-screen">
          <div className="flex flex-col items-center justify-center min-h-screen w-full">
            <span className="loader"></span>
            <h2 className="text-sm">Creando producto...</h2>
          </div>
        </section>
      )}
    </main>
  );
};

export default NewVariationOptimized;

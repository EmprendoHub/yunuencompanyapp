"use client";
import React, { useState, useRef } from "react";
import Image from "next/image";
import DateTimePicker from "react-datetime-picker";
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";
import { cstDateTimeClient } from "@/backend/helpers";
import { addVariationProduct } from "@/app/_actions";
import { useRouter } from "next/navigation";
import {
  set_colors,
  sizes_prendas,
  sizes_shoes_men,
  sizes_shoes_woman,
  product_categories,
  genders,
  blog_categories,
} from "@/backend/data/productData";
import MultiselectTagComponent from "../forms/MultiselectTagComponent";
import { ValidationError } from "./EditVariationProduct";

const NewVariationProduct = () => {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [title, setTitle] = useState("");
  const [brand, setBrand] = useState("");
  const [branchAvailability, setBranchAvailability] = useState("");
  const [instagramAvailability, setInstagramAvailability] = useState("");
  const [onlineAvailability, setOnlineAvailability] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Moda");
  const [tags, setTags] = useState([]);
  const [gender, setGender] = useState("Damas");
  const [featured, setFeatured] = useState("No");
  const [createdAt, setCreatedAt] = useState(
    cstDateTimeClient().toLocaleString()
  );
  const [salePrice, setSalePrice] = useState("");
  const [salePriceEndDate, setSalePriceEndDate] = useState("");
  const [sizeSelection, setSizeSelection] = useState(sizes_prendas);
  const [tagSelection, setTagSelection] = useState(blog_categories);
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
      price: 0,
      cost: 0,
      stock: 1,
      image: "/images/product-placeholder-minimalist.jpg",
    },
  ]);

  const addVariation = () => {
    setVariations((prevVariations) => [
      ...prevVariations,
      {
        size: "",
        color: "",
        price: prevVariations[0].price,
        cost: prevVariations[0].cost,
        stock: 1,
        image: prevVariations[0].image,
      },
    ]);
  };

  const removeVariation = (indexToRemove: number) => {
    setVariations((prevVariations) =>
      prevVariations.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleSizeChange = (index: number, newSize: string) => {
    const newVariations = [...variations];
    newVariations[index].size = newSize;
    setVariations(newVariations);
  };

  const handleColorChange = (index: number, newColor: string) => {
    const newVariations = [...variations];
    newVariations[index].color = newColor;
    setVariations(newVariations);
  };

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

  const handleStockChange = (index: number, newStock: string) => {
    const newVariations: any = [...variations];
    newVariations[index].stock = newStock;
    setVariations(newVariations);
  };

  const handleImageChange = async (index: number, newImage: File) => {
    // Retrieve a URL from our server.
    await retrieveNewURL(newImage, (file: any, url: string) => {
      const parsed = JSON.parse(url);
      url = parsed.url;
      // Upload the file to the server.
      uploadVariationFile(file, url, index);
    });
  };

  // generate a pre-signed URL for use in uploading that file:
  async function retrieveNewURL(file: any, cb: any) {
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

  // to upload this file to S3 at `https://minio.salvawebpro.com:9000` using the URL:
  async function uploadVariationFile(file: any, url: string, index: number) {
    fetch(url, {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      method: "PUT",
      body: file,
    })
      .then(() => {
        const newUrl = url.split("?");
        const newVariations = [...variations];
        newVariations[index].image = newUrl[0];
        setVariations(newVariations);
      })
      .catch((e) => {
        console.error(e);
      });
  }

  // functions
  const upload = async (e: any) => {
    // Get selected files from the input element.
    let files = e?.target.files;
    let section = e?.target.id;
    if (files) {
      for (var i = 0; i < files?.length; i++) {
        var file = files[i];
        // Retrieve a URL from our server.
        retrieveNewURL(file, (file: any, url: string) => {
          const parsed = JSON.parse(url);
          url = parsed.url;
          // Upload the file to the server.
          uploadFile(file, url, section);
        });
      }
    }
  };

  // to upload this file to S3 at `https://minio.salvawebpro.com:9000` using the URL:
  async function uploadFile(file: any, url: string, section: string) {
    fetch(url, {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      method: "PUT",
      body: file,
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
              size: "",
              color: "",
              price: 0,
              cost: 0,
              stock: 1,
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

  async function action() {
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
    if (!description) {
      const noDescriptionError = {
        description: { _errors: ["Se requiere descripción "] },
      };
      setValidationError(noDescriptionError);
      return;
    }
    if (!brand) {
      const noBrandError = {
        brand: { _errors: ["Se requiere un Marca "] },
      };
      setValidationError(noBrandError);
      return;
    }
    if (!tags) {
      const noTagsError = {
        tags: { _errors: ["Se requiere mínimo una etiqueta "] },
      };
      setValidationError(noTagsError);
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
    if (!variations[0].size) {
      const noSizesError = {
        sizes: { _errors: ["Se requiere una talla o tamaño "] },
      };
      setValidationError(noSizesError);
      return;
    }
    if (!variations[0].color) {
      const noColorsError = {
        colors: { _errors: ["Se requiere un color "] },
      };
      setValidationError(noColorsError);
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("featured", featured);
    formData.append("branchAvailability", branchAvailability.toString());
    formData.append("instagramAvailability", instagramAvailability.toString());
    formData.append("onlineAvailability", onlineAvailability.toString());
    formData.append("brand", brand);
    formData.append("gender", gender);
    formData.append("mainImage", mainImage);
    formData.append("variations", JSON.stringify(variations));
    formData.append("tags", JSON.stringify(tags));
    formData.append("salePrice", salePrice.toString());
    formData.append("salePriceEndDate", salePriceEndDate);
    formData.append("createdAt", createdAt);
    // write to database using server actions

    const result: any = await addVariationProduct(formData);
    if (result?.error) {
      setValidationError(result.error);
    } else {
      setValidationError(null);
      //reset the form
      formRef.current?.reset();
      router.push("/admin/productos");
    }
  }
  const handleCategoryChange = async (e: any) => {
    setCategory(e);
    if (e === "Calzado" && gender == "Damas") {
      setSizeSelection(sizes_shoes_woman);
    } else {
      setSizeSelection(sizes_shoes_men);
    }

    if (
      e === "Prendas" ||
      e === "Bolsas" ||
      e === "Accesorios" ||
      e === "Belleza" ||
      e === "Joyeria"
    ) {
      setSizeSelection(sizes_prendas);
    }
  };

  const handleAddTagField = (option: any) => {
    setTags(option);
  };

  function onChangeDate(date: any) {
    setSalePriceEndDate(date);
  }

  const handleGenderChange = async (e: any) => {
    setGender(e);
    if (category === "Calzado" && e == "Damas") {
      setSizeSelection(sizes_shoes_woman);
    } else {
      setSizeSelection(sizes_shoes_men);
    }

    if (
      category === "Prendas" ||
      category === "Bolsas" ||
      category === "Accesorios" ||
      category === "Belleza" ||
      category === "Joyeria"
    ) {
      setSizeSelection(sizes_prendas);
    }
  };

  return (
    <main className="w-full p-4 maxsm:p-2 bg-slate-200">
      <form
        action={action}
        ref={formRef}
        className="flex flex-col items-start gap-5 justify-start w-full"
      >
        <section className="w-full ">
          <div className="flex flex-row maxmd:flex-col items-center justify-between">
            <h1 className="w-full text-xl font-semibold text-foreground mb-8 font-EB_Garamond">
              Nuevo Producto Con Variaciones
            </h1>

            <div className="mb-4 w-full flex flex-row gap-4 items-center uppercase">
              <div className="relative">
                <label className="block mb-1 font-EB_Garamond">destacado</label>
                <select
                  className="block appearance-none border border-gray-300 bg-gray-100 rounded-md py-2 px-3 focus:outline-none focus:border-gray-400 w-full"
                  name="featured"
                  onChange={(e) => setFeatured(e.target.value)}
                  value={featured}
                >
                  {[
                    { value: false, name: "No", uniqueKey: "featuredNO" },
                    { value: true, name: "Si", uniqueKey: "featuredYES" },
                  ].map((opt, index) => (
                    <option key={opt.uniqueKey} value={`${opt.value}`}>
                      {opt.name}
                    </option>
                  ))}
                </select>
                {validationError?.featured && (
                  <p className="text-sm text-red-400">
                    {validationError.featured._errors.join(", ")}
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
              <div className="relative">
                <label className="block mb-1 font-EB_Garamond">instagram</label>
                <select
                  className="block appearance-none border border-gray-300 bg-gray-100 rounded-md py-2 px-3 focus:outline-none focus:border-gray-400 w-full"
                  name="instagramAvailability"
                  onChange={(e) => setInstagramAvailability(e.target.value)}
                  value={instagramAvailability.toString()}
                >
                  {[
                    {
                      value: false,
                      name: "No",
                      uniqueKey: "instagramNO",
                    },
                    {
                      value: true,
                      name: "Si",
                      uniqueKey: "instagramYes",
                    },
                  ].map((opt) => (
                    <option key={opt.uniqueKey} value={`${opt.value}`}>
                      {opt.name}
                    </option>
                  ))}
                </select>

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
              <div className="relative">
                <label className="block mb-1 font-EB_Garamond">sucursal</label>
                <select
                  className="block appearance-none border border-gray-300 bg-gray-100 rounded-md py-2 px-3 focus:outline-none focus:border-gray-400 w-full"
                  name="branchAvailability"
                  onChange={(e) => setBranchAvailability(e.target.value)}
                  value={branchAvailability.toString()}
                >
                  {[
                    {
                      value: false,
                      name: "No",
                      uniqueKey: "branchNo",
                    },
                    {
                      value: true,
                      name: "Si",
                      uniqueKey: "branchYes",
                    },
                  ].map((opt) => (
                    <option key={opt.uniqueKey} value={`${opt.value}`}>
                      {opt.name}
                    </option>
                  ))}
                </select>

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
              <div className="relative">
                <label className="block mb-1 font-EB_Garamond">www</label>
                <select
                  className="block appearance-none border border-gray-300 bg-gray-100 rounded-md py-2 px-3 focus:outline-none focus:border-gray-400 w-full"
                  name="onlineAvailability"
                  onChange={(e) => setOnlineAvailability(e.target.value)}
                  value={onlineAvailability}
                >
                  {[
                    {
                      value: false,
                      name: "No",
                      uniqueKey: "onlineNo",
                    },
                    {
                      value: true,
                      name: "Si",
                      uniqueKey: "onlineYes",
                    },
                  ].map((opt) => (
                    <option key={opt.uniqueKey} value={`${opt.value}`}>
                      {opt.name}
                    </option>
                  ))}
                </select>

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

          <div className="flex flex-row maxmd:flex-col items-start gap-5 justify-between w-full">
            <div className="gap-y-1 flex-col flex px-2 w-full">
              {/* Section 1 - Title, Image */}
              <label className="block  font-EB_Garamond">
                Imagen principal
              </label>
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

            <div className="w-full flex-col flex justify-start px-2 gap-y-5">
              <div className="mb-4">
                <label className="block mb-1  font-EB_Garamond"> Titulo</label>
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
              <div className="mb-4">
                <label className="block mb-1  font-EB_Garamond">
                  {" "}
                  Description Corta
                </label>
                <textarea
                  rows={2}
                  className="appearance-none border  bg-gray-100 rounded-md py-2 px-3 border-gray-300 focus:outline-none focus:border-gray-400 w-full"
                  placeholder="Descripción del Producto"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  name="description"
                ></textarea>
                {validationError?.description && (
                  <p className="text-sm text-red-400">
                    {validationError.description._errors.join(", ")}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label className="block mb-1  font-EB_Garamond"> Marca</label>
                <input
                  type="text"
                  className="appearance-none border bg-gray-100 rounded-md py-2 px-3 border-gray-300 focus:outline-none focus:border-gray-400 w-full"
                  placeholder="Marca del Producto"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  name="brand"
                />
                {validationError?.brand && (
                  <p className="text-sm text-red-400">
                    {validationError.brand._errors.join(", ")}
                  </p>
                )}
              </div>
              <div className="mb-4 w-full">
                <label className="block mb-1 font-EB_Garamond"> Género </label>
                <div className="relative">
                  <select
                    className="block appearance-none border border-gray-300 bg-gray-100 rounded-md py-2 px-3 focus:outline-none focus:border-gray-400 w-full"
                    name="gender"
                    onChange={(e) => handleGenderChange(e.target.value)}
                  >
                    {genders?.map((gender) => (
                      <option key={gender.es} value={gender.es}>
                        {gender.es}
                      </option>
                    ))}
                  </select>
                  {validationError?.gender && (
                    <p className="text-sm text-red-400">
                      {validationError.gender._errors.join(", ")}
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

              <div className="mb-4 w-full">
                <label className="block mb-1 font-EB_Garamond">Etiquetas</label>
                <div className="relative">
                  <MultiselectTagComponent
                    options={tagSelection}
                    handleAddTagField={handleAddTagField}
                  />
                  {validationError?.tags && (
                    <p className="text-sm text-red-400">
                      {validationError.tags._errors.join(", ")}
                    </p>
                  )}
                </div>
              </div>
              <div className="mb-4 w-full">
                <label className="block mb-1 font-EB_Garamond">
                  {" "}
                  Categoría{" "}
                </label>
                <div className="relative">
                  <select
                    className="block appearance-none border border-gray-400 bg-gray-100 rounded-md py-2 px-3 focus:outline-none focus:border-gray-400 w-full"
                    name="category"
                    onChange={(e) => handleCategoryChange(e.target.value)}
                  >
                    {product_categories.map((category) => (
                      <option key={category.es} value={category.es}>
                        {category.es}
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

              <div className="mb-4 w-full flex gap-5 flex-row items-center justify-center">
                <div className="flex w-full flex-col">
                  <label className="block mb-1 font-EB_Garamond">
                    Precio de Oferta
                  </label>
                  <div className="relative">
                    <div className="col-span-2">
                      <input
                        type="number"
                        className="appearance-none border border-gray-300 bg-gray-100 rounded-md py-2 px-3focus:outline-none focus:border-gray-400 w-full"
                        placeholder="0.00"
                        min="0"
                        value={salePrice}
                        onChange={(e) => setSalePrice(e.target.value)}
                        name="salePrice"
                      />
                      {validationError?.salePrice && (
                        <p className="text-sm text-red-400">
                          {validationError.salePrice._errors.join(", ")}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mb-4 w-full h-full">
                  <label className="block mb-1 font-EB_Garamond">
                    Fecha de Fin de Oferta
                  </label>
                  <div className="flex flex-row items-center gap-x-3"></div>
                  <DateTimePicker
                    onChange={onChangeDate}
                    value={salePriceEndDate}
                    locale={"es-MX"}
                    minDate={cstDateTimeClient()}
                    className={"h-full"}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="w-[300px]">
            <div
              onClick={addVariation}
              className="my-2 px-4 py-2 text-center inline-block text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 w-full cursor-pointer"
            >
              Agregar Variación +
            </div>
          </div>
          <div className="w-full main-variation">
            <div className="flex flex-row maxsm:flex-col items-center gap-5">
              <div className="mb-4 w-full">
                <label className="block mb-1 font-EB_Garamond"> Talla </label>
                <div className="relative">
                  <select
                    onChange={(e) => handleSizeChange(0, e.target.value)}
                    className="appearance-none border border-gray-300 bg-gray-100 rounded-md py-2 px-3 focus:outline-none focus:border-gray-400 w-full"
                  >
                    {sizeSelection.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.value}
                      </option>
                    ))}
                  </select>
                  {validationError?.sizes && (
                    <p className="text-sm text-red-400">
                      {validationError.sizes._errors.join(", ")}
                    </p>
                  )}
                </div>
              </div>
              <div className="mb-4 w-full">
                <label className="block mb-1 font-EB_Garamond"> Color </label>
                <div className="relative">
                  <select
                    onChange={(e) => handleColorChange(0, e.target.value)}
                    className="appearance-none border border-gray-300 bg-gray-100 rounded-md py-2 px-3 focus:outline-none focus:border-gray-400 w-full"
                  >
                    {set_colors.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.value}
                      </option>
                    ))}
                  </select>
                  {validationError?.colors && (
                    <p className="text-sm text-red-400">
                      {validationError.colors._errors.join(", ")}
                    </p>
                  )}
                </div>
              </div>
              <div className="mb-4 w-full">
                <label className="block mb-1  font-EB_Garamond">Precio</label>
                <div className="relative">
                  <div className="col-span-2">
                    <input
                      type="number"
                      className="appearance-none border border-gray-300 bg-gray-100 rounded-md py-2 px-3focus:outline-none focus:border-gray-400 w-full"
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
                <label className="block mb-1 font-EB_Garamond"> Costo </label>
                <div className="relative">
                  <div className="col-span-2">
                    <input
                      type="number"
                      className="appearance-none border border-gray-300 bg-gray-100 rounded-md py-2 px-3focus:outline-none focus:border-gray-400 w-full"
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
              <div className="mb-4 w-full">
                <label className="block mb-1 font-EB_Garamond">
                  {" "}
                  Existencias{" "}
                </label>
                <div className="relative">
                  <div className="col-span-2">
                    <input
                      type="number"
                      className="appearance-none border border-gray-300 bg-gray-100 rounded-md py-2 px-3 focus:outline-none focus:border-gray-400 w-full"
                      placeholder="1"
                      min="1"
                      value={variations[0].stock}
                      onChange={(e) => handleStockChange(0, e.target.value)}
                      name="stock"
                    />
                    {validationError?.stock && (
                      <p className="text-sm text-red-400">
                        {validationError.stock._errors.join(", ")}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="mb-4 w-full flex-col flex">
                {/* Section 1 - Title, Image */}
                <label className="block  font-EB_Garamond">
                  Imagen de Variación # 1
                </label>
                <div className="relative aspect-video hover:opacity-80 bg-background border-4 border-gray-300">
                  <label htmlFor="selectorVarOne" className="cursor-pointer">
                    <Image
                      id="MainVariation"
                      alt="Main Variation"
                      src={variations[0].image}
                      width={500}
                      height={500}
                      className="w-full h-40 object-cover z-20"
                    />
                    <input
                      id="selectorVarOne"
                      type="file"
                      accept=".png, .jpg, .jpeg, .webp"
                      hidden
                      onChange={(e: any) =>
                        handleImageChange(0, e.target.files[0])
                      }
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
          </div>

          {/* Render additional variations */}
          {variations.slice(1).map((variation, index) => (
            <div key={index + 1} className={`w-full variation-${index + 1}`}>
              <div className="relative flex flex-row maxsm:flex-col items-center gap-5">
                <div
                  onClick={() => removeVariation(index + 1)}
                  className="absolute top-0 left-0 p-1 bg-red-500 text-white rounded-tr-md cursor-pointer"
                >
                  X
                </div>
                <div className="mb-4 w-full">
                  <label className="block mb-1 font-EB_Garamond"> Talla </label>
                  <div className="relative">
                    <select
                      onChange={(e) =>
                        handleSizeChange(index + 1, e.target.value)
                      }
                      className="appearance-none border border-gray-300 bg-gray-100 rounded-md py-2 px-3 focus:outline-none focus:border-gray-400 w-full"
                    >
                      {sizeSelection.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.value}
                        </option>
                      ))}
                    </select>

                    {validationError?.sizes && (
                      <p className="text-sm text-red-400">
                        {validationError.sizes._errors.join(", ")}
                      </p>
                    )}
                  </div>
                </div>
                <div className="mb-4 w-full">
                  <label className="block mb-1 font-EB_Garamond"> Color </label>
                  <div className="relative">
                    <select
                      onChange={(e) =>
                        handleColorChange(index + 1, e.target.value)
                      }
                      className="appearance-none border border-gray-300 bg-gray-100 rounded-md py-2 px-3 focus:outline-none focus:border-gray-400 w-full"
                    >
                      {set_colors.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.value}
                        </option>
                      ))}
                    </select>
                    {validationError?.colors && (
                      <p className="text-sm text-red-400">
                        {validationError.colors._errors.join(", ")}
                      </p>
                    )}
                  </div>
                </div>
                <div className="mb-4 w-full">
                  <label className="block mb-1 font-EB_Garamond">Precio</label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      value={variation.price}
                      onChange={(e) =>
                        handlePriceChange(index + 1, e.target.value)
                      }
                      className="appearance-none border border-gray-300 bg-gray-100 rounded-md py-2 px-3 focus:outline-none focus:border-gray-400 w-full"
                    />
                  </div>
                </div>
                <div className="mb-4 w-full">
                  <label className="block mb-1 font-EB_Garamond"> Costo </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      value={variation.cost}
                      onChange={(e) =>
                        handleCostChange(index + 1, e.target.value)
                      }
                      className="appearance-none border border-gray-300 bg-gray-100 rounded-md py-2 px-3 focus:outline-none focus:border-gray-400 w-full"
                    />
                  </div>
                </div>
                <div className="mb-4 w-full">
                  <label className="block mb-1 font-EB_Garamond">
                    {" "}
                    Existencias{" "}
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      value={variation.stock}
                      onChange={(e) =>
                        handleStockChange(index + 1, e.target.value)
                      }
                      className="appearance-none border border-gray-300 bg-gray-100 rounded-md py-2 px-3 focus:outline-none focus:border-gray-400 w-full"
                    />
                  </div>
                </div>

                <div className="mb-4 w-full flex-col flex">
                  {/* Section 1 - Title, Image */}
                  <label className="block  font-EB_Garamond">
                    Imagen de Variación # {index + 2}
                  </label>
                  <div className="relative aspect-video hover:opacity-80 bg-background border-4 border-gray-300">
                    <label
                      htmlFor={`selector${index + 1}`}
                      className="cursor-pointer"
                    >
                      <Image
                        id={`variation-${index + 1}`}
                        alt={`image variation-${index + 1}`}
                        src={variation.image}
                        width={500}
                        height={500}
                        className="w-full h-40 object-cover z-20"
                      />
                      <input
                        id={`selector${index + 1}`}
                        type="file"
                        accept=".png, .jpg, .jpeg, .webp"
                        hidden
                        onChange={(e: any) =>
                          handleImageChange(index + 1, e.target.files[0])
                        }
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
            </div>
          ))}

          <button
            type="submit"
            className="my-2 px-4 py-2 text-center inline-block text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 w-full"
          >
            Guardar Producto
          </button>
        </section>
      </form>
    </main>
  );
};

export default NewVariationProduct;

"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import MarketProductCard from "./MarketProductCard";
import MercadoSearchProducts from "./MercadoSearch";
import { getProductCategories, getUserMercadoToken } from "@/app/_actions";

const CreateMercadoProduct = ({
  filteredProductsCount,
  products,
  pageName,
  testUsers,
  search,
}: {
  filteredProductsCount: any;
  products: any;
  pageName: string;
  search: any;
  testUsers: any;
}) => {
  const [listing, setListing]: any = useState(null);
  const [predictiveListings, setPredictiveListings]: any = useState(null);
  const [error, setError] = useState("");
  const [token, setToken] = useState("");
  const [productData, setProductData]: any = useState(null);
  const [inputSearch, setInputSearch] = useState("");

  useEffect(() => {
    const handleCreateToken: any = async () => {
      try {
        const response = await getUserMercadoToken();
        setToken(response.accessToken);
      } catch (err: any) {
        setError("Error al crear token: " + err.message);
      }
    };

    handleCreateToken();
  }, []);

  const handlePickProduct = (product: any) => {
    const productPictures: any[] = [];
    const productAttributes: { id: string; value_name: any }[] = [];
    const keySet = new Set<string>();

    product.images.forEach((image: any) => {
      productPictures.push({ source: image.url });
    });

    product.details.forEach((attribute: any) => {
      if (!keySet.has(attribute.key)) {
        keySet.add(attribute.key);
        productAttributes.push({
          id: attribute.key,
          value_name: attribute.value,
        });
      }
    });

    const itemData = {
      title: product.title,
      category_id: "MLM3530",
      price: product.currentPrice,
      currency_id: "MXN",
      available_quantity: product.stock,
      buying_mode: "buy_it_now",
      condition: "new",
      listing_type_id: "gold_special",
      sale_terms: [
        {
          id: "WARRANTY_TYPE",
          value_name: "Garantía del vendedor",
        },
        {
          id: "WARRANTY_TIME",
          value_name: "30 días",
        },
      ],
      pictures: productPictures,
      attributes: productAttributes,
    };

    setProductData(itemData);
  };

  const createItem = async () => {
    try {
      const response = await fetch("https://api.mercadolibre.com/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        throw new Error("Failed to create item");
      }

      const data = await response.json();
      setListing(data);
    } catch (error) {
      console.error("Error creating item:", error);
      throw error;
    }
  };

  const findProductCategory = async () => {
    try {
      const response: any = await getProductCategories(token, inputSearch);
      setPredictiveListings(response.data);
    } catch (error) {
      console.error("Error getting categories item:", error);
      throw error;
    }
  };

  return (
    <section className="py-4 mx-auto maxlg:px-2 flex flex-col justify-center items-center">
      <div className=" flex flex-row  flex-wrap gap-3 items-center justify-between w-full mb-3">
        <h1 className="text-xl text-foreground maxsm:text-base font-bold font-EB_Garamond w-full">
          {`${filteredProductsCount} Productos `}
        </h1>
        <MercadoSearchProducts search={search} />
      </div>

      <div className="flex flex-col items-center justify-center w-full gap-4 my-10 bg-card p-5 rounded-lg">
        <h3>
          Before creating a test product Login to MercadoLibre with the
          following user credentials:
        </h3>
        <div>
          <p className="flex items-center gap-2">
            <span>email:</span>
            <span className="font-bold">{testUsers[0]?.email}</span>
          </p>
          <p className="flex items-center gap-2">
            <span>password:</span>
            <span className="font-bold">{testUsers[0]?.password}</span>
          </p>
        </div>

        <Image
          src={"/icons/mercadolibre-svgrepo-com.svg"}
          alt="MercadoLibre"
          width={200}
          height={200}
          className="w-[80px] h-[80px}"
        />
        <div className="flex flex-col items-center justify-center">
          <Image
            src={
              productData?.pictures[0]?.source || products[0]?.images[0]?.url
            }
            alt="product image"
            width={150}
            height={150}
            className="w-[80px] h-[80px}"
          />
          <p>{productData?.title}</p>
          <p>{productData?.category_id}</p>
          <p>{productData?.price}</p>
        </div>
        <div>
          <input
            type="text"
            className="appearance-none border border-gray-300 bg-input rounded-md py-2 px-3focus:outline-none focus:border-gray-400 w-full remove-arrow "
            onChange={(e) => setInputSearch(e.target.value)}
          />
          {predictiveListings &&
            predictiveListings.map((prediction: any) => (
              <div key={prediction.category_id}>
                <div>
                  <span>category_id: </span>
                  {prediction.category_id}
                </div>
                <div>
                  <span>category_name: </span>
                  {prediction.category_name}
                </div>
                <div>
                  <span>domain_name: </span>
                  {prediction.domain_name}
                </div>
              </div>
            ))}
        </div>
        <Button onClick={() => findProductCategory()} size={"sm"}>
          Find Category
        </Button>
        <Button onClick={createItem} size={"sm"}>
          Add new Listing
        </Button>
        {listing && <p>Listing ID: {listing.id}</p>}
      </div>

      <div className=" mx-auto flex justify-center items-center w-full">
        <div className="w-full justify-center items-center gap-x-5">
          <div className=" flex flex-row gap-4 flex-wrap items-center w-full pl-5">
            {products?.map((product: any, index: number) => (
              <button
                onClick={() => handlePickProduct(product)}
                key={product._id}
                className="onClick"
              >
                <MarketProductCard item={product} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CreateMercadoProduct;

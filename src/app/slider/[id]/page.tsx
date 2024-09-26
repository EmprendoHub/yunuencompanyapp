import { getSessionCookiesName } from "@/backend/helpers";
import ProductComponent from "@/components/products/ProductComponent";
import { cookies } from "next/headers";
import React from "react";

const getOneProductDetails = async (id: any, currentCookies: string) => {
  const URL = `${process.env.NEXTAUTH_URL}/api/product?${id}`;
  const res = await fetch(URL, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Cookie: currentCookies,
    },
  });
  const data = await res.json();
  return data;
};

const page = async ({ params }: { params: any }) => {
  const nextCookies = cookies();
  const cookieName = getSessionCookiesName();
  let nextAuthSessionToken: any = nextCookies.get(cookieName);
  nextAuthSessionToken = nextAuthSessionToken?.value;
  const currentCookies = `${cookieName}=${nextAuthSessionToken}`;
  const data = await getOneProductDetails(params.id, currentCookies);
  const product = data?.product;
  const trendingProducts = data?.trendingProducts;
  return (
    <div className="h-full">
      <ProductComponent product={product} trendingProducts={trendingProducts} />
      {/* <ImageSlider /> */}
    </div>
  );
};

export default page;

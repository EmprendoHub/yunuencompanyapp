import { getAllAffiliateOrder } from "@/app/_actions";
import { getCookiesName } from "@/backend/helpers";
import AffiliateProfile from "@/components/afiliados/AffiliateProfile";
import ViewUserOrders from "@/components/orders/ViewUserOrders";
import axios from "axios";
import { cookies } from "next/headers";
import React from "react";

const getAffiliateProfile = async (id: string) => {
  const nextCookies = cookies();
  const cookieName = getCookiesName();
  const nextAuthSessionToken = nextCookies.get(cookieName);
  const URL = `${process.env.NEXTAUTH_URL}/api/affiliate?${id}`;
  const { data } = await axios.get(URL, {
    headers: {
      Cookie: `${cookieName}=${nextAuthSessionToken?.value}`,
    },
  });
  return data;
};

const AffiliateProfilePage = async ({
  searchParams,
  params,
}: {
  searchParams: any;
  params: any;
}) => {
  const urlParams = {
    keyword: searchParams.keyword,
    page: searchParams.page,
  };
  const filteredUrlParams = Object.fromEntries(
    Object.entries(urlParams).filter(([key, value]) => value !== undefined)
  );
  const searchQuery = new URLSearchParams(filteredUrlParams).toString();
  const data = await getAllAffiliateOrder(searchQuery, params.id);
  const affiliate = JSON.parse(data.affiliate);
  const orders = JSON.parse(data.orders);

  return <AffiliateProfile affiliate={affiliate} orders={orders} />;
};

export default AffiliateProfilePage;

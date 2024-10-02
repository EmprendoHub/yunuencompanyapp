import { getEndOfDayReport } from "@/app/_actions";
import React from "react";
import { getCookiesName } from "@/backend/helpers";
import { cookies } from "next/headers";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import CorteComponent from "@/components/reports/CorteComponent";

const getAllPayments = async (searchQuery: string, currentCookies: string) => {
  try {
    const session = await getServerSession(options);
    const stringSession = JSON.stringify(session);
    const URL = `${process.env.NEXTAUTH_URL}/api/endofday?${searchQuery}`;
    const res = await fetch(URL, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Cookie: currentCookies,
        Session: stringSession,
      },
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

const CortePage = async ({ searchParams }: { searchParams: any }) => {
  const nextCookies = cookies();
  const cookieName = getCookiesName();
  let nextAuthSessionToken: any = nextCookies.get(cookieName);
  nextAuthSessionToken = nextAuthSessionToken?.value;
  const currentCookies = `${cookieName}=${nextAuthSessionToken}`;
  const urlParams = {
    paid: searchParams.paid,
    branch: searchParams.branch,
    "createdAt[lte]": searchParams.max,
    "createdAt[gte]": searchParams.min,
  };

  // Filter out undefined values
  const filteredUrlParams = Object.fromEntries(
    Object.entries(urlParams).filter(([key, value]) => value !== undefined)
  );

  const searchQuery = new URLSearchParams(filteredUrlParams).toString();
  //const data = await getAllPayments(searchQuery, currentCookies);
  const data = await getEndOfDayReport(searchQuery);

  const itemCount = data?.itemCount;
  return (
    <div>
      <CorteComponent data={data} itemCount={itemCount} />
    </div>
  );
};

export default CortePage;

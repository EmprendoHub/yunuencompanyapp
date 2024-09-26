import { getSessionCookiesName } from "@/backend/helpers";
import MyAffiliateLinks from "@/components/afiliados/MyAffiliateLinks";
import { cookies } from "next/headers";
import React from "react";

const EnlacesDeAfiliadoPage = () => {
  const nextCookies = cookies();
  const cookieName = getSessionCookiesName();
  let nextAuthSessionToken: any = nextCookies.get(cookieName);
  nextAuthSessionToken = nextAuthSessionToken?.value;
  const currentCookies = `${cookieName}=${nextAuthSessionToken}`;
  return <MyAffiliateLinks currentCookies={currentCookies} />;
};

export default EnlacesDeAfiliadoPage;

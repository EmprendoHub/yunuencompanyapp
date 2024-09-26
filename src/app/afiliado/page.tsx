import React from "react";
import Profile from "@/components/user/profile/Profile";
import AfiliadoDashboard from "@/components/afiliados/AfiliadoDashboard";
import { getCookiesName } from "@/backend/helpers";
import { cookies } from "next/headers";

import { getServerSession } from "next-auth";
import { getAffiliateDashboard } from "../_actions";

const ProfilePage = async () => {
  const nextCookies = cookies();
  const session: any = await getServerSession();
  const email = session.user.email;
  const cookieName = getCookiesName();
  let nextAuthSessionToken: any = nextCookies.get(cookieName);
  nextAuthSessionToken = nextAuthSessionToken?.value;
  const currentCookies = `${cookieName}=${nextAuthSessionToken}`;
  const affiliateData = await getAffiliateDashboard(currentCookies, email);

  const referralLinks = affiliateData?.referralLinks;
  const clickTrackerData = affiliateData?.clickTrackerData;
  const commissionData = affiliateData?.commissionData;
  return (
    <>
      <Profile />
      <AfiliadoDashboard
        referralLinks={referralLinks}
        clickTrackerData={clickTrackerData}
        commissionData={commissionData}
      />
    </>
  );
};

export default ProfilePage;

"use client";
import React from "react";
import ReferralLinkList from "./ReferralLinkList";
import { useSession } from "next-auth/react";
import CommissionMonitor from "./CommissionMonitor";
import ClickTracker from "./ClickTracker";

const AfiliadoDashboard = ({
  referralLinks,
  clickTrackerData,
  commissionData,
}: {
  referralLinks: any;
  clickTrackerData: any;
  commissionData: any;
}) => {
  const { data: session }: any = useSession();
  if (!session) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <h1>Dashboard for {session.user.name}</h1>
      <ReferralLinkList referralLinks={referralLinks} />
      <ClickTracker data={clickTrackerData} />
      <CommissionMonitor data={commissionData} />
    </div>
  );
};

export default AfiliadoDashboard;

import React from "react";

const ReferralLinkList = ({ referralLinks }: { referralLinks: any }) => {
  return (
    <div>
      <h2>Referral Links</h2>
      <ul>
        {referralLinks?.map((link: any) => (
          <li key={link._id}>{link.uniqueCode}</li>
        ))}
      </ul>
    </div>
  );
};

export default ReferralLinkList;

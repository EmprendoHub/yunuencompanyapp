import StripeAffiliateAccount from "@/components/afiliados/StripeAffiliateAccount";
import React from "react";
import Stripe from "stripe";
import { getServerSession } from "next-auth/next";
import { options } from "@/app/api/auth/[...nextauth]/options";

const CompleteStripeAffiliateAccountPage = async (req: any, res: any) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const session = await getServerSession(options);
  const existingCustomer = await stripe.accounts.retrieve(
    session?.user?.stripeId
  );
  let accountLink;
  if (existingCustomer && existingCustomer.payouts_enabled != true) {
    accountLink = await stripe.accountLinks.create({
      account: existingCustomer.id,
      refresh_url: `${process.env.NEXTAUTH_URL}/registro/affiliate/reauth`,
      return_url: `${process.env.NEXTAUTH_URL}/registro/affiliate/stripe`,
      type: "account_onboarding",
    });
  }

  return (
    <StripeAffiliateAccount
      accountLink={accountLink}
      customerVerified={existingCustomer.payouts_enabled}
    />
  );
};

export default CompleteStripeAffiliateAccountPage;

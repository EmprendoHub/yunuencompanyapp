import React from "react";

const StripeAffiliateAccount = ({
  accountLink,
  customerVerified,
}: {
  accountLink: any;
  customerVerified: boolean;
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {customerVerified ? (
        <p>Cuenta activada</p>
      ) : (
        <a href={accountLink?.url}>Activa tu Cuenta de Afiliado con Stripe</a>
      )}
    </div>
  );
};

export default StripeAffiliateAccount;

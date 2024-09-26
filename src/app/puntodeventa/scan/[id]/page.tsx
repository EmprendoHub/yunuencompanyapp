import { getOnePOSProduct } from "@/app/_actions";
import POSScannerComponent from "@/components/pos/POSScannerComponent";
import React from "react";

const ScanPOSProductPage = async ({ params }: { params: any }) => {
  const variationId = params.id;
  const data = await getOnePOSProduct(variationId);
  const error = await JSON.parse(data.error);
  const product = await JSON.parse(data.product);
  const variation = await JSON.parse(data.variation);

  return (
    <>
      {
        <POSScannerComponent
          product={product}
          variation={variation}
          error={error}
        />
      }
    </>
  );
};

export default ScanPOSProductPage;

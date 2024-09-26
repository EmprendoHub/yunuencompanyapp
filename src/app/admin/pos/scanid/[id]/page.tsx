import { getOnePOSProduct } from "@/app/_actions";
import POSResultScanner from "@/components/pos/POSResultScanner";
import React from "react";

const ScanPOSProductPage = async ({ params }: { params: any }) => {
  const variationId = params.id;
  const data = await getOnePOSProduct(variationId);
  const product = await JSON.parse(data.product);
  const variation = await JSON.parse(data.variation);

  return <POSResultScanner product={product} variation={variation} />;
};

export default ScanPOSProductPage;

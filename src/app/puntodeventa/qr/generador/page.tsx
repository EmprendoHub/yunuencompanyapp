import { getAllPOSProductNoFilter } from "@/app/_actions";
import QRGenerator from "@/components/pos/qr/QRGenerator";

const QRPage = async () => {
  const data = await getAllPOSProductNoFilter();
  const products = JSON.parse(data.products);
  return <QRGenerator products={products} />;
};

export default QRPage;

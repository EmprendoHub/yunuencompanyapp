import POSPaymentForm from "@/components/pos/POSPaymentForm";
import { getServerSession } from "next-auth";
import { options } from "../../api/auth/[...nextauth]/options";

const DrawerPage = async () => {
  const session = await getServerSession(options);
  const userId = session.user._id;
  return <POSPaymentForm userId={userId} />;
};

export default DrawerPage;

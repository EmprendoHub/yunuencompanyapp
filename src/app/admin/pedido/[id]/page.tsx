import AdminOneOrder from "@/components/admin/profile/AdminOneOrder";
import { getOneOrder } from "@/app/_actions";

const AdminOneOrderPage = async ({ params }: { params: any }) => {
  const data: any = await getOneOrder(params.id);
  const order = JSON.parse(data.order);
  const orderPayments = JSON.parse(data.orderPayments);
  const customer = JSON.parse(data.customer);
  return (
    <div>
      <AdminOneOrder
        order={order}
        customer={customer}
        id={params?.id}
        orderPayments={orderPayments}
        currentCookies={""}
      />
    </div>
  );
};

export default AdminOneOrderPage;

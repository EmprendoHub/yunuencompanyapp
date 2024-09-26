import { getPOSDashboard } from "../_actions";
import POSDashComponent from "@/components/pos/POSDashComponent";

const POSPage = async () => {
  const data: any = await getPOSDashboard();
  const products = JSON.parse(data?.products);
  const orders = JSON.parse(data?.orders);
  const thisWeeksOrder = JSON.parse(data?.thisWeeksOrder);
  const orderCountPreviousMonth = data?.orderCountPreviousMonth;
  const totalOrderCount = data?.totalOrderCount;
  const totalProductCount = data?.totalProductCount;
  const thisWeekOrderTotals = data?.thisWeekOrderTotals;
  const dailyOrdersTotals = data?.dailyOrdersTotals;
  return (
    <>
      <POSDashComponent
        orders={orders}
        products={products}
        orderCountPreviousMonth={orderCountPreviousMonth}
        totalOrderCount={totalOrderCount}
        totalProductCount={totalProductCount}
        thisWeeksOrder={thisWeeksOrder}
        thisWeekOrderTotals={thisWeekOrderTotals}
        dailyOrdersTotals={dailyOrdersTotals}
      />
    </>
  );
};

export default POSPage;

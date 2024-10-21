import { getAllPOSBranches } from "@/app/_actions";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { getCookiesName } from "@/backend/helpers";
import NewVariationOptimized from "@/components/admin/NewVariationOptimized";
import { getServerSession } from "next-auth";
import { cookies } from "next/headers";

const NewProductPage = async () => {
  const session = await getServerSession(options);
  const branchId = session.user._id.toString();
  const nextCookies = cookies();
  const cookieName = getCookiesName();
  const nextAuthSessionToken = nextCookies.get(cookieName);
  const currentCookies = `${cookieName}=${nextAuthSessionToken?.value}`;
  const branchData = await getAllPOSBranches();
  const branches = JSON.parse(branchData);

  return (
    <NewVariationOptimized
      currentCookies={currentCookies}
      branchId={branchId}
      branches={branches}
    />
  );
};

export default NewProductPage;

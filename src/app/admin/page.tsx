import DashComponent from "@/components/admin/dashboard/DashComponent";
import { getDashboard } from "../_actions";

const ProfilePage = async () => {
  const data = await getDashboard();

  return (
    <>
      <DashComponent data={data} />
    </>
  );
};

export default ProfilePage;

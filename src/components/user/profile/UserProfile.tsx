import Image from "next/image";
import { formatDate, formatTime } from "@/backend/helpers";

const UserProfile = ({ user }: { user: any }) => {
  return (
    <>
      <figure className="flex maxmd:flex-col items-start maxsm:items-center text-foreground">
        <div className="relative flex pr-3">
          {user?.image ? (
            <Image
              className="w-12 h-12 maxmd:w-10 maxmd:h-10  rounded-full mr-4"
              src={user?.image ? user?.image : "/next.svg"}
              alt={user?.name ? user?.name : "avatar"}
              width={50}
              height={50}
            />
          ) : (
            <div className="w-12 h-12 rounded-full mr-4 bg-black text-white flex items-center justify-center uppercase text-2xl font-EB_Garamond">
              {user?.email.substring(0, 1)}
            </div>
          )}
          <h5 className="font-semibold text-lg flex items-center maxmd:text-base">
            <span>{user?.name.substring(0, 19)}...</span>
            <span className="text-red-400 text-sm maxmd:text-xs pl-2">
              ( {user?.role} )
            </span>
          </h5>
        </div>
        <figcaption className="flex maxmd:flex-col items-center  maxmd:items-start gap-5 maxmd:gap-2">
          <p className="flex items-center maxmd:text-sm">
            <b className="pr-1">Email: </b> <span>{user?.email}</span>
          </p>
          <p className="flex items-center maxmd:text-sm">
            <b className="pr-1">Fecha: </b>
            <span>
              {user?.createdAt &&
                ` ${formatDate(
                  user?.createdAt.substring(0, 24)
                )} a las ${formatTime(user?.createdAt.substring(0, 24))}`}
            </span>
          </p>
        </figcaption>
      </figure>

      <hr className="my-4" />
    </>
  );
};

export default UserProfile;

import Image from "next/image";

const DarkModeLogo = ({ className }: { className: string }) => {
  return (
    <div className="p-3 maxsm:p-1 pl-5 relative flex flex-col items-center justify-center max-w-full mx-auto">
      <div className=" flex justify-between maxmd:justify-center items-center">
        <Image
          alt="image"
          src={"/logos/yunuen_logo_Horixontal.webp"}
          width={500}
          height={500}
          className={`overflow-hidden transition-all ease-in-out w-36 h-auto`}
        />
      </div>
    </div>
  );
};

export default DarkModeLogo;

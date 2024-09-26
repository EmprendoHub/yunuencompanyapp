import Image from "next/image";

const LogoComponent = ({ className }: { className: string }) => {
  return (
    <Image
      width={250}
      height={250}
      src={"/logos/yunuen_logo_Horixontal.webp"}
      alt="Yunuen Company"
      className={`main-logo-class ${className}`}
    />
  );
};

export default LogoComponent;

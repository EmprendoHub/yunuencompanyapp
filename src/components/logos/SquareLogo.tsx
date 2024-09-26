import Image from "next/image";

const SquareLogo = ({ className }: { className: string }) => {
  return (
    <Image
      width={150}
      height={150}
      src={"/logos/yunuen_logo.webp"}
      alt="Yunuen Company"
      className={`main-logo-class ${className}`}
    />
  );
};

export default SquareLogo;

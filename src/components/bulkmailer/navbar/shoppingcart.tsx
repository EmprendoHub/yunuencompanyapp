import { CarTaxiFront } from "lucide-react";
import Link from "next/link";

export default function Shoppingcart({ items }: { items: any }) {
  return (
    <Link href="/cart">
      <span>
        <CarTaxiFront className="h-12" />
        <span className=" badge badge-warning text-white mr-5">{items}</span>
      </span>
    </Link>
  );
}

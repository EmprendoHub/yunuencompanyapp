export interface PricingTierFrequency {
  id: string;
  value: string;
  label: string;
  priceSuffix: string;
}

export interface PricingTier {
  name: string;
  id: string;
  href: string;
  discountPrice: string | Record<string, string>;
  price: string | Record<string, string>;
  description: string | React.ReactNode;
  features: string[];
  featured?: boolean;
  highlighted?: boolean;
  cta: string;
  soldOut?: boolean;
}

export const frequencies: PricingTierFrequency[] = [
  { id: "1", value: "1", label: "Monthly", priceSuffix: "/month" },
  { id: "2", value: "2", label: "Annually", priceSuffix: "/year" },
];

export const tiers: PricingTier[] = [
  {
    name: "Gratis",
    id: "1",
    href: "/subscribe",
    price: { "1": "$0", "2": "$0" },
    discountPrice: { "1": "", "2": "" },
    description: `Get all goodies for free, no credit card required.`,
    features: [
      `10,000 Palabras/Mes`,
      `50+ Plantillas de Contenido`,
      `Descargas y copias ilimitadas`,
      `1 Mes de Historial`,
    ],
    featured: false,
    highlighted: false,
    soldOut: false,
    cta: `Sign up`,
  },
  {
    name: "Pro",
    id: "2",
    href: "/subscribe",
    price: { "1": "$189", "2": "$1890" },
    discountPrice: { "1": "", "2": "" },
    description: `Get all goodies for free, no credit card required.`,
    features: [
      `100,000 Palabras/Mes`,
      `50+ Plantillas de Contenido`,
      `Descargas y copias ilimitadas`,
      `1 Mes de Historial`,
    ],
    featured: false,
    highlighted: false,
    soldOut: false,
    cta: `Sign up`,
  },
];

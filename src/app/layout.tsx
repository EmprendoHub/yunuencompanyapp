import CustomSessionProvider from "./SessionProvider";
import "../css/globals.css";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";

export const metadata = {
  metadataBase: new URL("https://www.yunuencompany.com"),
  title: "Yunuen Company",
  description: "Ofertas de liquidación en ropa, accesorios",
  openGraph: {
    title: "Yunuen Company - Ropa Americana",
    description:
      "Descubre lo mejor en prendas de vestir, accesorios y ropa casual. Nos Especializamos en ropa americana.",
    image: "url/opengraph-image.jpeg",
  },
  twitter: {
    card: "summary_large_image",
    site: "@yunuencompany",
    title: "Yunuen Company - Ropa Americana",
    description:
      "Descubre lo mejor en prendas de vestir, accesorios y ropa casual. Nos Especializamos en ropa americana.",
    image: "url/opengraph-image.jpeg",
  },
};
export const viewport = {
  themeColor: "#5ab9ddff",
};

export default async function RootLayout({ children }: { children: any }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`overflow-x-hidden max-w-full`}>
        <CustomSessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            {/* <HeaderComponent cookie={cookie} /> */}
            {children}
            {/* <FooterComponent /> */}
          </ThemeProvider>
        </CustomSessionProvider>
        <Toaster />
      </body>
    </html>
  );
}

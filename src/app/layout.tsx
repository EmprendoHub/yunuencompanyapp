import HeaderComponent from "@/components/header/HeaderComponent";
import CustomSessionProvider from "./SessionProvider";
import "../css/globals.css";
import FooterComponent from "@/components/footer/FooterComponent";
import WhatsAppButton from "@/components/buttons/WhatsAppButton";
import { getServerSession } from "next-auth";
import { options } from "./api/auth/[...nextauth]/options";
import CookieConsentComp from "@/components/cookies/CookieConsent";
import { getCookiesName } from "@/backend/helpers";
import { cookies } from "next/headers";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";

export const metadata = {
  title: "Yunuen Company",
  description: "Ofertas de liquidación en ropa, accesorios",
};

export default async function RootLayout({ children }: { children: any }) {
  const session = await getServerSession(options);
  //set cookies
  const nextCookies = cookies();
  const cookieName = getCookiesName();
  const nextAuthSessionToken = nextCookies.get(cookieName);
  const cookie = `${cookieName}=${nextAuthSessionToken?.value}`;
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
        <CookieConsentComp />
        <Toaster />
      </body>
    </html>
  );
}

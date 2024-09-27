import { getCookiesName } from "@/backend/helpers";
import GoogleCaptchaWrapper from "@/components/forms/GoogleCaptchaWrapper";
import RegisterComponent from "@/components/user/RegisterComponent";
import { cookies } from "next/headers";

const RegisterPage = () => {
  //set cookies
  const nextCookies = cookies();
  const cookieName = getCookiesName();
  const nextAuthSessionToken = nextCookies.get(cookieName);
  const cookie = `${cookieName}=${nextAuthSessionToken?.value}`;
  return (
    <GoogleCaptchaWrapper>
      <RegisterComponent cookie={cookie} />
    </GoogleCaptchaWrapper>
  );
};
export default RegisterPage;

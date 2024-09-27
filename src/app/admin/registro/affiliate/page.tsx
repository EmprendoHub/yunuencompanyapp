import RegisterAffiliate from "@/components/afiliados/RegisterAffiliate";
import GoogleCaptchaWrapper from "@/components/forms/GoogleCaptchaWrapper";

const RegisterPage = () => {
  return (
    <GoogleCaptchaWrapper>
      <RegisterAffiliate />
    </GoogleCaptchaWrapper>
  );
};
export default RegisterPage;

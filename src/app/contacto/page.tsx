import React from "react";
import ContactComponent from "@/components/contact/ContactComponent";

export const metadata = {
  title: "Contacto yunuencompany",
  description:
    "Comunícate con un representante para aclarar dudas o solicitudes.",
};

const ContactPage = async () => {
  return <ContactComponent />;
};

export default ContactPage;

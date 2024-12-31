"use client";
import { Button } from "@/components/ui/button";
import React, { useState, useRef } from "react";

const LoginPage = () => {
  const [authType, setAuthType] = useState("signin");
  const formRef = useRef<HTMLFormElement>(null);

  const handleButtonClick = async (type: string) => {
    setAuthType(type); // Update auth type
    if (formRef.current) {
      const formData = new FormData(formRef.current);
      const response = await fetch(`/admin/auth/${type}`, {
        method: "POST",
        body: formData,
      });

      // Handle response
      if (response.ok) {
        console.log("Success:", await response.json());
      } else {
        console.error("Error:", await response.json());
      }
    }
  };

  return (
    <form
      ref={formRef}
      className="flex flex-col items-center gap-3"
      onSubmit={(e) => e.preventDefault()} // Prevent default form submission
    >
      <label htmlFor="email">Email</label>
      <input name="email" type="email" required />
      <input name="password" type="password" required />
      <Button onClick={() => handleButtonClick("signin")} type="button">
        Login
      </Button>
      <Button onClick={() => handleButtonClick("signup")} type="button">
        Sign Up
      </Button>
    </form>
  );
};

export default LoginPage;

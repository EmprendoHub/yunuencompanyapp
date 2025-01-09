"use client";
import { Button } from "@/components/ui/button";
import React from "react";

const LoginPage = () => {
  return (
    <form
      action={"/puntodeventa/auth/signin"}
      method="POST"
      className="flex flex-col items-center gap-3"
    >
      <label htmlFor="email">Email</label>
      <input name="email" type="email" />
      <input type="password" name="password" />
      <Button type="submit">Login</Button>
    </form>
  );
};

export default LoginPage;

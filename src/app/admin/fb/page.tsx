"use client";
import { useEffect, useState } from "react";
import {
  getFacebookLoginStatus,
  initFacebookSdk,
  fbLogin,
} from "../../../../utils/FacebookSDK";

export function FBInit() {
  const [respuesta, setRespuesta] = useState("");
  useEffect(() => {
    console.log("Started use effect");
    initFacebookSdk().then(() => {
      getFacebookLoginStatus().then((response: any) => {
        if (response == null) {
          console.log("No login status for the person");
        } else {
          console.log(response);
        }
      });
    });
  }, []);
}

const page = () => {
  function login() {
    console.log("reached log in button");
    fbLogin().then((response: any) => {
      console.log(response);
      if (response.status === "connected") {
        console.log("Person is connected");
      } else {
        // something
      }
    });
  }

  return <div>page</div>;
};

export default page;

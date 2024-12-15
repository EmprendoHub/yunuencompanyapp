declare global {
  interface Window {
    fbAsyncInit: () => void;
    FB: any;
  }
}

export const initFacebookSdk = () => {
  return new Promise<void>((resolve, reject) => {
    // Load the Facebook SDK asynchronously
    window.fbAsyncInit = () => {
      window.FB.init({
        appId: "603274928710248",
        cookie: true,
        xfbml: true,
        version: "v16.0",
      });
      // Resolve the promise when the SDK is loaded
      resolve();
    };
  });
};

export const getFacebookLoginStatus = () => {
  return new Promise((resolve, reject) => {
    window.FB.getLoginStatus((response: any) => {
      resolve(response);
    });
  });
};

export const fbLogin = () => {
  return new Promise((resolve, reject) => {
    window.FB.login((response: any) => {
      resolve(response);
    });
  });
};

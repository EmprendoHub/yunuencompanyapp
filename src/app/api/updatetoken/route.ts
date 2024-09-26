import { getToken } from "next-auth/jwt";
import User from "@/backend/models/User";

export async function POST(request: any) {
  const userToken: any = await getToken({ req: request });

  let user;
  let tokenData;
  try {
    if (userToken.user) {
      user = await User.findOne({ _id: userToken.user._id });
      if (user) {
        tokenData = user.mercado_token;
      }
    }
    const appId = process.env.NEXT_PUBLIC_MERCADO_LIBRE_APP_ID!;
    const secretKey = process.env.MERCADO_LIBRE_APP_SECRET!;

    const response: any = await fetch(
      "https://api.mercadolibre.com/oauth/token",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "refresh_token",
          client_id: appId,
          client_secret: secretKey,
          refresh_token: tokenData.refresh_token,
        }),
      }
    );

    const newTokenData = await response.json();
    console.log("newTokenData", newTokenData);
    if (newTokenData.status === 400) {
      return new Response(JSON.stringify(newTokenData), {
        status: 400,
      });
    }

    if (newTokenData.status === 200) {
      user.mercado_token = newTokenData;
      await user.save();
    }

    return new Response(JSON.stringify(newTokenData), {
      status: 200,
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}

import dbConnect from "@/lib/db";
import TestUser from "@/backend/models/TestUser";

export async function POST(req: any) {
  try {
    await dbConnect();
    const { accessToken } = await req.json();
    const response = await fetch(
      "https://api.mercadolibre.com/users/test_user",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ site_id: "MLM" }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }

    const testUser = await response.json();

    const newTestUser = await TestUser.create(testUser);

    return new Response(JSON.stringify(newTestUser), { status: 201 });
  } catch (error: any) {
    console.log("error", error);

    return new Response(JSON.stringify(error.message), { status: 500 });
  }
}

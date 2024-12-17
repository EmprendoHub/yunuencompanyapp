export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("hub.mode");
  const challenge = searchParams.get("hub.challenge");
  const token = searchParams.get("hub.verify_token");

  const VERIFY_TOKEN = process.env.FB_WEBHOOKTOKEN; // Replace with your Facebook app verify token

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    return new Response(challenge, { status: 200 });
  } else {
    return new Response("Forbidden", { status: 403 });
  }
}

export async function POST(request: Request) {
  try {
    const incoming = await request.json();
    console.log(incoming.entry[0]);
    console.log(incoming);

    return new Response(
      JSON.stringify({ message: "POST received", data: incoming }),
      { status: 200 }
    );
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}

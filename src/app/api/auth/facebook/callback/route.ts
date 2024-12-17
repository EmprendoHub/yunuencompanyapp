export async function POST(request: any) {
  const headers = await request.headers;
  //     // Not Signed in
  //     const notAuthorized = "You are not authorized no no no";
  //     return new Response(JSON.stringify(notAuthorized), {
  //       status: 400,
  //     });
  //   }

  try {
    const incoming = await request.json();
    console.log("headers", headers);
    console.log("incoming", incoming);
  } catch (error: any) {
    return new Response(JSON.stringify(error.message), { status: 500 });
  }
}

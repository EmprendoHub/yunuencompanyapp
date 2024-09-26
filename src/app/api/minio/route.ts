import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import { join } from "path";
import { writeFile } from "fs/promises";
import { mc } from "@/lib/minio";

// Put a file in bucket my-bucketname.
const uploadToBucket = async (
  folder: string,
  filename: string,
  file: string
) => {
  const { _id, url }: any = mc.fPutObject(folder, filename, file);

  if (_id) {
    return {
      _id,
      url,
    };
  }
};

export async function POST(request: any, res: any) {
  const token: any = await getToken({ req: request });
  if (token && token.user.role === "manager") {
    try {
      const images = await request.formData();

      // set image urls
      const savedPostMinioBucketImages = [];
      const savedImagesResults = [];

      // upload images to bucket
      for (const [name, file] of images.entries()) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const path = join("/", "tmp", file.name);

        await writeFile(path, buffer);
        const fileName = "/posts/" + String(file.name);
        await uploadToBucket("yunuencompany", fileName, path);
        const imageUrl = { url: `${process.env.MINIO_URL}${fileName}` };
        savedImagesResults.push(imageUrl);
      }
      const response = NextResponse.json({
        message: "Las imágenes se subieron con éxito.",
        success: true,
        images: savedImagesResults,
      });

      return response;
    } catch (error) {
      return NextResponse.json(
        {
          error: "Error al Subir Imágenes",
        },
        { status: 500 }
      );
    }
  } else {
    // Not Signed in
    return new Response("You are not authorized, eh eh eh, no no no", {
      status: 400,
    });
  }
}

export async function PUT(request: any, res: any) {
  const token: any = await getToken({ req: request });
  const name = await request.headers.get("name");
  if (
    (token && token.user.role === "manager") ||
    token.user.role === "socials"
  ) {
    const url = await mc.presignedPutObject("yunuencompany", name, 900);
    const response = NextResponse.json({
      message: "Las imágenes se subieron con éxito.",
      success: true,
      url: url,
    });

    return response;
  } else {
    // Not Signed in
    return new Response("You are not authorized, eh eh eh, no no no", {
      status: 400,
    });
  }
}

import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import { join } from "path";
import { writeFile } from "fs/promises";
import { mc } from "@/lib/minio";

// Put a file in bucket my-bucketname.
const uploadToBucket = async (folder, filename, file) => {
  return new Promise((resolve, reject) => {
    mc.fPutObject(folder, filename, file, function (err, result) {
      if (err) {
        console.log("Error from minio", err);
        reject(err);
      } else {
        //console.log('Success uploading images to minio', result);
        resolve({
          _id: result._id, // Make sure _id and url are properties of the result object
          url: result.url,
        });
      }
    });
  });
};

export async function POST(request, res) {
  const token = await getToken({ req: request });
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
        await uploadToBucket("ofertazosmx", fileName, path);
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

export async function PUT(request, res) {
  const token = await getToken({ req: request });
  const name = await request.headers.get("name");
  if (
    (token && token.user.role === "manager") ||
    token.user.role === "instagram"
  ) {
    const url = await new Promise((resolve, reject) => {
      mc.presignedPutObject(
        "uploads", // bucket name
        name,
        900, // 15 min expiry
        function (err, url) {
          if (err) {
            //console.log('Error from minio', err);
            reject(err);
          } else {
            //console.log('Success presigned Url');
            resolve(url);
          }
        }
      );
    });
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

import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Product from "@/backend/models/Product";
import { getToken } from "next-auth/jwt";
import { generateUrlSafeTitle, newCSTDate } from "@/backend/helpers";

export async function POST(request: any, res: any) {
  const token: any = await getToken({ req: request });
  if (!token) {
    return new Response("Unauthorized", { status: 401 });
  }
  try {
    await dbConnect();
    const payload = await request.formData();
    let {
      title,
      description,
      category,
      tags,
      featured,
      branchAvailability,
      socialsAvailability,
      onlineAvailability,
      mainImage,
      brand,
      gender,
      variations,
      salePrice,
      salePriceEndDate,
      createdAt,
      branchId,
    } = Object.fromEntries(payload);

    let slug = generateUrlSafeTitle(title);
    variations = JSON.parse(variations);
    let slugExists = await Product.findOne({ slug });

    while (slugExists) {
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const newTitle = `${title} Mod-${randomNum}`;
      title = newTitle;
      slug = generateUrlSafeTitle(newTitle);
      slugExists = await Product.findOne({ slug });
    }

    const user = { _id: token?.user?._id };
    console.log("variations", variations.stock);

    let colors: any[] = [];

    tags = JSON.parse(tags);
    const sale_price = Number(salePrice);
    const sale_price_end_date = salePriceEndDate;
    const images = [{ url: mainImage }];

    // Update stock structure
    const stock = variations[0].stock.map((stock: any) => ({
      amount: stock.amount,
      branch: stock.branch,
    }));

    console.log(stock, "stock", variations);

    createdAt = newCSTDate();

    const availability = {
      socials: socialsAvailability,
      branch: branchAvailability,
      online: onlineAvailability,
    };

    const newProduct = new Product({
      type: "variation",
      title,
      slug,
      description,
      featured,
      availability,
      brand,
      gender,
      category,
      tags,
      images,
      colors,
      variations: variations,
      stock,
      sale_price,
      sale_price_end_date,
      createdAt,
      user,
    });

    await newProduct.save();
    return new Response(
      JSON.stringify({
        message: "Producto creado exitosamente",
        success: true,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.log(error);
    return new Response(
      JSON.stringify({
        error: "Error al crear Producto",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function PUT(request: any, res: any) {
  const token: any = await getToken({ req: request });

  if (!token) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    await dbConnect();
    const payload = await request.formData();
    let {
      title,
      featured,
      branchAvailability,
      mainImage,
      variations,
      branchId,
      updatedAt,
      _id,
    } = Object.fromEntries(payload);
    variations = JSON.parse(variations);

    let slug = generateUrlSafeTitle(title);
    let slugExists = await Product.findOne({
      slug: slug,
      _id: { $ne: _id },
    });

    while (slugExists) {
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const newTitle = `${title} Mod-${randomNum}`;
      title = newTitle;
      slug = generateUrlSafeTitle(newTitle);
      slugExists = await Product.findOne({ slug });
    }

    const user = { _id: token?.user?._id };

    const images = [{ url: mainImage }];

    // Update stock structure
    // const stock = variations.map((variation: any) => ({
    //   amount: variation.stock,
    //   branch: branchId,
    // }));

    updatedAt = new Date(updatedAt);

    const availability = {
      branch: branchAvailability,
    };

    // Update variations structure
    const updatedVariations = variations.map((variation: any) => ({
      ...variation,
      stock: [{ amount: variation.stock, branch: branchId }],
    }));

    console.log("updatedVariations", updatedVariations);
    console.log("variations", variations);

    await Product.updateOne(
      { _id },
      {
        type: "variation",
        title,
        slug,
        featured,
        availability,
        images,
        variations: variations,
        updatedAt,
        user,
      }
    );
    const response = NextResponse.json({
      message: "Producto actualizado exitosamente",
      success: true,
    });

    return response;
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error: "Error al actualizar Producto",
      },
      { status: 500 }
    );
  }
}

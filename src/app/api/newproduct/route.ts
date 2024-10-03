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

    let slugExists = await Product.findOne({ slug });

    while (slugExists) {
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const newTitle = `${title} Mod-${randomNum}`;
      title = newTitle;
      slug = generateUrlSafeTitle(newTitle);
      slugExists = await Product.findOne({ slug });
    }

    const user = { _id: token?.user?._id };

    let colors: any[] = [];
    variations = JSON.parse(variations, (key, value) => {
      if (key === "color") {
        const color = {
          value: value,
          label: value,
        };
        const exists = colors.some(
          (c) => c.value === value || c.label === value
        );
        if (!exists) {
          colors.push(color);
        }
      }
      if (!isNaN(value) && value !== "" && !Array.isArray(value)) {
        if (key !== "size") {
          return Number(value);
        }
      }
      return value;
    });

    tags = JSON.parse(tags);
    const sale_price = Number(salePrice);
    const sale_price_end_date = salePriceEndDate;
    const images = [{ url: mainImage }];

    // Update stock structure
    const stock = variations.map((variation: any) => ({
      amount: variation.stock,
      branch: branchId,
    }));

    createdAt = newCSTDate();

    const availability = {
      socials: socialsAvailability,
      branch: branchAvailability,
      online: onlineAvailability,
    };

    // Update variations structure
    const updatedVariations = variations.map((variation: any) => ({
      ...variation,
      stock: [{ amount: variation.stock, branch: branchId }],
    }));

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
      variations: updatedVariations,
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
      branchId,
      updatedAt,
      _id,
    } = Object.fromEntries(payload);

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

    let colors: any[] = [];
    variations = JSON.parse(variations, (key, value) => {
      if (key === "color") {
        const color = {
          value: value,
          label: value,
        };
        const exists = colors.some(
          (c) => c.value === value || c.label === value
        );
        if (!exists) {
          colors.push(color);
        }
      }
      if (!isNaN(value) && value !== "" && !Array.isArray(value)) {
        if (key !== "size") {
          return Number(value);
        }
      }
      return value;
    });

    tags = JSON.parse(tags);
    const sale_price = Number(salePrice);
    const sale_price_end_date = salePriceEndDate;
    const images = [{ url: mainImage }];

    // Update stock structure
    const stock = variations.map((variation: any) => ({
      amount: variation.stock,
      branch: branchId,
    }));

    updatedAt = new Date(updatedAt);

    const availability = {
      socials: socialsAvailability,
      branch: branchAvailability,
      online: onlineAvailability,
    };

    // Update variations structure
    const updatedVariations = variations.map((variation: any) => ({
      ...variation,
      stock: [{ amount: variation.stock, branch: branchId }],
    }));

    await Product.updateOne(
      { _id },
      {
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
        variations: updatedVariations,
        stock,
        sale_price,
        sale_price_end_date,
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
    return NextResponse.json(
      {
        error: "Error al actualizar Producto",
      },
      { status: 500 }
    );
  }
}

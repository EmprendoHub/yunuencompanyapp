import axios from "axios";
import * as cheerio from "cheerio";
import {
  extractCountryDomain,
  extractCurrency,
  extractDiscountRate,
  extractMercadoLibreASIN,
  extractNumberFromString,
  extractPrice,
  extractStars,
} from "../utils";

export async function scrapeAmazonProduct(url: string) {
  if (!url) return;

  // BrightData proxy configuration
  const userName = String(process.env.BRIGHT_DATA_USERNAME);
  const password = String(process.env.BRIGHT_DATA_PASSWORD);
  const port = 22225;
  const session_id = (1000000 * Math.random()) | 0;

  const options = {
    auth: {
      username: `${userName}-session-${session_id}`,
      password,
    },
    host: "brd.superproxy.io",
    port,
    rejectUnauthorized: false,
  };

  try {
    // Fetch product page
    const response = await axios.get(url, options);
    const $ = cheerio.load(response.data);
    // Define empty object to store product details

    //Extract the product details
    const title = $("#productTitle").text().trim();

    const category = $("#nav-subnav").data("category");
    const reviewCount = $('.a-section[data-hook="review"]').length;
    const stars = extractStars($("#acrPopover"));

    // Extract description (might require additional logic)
    const productDescription: any = [];
    $(
      "#featurebullets_feature_div #feature-bullets ul li span.a-list-item"
    ).each((i, element) => {
      productDescription.push($(element).text().trim());
    });
    const description = productDescription;

    // Extract product details (find relevant selectors based on HTML structure)
    const details: any = [];
    $("table.a-normal.a-spacing-micro tbody tr").each((index, row) => {
      // Assuming details are within elements with class 'product-detail-item'
      const detailKey = $(row).find("td.a-span3 .a-text-bold").text().trim();
      const detailValue = $(row)
        .find("td.a-span9 .po-break-word")
        .text()
        .trim();
      details.push({ key: detailKey, value: detailValue });
    });

    // Extract image URLs (find relevant selectors based on HTML structure)
    const images: any = [];
    // Select all elements with the class "imageThumbnail" within the "altImages" element
    $("#imgTagWrapperId img").each((index, element) => {
      const imageUrl = $(element).attr("src");
      if (imageUrl) {
        images.push({ url: imageUrl, color: "#00000050" });
      }
    });

    const currentPrice = extractPrice(
      $(".priceToPay span.a-price-whole"),
      $(".a-button-selected .a-color-base"),
      $("span.a-price")
    );

    const originalPrice = extractPrice(
      $("#priceblock_ourprice"),
      $(".a-price.a-text-price span.a-offscreen"),
      $("#listPrice"),
      $("priceblock_dealprice")
    );

    // Extract ASIN
    const ASIN = $("#buybox").find('input[name="ASIN"]').attr("value");

    // Find the currency code
    const domain = extractCountryDomain(url);
    const currency = extractCurrency($(".a-price-symbol"));
    const discountRate = extractDiscountRate($(".savingsPercentage"));

    const availability = $("#availability").text().trim().toLowerCase();

    const outOfStock =
      availability.includes("unavailable") ||
      availability.includes("no disponible");

    const slug = "";

    const data = {
      url,
      ASIN,
      currency: currency || "$",
      domain,
      images,
      details,
      title,
      slug,
      description,
      currentPrice: Number(currentPrice) || Number(originalPrice),
      originalPrice: Number(originalPrice) || Number(currentPrice),
      discountRate: Number(discountRate),
      category,
      reviewCount,
      stars,
      isOutOfStock: outOfStock,
    };
    return data;
  } catch (error: any) {
    throw new Error(`Failed to scrape product: ${error.message}`);
  }
}

export async function scrapeMercadoLibreProduct(url: string) {
  if (!url) return;

  // BrightData proxy configuration
  const userName = String(process.env.BRIGHT_DATA_USERNAME);
  const password = String(process.env.BRIGHT_DATA_PASSWORD);
  const port = 22225;
  const session_id = (1000000 * Math.random()) | 0;

  const options = {
    auth: {
      username: `${userName}-session-${session_id}`,
      password,
    },
    host: "brd.superproxy.io",
    port,
    rejectUnauthorized: false,
  };

  try {
    // Fetch product page
    const response = await axios.get(url, options);
    const $ = cheerio.load(response.data);
    // Define empty object to store product details

    //Extract the product details
    const title = $(".ui-pdp-title").text().trim();

    const category = $(".ui-pdp-breadcrumb__link").last().text().trim();
    const reviewCount =
      extractNumberFromString(
        $(".ui-review-capability__rating__label").text().trim()
      ) || 0;

    const stars = Number($(".ui-pdp-review__rating").text().trim());
    // Extract description (might require additional logic)
    const description = $(".ui-pdp-description__content").text().trim();

    // Extract product details (find relevant selectors based on HTML structure)
    // Extract product details
    const details: any = [];
    $("table.andes-table tbody tr").each((index, row) => {
      const detailKey = $(row).find("th.andes-table__header").text().trim();
      const detailValue = $(row)
        .find("td.andes-table__column span.andes-table__column--value")
        .text()
        .trim();
      details.push({ key: detailKey, value: detailValue });
    });

    // // Extract "Formato de venta" detail
    $(".ui-vpp-highlighted-specs__key-value__labels__key-value").each(
      (index, element) => {
        const text = $(element).text();
        console.log("text"), text;

        const [key, value] = text.split(":");
        details.push({ key: key.trim(), value: value.trim() });
      }
    );

    // Extract image URLs (find relevant selectors based on HTML structure)
    // Select all image elements with the `data-zoom` attribute
    const imageElements = $(".ui-pdp-gallery__figure img[data-zoom]");

    const images: any = [];
    imageElements.each((index, element) => {
      const imageUrl = $(element).attr("data-zoom");
      if (imageUrl) {
        images.push({ url: imageUrl, color: "#00000050" });
      }
    });

    // Extract the current price
    const currentPriceText = $(".ui-pdp-price__second-line .andes-money-amount")
      .first()
      .text()
      .trim();
    const currentPrice = Number(
      currentPriceText.replace(/[^0-9,]/g, "").replace(",", "")
    );

    // Extract the original price
    const oldPriceElement = $(".ui-pdp-price__original-value");
    const originalPriceText = oldPriceElement.text().trim();
    const originalPrice = Number(
      originalPriceText.replace(/[^0-9,]/g, "").replace(",", "")
    );

    // Extract the currency
    const currency = oldPriceElement
      .find(".andes-money-amount__currency-symbol")
      .text();

    // Extract ASIN
    const ASIN = extractMercadoLibreASIN(url);

    // Find the currency code
    const domain = "mercadolibre.com.mx";
    const discountRate = Number($(".ui-pdp-price__discount").text().trim());

    const availability = $(".ui-pdp-stock-information__title")
      .text()
      .trim()
      .toLowerCase();

    const outOfStock = !availability ? true : false;
    const slug = "";

    const data = {
      url,
      ASIN,
      currency: currency || "$",
      domain,
      images,
      title,
      slug,
      description,
      details,
      currentPrice: Number(currentPrice) || Number(originalPrice),
      originalPrice: Number(originalPrice) || Number(currentPrice),
      discountRate: Number(discountRate),
      category,
      reviewCount,
      stars,
      isOutOfStock: outOfStock,
    };

    return data;
  } catch (error: any) {
    console.log(error);

    throw new Error(`Failed to scrape product: ${error.message}`);
  }
}

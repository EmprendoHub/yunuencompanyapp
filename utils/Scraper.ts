const puppeteer = require("puppeteer");

export async function scrapeData(productUrl: string) {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(productUrl, { waitUntil: "networkidle2" });

    // Extract data
    const productName = await page.$eval(
      "h1 span#productTitle",
      (el: { innerText: string }) => el.innerText.trim()
    );

    await browser.close();
    return productName;
  } catch (error) {
    console.error("Error scraping data with Puppeteer:", error);
    return null;
  }
}

// Example URL
const url =
  "https://www.amazon.com.mx/guantes-bufanda-c%C3%A1lidos-invierno-calentador/dp/B0BJFH17GP";
scrapeData(url).then((data) => console.log(data));

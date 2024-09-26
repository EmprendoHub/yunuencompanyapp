import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isEmail = (email: string) =>
  /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,20}$/i.test(email);

export const isPassword = (password: string) => {
  if (password.length < 7 || password.length > 15) {
    return false;
  } else {
    return true;
  }
};

export const extractURLfromString = (url: string) => {
  return url.match(/https?:\/\/[^\s"<>]+/);
};

export const extractEmailsFromString = (text: string) => {
  return text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi);
};

export function getWordCount(str: string) {
  return str.length;
}

// Extracts and returns the price from a list of possible elements.
export function extractPrice(...elements: any) {
  for (const element of elements) {
    const priceText = element.text().trim();

    if (priceText) {
      const cleanPrice = priceText.replace(/[^\d.]/g, "");

      let lastPrice;

      if (cleanPrice) {
        const prices = cleanPrice.split(".");
        // Handle cases where the price ends with a dot
        if (prices[prices.length - 1] === "") {
          prices.pop();
        }
        // Extract the last two digits as the price
        lastPrice = prices[prices.length - 2] + "." + prices[prices.length - 1];
        lastPrice = lastPrice.match(/\d+\.\d{2}/)?.[0];
      }

      return Number(lastPrice) || Number(cleanPrice);
    }
  }

  return "";
}

export function extractDiscountRate(...elements: any) {
  for (const element of elements) {
    const discountText = element.text().trim();

    if (discountText) {
      const cleanDiscount = discountText.replace(/[%]/g, "");

      let lastDiscount;

      if (cleanDiscount) {
        const prices = cleanDiscount.split("-");

        // Extract the last two digits as the price
        lastDiscount = prices[prices.length - 1];
      }

      return Number(lastDiscount) || Number(cleanDiscount);
    }
  }

  return "";
}

export function extractCountryDomain(url: string) {
  // Handle invalid URLs gracefully
  if (!url || !url.startsWith("https://www.amazon")) {
    return null;
  }

  // Extract the domain name segment
  const domain = url.split("/")[2];
  // Return extracted code or null if not found
  return domain ? domain : null;
}

export function extractCurrency(element: any) {
  const currencyText = element.text().trim().slice(0, 1);
  return currencyText ? currencyText : "";
}

export function extractStars(element: any) {
  const titleAttribute = element.attr("title");
  // Extract the star rating from the title attribute
  const starsText = titleAttribute.match(/\d+\.\d+/)[0];

  return parseFloat(starsText);
}

export function extractMercadoLibreASIN(url: string) {
  // Expresión regular para extraer el ASIN
  const asinRegex = /MLM-\d+/;

  // Encontrar todas las coincidencias de la expresión regular en la URL
  const matches = url.match(asinRegex);

  // Si se encuentra una coincidencia, devolver el ASIN
  if (matches) {
    return matches[0];
  } else {
    return null; // O lanzar un error si prefieres
  }
}

export const formatNumber = (num: number = 0) => {
  return num.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};

export function extractNumberFromString(string: string) {
  // Remove non-numeric characters using a regular expression
  const numberString = string.replace(/\D/g, "");
  // Convert the string to a number
  const number = parseInt(numberString);
  return number;
}

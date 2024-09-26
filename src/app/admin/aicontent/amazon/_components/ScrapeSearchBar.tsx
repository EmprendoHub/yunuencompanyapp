"use client";
import { scraperAndStoreProduct } from "@/actions/scraper";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import React from "react";

const isValidAmazonProductUrl = (url: string) => {
  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname;

    if (
      hostname.includes("amazon.com") ||
      hostname.includes("amazon.") ||
      hostname.endsWith("amazon")
    ) {
      return true;
    }

    // check if hostname contains amazon.com or amazon.ca
  } catch (error) {
    return;
  }
};

const ScrapeSearchBar = () => {
  const [searchPrompt, setSearchPrompt] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [details, setDetails] = React.useState<any>("");

  const handleSearchSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isValidLink = isValidAmazonProductUrl(searchPrompt);
    if (!isValidLink)
      return toast({
        title: "Invalid Link",
        description: "Add a valid amazon product link",
        variant: "destructive",
      });

    try {
      setIsLoading(true);

      // SCRAPE product page
      const product = await scraperAndStoreProduct(searchPrompt);
    } catch (error) {
      console.log(error, "error 5646874");
    } finally {
      setIsLoading(false);
    }
    if (isValidLink) {
      return toast({
        title: "Valid Link",
        description: "Successfully scraped product",
      });
    } else {
      return toast({
        title: "Invalid Link",
        description: "Add a valid amazon product link",
        variant: "destructive",
      });
    }
  };

  // const useEffect = React.useEffect(() => {
  //   const result = async () => {
  //     const details = await scrapeData(productUrl);
  //     console.log(details);
  //     setDetails(details);
  //   };

  //   result();
  // }, [productUrl]);

  return (
    <form
      onSubmit={handleSearchSubmit}
      className="flex items-center justify-center gap-5 bg-background my-2 p-3 rounded-[10px]"
    >
      <input
        type="text"
        value={searchPrompt}
        onChange={(e) => setSearchPrompt(e.target.value)}
        placeholder="Enter product link"
        className="flex-1 min-w-[200px] w-full p-2 border  rounded-[10px] text-sm text-gray-500 focus:outline-none bg-card"
      />

      <Button
        type="submit"
        disabled={searchPrompt === ""}
        variant={"secondary"}
      >
        {isLoading ? "Searching..." : "Search"}
      </Button>
    </form>
  );
};

export default ScrapeSearchBar;

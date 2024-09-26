import BonusHero from "@/components/hero/BonusHero";
import MainHeroComponent from "@/components/hero/MainHeroComponent";
import MultiDivHero from "@/components/hero/MultiDivHero";
import ExploreCategoryComponent from "@/components/products/ExploreCategoryComponent";
import TrendingNewProducts from "@/components/products/TrendingNewProducts";
import { getHomeProductsData } from "./_actions";
import UnderConstructionTwo from "@/components/hero/UnderConstructionTwo";

export default async function Home() {
  const data: any = await getHomeProductsData();
  const trendProducts = JSON.parse(data.trendingProducts);
  const editorsProducts = JSON.parse(data.editorsProducts);
  return (
    <main className="flex min-h-screen flex-col items-center justify-center ">
      <UnderConstructionTwo />
      {/* <MainHeroComponent />
      <BonusHero /> */}
      {/* <TrendingNewProducts trendProducts={trendProducts} /> */}
      {/* <HorizontalTextHero />
      <ExploreCategoryComponent />
      <MultiDivHero />
      <EditorsPickProducts editorsProducts={editorsProducts} /> */}
    </main>
  );
}

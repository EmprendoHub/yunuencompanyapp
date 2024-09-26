import BlogCoverSection from "@/components/blog/BlogCoverSection";
import FeaturedPosts from "@/components/blog/FeaturedPosts";
import RecentPosts from "@/components/blog/RecentPosts";
import { getAllPost } from "@/app/_actions";

export const metadata = {
  title: "Blog OFERTAZOSMX",
  description: "Ven y explora nuestro blog y descubre artículos de moda.",
};

const AllPostsPage = async ({ searchParams }: { searchParams: any }) => {
  const urlParams = {
    keyword: searchParams.keyword,
    page: searchParams.page,
  };
  const filteredUrlParams = Object.fromEntries(
    Object.entries(urlParams).filter(([key, value]) => value !== undefined)
  );
  const searchQuery = new URLSearchParams(filteredUrlParams).toString();
  const data = await getAllPost(searchQuery);
  const posts = JSON.parse(data.posts);
  return (
    <>
      <main className="flex flex-col items-center justify-center mt-10">
        <BlogCoverSection blogs={posts} />
        <FeaturedPosts blogs={posts} />
        <RecentPosts blogs={posts} />
      </main>
    </>
  );
};

export default AllPostsPage;

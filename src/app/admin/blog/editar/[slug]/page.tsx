import { getOnePost } from "@/app/_actions";
import BlogPublishedComponent from "@/components/blog/BlogPublishedComponent";

const PostDetailsPage = async ({ params }: { params: any }) => {
  const data = await getOnePost(params.slug);
  const post = JSON.parse(data.post);
  return <BlogPublishedComponent post={post} />;
};

export default PostDetailsPage;

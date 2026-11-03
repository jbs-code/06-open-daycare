import { PostCard } from "@/features/feed/PostCard";
import { feedPosts } from "@/lib/mockData";

// Temporal (paso 4): la composición final del feed llega en el paso 5
export default function Home() {
  return (
    <main className="mx-auto w-full max-w-[760px] px-10 pt-[34px] pb-20">
      <div className="flex flex-col gap-4">
        {feedPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </main>
  );
}

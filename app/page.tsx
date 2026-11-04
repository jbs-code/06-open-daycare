import { ComposerCard } from "@/features/feed/ComposerCard";
import { FeedHeader } from "@/features/feed/FeedHeader";
import { PostCard } from "@/features/feed/PostCard";
import { SectionLabel } from "@/features/feed/SectionLabel";
import { MobileSidebar } from "@/features/sidebar/MobileSidebar";
import { Sidebar } from "@/features/sidebar/Sidebar";
import { currentUser, feedDateLabel, feedPosts } from "@/lib/mockData";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-page md:flex-row">
      <MobileSidebar user={currentUser} />
      <Sidebar user={currentUser} />
      <main className="min-w-0 flex-1">
        <div className="mx-auto w-full max-w-[760px] px-10 pt-[34px] pb-20">
          <FeedHeader user={currentUser} dateLabel={feedDateLabel} />
          <ComposerCard initial={currentUser.initial} />
          <SectionLabel label="PUBLICADO HOY" />
          <div className="flex flex-col gap-4">
            {feedPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

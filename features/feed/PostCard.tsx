import { CommentIcon, HeartIcon, ImageIcon, MegaphoneIcon } from "@/components/icons";
import type { FeedPost } from "@/lib/mockData";
import { POST_KIND_BADGE_CLASSES, POST_KIND_LABELS } from "@/lib/postKinds";

function PostAvatar({ post }: { post: FeedPost }) {
  const kindClasses = POST_KIND_BADGE_CLASSES[post.kind];

  // Sin inicial (anuncio general) → ícono en lugar de avatar
  if (!post.authorInitial) {
    return (
      <div
        className={`flex size-11 flex-none items-center justify-center rounded-full ${kindClasses}`}
      >
        <MegaphoneIcon className="size-5" />
      </div>
    );
  }

  return (
    <div className="flex size-11 flex-none items-center justify-center rounded-full bg-child-avatar font-fredoka text-[17px] font-semibold text-child-avatar-ink">
      {post.authorInitial}
    </div>
  );
}

function PostBadge({ kind }: { kind: FeedPost["kind"] }) {
  return (
    <div
      className={`flex flex-none items-center gap-[7px] rounded-full px-3 py-1.5 ${POST_KIND_BADGE_CLASSES[kind]}`}
    >
      <span className="size-2 rounded-full bg-current" />
      <span className="text-xs font-extrabold tracking-[.5px]">
        {POST_KIND_LABELS[kind]}
      </span>
    </div>
  );
}

function PostPhoto({ label }: { label: string }) {
  return (
    <a
      href="#"
      className="mt-3.5 flex h-[200px] flex-col items-center justify-center gap-2 rounded-2xl border-[1.5px] border-dashed border-photo-border bg-surface-sunken text-photo-ink"
    >
      <ImageIcon className="size-[30px]" />
      <span className="text-[13.5px]">{label}</span>
    </a>
  );
}

function PostFooter({ post }: { post: FeedPost }) {
  return (
    <div className="mt-4 flex items-center gap-[18px] border-t border-border-soft pt-3.5">
      <span className="flex items-center gap-[7px] text-sm font-bold text-coral">
        <HeartIcon className="size-[19px]" />
        {post.likes}
      </span>
      <a
        href="#"
        className="flex items-center gap-[7px] text-sm font-bold text-muted-strong"
      >
        <CommentIcon className="size-[18px]" />
        {post.comments}
      </a>
      <a href="#" className="ml-auto text-sm font-extrabold text-coral-strong">
        Editar
      </a>
    </div>
  );
}

export function PostCard({ post }: { post: FeedPost }) {
  return (
    <article className="rounded-[20px] border border-border bg-surface px-[22px] py-5 shadow-[0_4px_16px_-12px_rgba(120,90,60,0.5)]">
      <header className="mb-3.5 flex items-center gap-3">
        <PostAvatar post={post} />
        <div className="min-w-0 flex-1">
          <div className="font-fredoka text-[16.5px] font-semibold text-foreground">
            {post.authorName}
          </div>
          <div className="text-[12.5px] text-muted">{post.time}</div>
        </div>
        <PostBadge kind={post.kind} />
      </header>

      <div className="mb-2.5 text-[12.5px] text-muted">{post.audience}</div>
      <p className="text-[15.5px] leading-[1.55] text-body">{post.body}</p>

      {post.photo && <PostPhoto label={post.photo.label} />}
      <PostFooter post={post} />
    </article>
  );
}

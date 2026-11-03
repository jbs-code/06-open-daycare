import type { CurrentUser } from "@/lib/mockData";

interface FeedHeaderProps {
  user: CurrentUser;
  dateLabel: string;
}

export function FeedHeader({ user, dateLabel }: FeedHeaderProps) {
  const firstName = user.fullName.split(" ")[0];

  return (
    <header className="mb-6">
      <div className="mb-1 text-[12.5px] font-extrabold tracking-[.8px] text-coral-deep uppercase">
        Guardería · {user.roomName}
      </div>
      <h1 className="font-fredoka text-[30px] font-semibold text-foreground">
        Buenas, {firstName}
      </h1>
      <p className="mt-[5px] text-[14.5px] text-muted-strong">
        {user.childrenCount} niños · {dateLabel}
      </p>
    </header>
  );
}

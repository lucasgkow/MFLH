import { adminGetPosts } from "@/lib/admin-data";
import { adminDeletePost } from "@/app/admin/actions";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { timeAgo } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminFeedPage() {
  const posts = await adminGetPosts();

  return (
    <div>
      <h1 className="text-5xl uppercase">Feed Moderation</h1>
      <p className="mt-2 font-body text-sm text-bone/50">
        Remove any post from the member social feed.
      </p>

      <div className="mt-8 space-y-3">
        {posts.length ? (
          posts.map((p) => (
            <div
              key={p.id}
              className="flex items-start justify-between gap-4 border border-concrete bg-[#0d0d0d] p-5"
            >
              <div>
                <p className="font-body text-xs uppercase tracking-[0.2em] text-flame">
                  {p.profiles?.display_name || "Athlete"} ·{" "}
                  {timeAgo(p.created_at)}
                  {p.pinned && " · Pinned"}
                </p>
                <p className="mt-2 whitespace-pre-line font-body text-sm text-bone/80">
                  {p.body}
                </p>
              </div>
              <DeleteButton id={p.id} action={adminDeletePost} />
            </div>
          ))
        ) : (
          <p className="border border-concrete bg-[#0d0d0d] p-10 text-center font-body text-bone/50">
            No posts yet.
          </p>
        )}
      </div>
    </div>
  );
}

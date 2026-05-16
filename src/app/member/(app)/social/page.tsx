import { requireMember } from "@/lib/auth";
import { getFeed } from "@/lib/member-data";
import {
  createPost,
  deletePost,
  toggleReaction,
  addComment
} from "@/app/member/actions";
import { MemberHeading } from "@/components/member/MemberHeading";
import { timeAgo } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function SocialPage() {
  const { user, profile } = await requireMember();
  const feed = await getFeed();
  const isAdmin = profile?.role === "admin";

  return (
    <div className="space-y-6">
      <MemberHeading eyebrow="The Crew" title="Social" />

      <form
        action={createPost}
        className="space-y-3 border border-concrete bg-[#0d0d0d] p-4"
      >
        <textarea
          name="body"
          required
          rows={3}
          placeholder="Share a win, a PR, a callout…"
          className="field-input"
        />
        <button className="btn-primary w-full text-xl">Post</button>
      </form>

      <ul className="space-y-5">
        {feed.length ? (
          feed.map((p) => (
            <li
              key={p.id}
              className="border border-concrete bg-[#0d0d0d] p-5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {p.profiles?.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.profiles.avatar_url}
                      alt=""
                      className="h-9 w-9 object-cover"
                    />
                  ) : (
                    <span className="flex h-9 w-9 items-center justify-center bg-concrete font-display text-sm uppercase">
                      {(p.profiles?.display_name || "A").slice(0, 2)}
                    </span>
                  )}
                  <div>
                    <p className="font-display text-lg uppercase leading-none">
                      {p.profiles?.display_name || "Athlete"}
                    </p>
                    <p className="font-body text-[11px] text-bone/40">
                      {p.pinned && (
                        <span className="text-flame">Pinned · </span>
                      )}
                      {timeAgo(p.created_at)}
                    </p>
                  </div>
                </div>
                {(p.author_id === user.id || isAdmin) && (
                  <form action={deletePost.bind(null, p.id)}>
                    <button className="font-body text-xs uppercase tracking-widest text-bone/30 hover:text-flame">
                      Delete
                    </button>
                  </form>
                )}
              </div>

              <p className="mt-4 whitespace-pre-line font-body text-bone/85">
                {p.body}
              </p>

              <div className="mt-4 flex items-center gap-4">
                <form action={toggleReaction.bind(null, p.id)}>
                  <button
                    className={`font-body text-sm font-bold ${
                      p.reacted ? "text-flame" : "text-bone/50"
                    }`}
                  >
                    ❤️ {p.reactionCount}
                  </button>
                </form>
                <span className="font-body text-sm text-bone/40">
                  💬 {p.comments.length}
                </span>
              </div>

              {p.comments.length > 0 && (
                <ul className="mt-4 space-y-2 border-t border-concrete pt-4">
                  {p.comments.map((c) => (
                    <li key={c.id} className="font-body text-sm">
                      <span className="font-bold text-bone/80">
                        {c.profiles?.display_name || "Athlete"}
                      </span>{" "}
                      <span className="text-bone/65">{c.body}</span>
                    </li>
                  ))}
                </ul>
              )}

              <form
                action={addComment}
                className="mt-3 flex gap-2"
              >
                <input type="hidden" name="post_id" value={p.id} />
                <input
                  name="body"
                  required
                  placeholder="Add a comment…"
                  className="field-input flex-1"
                />
                <button className="border border-concrete px-4 font-body text-xs font-bold uppercase tracking-widest text-bone/70 hover:border-flame hover:text-flame">
                  Send
                </button>
              </form>
            </li>
          ))
        ) : (
          <li className="border border-concrete bg-[#0d0d0d] p-8 text-center font-body text-bone/50">
            No posts yet. Start the conversation.
          </li>
        )}
      </ul>
    </div>
  );
}

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireMember } from "@/lib/auth";

export async function registerForClass(classId: string) {
  const { user } = await requireMember();
  const supabase = createClient();
  // Re-activate a prior cancellation or create a fresh registration.
  await supabase
    .from("class_registrations")
    .upsert(
      { class_id: classId, member_id: user.id, status: "registered" },
      { onConflict: "class_id,member_id" }
    );
  revalidatePath("/member/schedule");
  revalidatePath(`/member/schedule/${classId}`);
}

export async function cancelRegistration(classId: string) {
  const { user } = await requireMember();
  const supabase = createClient();
  await supabase
    .from("class_registrations")
    .update({ status: "cancelled" })
    .eq("class_id", classId)
    .eq("member_id", user.id);
  revalidatePath("/member/schedule");
  revalidatePath(`/member/schedule/${classId}`);
}

export async function checkIn(formData: FormData) {
  const { user } = await requireMember();
  const supabase = createClient();
  const classId = (formData.get("class_id") as string) || null;
  await supabase.from("member_checkins").insert({
    member_id: user.id,
    class_id: classId,
    source: "qr"
  });
  revalidatePath("/member");
  revalidatePath("/member/checkins");
}

export async function saveWorkoutLog(formData: FormData) {
  const { user } = await requireMember();
  const supabase = createClient();
  const { data: log } = await supabase
    .from("workout_logs")
    .insert({
      member_id: user.id,
      log_date:
        (formData.get("log_date") as string) ||
        new Date().toISOString().slice(0, 10),
      title: String(formData.get("title")),
      notes: (formData.get("notes") as string) || null
    })
    .select("id")
    .single();

  const raw = formData.get("entries") as string;
  if (log && raw) {
    try {
      const entries = JSON.parse(raw) as any[];
      if (entries.length) {
        await supabase.from("workout_entries").insert(
          entries.map((e, i) => ({
            log_id: log.id,
            exercise: String(e.exercise || "Movement"),
            reps: e.reps ? Number(e.reps) : null,
            weight_kg: e.weight_kg ? Number(e.weight_kg) : null,
            distance_m: e.distance_m ? Number(e.distance_m) : null,
            duration_sec: e.duration_sec ? Number(e.duration_sec) : null,
            position: i
          }))
        );
      }
    } catch {
      /* malformed entries — log still saved */
    }
  }
  revalidatePath("/member/workouts");
  redirect("/member/workouts");
}

export async function deleteWorkoutLog(id: string) {
  await requireMember();
  const supabase = createClient();
  await supabase.from("workout_logs").delete().eq("id", id);
  revalidatePath("/member/workouts");
}

export async function recordBenchmark(formData: FormData) {
  const { user } = await requireMember();
  const supabase = createClient();
  await supabase.from("benchmark_results").insert({
    member_id: user.id,
    benchmark_id: String(formData.get("benchmark_id")),
    value: Number(formData.get("value")),
    recorded_on:
      (formData.get("recorded_on") as string) ||
      new Date().toISOString().slice(0, 10),
    notes: (formData.get("notes") as string) || null
  });
  revalidatePath("/member/benchmarks");
}

export async function createPost(formData: FormData) {
  const { user } = await requireMember();
  const supabase = createClient();
  const body = String(formData.get("body") || "").trim();
  if (!body) return;
  await supabase.from("posts").insert({
    author_id: user.id,
    body,
    image_url: (formData.get("image_url") as string) || null
  });
  revalidatePath("/member/social");
}

export async function deletePost(id: string) {
  await requireMember();
  const supabase = createClient();
  await supabase.from("posts").delete().eq("id", id);
  revalidatePath("/member/social");
}

export async function toggleReaction(postId: string) {
  const { user } = await requireMember();
  const supabase = createClient();
  const { data: existing } = await supabase
    .from("post_reactions")
    .select("id")
    .eq("post_id", postId)
    .eq("member_id", user.id)
    .maybeSingle();
  if (existing) {
    await supabase.from("post_reactions").delete().eq("id", existing.id);
  } else {
    await supabase
      .from("post_reactions")
      .insert({ post_id: postId, member_id: user.id, emoji: "❤️" });
  }
  revalidatePath("/member/social");
}

export async function addComment(formData: FormData) {
  const { user } = await requireMember();
  const supabase = createClient();
  const body = String(formData.get("body") || "").trim();
  const postId = String(formData.get("post_id"));
  if (!body) return;
  await supabase
    .from("post_comments")
    .insert({ post_id: postId, author_id: user.id, body });
  revalidatePath("/member/social");
}

export async function updateProfile(formData: FormData) {
  const { user } = await requireMember();
  const supabase = createClient();
  const first = ((formData.get("first_name") as string) || "").trim();
  const last = ((formData.get("last_name") as string) || "").trim();
  const display = ((formData.get("display_name") as string) || "").trim();
  const avatar = ((formData.get("avatar_url") as string) || "").trim();
  const composed = `${first} ${last}`.trim();

  const patch: Record<string, string | null> = {
    first_name: first || null,
    last_name: last || null,
    full_name: composed || null,
    display_name: display || first || null,
    bio: (formData.get("bio") as string) || null,
    phone: (formData.get("phone") as string) || null
  };
  // Only overwrite the avatar when a new one was uploaded.
  if (avatar) patch.avatar_url = avatar;

  await supabase.from("profiles").update(patch).eq("id", user.id);
  revalidatePath("/member/profile");
  revalidatePath("/member");
  revalidatePath("/member/social");
}

export async function signOutMember() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect("/member/login");
}

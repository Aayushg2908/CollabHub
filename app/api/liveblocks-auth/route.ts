import { currentUser } from "@clerk/nextjs";
import { Liveblocks } from "@liveblocks/node";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

const SECRET_KEY = process.env.LIVEBLOCKS_SECRET_KEY;

const liveblocks = new Liveblocks({
  secret: SECRET_KEY!,
});

export async function POST(request: NextRequest) {
  const user = await currentUser();
  if (!user) {
    return redirect("/sign-in");
  }

  const session = liveblocks.prepareSession(`user-${user.id}`, {
    userInfo: {
      name: user.username || undefined,
      avatar: user.imageUrl,
    },
  });

  const { room } = await request.json();
  session.allow(room, session.FULL_ACCESS);

  const { body, status } = await session.authorize();
  return new Response(body, { status });
}

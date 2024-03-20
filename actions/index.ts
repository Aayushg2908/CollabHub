"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { ROOMTYPE } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Liveblocks } from "@liveblocks/node";

const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY!,
});

export const deleteRoom = async (roomId: string, type: ROOMTYPE) => {
  const { userId } = auth();
  if (!userId) {
    return redirect("/sign-in");
  }

  await db.room.delete({
    where: {
      id: roomId,
      type: type,
    },
  });

  if (type !== "CALL") {
    await liveblocks.deleteRoom(roomId);
  }

  revalidatePath(`/${type.toLowerCase()}`);
};

export const updateRoom = async (
  roomId: string,
  type: ROOMTYPE,
  updatedRoomName: string
) => {
  const { userId } = auth();
  if (!userId) {
    return redirect("/sign-in");
  }

  await db.room.update({
    where: {
      id: roomId,
      type: type,
    },
    data: {
      name: updatedRoomName,
    },
  });

  revalidatePath(`/${type.toLowerCase()}`);
};

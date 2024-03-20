"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const createCallRoom = async (roomName: string) => {
  const { userId } = auth();
  if (!userId) {
    return redirect("/sign-in");
  }

  const createdRoom = db.room.create({
    data: {
      name: roomName,
      ownerId: userId,
      type: "CALL",
      users: {
        set: [userId],
      },
    },
    select: {
      id: true,
    },
  });

  revalidatePath("/call");

  return createdRoom;
};

export const getOwnedCallRooms = async () => {
  const { userId } = auth();
  if (!userId) {
    return redirect("/sign-in");
  }

  const rooms = await db.room.findMany({
    where: {
      ownerId: userId,
      type: "CALL",
    },
  });

  return rooms;
};

export const getAllCallRooms = async () => {
  const { userId } = auth();
  if (!userId) {
    return redirect("/sign-in");
  }

  const rooms = await db.room.findMany({
    where: {
      users: {
        has: userId,
      },
      type: "CALL",
    },
  });

  return rooms;
};

export const joinCallRoom = async (roomId: string) => {
  const { userId } = auth();
  if (!userId) {
    return redirect("/sign-in");
  }

  const room = await db.room.findUnique({
    where: {
      id: roomId,
    },
  });
  if (!room) {
    return redirect("/call");
  }

  const userAlreadyInRoom = room.users.includes(userId);
  if (userAlreadyInRoom) {
    return;
  }

  await db.room.update({
    where: {
      id: roomId,
    },
    data: {
      users: {
        set: [...room.users, userId],
      },
    },
  });
};

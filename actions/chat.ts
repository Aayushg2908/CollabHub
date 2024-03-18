"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const createChatRoom = (roomName: string) => {
  const { userId } = auth();
  if (!userId) {
    return redirect("/sign-in");
  }

  const createdRoom = db.room.create({
    data: {
      name: roomName,
      ownerId: userId,
      type: "CHAT",
      users: {
        set: [userId],
      },
    },
    select: {
      id: true,
    },
  });

  revalidatePath("/chat");

  return createdRoom;
};

export const getOwnedChatRooms = async () => {
  const { userId } = auth();
  if (!userId) {
    return redirect("/sign-in");
  }

  const rooms = await db.room.findMany({
    where: {
      ownerId: userId,
      type: "CHAT",
    },
  });

  return rooms;
};

export const getAllChatRooms = async () => {
  const { userId } = auth();
  if (!userId) {
    return redirect("/sign-in");
  }

  const rooms = await db.room.findMany({
    where: {
      users: {
        has: userId,
      },
      type: "CHAT",
    },
  });

  return rooms;
};

export const joinChatRoom = async (roomId: string) => {
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
    return redirect("/chat");
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

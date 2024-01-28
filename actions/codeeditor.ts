"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const createCodeEditorRoom = async (roomName: string) => {
  const { userId } = auth();
  if (!userId) {
    return redirect("/sign-in");
  }

  const createdRoom = await db.room.create({
    data: {
      name: roomName,
      ownerId: userId,
      type: "CODEEDITOR",
      users: {
        set: [userId],
      },
    },
    select: {
      id: true,
    },
  });

  revalidatePath("/codeeditor");

  return createdRoom;
};

export const getOwnedCodeEditorRooms = async () => {
  const { userId } = auth();
  if (!userId) {
    return redirect("/sign-in");
  }

  const rooms = await db.room.findMany({
    where: {
      ownerId: userId,
      type: "CODEEDITOR",
    },
  });

  return rooms;
};

export const getAllCodeEditorRooms = async () => {
  const { userId } = auth();
  if (!userId) {
    return redirect("/sign-in");
  }

  const rooms = await db.room.findMany({
    where: {
      users: {
        has: userId,
      },
      type: "CODEEDITOR",
    },
  });

  return rooms;
};

export const joinCodeEditorRoom = async (roomId: string) => {
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
    return redirect("/codeeditor");
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

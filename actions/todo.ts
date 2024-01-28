"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const createTodoRoom = async (roomName: string) => {
  const { userId } = auth();
  if (!userId) {
    return redirect("/sign-in");
  }

  const createdRoom = await db.room.create({
    data: {
      name: roomName,
      ownerId: userId,
      type: "TODO",
      users: {
        set: [userId],
      },
    },
    select: {
      id: true,
    },
  });

  revalidatePath("/todo");

  return createdRoom;
};

export const getOwnedTodoRooms = async () => {
  const { userId } = auth();
  if (!userId) {
    return redirect("/sign-in");
  }

  const rooms = await db.room.findMany({
    where: {
      ownerId: userId,
      type: "TODO",
    },
  });

  return rooms;
};

export const getAllTodoRooms = async () => {
  const { userId } = auth();
  if (!userId) {
    return redirect("/sign-in");
  }

  const rooms = await db.room.findMany({
    where: {
      users: {
        has: userId,
      },
      type: "TODO",
    },
  });

  return rooms;
};

export const joinTodoRoom = async (roomId: string) => {
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
    return redirect("/404");
  }

  const updatedRoom = await db.room.update({
    where: {
      id: roomId,
    },
    data: {
      users: {
        set: [...room.users, userId],
      },
    },
  });

  return updatedRoom;
};

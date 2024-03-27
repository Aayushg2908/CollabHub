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

export const createRoom = async (roomName: string, type: ROOMTYPE) => {
  const { userId } = auth();
  if (!userId) {
    return redirect("/sign-in");
  }

  const createdRoom = await db.room.create({
    data: {
      name: roomName,
      ownerId: userId,
      type,
      users: {
        set: [userId],
      },
    },
    select: {
      id: true,
    },
  });

  revalidatePath(`/${type.toLowerCase()}`);

  return createdRoom;
};

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
    try {
      await liveblocks.deleteRoom(roomId);
    } catch (error) {
      console.log(error);
    }
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

export const getOwnedRooms = async (type: ROOMTYPE) => {
  const { userId } = auth();
  if (!userId) {
    return redirect("/sign-in");
  }

  const rooms = await db.room.findMany({
    where: {
      ownerId: userId,
      type,
    },
  });

  return rooms;
};

export const getAllRooms = async (type: ROOMTYPE) => {
  const { userId } = auth();
  if (!userId) {
    return redirect("/sign-in");
  }

  const rooms = await db.room.findMany({
    where: {
      users: {
        has: userId,
      },
      type,
    },
  });

  return rooms;
};

export const joinRoom = async (roomId: string, type: ROOMTYPE) => {
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
    return redirect(`/${type.toLowerCase()}`);
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

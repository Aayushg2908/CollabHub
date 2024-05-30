"use server";

import { db } from "@/lib/db";
import { auth, currentUser } from "@clerk/nextjs";
import { ROOMTYPE } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Liveblocks } from "@liveblocks/node";
import { checkSubscription } from "@/lib/subscription";
import { checkRoomLimit, decrementRoomLimit, incrementRoomLimit } from "@/lib/room-limit";
import { stripe } from "@/lib/stripe";

const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY!,
});

export const createRoom = async (roomName: string, type: ROOMTYPE) => {
  const { userId } = auth();
  if (!userId) {
    return redirect("/sign-in");
  }

  const isPro = await checkSubscription();
  const freeTrial = await checkRoomLimit();

  if (!freeTrial && !isPro) {
    return { error: "You have reached the limit of free rooms" };
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

  if (!isPro) {
    await incrementRoomLimit(); 
  }

  revalidatePath(`/${type.toLowerCase()}`);

  return { data: createdRoom };
};

export const deleteRoom = async (roomId: string, type: ROOMTYPE) => {
  const { userId } = auth();
  if (!userId) {
    return redirect("/sign-in");
  }

  const isPro = await checkSubscription();

  await db.room.delete({
    where: {
      id: roomId,
      type: type,
    },
  });

  if(!isPro) {
    await decrementRoomLimit();
  }

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

export const upgradeToPro = async () => {
  const {userId} = auth();
  const user = await currentUser();
  if(!userId || !user) {
    return redirect("/sign-in");
  }

  const userSubscription = await db.userSubscription.findUnique({
    where: { userId },
  });

  if (userSubscription && userSubscription.stripeCustomerId) {
    const stripeSession = await stripe.billingPortal.sessions.create({
      customer: userSubscription.stripeCustomerId,
      return_url: "https://collab-hub-one.vercel.app",
    });

    return { url: stripeSession.url };
  }

  const stripeSession = await stripe.checkout.sessions.create({
    success_url: "https://collab-hub-one.vercel.app",
    cancel_url: "https://collab-hub-one.vercel.app",
    payment_method_types: ["card"],
    mode: "subscription",
    billing_address_collection: "auto",
    customer_email: user.emailAddresses[0].emailAddress,
    line_items: [
      {
        price_data: {
          currency: "USD",
          product_data: {
            name: "CollabHub Pro",
            description: "Unlimited Room Creation",
          },
          unit_amount: 6000,
          recurring: {
            interval: "month",
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      userId,
    },
  });

  return { url: stripeSession.url };
};

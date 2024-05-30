import { auth } from "@clerk/nextjs";
import { db } from "./db";

const MAX_ROOMS = 6;

export const incrementRoomLimit = async () => {
  const {userId} = auth();
  if(!userId) {
    return;
  }

  const userRoomLimit = await db.userRoomLimit.findFirst({
    where: { userId },
  });

  if (userRoomLimit) {
    await db.userRoomLimit.update({
      where: { userId },
      data: { count: userRoomLimit.count + 1 },
    });
  } else {
    await db.userRoomLimit.create({
      data: { userId: userId, count: 1 },
    });
  }
};

export const checkRoomLimit = async () => {
  const { userId } = auth();
  if (!userId) {
    return false;
  }

  const userRoomLimit = await db.userRoomLimit.findUnique({
    where: { userId },
  });

  if (!userRoomLimit || userRoomLimit.count < MAX_ROOMS) {
    return true;
  } else {
    return false;
  }
};

export const getRoomLimitCount = async () => {
  const { userId } = auth();
  if (!userId) {
    return 0;
  }

  const userRoomLimit = await db.userRoomLimit.findUnique({
    where: {
      userId,
    },
  });

  if (!userRoomLimit) {
    return 0;
  }

  return userRoomLimit.count;
};


export const decrementRoomLimit = async () => {
  const {userId} = auth();
  if(!userId) {
    return;
  }

  const userRoomLimit = await db.userRoomLimit.findFirst({
    where: { userId },
  });

  if (userRoomLimit && userRoomLimit.count > 0) {
    await db.userRoomLimit.update({
      where: { userId },
      data: { count: userRoomLimit.count - 1 },
    });
  }
};

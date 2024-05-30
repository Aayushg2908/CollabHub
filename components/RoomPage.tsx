import { Tooltip } from "@nextui-org/tooltip";
import { auth } from "@clerk/nextjs";
import Link from "next/link";
import { Actions } from "./Actions";
import { ROOMTYPE, Room } from "@prisma/client";
import { checkSubscription } from "@/lib/subscription";
import { getRoomLimitCount } from "@/lib/room-limit";
import { FreeCounter } from "./FreeCounter";
import ProButton from "./ProButton";

const RoomPage = async ({
  children,
  ownedRooms,
  allRooms,
  link,
}: {
  children: React.ReactNode;
  ownedRooms: Room[];
  allRooms: Room[];
  link: ROOMTYPE;
}) => {
  const { userId } = auth();

  const roomLimitCount = await getRoomLimitCount();
  const isPro = await checkSubscription();

  return (
    <div className="mt-10 w-full flex flex-col items-center">
      {!isPro && (
        <div className="w-full flex flex-col items-center mb-4">
          <FreeCounter roomLimitCount={roomLimitCount} isPro={isPro} />
          <ProButton />
        </div>
      )}
      <h1 className="font-bold text-3xl md:text-5xl text-center">
        Rooms created by you
      </h1>
      <div className="mt-6 flex items-center gap-x-4 flex-wrap px-10 gap-y-2">
        {ownedRooms.map((room) => (
          <Tooltip
            key={room.id}
            content={`There are ${room.users.length} users in the room`}
          >
            <Link
              href={`/${link.toLowerCase()}/${room.id}`}
              className="border bg-neutral-800 transition-all rounded-md min-w-[120px] w-fit h-[130px] flex items-center justify-center cursor-pointer font-bold text-xl p-1 relative"
            >
              {room.name}
              {room.ownerId === userId && (
                <Actions roomId={room.id} type={link} roomName={room.name} />
              )}
            </Link>
          </Tooltip>
        ))}
        {children}
      </div>
      <h1 className="mt-16 font-bold text-3xl md:text-5xl text-center">
        Your Rooms
      </h1>
      <div className="mt-6 flex items-center gap-x-4 flex-wrap px-10 gap-y-2">
        {allRooms.map((room) => (
          <Tooltip
            key={room.id}
            content={`There are ${room.users.length} users in the room`}
          >
            <Link
              href={`/${link.toLowerCase()}/${room.id}`}
              key={room.id}
              className="border bg-neutral-800 transition-all rounded-md min-w-[120px] w-fit h-[130px] flex items-center justify-center cursor-pointer font-bold text-xl overflow-hidden p-1 relative"
            >
              {room.name}
              {room.ownerId === userId && (
                <Actions roomId={room.id} type={link} roomName={room.name} />
              )}
            </Link>
          </Tooltip>
        ))}
      </div>
    </div>
  );
};

export default RoomPage;

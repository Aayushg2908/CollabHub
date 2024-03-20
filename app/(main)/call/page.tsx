import { auth } from "@clerk/nextjs";
import { CreateCallRoom } from "./_components/CreateCallRoom";
import { getAllCallRooms, getOwnedCallRooms } from "@/actions/call";
import Link from "next/link";
import { Actions } from "@/components/Actions";
import { Tooltip } from "@nextui-org/tooltip";

const CallPage = async () => {
  const { userId } = auth();
  const ownedRooms = await getOwnedCallRooms();
  const allRooms = await getAllCallRooms();

  return (
    <div className="mt-10 w-full flex flex-col items-center">
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
              href={`/chat/${room.id}`}
              className="border bg-neutral-800 transition-all rounded-md min-w-[120px] w-fit h-[130px] flex items-center justify-center cursor-pointer font-bold text-xl p-1 relative"
            >
              {room.name}
              {room.ownerId === userId && (
                <Actions roomId={room.id} type="CALL" roomName={room.name} />
              )}
            </Link>
          </Tooltip>
        ))}
        <CreateCallRoom />
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
              href={`/chat/${room.id}`}
              key={room.id}
              className="border min-w-[120px] bg-neutral-800 transition-all rounded-md w-fit h-[130px] flex items-center justify-center cursor-pointer font-bold text-xl overflow-hidden p-1 relative"
            >
              {room.name}
              {room.ownerId === userId && (
                <Actions roomId={room.id} type="CHAT" roomName={room.name} />
              )}
            </Link>
          </Tooltip>
        ))}
      </div>
    </div>
  );
};

export default CallPage;

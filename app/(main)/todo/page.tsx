import { getAllTodoRooms, getOwnedTodoRooms } from "@/actions/todo";
import { CreateTodoRoom } from "./_components/CreateTodoRoom";
import Link from "next/link";
import { Tooltip } from "@nextui-org/tooltip";
import { Actions } from "@/components/Actions";

const TodoPage = async () => {
  const ownedRooms = await getOwnedTodoRooms();
  const allRooms = await getAllTodoRooms();

  return (
    <div className="mt-10 w-full flex flex-col items-center">
      <h1 className="font-bold text-3xl md:text-5xl text-center">
        Rooms created by you
      </h1>
      <div className="mt-10 flex items-center gap-x-4 flex-wrap px-10 gap-y-2">
        {ownedRooms.map((room) => (
          <Tooltip
            key={room.id}
            content={`There are ${room.users.length} users in the room`}
          >
            <Link
              href={`/todo/${room.id}`}
              className="border bg-neutral-800 transition-all rounded-md h-[130px] flex items-center justify-center cursor-pointer font-bold text-xl w-fit p-1 relative"
            >
              {room.name}
              <Actions roomId={room.id} type="TODO" />
            </Link>
          </Tooltip>
        ))}
        <CreateTodoRoom />
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
              href={`/todo/${room.id}`}
              className="border bg-neutral-800 transition-all rounded-md w-fit h-[130px] flex items-center justify-center cursor-pointer font-bold text-xl p-1 relative"
            >
              {room.name}
              <Actions roomId={room.id} type="TODO" />
            </Link>
          </Tooltip>
        ))}
      </div>
    </div>
  );
};

export default TodoPage;

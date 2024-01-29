import {
  getAllCodeEditorRooms,
  getOwnedCodeEditorRooms,
} from "@/actions/codeeditor";
import Link from "next/link";
import { CreateCodeEditorRoom } from "./_components/CreateCodeEditorRoom";
import { Tooltip } from "@nextui-org/tooltip";

const CodeEditorPage = async () => {
  const ownedRooms = await getOwnedCodeEditorRooms();
  const allRooms = await getAllCodeEditorRooms();

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
              href={`/codeeditor/${room.id}`}
              className="border bg-neutral-800 transition-all rounded-md h-[130px] flex items-center justify-center cursor-pointer font-bold text-xl w-fit p-1"
            >
              {room.name}
            </Link>
          </Tooltip>
        ))}
        <CreateCodeEditorRoom />
      </div>
      <h1 className="mt-16 font-bold text-3xl md:text-5xl text-center">
        Your Rooms
      </h1>
      <div className="mt-6 flex items-center gap-x-4 flex-wrap px-10 gap-y-2">
        {allRooms.map((room) => (
          <Link
            href={`/todo/${room.id}`}
            key={room.id}
            className="border bg-neutral-800 transition-all rounded-md w-fit h-[130px] flex items-center justify-center cursor-pointer font-bold text-xl p-1"
          >
            {room.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CodeEditorPage;

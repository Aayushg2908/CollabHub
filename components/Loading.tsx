import Image from "next/image";

export function Loading() {
  return (
    <div className="mt-40 w-full flex flex-col items-center justify-center">
      <Image
        src="https://liveblocks.io/loading.svg"
        alt="Loading"
        width={50}
        height={50}
        className="invert"
      />
      <h1>Loading...</h1>
    </div>
  );
}

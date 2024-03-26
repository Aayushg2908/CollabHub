import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex flex-col items-center gap-y-2">
      <p className="rounded-full py-2 px-4 bg-blue-500 text-white">
        Email: your_name+clerk_test@gmail.com and Username Can be anything.{" "}
        <br />
        Verification Code: 424242
      </p>
      <SignUp />
    </div>
  );
}

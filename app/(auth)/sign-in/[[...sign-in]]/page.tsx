import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex items-center flex-col gap-y-2">
      <p className="rounded-full py-1 px-2 bg-yellow-500 text-black">
        If You want to login with a{" "}
        <span className="font-extrabold">Test Email</span>, Please go to the
        Sign Up page.
      </p>
      <SignIn />
    </div>
  );
}

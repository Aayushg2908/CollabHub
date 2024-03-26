import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex items-center flex-col gap-y-2">
      <p className="rounded-full py-2 px-4 bg-blue-500 text-white">
        Test Email: test+clerk_test@gmail.com <br />
        Verification Code: 424242
      </p>
      <p className="rounded-full py-1 px-2 bg-yellow-500 text-black">
        If You want to login with your own{" "}
        <span className="font-extrabold">Test Email</span>, Please go to the
        Sign Up page and follow the instructions.
      </p>
      <SignIn />
    </div>
  );
}

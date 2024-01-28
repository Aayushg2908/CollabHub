const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center gap-y-4">
      <h1 className="font-bold text-4xl bg-clip-text text-transparent bg-gradient-to-r from-[#12c2e9] via-[#c471ed] to-[#f64f59]">
        CollabHub
      </h1>
      {children}
    </div>
  );
};

export default AuthLayout;

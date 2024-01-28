import { MainNavbar } from "@/components/Navbar";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full h-screen">
      <MainNavbar />
      {children}
    </div>
  );
};

export default MainLayout;

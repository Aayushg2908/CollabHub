import { MainNavbar } from "@/components/Navbar";
import { Toaster } from "react-hot-toast";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full h-screen">
      <MainNavbar />
      <Toaster />
      {children}
    </div>
  );
};

export default MainLayout;

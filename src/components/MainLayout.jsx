import FloatingAIButton from "./FloatingAIButton";
import  Navbar  from "./Navbar";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        <Outlet />
      </main>
       <FloatingAIButton />
    </>
  );
};

export default MainLayout;

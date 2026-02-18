import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  ShoppingBag,
  User,
  Search,
  Menu,
  LogOut,
  Package,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/redux/userSlice";
import api from "@/api/axios";

const Navbar = () => {
  const user = useSelector((state) => state.user.user);
  const isLoggedIn = Boolean(user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartCount = 0;
  const accessToken = localStorage.getItem("accessToken");
  const API_URL = import.meta.env.VITE_API_URL;

  const logOutHandler = async () => {
    try {
      const res = await api.post(
        `${API_URL}/api/v1/user/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      if (res.data.success) {
        toast.success(res.data.message);
        setTimeout(() => {
          toast.success("Thank You, Visit Again!!!");
        }, 2000);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    } finally {
      localStorage.removeItem("accessToken");
      dispatch(setUser(null));
      navigate("/login");
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full h-16 bg-white border-b z-50">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        {/* LOGO */}
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-7 w-7 text-primary" />
          <Link to="/" className="text-2xl font-bold text-primary">
            <span className="italic font-[cursive]">eKart</span>
          </Link>
        </div>

        {/* SEARCH (Desktop) */}
        <div className="hidden md:flex w-1/3 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input placeholder="Search products..." className="pl-9" />
        </div>

        {/* RIGHT SECTION */}
        <div className="flex items-center gap-4">
          {/* CART */}
          <Link to="/cart" className="relative">
            <ShoppingBag className="h-6 w-6" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs h-5 w-5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {/* DESKTOP AUTH */}
          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn ? (
              <>
                <div className="border-2 border-red rounded-full text-sm hidden md:block p-1">
                  {user.email}
                </div>
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link to="/">Home</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/profile">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/orders">Orders</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-500"
                      onClick={logOutHandler}
                    >
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link to="/signup">
                  <Button>Sign Up</Button>
                </Link>
              </>
            )}
          </div>

          {/* MOBILE MENU */}
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link to="/cart" className="flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4" />
                  Cart
                </Link>
              </DropdownMenuItem>

              {isLoggedIn ? (
                <>
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link to="/orders" className="flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      Orders
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    className="text-red-500 flex items-center gap-2"
                    onClick={logOutHandler}
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem asChild>
                    <Link to="/login">Login</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/signup">Sign Up</Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

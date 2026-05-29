import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  ShoppingBag,
  User,
  Search,
  Menu,
  LogOut,
  Package,
  Home,
  PackagePlus,
  SquarePlus,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/redux/userSlice";
import api from "@/api/axios";
import "@/utils/Navbar.css";

const Navbar = () => {
  const user = useSelector((state) => state.user.user);
  const isLoggedIn = Boolean(user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;
  const cartCount = 0;

  const logOutHandler = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const res = await api.post(
        `${API_URL}/api/v1/user/logout`,
        {},
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );
      if (res.data.success) {
        toast.success(res.data.message);
        setTimeout(() => toast.success("Thank You, Visit Again!!!"), 2000);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("serverNoticeSeen");
      dispatch(setUser(null));
      navigate("/login");
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full h-16 bg-white/95 backdrop-blur-sm border-b border-gray-100 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-full flex items-center justify-between gap-2 sm:gap-4">
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="bg-gray-900 p-1.5 rounded-lg">
            <ShoppingCart className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg sm:text-xl font-bold text-gray-900 italic font-[cursive]">
            eKart
          </span>
        </Link>

        <div className="hidden md:flex flex-1 max-w-xs lg:max-w-sm relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          <Input
            placeholder="Search products..."
            className="pl-9 bg-gray-50 border-gray-200 rounded-xl text-sm focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          {isLoggedIn && (
            <Link
              to="/cart"
              className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <ShoppingBag className="h-5 w-5 text-gray-700" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] h-4 w-4 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>
          )}

          <div className="hidden md:flex items-center gap-2">
            {isLoggedIn ? (
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <button className="navbar-avatar-btn">
                    <User className="h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="navbar-dropdown-content p-0 border-0"
                >
                  <div className="navbar-dropdown-header">
                    <div className="navbar-dropdown-email">{user.email}</div>
                  </div>
                  <Link to="/" className="navbar-dropdown-item">
                    <span className="navbar-dropdown-item-icon">
                      <Home className="h-3.5 w-3.5 text-gray-500" />
                    </span>
                    Home
                  </Link>
                  <Link to="/profile" className="navbar-dropdown-item">
                    <span className="navbar-dropdown-item-icon">
                      <User className="h-3.5 w-3.5 text-gray-500" />
                    </span>
                    Profile
                  </Link>
                  <Link to="/orders" className="navbar-dropdown-item">
                    <span className="navbar-dropdown-item-icon">
                      <Package className="h-3.5 w-3.5 text-gray-500" />
                    </span>
                    Orders
                  </Link>
                  {user.role === "admin" && (
                    <Link to="/addproduct" className="navbar-dropdown-item">
                      <span className="navbar-dropdown-item-icon">
                        <SquarePlus className="h-3.5 w-3.5 text-gray-500" />
                      </span>
                      Add products
                    </Link>
                  )}
                  <div
                    style={{ borderTop: "1px solid #f3f4f6", margin: "4px 0" }}
                  />
                  <button
                    className="navbar-dropdown-logout"
                    onClick={logOutHandler}
                  >
                    <span className="navbar-dropdown-logout-icon">
                      <LogOut className="h-4 w-4 text-red-500" />
                    </span>
                    Logout
                  </button>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link to="/login" className="navbar-auth-btn-login">
                  Login
                </Link>
                <Link to="/signup" className="navbar-auth-btn-signup">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild className="md:hidden">
              <button className="p-2 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                <Menu className="h-5 w-5 text-gray-700" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="navbar-dropdown-content p-0 border-0"
            >
              {isLoggedIn ? (
                <>
                  <Link to="/cart" className="navbar-mobile-item">
                    <ShoppingBag className="h-4 w-4" /> Cart
                  </Link>
                  <Link to="/profile" className="navbar-mobile-item">
                    <User className="h-4 w-4" /> Profile
                  </Link>
                  <Link to="/orders" className="navbar-mobile-item">
                    <Package className="h-4 w-4" /> Orders
                  </Link>
                  {user.role === "admin" && (
                    <Link to="/addproduct" className="navbar-dropdown-item">
                      <span className="navbar-dropdown-item-icon">
                        <SquarePlus className="h-4 w-4 text-gray-500" />
                      </span>
                      Add products
                    </Link>
                  )}
                  <div
                    style={{ borderTop: "1px solid #f3f4f6", margin: "4px 0" }}
                  />
                  <button
                    className="navbar-mobile-logout"
                    onClick={logOutHandler}
                  >
                    <LogOut className="h-4 w-4" /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="navbar-mobile-item">
                    Login
                  </Link>
                  <Link to="/signup" className="navbar-mobile-item">
                    Sign Up
                  </Link>
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

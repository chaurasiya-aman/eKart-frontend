import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import AdminOrders from "@/components/AdminOrders";
import MyOrders from "@/components/MyOrders";

export default function OrdersPage() {
  const user = useSelector((state) => state.user.user);
  if (!user) return <Navigate to="/login" replace />;
  return user.role === "admin" ? <AdminOrders /> : <MyOrders />;
}

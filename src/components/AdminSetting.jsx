import { Link } from "react-router-dom";
import {
  SquarePlus,
  Users,
  Package,
  Settings,
  ArrowRight,
} from "lucide-react";
import "@/utils/Adminsettings.css";
import { Button } from "./ui/button";

const CARDS = [
  {
    to: "/addproduct",
    icon: <SquarePlus size={20} />,
    iconClass: "admin-settings__icon-wrap--emerald",
    label: "Add product",
    desc: "Create and list a new product in your store",
  },
  {
    to: "/all-users",
    icon: <Users size={20} />,
    iconClass: "admin-settings__icon-wrap--violet",
    label: "All users",
    desc: "View and manage all registered accounts",
  },
  {
    to: "/orders",
    icon: <Package size={20} />,
    iconClass: "admin-settings__icon-wrap--amber",
    label: "Orders",
    desc: "Track and update all customer orders",
  },
  {
    to: "/settings",
    icon: <Settings size={20} />,
    iconClass: "admin-settings__icon-wrap--blue",
    label: "Store settings",
    desc: "Configure store name, currency, and policies",
  },
];

export default function AdminSettings() {
  return (
    <div className="admin-settings">

      <div className="admin-settings__header">
        <h2 className="admin-settings__title">Admin settings</h2>
        <p className="admin-settings__subtitle">
          Manage your store, users, and orders from one place
        </p>
      </div>

      <div className="admin-settings__grid">
        {CARDS.map(({ to, icon, iconClass, label, desc }) => (
          <Link key={to} to={to} className="admin-settings__card">
            <div className={`admin-settings__icon-wrap ${iconClass}`} aria-hidden="true">
              {icon}
            </div>
            <div>
              <p className="admin-settings__card-label">{label}</p>
              <p className="admin-settings__card-desc">{desc}</p>
            </div>
            <div className="admin-settings__card-footer">
              Go to page <ArrowRight size={12} />
            </div>
          </Link>
        ))}
      </div>

      <hr className="admin-settings__divider" />
      <Button>
        <Link to="/">
        Back to home</Link>
      </Button>

    </div>
  );
}
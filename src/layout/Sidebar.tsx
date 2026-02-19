import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Shield,
  Users,
  Lock
} from "lucide-react";
import "./sidebar.css";

const menu = [
  {
    label: "Dashboard",
    to: "/dashboard",
    icon: LayoutDashboard
  },
  {
    label: "Admins",
    to: "/admins",
    icon: Users
  },
  {
    label: "Roles",
    to: "/roles",
    icon: Shield
  },
  {
    label: "Permissions",
    to: "/permissions",
    icon: Lock
  }
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        Center Guard
      </div>

      <nav className="sidebar-nav">
        {menu.map(item => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}

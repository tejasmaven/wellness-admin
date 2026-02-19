import { useEffect, useState } from "react";
import { getDashboardStats } from "../api/dashboard.api";
import "./dashboard.css";

type Stats = {
  admins: number;
  roles: number;
  permissions: number;
  pendingCenters: number;
};

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    getDashboardStats()
      .then(setStats)
      .catch(() => {});
  }, []);

  return (
    <div className="dashboard">
      <h1 className="page-title">Dashboard</h1>

      <div className="stats-grid">
        <StatCard title="Total Admins" value={stats?.admins} />
        <StatCard title="Roles" value={stats?.roles} />
        <StatCard title="Permissions" value={stats?.permissions} />
        <StatCard title="Pending Centers" value={stats?.pendingCenters} />
       
      </div>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value?: number }) {
  return (
    <div className="stat-card">
      <div className="stat-title">{title}</div>
      <div className="stat-value">
        {value !== undefined ? value : "—"}
      </div>
    </div>
  );
}

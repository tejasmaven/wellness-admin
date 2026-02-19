import { useEffect, useState } from "react";
import api from "../api/axios";

type Admin = {
  id: number;
  name: string;
  email: string;
  status: "ACTIVE" | "SUSPENDED";
  role_id: number;      
  role_name: string; 
};

type Role = {
  id: number;
  name: string;
};

export default function Admins() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roleId, setRoleId] = useState<number | null>(null);

  /* FETCH DATA */

  const fetchAdmins = async () => {
    const res = await api.get("/admins");
    setAdmins(res.data);
  };

  const fetchRoles = async () => {
    try {
      const res = await api.get("/roles");
      setRoles(res.data || []);
      if (res.data?.length) {
        setRoleId(res.data[0].id);
      }
    } catch (err) {
      console.warn("Roles not allowed or failed");
      setRoles([]);
    }
  };

  useEffect(() => {
    Promise.all([fetchAdmins(), fetchRoles()])
      .finally(() => setLoading(false));
  }, []);

  /*  CREATE ADMIN */

  const createAdmin = async () => {
    if (!name || !email || !password || !roleId) {
      alert("All fields required");
      return;
    }

    await api.post("/admins", {
      name,
      email,
      password,
      role_id: roleId
    });

    setName("");
    setEmail("");
    setPassword("");
    fetchAdmins();
  };

  /*TOGGLE STATUS*/

  const toggleStatus = async (admin: Admin) => {
    await api.patch(`/admins/${admin.id}/status`, {
      status: admin.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE"
    });

    fetchAdmins();
  };

  /*UI */

  if (loading) {
    return <div className="p-6">Loading admins...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Admins</h1>

      {/* ADD ADMIN */}
      <div className="bg-white p-4 rounded shadow space-y-3 max-w-xl">
        <h2 className="font-semibold">Add Admin</h2>

        <input
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
           className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black"
        />
        <br/>
        <input
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
           className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black"
        />
        <br/>

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
           className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black"
        />
        <br/>

        <select
          value={roleId ?? ""}
          onChange={e => setRoleId(Number(e.target.value))}
           className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black"
        >
          {roles.length === 0 && (
            <option value="">No roles available</option>
          )}

          {roles.map(role => (
            <option key={role.id} value={role.id}>
              {role.name}
            </option>
          ))}
        </select>

        <button
          onClick={createAdmin}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Create Admin
        </button>
      </div>

      {/* ADMIN LIST */}
      <div className="bg-white rounded shadow">
        <table className="w-full text-left">
          <thead className="border-b">
            <tr>
              <th className="p-3">Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {admins.map(admin => (
              <tr key={admin.id} className="border-b">
                <td className="p-3">{admin.name}</td>
                <td>{admin.email}</td>
                <td>{admin.role_name}</td>
                <td>
                  <span
                    className={
                      admin.status === "ACTIVE"
                        ? "text-green-600"
                        : "text-red-500"
                    }
                  >
                    {admin.status}
                  </span>
                </td>
                <td>
                  <button
                    onClick={() => toggleStatus(admin)}
                    className="px-3 py-1 text-sm border rounded"
                  >
                    {admin.status === "ACTIVE"
                      ? "Suspend"
                      : "Activate"}
                  </button>
                </td>
              </tr>
            ))}

            {admins.length === 0 && (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-500">
                  No admins found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

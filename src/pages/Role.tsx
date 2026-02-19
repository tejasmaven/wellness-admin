import { useEffect, useState } from "react";
import {
  getRoles,
  createRole,
  deleteRole
} from "../api/roles.api";

import RolePermissionEditor from "../components/RolePermissionEditor";

type Role = {
  id: number;
  name: string;
  permissions?: string[];
};

export default function Roles() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [newRole, setNewRole] = useState("");
  const [loading, setLoading] = useState(true);

  /* ---------------- LOAD ROLES ---------------- */

  const loadRoles = async () => {
    try {
      const data = await getRoles();
      setRoles(data || []);
    } catch {
      setRoles([]);
    }
  };

  useEffect(() => {
    loadRoles().finally(() => setLoading(false));
  }, []);

  /* ---------------- ADD ROLE ---------------- */

  const handleAddRole = async () => {
    if (!newRole.trim()) return;

    await createRole({ name: newRole });
    setNewRole("");
    loadRoles();
  };

  /* ---------------- DELETE ROLE ---------------- */

  const handleDelete = async (id: number) => {
    if (!confirm("Delete role?")) return;

    await deleteRole(id);
    loadRoles();
  };

  /* ---------------- UI ---------------- */

  if (loading) {
    return <div className="p-6">Loading roles...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Manage Roles</h1>

      {/* ADD ROLE CARD */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 max-w-xl">
        <h2 className="font-semibold mb-4">Add Role</h2>

        <div className="flex gap-3">
          <input
            placeholder="Role name"
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />

          <button
            onClick={handleAddRole}
            className="bg-black text-white px-4 py-2 rounded-md text-sm hover:opacity-90 transition"
          >
            Add
          </button>
        </div>
      </div>

      {/* ROLES TABLE */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Permissions
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-100">
            {roles.map((role) => (
              <tr key={role.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {role.name}
                </td>

                <td className="px-6 py-4 text-sm text-gray-600">
                  {(role.permissions || []).join(", ") || "-"}
                </td>

                <td className="px-6 py-4 text-right space-x-2">
                  <button
                    onClick={() => setSelectedRole(role)}
                    className="inline-flex items-center px-3 py-1.5 text-xs font-medium border border-gray-300 rounded-md hover:bg-gray-100 transition"
                  >
                    Edit
                  </button>

                  {role.name !== "SUPER_ADMIN" && (
                    <button
                      onClick={() => handleDelete(role.id)}
                      className="inline-flex items-center px-3 py-1.5 text-xs font-medium bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition"
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}

            {roles.length === 0 && (
              <tr>
                <td
                  colSpan={3}
                  className="px-6 py-6 text-center text-sm text-gray-500"
                >
                  No roles found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* EDIT PERMISSIONS MODAL */}
      {selectedRole && (
        <RolePermissionEditor
          role={selectedRole}
          onClose={() => setSelectedRole(null)}
          onSaved={() => {
            setSelectedRole(null);
            loadRoles();
          }}
        />
      )}
    </div>
  );
}

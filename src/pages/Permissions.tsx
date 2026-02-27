import { useEffect, useState } from "react";
import {
  getPermissions,
  createPermission,
  deletePermission
} from "../api/permissions.api";
import PermissionEditor from "../components/PermissionEditor";

type Permission = {
  id: number;
  perm_key: string;
  module: string;
  description: string;
};

export default function Permissions() {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [selected, setSelected] = useState<Permission | null>(null);
  const [loading, setLoading] = useState(true);

  // Add form state
  const [permKey, setPermKey] = useState("");
  const [module, setModule] = useState("");
  const [description, setDescription] = useState("");

  const loadPermissions = async () => {
    try {
      const data = await getPermissions();
      setPermissions(data || []);
    } catch (err) {
      console.error("Failed loading permissions", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPermissions();
  }, []);

  // CREATE PERMISSION
  const handleCreate = async () => {
    if (!permKey.trim()) {
      alert("Permission key is required");
      return;
    }

    try {
      await createPermission({
        perm_key: permKey,
        module,
        description
      });

      setPermKey("");
      setModule("");
      setDescription("");
      loadPermissions();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to create permission");
    }
  };

  // DELETE PERMISSION
  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this permission?")) return;
    
    try {
      await deletePermission(id);
      loadPermissions();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete permission");
    }
  };

  /* UI */

  if (loading) {
    return <div className="p-6">Loading permissions...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Permissions</h1>

      {/* ADD CARD */}
      <div className="bg-white p-4 rounded shadow space-y-4 max-w-4xl">
        <h2 className="font-semibold text-lg border-b pb-2">Add Permission</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            placeholder="Permission Key (e.g., ADMIN_MANAGE)"
            value={permKey}
            onChange={(e) => setPermKey(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />

          <input
            placeholder="Module"
            value={module}
            onChange={(e) => setModule(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />

          <input
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <button
          onClick={handleCreate}
          className="bg-black text-white px-4 py-2 rounded mt-2 hover:bg-gray-800 transition-colors"
        >
          Add Permission
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-left min-w-max">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="p-3">Permission Key</th>
              <th>Module</th>
              <th>Description</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {permissions.map((p) => (
              <tr key={p.id} className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium text-gray-800">{p.perm_key}</td>
                <td className="text-gray-600">{p.module || "-"}</td>
                <td className="text-gray-600">{p.description || "-"}</td>

                <td className="p-3 flex justify-end gap-2">
                  <button
                    onClick={() => setSelected(p)}
                    className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="px-3 py-1 text-sm border border-red-200 text-red-600 rounded hover:bg-red-50 transition-colors"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {permissions.length === 0 && (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-500">
                  No permissions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* EDITOR MODAL COMPONENT */}
      {selected && (
        <PermissionEditor
          permission={selected}
          onClose={() => setSelected(null)}
          onSaved={() => {
            setSelected(null);
            loadPermissions();
          }}
        />
      )}
    </div>
  );
}
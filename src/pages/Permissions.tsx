import { useEffect, useState } from "react";
import {
  getPermissions,
  createPermission,
  deletePermission
} from "../api/permissions.api";
import PermissionEditor from "../components/PermissionEditor";

export default function Permissions() {
  const [permissions, setPermissions] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | null>(null);

  // add form
  const [permKey, setPermKey] = useState("");
  const [module, setModule] = useState("");
  const [description, setDescription] = useState("");

  const loadPermissions = async () => {
    try {
      const data = await getPermissions();
      setPermissions(data || []);
    } catch (err) {
      console.error("Failed loading permissions", err);
    }
  };

  useEffect(() => {
    loadPermissions();
  }, []);

  // ✅ create permission
  const handleCreate = async () => {
    if (!permKey.trim()) return alert("Permission key required");

    await createPermission({
      perm_key: permKey,
      module,
      description
    });

    setPermKey("");
    setModule("");
    setDescription("");
    loadPermissions();
  };

  // ✅ delete
  const handleDelete = async (id: number) => {
    if (!confirm("Delete permission?")) return;
    await deletePermission(id);
    loadPermissions();
  };

  return (
    <div>
      <h1 style={{ marginBottom: 20 }}>Permissions</h1>

      {/* ================= ADD CARD ================= */}
      <div style={addCard}>
        <h3>Add Permission</h3>

        <div style={row}>
          <input
            placeholder="Permission Key (ADMIN_MANAGE)"
            value={permKey}
            onChange={(e) => setPermKey(e.target.value)}
            style={input}
          />

          <input
            placeholder="Module"
            value={module}
            onChange={(e) => setModule(e.target.value)}
            style={input}
          />

          <input
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={input}
          />

          <button style={addBtn} onClick={handleCreate}>
            Add
          </button>
        </div>
      </div>

      {/* ================= TABLE ================= */}
      <div style={table}>
        <div style={headerRow}>
          <b>Permission</b>
          <b>Module</b>
          <b>Description</b>
          <b>Action</b>
        </div>

        {permissions.map((p) => (
          <div key={p.id} style={dataRow}>
            <div>{p.perm_key}</div>
            <div>{p.module || "-"}</div>
            <div>{p.description || "-"}</div>

            <div>
              <button
                style={editBtn}
                onClick={() => setSelected(p)}
              >
                Edit
              </button>

              <button
                style={deleteBtn}
                onClick={() => handleDelete(p.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

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

/* ================= STYLES ================= */

const addCard = {
  background: "#fff",
  padding: 20,
  borderRadius: 8,
  marginBottom: 20,
  border: "1px solid #eee"
};

const row = {
  display: "flex",
  gap: 10,
  marginTop: 10
};

const input = {
  flex: 1,
  padding: 10,
  border: "1px solid #ddd",
  borderRadius: 6
};

const addBtn = {
  background: "#16a34a",
  color: "#fff",
  border: "none",
  padding: "10px 18px",
  borderRadius: 6,
  cursor: "pointer"
};

const table = {
  background: "#fff",
  borderRadius: 8,
  overflow: "hidden",
  border: "1px solid #eee"
};

const headerRow = {
  display: "grid",
  gridTemplateColumns: "2fr 1fr 2fr 1fr",
  padding: 12,
  background: "#f5f5f5"
};

const dataRow = {
  display: "grid",
  gridTemplateColumns: "2fr 1fr 2fr 1fr",
  padding: 12,
  borderTop: "1px solid #eee",
  alignItems: "center"
};

const editBtn = {
  marginRight: 8,
  background: "#111",
  color: "#fff",
  border: "none",
  padding: "6px 12px",
  borderRadius: 6,
  cursor: "pointer"
};

const deleteBtn = {
  background: "#ef4444",
  color: "#fff",
  border: "none",
  padding: "6px 12px",
  borderRadius: 6,
  cursor: "pointer"
};

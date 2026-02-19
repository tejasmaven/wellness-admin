import { useEffect, useState } from "react";
import { getPermissions } from "../api/permissions.api";
import { updateRolePermissions } from "../api/roles.api";

export default function RolePermissionEditor({
  role,
  onClose,
  onSaved
}: any) {

  const [permissions, setPermissions] = useState<any[]>([]);
  const [selected, setSelected] = useState<number[]>([]);

  useEffect(() => {
    async function load() {
      const perms = await getPermissions();
      setPermissions(perms || []);

      const selectedIds = perms
        .filter((p: any) =>
          role.permissions?.includes(p.perm_key)
        )
        .map((p: any) => p.id);

      setSelected(selectedIds);
    }

    load();
  }, [role]);

  const toggle = (id: number) => {
    setSelected(prev =>
      prev.includes(id)
        ? prev.filter(x => x !== id)
        : [...prev, id]
    );
  };

  const handleSave = async () => {
    await updateRolePermissions(role.id, selected);
    onSaved();
  };

  return (
    <div style={overlay}>
      <div style={modal}>
        <h3>Edit Role: {role.name}</h3>

        {permissions.map(p => (
          <label key={p.id} style={row}>
            <input
              type="checkbox"
              checked={selected.includes(p.id)}
              onChange={() => toggle(p.id)}
              //disabled={role.name === "SUPER_ADMIN"}
            />
            {p.perm_key}
          </label>
        ))}

        <div style={{ marginTop: 20 }}>
          <button onClick={onClose}>Cancel</button>
          <button style={saveBtn} onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

const overlay: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
};

const modal: React.CSSProperties = {
  background: "#fff",
  padding: 24,
  width: 450,
  borderRadius: 8,
  maxHeight: "80vh",
  overflowY: "auto"
};

const row = {
  display: "block",
  marginTop: 10
};

const saveBtn = {
  marginLeft: 10,
  background: "black",
  color: "white",
  padding: "8px 14px",
  border: "none"
};

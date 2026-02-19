import { useState } from "react";
import type { CSSProperties } from "react";

import { updatePermission } from "../api/permissions.api";

type Props = {
  permission: any;
  onClose: () => void;
  onSaved: () => void;
};

export default function PermissionEditor({
  permission,
  onClose,
  onSaved
}: Props) {
  const [module, setModule] = useState(permission.module || "");
  const [description, setDescription] = useState(
    permission.description || ""
  );
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    try {
      setSaving(true);

      await updatePermission(permission.id, {
        module,
        description
      });

      onSaved();
    } catch (err) {
      console.error("Update failed", err);
      alert("Failed to update permission");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={overlay}>
      <div style={modal}>
        <h3 style={{ marginBottom: 12 }}>Edit Permission</h3>

        {/* perm key (readonly) */}
        <label style={label}>Permission Key</label>
        <input value={permission.perm_key} disabled style={input} />

        {/* module */}
        <label style={label}>Module</label>
        <input
          placeholder="Module"
          value={module}
          onChange={(e) => setModule(e.target.value)}
          style={input}
        />

        {/* description */}
        <label style={label}>Description</label>
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ ...input, height: 90 }}
        />

        <div style={footer}>
          <button style={cancelBtn} onClick={onClose}>
            Cancel
          </button>

          <button
            style={saveBtn}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const overlay: CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.45)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 999
};

const modal: CSSProperties = {
  background: "#fff",
  padding: 24,
  width: 440,
  borderRadius: 10,
  boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
};

const label: CSSProperties = {
  fontSize: 13,
  marginTop: 12,
  display: "block",
  color: "#555"
};

const input: CSSProperties = {
  width: "100%",
  padding: 10,
  marginTop: 6,
  borderRadius: 6,
  border: "1px solid #ddd"
};

const footer: CSSProperties = {
  marginTop: 22,
  display: "flex",
  justifyContent: "flex-end",
  gap: 10
};

const cancelBtn: CSSProperties = {
  padding: "8px 14px",
  borderRadius: 6,
  border: "1px solid #ccc",
  background: "#fff",
  cursor: "pointer"
};

const saveBtn: CSSProperties = {
  background: "black",
  color: "white",
  padding: "8px 16px",
  border: "none",
  borderRadius: 6,
  cursor: "pointer"
};

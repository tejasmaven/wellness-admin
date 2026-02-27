import { useState } from "react";
import { updatePartner } from "../api/partners.api";

type Partner = {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: "ACTIVE" | "SUSPENDED";
};

type Props = {
  partner: Partner;
  onClose: () => void;
  onSaved: () => void;
};

export default function PartnerEditor({ partner, onClose, onSaved }: Props) {
  // The backend update controller only accepts name and phone.
  const [name, setName] = useState(partner.name || "");
  const [phone, setPhone] = useState(partner.phone || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      alert("Name is required");
      return;
    }

    try {
      setSaving(true);
      await updatePartner(partner.id, { name, phone });
      onSaved();
    } catch (err: any) {
      console.error("Update failed", err);
      alert(err.response?.data?.message || "Failed to update partner");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 w-full max-w-md rounded-lg shadow-xl">
        <h3 className="text-xl font-bold mb-4">Edit Partner</h3>

        {/* EMAIL (Read-only, since email shouldn't change to maintain DB integrity) */}
        <label className="block text-sm text-gray-700 mt-4 mb-1">Email</label>
        <input 
          value={partner.email} 
          disabled 
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-100 cursor-not-allowed"
        />

        {/* NAME */}
        <label className="block text-sm text-gray-700 mt-4 mb-1">Name</label>
        <input
          placeholder="Partner Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black"
        />

        {/* PHONE */}
        <label className="block text-sm text-gray-700 mt-4 mb-1">Phone</label>
        <input
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black"
        />

        <div className="mt-6 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className={`bg-black text-white px-4 py-2 rounded transition-colors ${saving ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-800"}`}
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
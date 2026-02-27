import { useEffect, useState } from "react";
import {
  getPartners,
  createPartner,
  togglePartnerStatus
} from "../api/partners.api";
import PartnerEditor from "../components/PartnerEditor";

type Partner = {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: "ACTIVE" | "SUSPENDED";
};

export default function Partners() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null); 

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const load = async () => {
    try {
      const data = await getPartners();
      setPartners(data);
    } catch (err) {
      console.error("Failed to load partners", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async () => {
    if (!name || !email || !password) {
      alert("Name, email, and password are required");
      return;
    }

    try {
      await createPartner({ name, email, phone, password });
      setName("");
      setEmail("");
      setPhone("");
      setPassword("");
      load();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to create partner");
    }
  };

  const toggle = async (p: Partner) => {
    try {
      await togglePartnerStatus(
        p.id,
        p.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE"
      );
      load();
    } catch (err) {
      console.error("Failed to toggle status", err);
    }
  };

  /* UI */

  if (loading) {
    return <div className="p-6">Loading partners...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Partners</h1>

      {/* ADD CARD */}
      <div className="bg-white p-4 rounded shadow space-y-3 max-w-xl">
        <h2 className="font-semibold text-lg border-b pb-2">Add Partner</h2>

        <input
          placeholder="Name *"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black"
        />
        
        <input
          placeholder="Email *"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black"
        />

        <input
          type="password"
          placeholder="Password *"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black"
        />

        <input
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black"
        />

        <button
          onClick={handleCreate}
          className="bg-black text-white px-4 py-2 rounded mt-2 hover:bg-gray-800 transition-colors"
        >
          Add Partner
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-left min-w-max">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="p-3">Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {partners.map((p) => (
              <tr key={p.id} className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium text-gray-800">{p.name}</td>
                <td className="text-gray-600">{p.email}</td>
                <td className="text-gray-600">{p.phone || "-"}</td>

                <td>
                  <span
                    className={
                      p.status === "ACTIVE" ? "text-green-600 font-medium" : "text-red-500 font-medium"
                    }
                  >
                    {p.status}
                  </span>
                </td>

                <td className="p-3 flex justify-end gap-2">
                  <button
                    onClick={() => setSelectedPartner(p)}
                    className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => toggle(p)}
                    className={`px-3 py-1 text-sm border rounded transition-colors ${
                      p.status === "ACTIVE" 
                        ? "border-red-200 text-red-600 hover:bg-red-50" 
                        : "border-green-200 text-green-600 hover:bg-green-50"
                    }`}
                  >
                    {p.status === "ACTIVE" ? "Suspend" : "Activate"}
                  </button>
                </td>
              </tr>
            ))}

            {partners.length === 0 && (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">
                  No partners found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* RENDER MODAL IF A PARTNER IS SELECTED */}
      {selectedPartner && (
        <PartnerEditor
          partner={selectedPartner}
          onClose={() => setSelectedPartner(null)}
          onSaved={() => {
            setSelectedPartner(null);
            load();
          }}
        />
      )}
    </div>
  );
}
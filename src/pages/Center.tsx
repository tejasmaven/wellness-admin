import { useEffect, useState } from "react";
import { 
  createCenter, 
  getPendingCenters, 
  getVerifiedCenters, 
  verifyCenterStatus 
} from "../api/center.api"; 
import { getPartners } from "../api/partners.api"; 

type Center = {
  id: number;
  name: string;
  center_type: string;
  verified_status: string;
  created_at: string;
};

type Partner = {
  id: number;
  name: string;
};

export default function Centers() {
  const [centers, setCenters] = useState<Center[]>([]);
  const [verifiedCenters, setVerifiedCenters] = useState<Center[]>([]); 
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  const [partnerId, setPartnerId] = useState<number | "">("");
  const [name, setName] = useState("");
  const [centerType, setCenterType] = useState("");
  const [description, setDescription] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");

  const load = async () => {
    try {
      const [centersData, verifiedData, partnersData] = await Promise.all([
        getPendingCenters(),
        getVerifiedCenters(),
        getPartners()
      ]);
      setCenters(centersData);
      setVerifiedCenters(verifiedData);
      setPartners(partnersData);
    } catch (err) {
      console.error("Failed to load data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async () => {
    if (!name || !centerType || !city || !state || !partnerId) {
      alert("Partner, Name, Center Type, City, and State are required");
      return;
    }

    try {
      await createCenter({
        partner_id: partnerId,
        name,
        center_type: centerType,
        description,
        address_line1: addressLine1,
        city,
        state,
        pincode,
      });
      
      setPartnerId("");
      setName("");
      setCenterType("");
      setDescription("");
      setAddressLine1("");
      setCity("");
      setState("");
      setPincode("");
      
      load();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to create center");
    }
  };

  const handleVerify = async (id: number, status: "VERIFIED" | "REJECTED") => {
    if (!window.confirm(`Are you sure you want to mark this center as ${status}?`)) return;

    try {
      await verifyCenterStatus(id, status);
      load(); 
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to update center status");
    }
  };

  /* UI */

  if (loading) {
    return <div className="p-6">Loading centers...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Centers</h1>

      {/* ADD CENTER CARD */}
      <div className="bg-white p-4 rounded shadow space-y-4 max-w-2xl">
        <h2 className="font-semibold text-lg border-b pb-2">Add New Center</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            value={partnerId}
            onChange={(e) => setPartnerId(Number(e.target.value) || "")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black"
          >
            <option value="">Select Partner *</option>
            {partners.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <input
            placeholder="Center Name *"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
          
          <select
            value={centerType}
            onChange={(e) => setCenterType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black"
          >
            <option value="">Select Center Type *</option>
            <option value="SALON">SALON</option>
            <option value="YOGA">YOGA</option>
            <option value="SPA">SPA</option>
            <option value="THERAPY">THERAPY</option>
            <option value="GYM">GYM</option>
            <option value="OTHER">OTHER</option>
          </select>

          <input
            placeholder="City *"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            placeholder="State *"
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />

          <input
            placeholder="Address Line 1"
            value={addressLine1}
            onChange={(e) => setAddressLine1(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            placeholder="Pincode"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black"
        />

        <button
          onClick={handleCreate}
          className="bg-black text-white px-4 py-2 rounded mt-2 hover:bg-gray-800 transition-colors"
        >
          Add Center
        </button>
      </div>

      {/* PENDING CENTERS TABLE */}
      <div className="bg-white rounded shadow overflow-x-auto">
        <div className="p-4 border-b bg-yellow-50">
          <h3 className="font-semibold text-yellow-800">Pending Approvals</h3>
        </div>
        <table className="w-full text-left min-w-max">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="p-3">Name</th>
              <th>Type</th>
              <th>Status</th>
              <th>Created Date</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {centers.map((c) => (
              <tr key={c.id} className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium text-gray-800">{c.name}</td>
                <td>
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md font-medium">
                    {c.center_type}
                  </span>
                </td>
                <td>
                  <span className="text-yellow-600 font-medium text-sm">
                    {c.verified_status}
                  </span>
                </td>
                <td className="text-gray-500 text-sm">
                  {new Date(c.created_at).toLocaleDateString()}
                </td>
                
                <td className="p-3 flex justify-end gap-2">
                  <button
                    onClick={() => handleVerify(c.id, "VERIFIED")}
                    className="px-3 py-1 text-sm border border-green-200 text-green-700 rounded hover:bg-green-50 transition-colors"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleVerify(c.id, "REJECTED")}
                    className="px-3 py-1 text-sm border border-red-200 text-red-600 rounded hover:bg-red-50 transition-colors"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}

            {centers.length === 0 && (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">
                  No pending centers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* VERIFIED CENTERS TABLE */}
      <div className="bg-white rounded shadow overflow-x-auto">
        <div className="p-4 border-b bg-green-50">
          <h3 className="font-semibold text-green-800">Verified Centers</h3>
        </div>
        <table className="w-full text-left min-w-max">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="p-3">Name</th>
              <th>Type</th>
              <th>Status</th>
              <th>Created Date</th>
            </tr>
          </thead>

          <tbody>
            {verifiedCenters.map((c) => (
              <tr key={c.id} className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium text-gray-800">{c.name}</td>
                <td>
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md font-medium">
                    {c.center_type}
                  </span>
                </td>
                <td>
                  <span className="text-green-600 font-medium text-sm">
                    {c.verified_status}
                  </span>
                </td>
                <td className="text-gray-500 text-sm">
                  {new Date(c.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}

            {verifiedCenters.length === 0 && (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-500">
                  No verified centers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
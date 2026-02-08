import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import EditCaseModal from "../Cases/AllCases/EditCaseModal";
import toast from "react-hot-toast";
import { FaEdit, FaPlus } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";

const InfoRow = ({ label, value }) => (
  <div className="flex justify-between border-b py-2 text-sm">
    <span className="font-medium text-gray-600">{label}</span>
    <span className="text-gray-800">{value || "-"}</span>
  </div>
);

const Card = ({ title, onEdit, children, editLabel = "Edit", icon }) => (
  <div className="bg-base-100 rounded-xl shadow p-4">
    <div className="flex justify-between items-center mb-3">
      <h3 className="font-semibold text-lg">{title}</h3>
      {onEdit && (
        <button
          className="btn btn-xs btn-success flex items-center gap-1"
          onClick={onEdit}
        >
          {icon} {editLabel}
        </button>
      )}
    </div>
    {children}
  </div>
);

const DetailsModal = ({
  detailsEdit,
  setDetailsEdit,
  handleDetailsSave,
  onClose,
}) => (
  <div className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center">
    <div className="bg-base-100 w-full max-w-md rounded-xl p-6 space-y-4">
      <h3 className="text-lg font-semibold">Edit Case Details</h3>

      <label className="font-medium">Description</label>
      <textarea
        className="textarea textarea-bordered w-full"
        rows={3}
        value={detailsEdit.description}
        onChange={(e) =>
          setDetailsEdit((prev) => ({ ...prev, description: e.target.value }))
        }
      />

      <label className="font-medium">Case Laws</label>
      <input
        type="text"
        className="input input-bordered w-full"
        value={detailsEdit.laws}
        onChange={(e) =>
          setDetailsEdit((prev) => ({ ...prev, laws: e.target.value }))
        }
      />

      <label className="font-medium">Payable Fees</label>
      <input
        type="number"
        className="input input-bordered w-full"
        value={detailsEdit.fees.payable || ""}
        onChange={(e) =>
          setDetailsEdit((prev) => ({
            ...prev,
            fees: { ...prev.fees, payable: e.target.value },
          }))
        }
      />

      <div className="flex flex-col gap-3">
        <button className="btn btn-primary w-full" onClick={handleDetailsSave}>
          Save
        </button>
        <button className="btn btn-outline w-full" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  </div>
);

const AppointedPartyModal = ({ initialData, onSave, onClose }) => {
  const [form, setForm] = useState(() => ({
    type: initialData?.type || "appointed", // default type
    name: initialData?.name || "",
    mobile: initialData?.mobile || "",
    email: initialData?.email || "",
    address: initialData?.address || "",
  }));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/60 flex items-center justify-center">
      <div className="bg-base-100 w-full max-w-md rounded-xl p-6 space-y-4">
        <h3 className="text-lg font-semibold text-center">Party Details</h3>

        {/* Dropdown for type */}
        <label className="font-medium">Type</label>
        <select
          name="type"
          className="select select-bordered w-full"
          value={form.type}
          onChange={handleChange}
        >
          <option value="appointed">Appointed</option>
          <option value="opposite">Opposite</option>
        </select>

        <input
          name="name"
          className="input input-bordered w-full"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
        />

        <input
          name="mobile"
          type="number"
          className="input input-bordered w-full"
          value={form.mobile}
          onChange={handleChange}
          placeholder="Mobile"
        />

        <input
          name="email"
          className="input input-bordered w-full"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
        />

        <textarea
          name="address"
          className="textarea textarea-bordered w-full"
          value={form.address}
          onChange={handleChange}
          placeholder="Address"
        />

        <div className="flex flex-col gap-2 pt-2">
          <button className="btn btn-primary w-full" onClick={handleSubmit}>
            Save
          </button>
          <button className="btn btn-outline w-full" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const DetailsEdit = () => {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeEdit, setActiveEdit] = useState(null);
  const [appointedEditOpen, setAppointedEditOpen] = useState(false);
  const [appointedUpdateOpen, setAppointedUpdateOpen] = useState(false);
  const [editingParty, setEditingParty] = useState(null);

  const [detailsEdit, setDetailsEdit] = useState({
    description: "",
    laws: "",
    fees: { payable: 0 },
  });

  useEffect(() => {
    const fetchCase = async () => {
      try {
        const res = await axiosSecure.get(`/cases/${id}`);
        const data = res.data || {};

        setCaseData(data);
        setDetailsEdit({
          description: data.description || "",
          laws: data.laws || "",
          fees: { payable: data.fees?.payable || 0 },
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCase();
  }, [id]);

  const fetchParties = async () => {
    const res = await axiosSecure.get(`/caseParty/${id}/parties`);
    return res.data?.data || [];
  };
  const fetchDetails = async () => {
    const res = await axiosSecure.get(`/casesDetails/${id}/details`);
    return res.data || [];
  };

  const { data: details = [], refetch: dataRefetch } = useQuery({
    queryKey: ["caseDetails", id],
    queryFn: fetchDetails,
    enabled: !!id,
  });
  const { data: parties = [], refetch } = useQuery({
    queryKey: ["caseParties", id],
    queryFn: fetchParties,
    enabled: !!id,
  });

  if (loading) return <div className="p-6">Loading case details...</div>;
  if (!caseData) return <div className="p-6 text-red-500">Case not found</div>;

  const handleDetailsSave = async () => {
    try {
      const updatedData = {
        description: detailsEdit.description,
        laws: detailsEdit.laws,
        fees: { payable: Number(detailsEdit.fees.payable) },
      };

      setCaseData({ ...caseData, ...updatedData });
      await axiosSecure.post(`/casesDetails/${id}/details`, updatedData);
      dataRefetch();
      toast.success("Case details updated successfully!");
      refetch();
      setActiveEdit(null);
    } catch (error) {
      console.error("Failed to update case:", error);
      toast.error("Failed to update case. Please try again!");
    }
  };
  const handleAppointedSave = async (data) => {
    try {
      const res = await axiosSecure.post(`/caseParty/${id}/parties`, data);

      setCaseData((prev) => ({
        ...prev,
        appointedParty: res.data.appointedParty,
      }));

      toast.success("Appointed party updated!");
      setAppointedEditOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save appointed party");
    }
  };

  const handleEditParty = (party) => {
    setEditingParty(party);
    setAppointedUpdateOpen(true);
  };

  const handleDeleteParty = async (party) => {
    try {
      await axiosSecure.delete(
        `/caseParty/${party.caseId}/parties/${party._id}`,
      );
      refetch();

      toast.success("Party deleted successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete party");
    }
  };
	const singleDetails = details?.length ? details[0] : null;
	const handleDetailsEdit = () => {
  setDetailsEdit({
    description: singleDetails?.description || "",
    laws: singleDetails?.laws || "",
    fees: { payable: singleDetails?.fees?.payable || 0 },
  });

  setActiveEdit("details");
};
console.table(detailsEdit)

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Case Details</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Info */}
        <Card
          title="Basic Info"
          onEdit={() => setActiveEdit("basic")}
          editLabel="Edit"
          icon={<FaEdit />}
        >
          <InfoRow label="File No" value={caseData.fileNo} />
          <InfoRow label="Case No" value={caseData.caseNo} />
          <InfoRow label="Court" value={caseData.court} />
          <InfoRow label="Police Station" value={caseData.policeStation} />
          <InfoRow label="Case Type" value={caseData.caseType} />
          <InfoRow label="Status" value={caseData.status} />
          <InfoRow label="First Party" value={caseData.firstParty} />
          <InfoRow label="Second Party" value={caseData.secondParty} />
          <InfoRow label="Phone" value={caseData.mobileNo} />
          <InfoRow label="Law Section" value={caseData.lawSection} />
          <InfoRow
            label="Created"
            value={
              caseData.createdAt
                ? new Date(caseData.createdAt).toLocaleString()
                : "-"
            }
          />
          <InfoRow label="Comments" value={caseData.comments} />
        </Card>

        {/* Case Details */}
        <Card
          title="Case Details"
          onEdit={handleDetailsEdit}
          editLabel={singleDetails ? "Edit" : "Add New"}
          icon={singleDetails ? <FaEdit /> : <FaPlus />}
        >
          <InfoRow
            label="Description"
            value={singleDetails?.description || "-"}
          />
          <InfoRow label="Case Laws" value={singleDetails?.laws || "-"} />
          <InfoRow
            label="Payable Fees"
            value={singleDetails?.fees?.payable || 0}
          />
          <InfoRow label="Paid" value={caseData.fees?.paid || 0} />
        </Card>

        {/* Appointed Party Details */}
        <Card
          title="Appointed Party Details"
          onEdit={() => {
            setEditingParty(null);
            setAppointedUpdateOpen(true);
          }}
          editLabel="Add New"
          icon={<FaPlus />}
        >
          {parties?.length ? (
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full text-sm">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Mobile</th>
                    <th>Email</th>
                    <th>Address</th>
                    <th>Type</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {parties.map((party) => (
                    <tr key={party._id}>
                      <td>{party.name}</td>
                      <td>{party.mobile}</td>
                      <td>{party.email}</td>
                      <td>{party.address}</td>
                      <td>
                        <span
                          className={`badge ${
                            party.type === "appointed"
                              ? "badge-success"
                              : "badge-warning"
                          }`}
                        >
                          {party.type}
                        </span>
                      </td>
                      <td className="flex gap-2">
                        <button
                          className="btn btn-xs btn-success"
                          onClick={() => handleEditParty(party)}
                        >
                          Update
                        </button>
                        <button
                          className="btn btn-xs btn-error"
                          onClick={() => handleDeleteParty(party)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <span className="text-gray-500">No appointed parties found.</span>
          )}
        </Card>

        {/* Opposite Advocate Details */}
        <Card
          title="Opposite Advocate Details"
          onEdit={() => setActiveEdit("opposite")}
          editLabel={caseData.oppositeAdvocate ? "Edit" : "Add New"}
          icon={caseData.oppositeAdvocate ? <FaEdit /> : <FaPlus />}
        >
          <InfoRow label="Advocate Name" value={caseData.oppositeAdvocate} />
          <InfoRow label="Phone" value={caseData.oppositeAdvocatePhone} />
        </Card>

        {/* Payment Details */}
        <Card
          title="Payment Details"
          onEdit={() => setActiveEdit("payment")}
          editLabel={caseData.fees?.payable ? "Edit" : "Add New"}
          icon={caseData.fees?.payable ? <FaEdit /> : <FaPlus />}
        >
          <InfoRow label="Payable Fees" value={caseData.fees?.payable || 0} />
          <InfoRow label="Paid" value={caseData.fees?.paid || 0} />
        </Card>

        {/* Previous Dates */}
        <Card
          title="Previous Dates"
          onEdit={() => setActiveEdit("previousDates")}
          editLabel={caseData.previousDates?.length ? "Edit" : "Add New"}
          icon={caseData.previousDates?.length ? <FaEdit /> : <FaPlus />}
        >
          {caseData.previousDates?.length ? (
            caseData.previousDates.map((date, idx) => (
              <InfoRow
                key={idx}
                label={`Date ${idx + 1}`}
                value={new Date(date).toLocaleDateString()}
              />
            ))
          ) : (
            <span className="text-gray-500">No previous dates</span>
          )}
        </Card>
      </div>

      {/* Modals */}
      {activeEdit === "basic" && (
        <EditCaseModal
          caseData={caseData}
          onClose={() => setActiveEdit(null)}
          onUpdate={(updated) => {
            setCaseData(updated);
            setActiveEdit(null);
          }}
        />
      )}
      {appointedEditOpen && (
        <AppointedPartyModal
          initialData={caseData.appointedParty}
          onSave={handleAppointedSave}
          onClose={() => setAppointedEditOpen(false)}
        />
      )}

      {activeEdit === "details" && (
        <DetailsModal
          detailsEdit={detailsEdit}
          setDetailsEdit={setDetailsEdit}
          handleDetailsSave={handleDetailsSave}
          onClose={() => setActiveEdit(null)}
        />
      )}
      {appointedUpdateOpen && (
        <AppointedPartyModal
          initialData={editingParty || { type: "appointed" }}
          onSave={async (data) => {
            try {
              if (editingParty?._id) {
                await axiosSecure.put(
                  `/caseParty/${id}/parties/${editingParty._id}`,
                  data,
                );

                refetch();
              } else {
                // ✅ ADD NEW
                const res = await axiosSecure.post(
                  `/caseParty/${id}/parties`,
                  data,
                );

                refetch();
              }

              toast.success("Party saved successfully!");
              setAppointedUpdateOpen(false);
              setEditingParty(null);
            } catch (err) {
              console.error(err);
              toast.error("Failed to save party");
            }
          }}
          onClose={() => {
            setAppointedUpdateOpen(false);
            setEditingParty(null);
          }}
        />
      )}
    </div>
  );
};

export default DetailsEdit;

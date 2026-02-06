import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import EditCaseModal from "../Cases/AllCases/EditCaseModal";
import toast from "react-hot-toast";
import { FaEdit, FaPlus } from "react-icons/fa";

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
        <button className="btn btn-xs btn-success flex items-center gap-1" onClick={onEdit}>
          {icon} {editLabel}
        </button>
      )}
    </div>
    {children}
  </div>
);

const DetailsModal = ({ detailsEdit, setDetailsEdit, handleDetailsSave, onClose }) => (
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

const DetailsEdit = () => {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeEdit, setActiveEdit] = useState(null);

  const [detailsEdit, setDetailsEdit] = useState({
    description: "",
    laws: "",
    fees: { payable: 0 },
  });

  useEffect(() => {
    axiosSecure.get(`/cases/${id}`).then((res) => {
      const data = res.data || {};
      setCaseData(data);
      setDetailsEdit({
        description: data.description || "",
        laws: data.laws || "",
        fees: { payable: data.fees?.payable || 0 },
      });
      setLoading(false);
    });
  }, [id, axiosSecure]);

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
      await axiosSecure.put(`/cases/${id}`, updatedData);

      toast.success("Case details updated successfully!");
      setActiveEdit(null);
    } catch (error) {
      console.error("Failed to update case:", error);
      toast.error("Failed to update case. Please try again!");
    }
  };

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
            value={caseData.createdAt ? new Date(caseData.createdAt).toLocaleString() : "-"}
          />
          <InfoRow label="Comments" value={caseData.comments} />
        </Card>

        {/* Case Details */}
        <Card
          title="Case Details"
          onEdit={() => setActiveEdit("details")}
          editLabel={
            caseData.description || caseData.laws || caseData.fees?.payable
              ? "Edit"
              : "Add New"
          }
          icon={
            caseData.description || caseData.laws || caseData.fees?.payable
              ? <FaEdit />
              : <FaPlus />
          }
        >
          <InfoRow label="Description" value={caseData.description} />
          <InfoRow label="Case Laws" value={caseData.laws} />
          <InfoRow label="Payable Fees" value={caseData.fees?.payable || 0} />
          <InfoRow label="Paid" value={caseData.fees?.paid || 0} />
        </Card>

        {/* Appointed Party Details */}
        <Card
          title="Appointed Party Details"
          onEdit={() => setActiveEdit("appointed")}
          editLabel={caseData.appointedBy ? "Edit" : "Add New"}
          icon={caseData.appointedBy ? <FaEdit /> : <FaPlus />}
        >
          <InfoRow label="Appointed By" value={caseData.appointedBy} />
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
              <InfoRow key={idx} label={`Date ${idx + 1}`} value={new Date(date).toLocaleDateString()} />
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

      {activeEdit === "details" && (
        <DetailsModal
          detailsEdit={detailsEdit}
          setDetailsEdit={setDetailsEdit}
          handleDetailsSave={handleDetailsSave}
          onClose={() => setActiveEdit(null)}
        />
      )}
    </div>
  );
};

export default DetailsEdit;

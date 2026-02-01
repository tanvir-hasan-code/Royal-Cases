import React, { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

const EditCaseModal = ({ caseData, onClose, onUpdated }) => {
  const axiosInstance = useAxiosSecure();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    fileNo: caseData.fileNo || "",
    caseNo: caseData.caseNo || "",
    date: caseData.date ? caseData.date.split("T")[0] : "",
    company: caseData.company || "",
    firstParty: caseData.firstParty || "",
    secondParty: caseData.secondParty || "",
    appointedBy: caseData.appointedBy || "",
    caseType: caseData.caseType || "",
    court: caseData.court || "",
    policeStation: caseData.policeStation || "",
    fixedFor: caseData.fixedFor || "",
    mobileNo: caseData.mobileNo || "",
    lawSection: caseData.lawSection || "",
    comments: caseData.comments || "",
    status: caseData.status || "Pending",
  });

  const initialDataRef = useRef(JSON.stringify(formData));
  const [isChanged, setIsChanged] = useState(false);

  const [errors, setErrors] = useState({});

  // ================= FETCH DROPDOWN DATA =================
  const { data: companies = [] } = useQuery({
    queryKey: ["companies"],
    queryFn: async () => (await axiosInstance.get("/companies")).data,
  });

  const { data: courts = [] } = useQuery({
    queryKey: ["courts"],
    queryFn: async () => (await axiosInstance.get("/courts")).data,
  });

  const { data: caseTypes = [] } = useQuery({
    queryKey: ["caseTypes"],
    queryFn: async () => (await axiosInstance.get("/cases-type")).data,
  });

  const { data: policeStations = [] } = useQuery({
    queryKey: ["policeStations"],
    queryFn: async () => (await axiosInstance.get("/police-station")).data,
  });
  useEffect(() => {
    const current = JSON.stringify(formData);
    setIsChanged(current !== initialDataRef.current);
  }, [formData]);

  // ================= MUTATION =================
  const mutation = useMutation({
    mutationFn: (updatedCase) =>
      axiosInstance
        .put(`/update-case/${caseData._id}`, updatedCase)
        .then((res) => res.data),

    onSuccess: (data) => {
      queryClient.invalidateQueries(["cases"]);

      if (data.message === "No changes were made") {
        toast("No changes were made", { icon: "ℹ️" });
      } else {
        toast.success(data.message);
      }

      onClose();
    },
    onError: (error) => {
      const msg = error?.response?.data?.message || "Failed to update case";

      if (error?.response?.data?.field) {
        setErrors({ [error.response.data.field]: msg });
      } else {
        toast.error(msg);
      }
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // clear inline error on typing
  };

  const validate = () => {
    const requiredFields = ["fileNo", "caseNo", "date", "court", "firstParty"];
    const newErrors = {};
    requiredFields.forEach((field) => {
      if (!formData[field]?.trim()) {
        newErrors[field] = "This field is required";
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return; // show inline errors
    mutation.mutate(formData);
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999]"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="fixed inset-0 flex justify-center items-center z-[10000] p-4">
        <div className="bg-gradient-to-r from-indigo-50 via-white to-pink-50 p-6 rounded-xl w-full max-w-3xl shadow-lg overflow-y-auto max-h-[90vh]">
          <h3 className="text-2xl font-bold mb-6 text-center text-gray-800">
            Edit Case
          </h3>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {/* File No */}
            <div className="form-control w-full">
              <label className="label">File No *</label>
              <input
                type="text"
                name="fileNo"
                value={formData.fileNo}
                onChange={handleChange}
                className={`input input-bordered w-full ${errors.fileNo && "input-error"}`}
              />
              {errors.fileNo && (
                <span className="text-red-500 text-sm">{errors.fileNo}</span>
              )}
            </div>

            {/* Case No */}
            <div className="form-control w-full">
              <label className="label">Case No *</label>
              <input
                type="text"
                name="caseNo"
                value={formData.caseNo}
                onChange={handleChange}
                className={`input input-bordered w-full ${errors.caseNo && "input-error"}`}
              />
              {errors.caseNo && (
                <span className="text-red-500 text-sm">{errors.caseNo}</span>
              )}
            </div>

            {/* Date */}
            <div className="form-control w-full">
              <label className="label">Date *</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className={`input input-bordered w-full ${errors.date && "input-error"}`}
              />
              {errors.date && (
                <span className="text-red-500 text-sm">{errors.date}</span>
              )}
            </div>

            {/* Court */}
            <div className="form-control w-full">
              <label className="label">Court *</label>
              <select
                name="court"
                value={formData.court}
                onChange={handleChange}
                className={`select select-bordered w-full ${errors.court && "select-error"}`}
              >
                <option value="">--Select Court--</option>
                {courts.map((court) => (
                  <option key={court._id} value={court.name}>
                    {court.name}
                  </option>
                ))}
              </select>
              {errors.court && (
                <span className="text-red-500 text-sm">{errors.court}</span>
              )}
            </div>

            {/* Rest of the form fields (Company, CaseType, Police Station, etc.) */}
            <div className="form-control w-full">
              <label className="label">Company</label>
              <select
                name="company"
                value={formData.company}
                onChange={handleChange}
                className="select select-bordered w-full"
              >
                <option value="">--Select Company--</option>
                {companies.map((c) => (
                  <option key={c._id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-control w-full">
              <label className="label">Case Type</label>
              <select
                name="caseType"
                value={formData.caseType}
                onChange={handleChange}
                className="select select-bordered w-full"
              >
                <option value="">--Select Case Type--</option>
                {caseTypes.map((ct) => (
                  <option key={ct._id} value={ct.name}>
                    {ct.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-control w-full">
              <label className="label">Police Station</label>
              <select
                name="policeStation"
                value={formData.policeStation}
                onChange={handleChange}
                className="select select-bordered w-full"
              >
                <option value="">--Select Police Station--</option>
                {policeStations.map((ps) => (
                  <option key={ps._id} value={ps.name}>
                    {ps.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Remaining text fields */}
            <input
              type="text"
              name="fixedFor"
              value={formData.fixedFor}
              onChange={handleChange}
              placeholder="Fixed For"
              className="input input-bordered w-full"
            />
            <input
              type="text"
              name="firstParty"
              value={formData.firstParty}
              onChange={handleChange}
              placeholder="1st Party"
              className={`input input-bordered w-full ${errors.firstParty && "input-error"}`}
            />
            {errors.firstParty && (
              <span className="text-red-500 text-sm">{errors.firstParty}</span>
            )}
            <input
              type="text"
              name="secondParty"
              value={formData.secondParty}
              onChange={handleChange}
              placeholder="2nd Party"
              className="input input-bordered w-full"
            />
            <input
              type="text"
              name="appointedBy"
              value={formData.appointedBy}
              onChange={handleChange}
              placeholder="Appointed By"
              className="input input-bordered w-full"
            />
            <input
              type="tel"
              name="mobileNo"
              value={formData.mobileNo}
              onChange={handleChange}
              placeholder="Mobile No"
              className="input input-bordered w-full"
            />
            <input
              type="text"
              name="lawSection"
              value={formData.lawSection}
              onChange={handleChange}
              placeholder="Law & Section"
              className="input input-bordered w-full"
            />
            <textarea
              name="comments"
              value={formData.comments}
              onChange={handleChange}
              placeholder="Comments / Others"
              className="textarea textarea-bordered w-full md:col-span-2"
            />

            {/* Status */}
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="select select-bordered w-full md:col-span-2"
            >
              <option value="Pending">Pending</option>
              <option value="Running">Running</option>
              <option value="Completed">Completed</option>
            </select>

            {/* Buttons */}
            <div className="md:col-span-2 flex justify-end gap-2 mt-4">
              <button
                type="button" // ✅ VERY IMPORTANT
                className="btn btn-outline"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={!isChanged || mutation.isLoading}
              >
                {mutation.isLoading ? "Updating..." : "Update"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditCaseModal;

import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import toast from "react-hot-toast";
import usePageTitle from "../../../Hooks/useTitle";

const AddCases = () => {
  usePageTitle("Add Cases")
  const axiosInstance = useAxiosSecure();

  const [formData, setFormData] = useState({
    fileNo: "",
    caseNo: "",
    date: "",
    company: "",
    firstParty: "",
    secondParty: "",
    appointedBy: "",
    caseType: "",
    court: "",
    policeStation: "",
    fixedFor: "",
    mobileNumber: "",
    lawAndSection: "",
    comments: "",
  });

  const [errors, setErrors] = useState({});

  /* ================= FETCH DROPDOWN DATA ================= */
  const { data: companies = [] } = useQuery({
    queryKey: ["companies"],
    queryFn: async () => {
      const res = await axiosInstance.get("/company");
      return res.data.data;
    },
  });

  const { data: courts = [] } = useQuery({
    queryKey: ["courts"],
    queryFn: async () => {
      const res = await axiosInstance.get("/courts");
      return res.data.data;
    },
  });

  const { data: caseTypes = [] } = useQuery({
    queryKey: ["caseTypes"],
    queryFn: async () => {
      const res = await axiosInstance.get("/caseTypes");
      return res.data.data;
    },
  });

  const { data: policeStations = [] } = useQuery({
    queryKey: ["policeStations"],
    queryFn: async () => {
      const res = await axiosInstance.get("/policeStation");
      return res.data.data;
    },
  });

  /* ================= MUTATION ================= */
  const mutation = useMutation({
    mutationFn: (newCase) =>
      axiosInstance.post("/cases", newCase).then((res) => res.data),
    onSuccess: () => {
      toast.success("Case added successfully!");
      setFormData({
        fileNo: "",
        caseNo: "",
        company: "",
        firstParty: "",
        secondParty: "",
        appointedBy: "",
        caseType: "",
        court: "",
        policeStation: "",
        fixedFor: "",
        mobileNo: "",
        lawSection: "",
        comments: "",
      });
      setErrors({});
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to add case. Please try again.");
    },
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const validate = () => {
    const requiredFields = ["fileNo", "caseNo", "date", "court", "firstParty"];
    const newErrors = {};
    requiredFields.forEach((field) => {
      if (!formData[field]) newErrors[field] = "This field is required";
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    mutation.mutate(formData);
  };

  return (
    <div className="p-4 overflow-hidden">
      <h1 className="text-2xl font-bold mb-6">Add New Case</h1>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {/* File No */}
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">File No *</span>
          </label>
          <input
            type="text"
            name="fileNo"
            value={formData.fileNo}
            onChange={handleChange}
            placeholder="Enter File No"
            className={`input input-bordered w-full ${
              errors.fileNo && "input-error"
            }`}
          />
          {errors.fileNo && (
            <span className="text-red-500 text-sm mt-1">{errors.fileNo}</span>
          )}
        </div>

        {/* Case No */}
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Case No *</span>
          </label>
          <input
            type="text"
            name="caseNo"
            value={formData.caseNo}
            onChange={handleChange}
            placeholder="Enter Case No / Year"
            className={`input input-bordered w-full ${
              errors.caseNo && "input-error"
            }`}
          />
          {errors.caseNo && (
            <span className="text-red-500 text-sm mt-1">{errors.caseNo}</span>
          )}
        </div>

        {/* Date */}
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Date *</span>
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className={`input input-bordered w-full ${
              errors.date && "input-error"
            }`}
          />
          {errors.date && (
            <span className="text-red-500 text-sm mt-1">{errors.date}</span>
          )}
        </div>

        {/* Court */}
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Court *</span>
          </label>
          <select
            name="court"
            value={formData.court}
            onChange={handleChange}
            className={`select select-bordered w-full ${
              errors.court && "select-error"
            }`}
          >
            <option value="">--Select a Court--</option>
            {courts?.map((court) => (
              <option key={court._id} value={court.name}>
                {court.name}
              </option>
            ))}
          </select>
          {errors.court && (
            <span className="text-red-500 text-sm mt-1">{errors.court}</span>
          )}
        </div>

        {/* Company */}
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Company</span>
          </label>
          <select
            name="company"
            value={formData.company}
            onChange={handleChange}
            className="select select-bordered w-full"
          >
            <option value="">--Select Company/Group--</option>
            {companies?.map((company) => (
              <option key={company._id} value={company.name}>
                {company.name}
              </option>
            ))}
          </select>
        </div>

        {/* Case Type */}
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Case Type</span>
          </label>
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

        {/* Police Station */}
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Police Station</span>
          </label>
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

        {/* Rest of the form remains unchanged */}
        {/* Fixed For */}
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Fixed For</span>
          </label>
          <input
            type="text"
            name="fixedFor"
            value={formData.fixedFor}
            onChange={handleChange}
            placeholder="e.g. Hearing, Argument, Order, Evidence"
            className="input input-bordered w-full"
          />
        </div>

        {/* 1st Party */}
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">1st Party *</span>
          </label>
          <input
            type="text"
            name="firstParty"
            value={formData.firstParty}
            onChange={handleChange}
            placeholder="Enter First Party"
            className={`input input-bordered w-full ${
              errors.firstParty && "input-error"
            }`}
          />
          {errors.firstParty && (
            <span className="text-red-500 text-sm mt-1">
              {errors.firstParty}
            </span>
          )}
        </div>

        {/* 2nd Party */}
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">2nd Party</span>
          </label>
          <input
            type="text"
            name="secondParty"
            value={formData.secondParty}
            onChange={handleChange}
            placeholder="Enter Second Party"
            className="input input-bordered w-full"
          />
        </div>

        {/* Appointed By */}
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Appointed By</span>
          </label>
          <input
            type="text"
            name="appointedBy"
            value={formData.appointedBy}
            onChange={handleChange}
            placeholder="Enter which party appointed you"
            className="input input-bordered w-full"
          />
        </div>

        {/* Mobile No */}
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Mobile No</span>
          </label>
          <input
            type="tel"
            name="mobileNo"
            value={formData.mobileNo}
            onChange={handleChange}
            placeholder="Enter Client Mobile No"
            className="input input-bordered w-full"
          />
        </div>

        {/* Law & Section */}
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Law & Section</span>
          </label>
          <input
            type="text"
            name="lawSection"
            value={formData.lawSection}
            onChange={handleChange}
            placeholder="Enter Law & Section"
            className="input input-bordered w-full"
          />
        </div>

        {/* Comments */}
        <div className="form-control md:col-span-2">
          <label className="label">
            <span className="label-text">Comments / Others</span>
          </label>
          <textarea
            name="comments"
            value={formData.comments}
            onChange={handleChange}
            placeholder="Enter more about this case"
            className="textarea textarea-bordered w-full"
          />
        </div>

        {/* Submit Button */}
        <div className="md:col-span-2">
          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={mutation.isLoading}
          >
            {mutation.isLoading ? "Adding..." : "Add Case"} {/* Loading text */}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCases;

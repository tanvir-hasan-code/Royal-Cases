import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import toast from "react-hot-toast";
import CasesTable from "../AllCases/CasesTable";
import EditCaseModal from "../AllCases/EditCaseModal";

const LIMIT = 8;

const RunningCases = () => {
  const axiosSecure = useAxiosSecure();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialPage = parseInt(searchParams.get("page")) || 1;
  const initialSearch = searchParams.get("search") || "";

  const [page, setPage] = useState(initialPage);
  const [search, setSearch] = useState(initialSearch);
  const [editCase, setEditCase] = useState(null);
  const [viewCase, setViewCase] = useState(null);
  const [totalPages, setTotalPages] = useState(0);

  // Fetch backend data
  const { data, refetch, isLoading } = useQuery({
    queryKey: ["cases", page],
    queryFn: async () => {
      const res = await axiosSecure.get(`/cases?page=${page}&limit=${LIMIT}`);
      return res.data;
    },
  });

  // Update URL query params when page or search changes
  useEffect(() => {
    const params = {};
    if (page > 1) params.page = page;
    if (search) params.search = search;
    setSearchParams(params);
  }, [page, search]);

  // Update totalPages when data arrives
  useEffect(() => {
    if (data?.totalPages) {
      setTotalPages(data.totalPages);
    }
  }, [data]);

  const handleUpdate = async (id, updatedData) => {
    await axiosSecure.patch(`/cases/${id}`, updatedData);
    toast.success("Case updated");
    setEditCase(null);
    refetch();
  };

  const handleDelete = async (id) => {
    await axiosSecure.delete(`/cases/${id}`);
    toast.success("Case deleted");
    refetch();
  };

  const goPrev = () => setPage((p) => Math.max(p - 1, 1));
  const goNext = () => setPage((p) => Math.min(p + 1, totalPages));

  if (isLoading) return <p>Loading...</p>;

  // Filter only running cases and also apply search filter
  const filteredRunningCases = (data?.cases || [])
    .filter((c) => c.status === "Running")
    .filter((c) => c.caseNo.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-4 relative">
      <h2 className="text-2xl font-bold mb-4">Running Cases</h2>

      {/* Search Field */}
      <div className="flex justify-end mb-4">
        <input
          type="text"
          placeholder="Search Case No"
          className="input input-bordered w-64"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1); // reset page
          }}
        />
      </div>

      {/* Cases Table */}
      <CasesTable
        cases={filteredRunningCases}
        onEdit={setEditCase}
        onDelete={handleDelete}
        onView={setViewCase} // only row click opens modal
      />

      {/* Pagination */}
      <div className="flex justify-center gap-2 mt-6 items-center">
        <button
          className="btn btn-sm btn-outline"
          onClick={goPrev}
          disabled={page === 1}
        >
          &lt; Prev
        </button>

        {[...Array(totalPages).keys()].map((n) => (
          <button
            key={n}
            onClick={() => setPage(n + 1)}
            className={`btn btn-sm ${page === n + 1 ? "btn-primary" : "btn-outline"}`}
          >
            {n + 1}
          </button>
        ))}

        <button
          className="btn btn-sm btn-outline"
          onClick={goNext}
          disabled={page === totalPages}
        >
          Next &gt;
        </button>
      </div>

      {/* Edit Modal */}
      {editCase && (
        <EditCaseModal
          caseData={editCase}
          onSave={handleUpdate}
          onClose={() => setEditCase(null)}
        />
      )}

      {/* View Case Modal */}
{viewCase && (
  <>
    {/* Overlay */}
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999]"></div>

    {/* Modal */}
    <div className="fixed inset-0 flex justify-center items-center z-[10000] p-4">
      <div className="bg-gradient-to-r from-indigo-50 via-white to-pink-50 p-6 rounded-xl w-full max-w-2xl shadow-lg">
        <h3 className="text-2xl font-bold mb-6 text-center text-gray-800">Case Details</h3>

        {/* Compact Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          {/* Left Column */}
          <div className="flex flex-col">
            <span className="text-gray-500 font-medium">File No</span>
            <span className="text-gray-800">{viewCase.fileNo || "-"}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-gray-500 font-medium">Case No</span>
            <span className="text-gray-800">{viewCase.caseNo || "-"}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-gray-500 font-medium">Date</span>
            <span className="text-gray-800">{viewCase.date ? new Date(viewCase.date).toLocaleDateString() : "-"}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-gray-500 font-medium">Company</span>
            <span className="text-gray-800">{viewCase.company || "-"}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-gray-500 font-medium">First Party</span>
            <span className="text-gray-800">{viewCase.firstParty || "-"}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-gray-500 font-medium">Second Party</span>
            <span className="text-gray-800">{viewCase.secondParty || "-"}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-gray-500 font-medium">Appointed By</span>
            <span className="text-gray-800">{viewCase.appointedBy || "-"}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-gray-500 font-medium">Case Type</span>
            <span className="text-gray-800">{viewCase.caseType || "-"}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-gray-500 font-medium">Court</span>
            <span className="text-gray-800">{viewCase.court || "-"}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-gray-500 font-medium">Police Station</span>
            <span className="text-gray-800">{viewCase.policeStation || "-"}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-gray-500 font-medium">Fixed For</span>
            <span className="text-gray-800">{viewCase.fixedFor || "-"}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-gray-500 font-medium">Status</span>
            <span className={`inline-block w-fit  mt-1 px-3 py-1 text-xs font-semibold rounded-full ${
              viewCase.status === "Pending" ? "bg-yellow-200 text-yellow-800" :
              viewCase.status === "Running" ? "bg-blue-200 text-blue-800" :
              "bg-green-200 text-green-800"
            }`}>
              {viewCase.status || "-"}
            </span>
          </div>

          {/* Last 4 fields in 2-column layout */}
          <div className="flex flex-col">
            <span className="text-gray-500 font-medium">Mobile No</span>
            <span className="text-gray-800">{viewCase.mobileNo || "-"}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-gray-500 font-medium">Law & Section</span>
            <span className="text-gray-800">{viewCase.lawSection || "-"}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-gray-500 font-medium">Comments</span>
            <span className="text-gray-800">{viewCase.comments || "-"}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-gray-500 font-medium">Created At</span>
            <span className="text-gray-800">{viewCase.createdAt ? new Date(viewCase.createdAt).toLocaleString() : "-"}</span>
          </div>
        </div>

        {/* Close Button */}
        <div className="mt-6 flex justify-end">
          <button
            className="btn btn-primary"
            onClick={() => setViewCase(null)}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </>
)}

    </div>
  );
};

export default RunningCases;

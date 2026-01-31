import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import toast from "react-hot-toast";
import CasesTable from "./CasesTable";
import EditCaseModal from "./EditCaseModal";

const LIMIT = 8;

const AllCases = () => {
  const axiosSecure = useAxiosSecure();
  const [searchParams, setSearchParams] = useSearchParams();

  // ইউআরএল থেকে ইনিশিয়াল ভ্যালু নেওয়া
  const initialPage = useMemo(() => parseInt(searchParams.get("page")) || 1, []);
  const initialSearch = useMemo(() => searchParams.get("search") || "", []);

  const [page, setPage] = useState(initialPage);
  const [search, setSearch] = useState(initialSearch);
  const [editCase, setEditCase] = useState(null);
  const [viewCase, setViewCase] = useState(null);

  // Fetch backend data
  const { data, refetch, isLoading } = useQuery({
    queryKey: ["cases", page, search],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/cases?page=${page}&limit=${LIMIT}&search=${search}`
      );
      return res.data;
    },
    keepPreviousData: true, // ডাটা লোড হওয়ার সময় আগের ডাটা ধরে রাখবে, ফলে পেজ কাঁপবে না
  });

  const totalPages = data?.totalPages || 0;

  // URL Query Params আপডেট করার নিরাপদ নিয়ম
  useEffect(() => {
    const params = new URLSearchParams();
    if (page > 1) params.set("page", page);
    if (search) params.set("search", search);
    
    // কেবল যদি বর্তমান সার্চ পারামস ভিন্ন হয় তবেই আপডেট করবে (লুপ আটকানোর জন্য)
    if (params.toString() !== searchParams.toString()) {
      setSearchParams(params, { replace: true });
    }
  }, [page, search, setSearchParams, searchParams]);

  const handleUpdate = async (id, updatedData) => {
    try {
      await axiosSecure.patch(`/cases/${id}`, updatedData);
      toast.success("Case updated");
      setEditCase(null);
      refetch();
    } catch (err) {
      toast.error("Failed to update");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosSecure.delete(`/cases/${id}`);
      toast.success("Case deleted");
      refetch();
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="p-4 relative">
      <h2 className="text-2xl font-bold mb-4">All Cases</h2>

      {/* Search Input - এটাকেisLoading এর বাইরে রাখা হয়েছে */}
      <div className="flex justify-end mb-4">
        <input
          type="text"
          placeholder="Search Case No..."
          className="input input-bordered w-64 focus:outline-primary"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>

      {isLoading ? (
        <div className="flex flex-col justify-center items-center h-64">
           <span className="loading loading-spinner loading-lg text-primary"></span>
           <p className="mt-2 text-gray-500">Loading cases, please wait...</p>
        </div>
      ) : (
        <>
          <CasesTable
            cases={data?.cases || []}
            onEdit={setEditCase}
            onDelete={handleDelete}
            onView={setViewCase}
          />

          {/* Pagination */}
          <div className="flex justify-center gap-2 mt-6 items-center">
            <button
              className="btn btn-sm btn-outline"
              onClick={() => setPage(p => Math.max(p - 1, 1))}
              disabled={page === 1}
            >
              Prev
            </button>

            {[...Array(totalPages).keys()].map((n) => (
              <button
                key={n}
                onClick={() => setPage(n + 1)}
                className={`btn btn-sm ${
                  page === n + 1 ? "btn-primary" : "btn-outline"
                }`}
              >
                {n + 1}
              </button>
            ))}

            <button
              className="btn btn-sm btn-outline"
              onClick={() => setPage(p => Math.min(p + 1, totalPages))}
              disabled={page === totalPages || totalPages === 0}
            >
              Next
            </button>
          </div>
        </>
      )}

      {/* Modals */}
      {editCase && (
        <EditCaseModal
          caseData={editCase}
          onSave={handleUpdate}
          onClose={() => setEditCase(null)}
        />
      )}

      {viewCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setViewCase(null)}></div>
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-xl shadow-2xl overflow-y-auto max-h-[90vh]">
            <h3 className="text-xl font-bold border-b pb-2 mb-4">Case Information</h3>
            <div className="grid grid-cols-1 gap-3">
              <p><strong>Case No:</strong> {viewCase.caseNo}</p>
              <p><strong>Status:</strong> <span className="badge badge-primary">{viewCase.status}</span></p>
              <p><strong>Court:</strong> {viewCase.court}</p>
              <p><strong>Law:</strong> {viewCase.lawSection}</p>
              <p><strong>Fixed For:</strong> {viewCase.fixedFor}</p>
              <hr />
              <p><strong>First Party:</strong> {viewCase.firstParty}</p>
              <p><strong>Second Party:</strong> {viewCase.secondParty}</p>
            </div>
            <button className="btn btn-block btn-ghost mt-6 border-gray-300" onClick={() => setViewCase(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllCases;
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
  const initialPage = useMemo(
    () => parseInt(searchParams.get("page")) || 1,
    [],
  );
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
        `/cases?page=${page}&limit=${LIMIT}&search=${search}`,
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
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
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
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
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
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999]"
            onClick={() => setViewCase(null)}
          ></div>

          {/* Modal */}
          <div className="fixed inset-0 flex justify-center items-center z-[10000] p-4 pointer-events-none">
            <div className="bg-gradient-to-r from-indigo-50 via-white to-pink-50 p-6 rounded-xl w-full max-w-2xl shadow-lg overflow-y-auto max-h-[90vh] pointer-events-auto">
              <h3 className="text-2xl font-bold mb-6 text-center text-gray-800 border-b pb-2">
                Case Details
              </h3>

              {/* Info Grid: Mobile 1 column, Small screen and up 2 columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                <div className="flex flex-col border-b border-gray-100 pb-1">
                  <span className="text-gray-500 font-semibold uppercase text-[10px] tracking-wider">
                    File No
                  </span>
                  <span className="text-gray-800 font-medium">
                    {viewCase.fileNo || "-"}
                  </span>
                </div>

                <div className="flex flex-col border-b border-gray-100 pb-1">
                  <span className="text-gray-500 font-semibold uppercase text-[10px] tracking-wider">
                    Case No
                  </span>
                  <span className="text-gray-800 font-medium">
                    {viewCase.caseNo || "-"}
                  </span>
                </div>

                <div className="flex flex-col border-b border-gray-100 pb-1">
                  <span className="text-gray-500 font-semibold uppercase text-[10px] tracking-wider">
                    Date
                  </span>
                  <span className="text-gray-800 font-medium">
                    {viewCase.date
                      ? new Date(viewCase.date).toLocaleDateString()
                      : "-"}
                  </span>
                </div>

                <div className="flex flex-col border-b border-gray-100 pb-1">
                  <span className="text-gray-500 font-semibold uppercase text-[10px] tracking-wider">
                    Company
                  </span>
                  <span className="text-gray-800 font-medium">
                    {viewCase.company || "-"}
                  </span>
                </div>

                <div className="flex flex-col border-b border-gray-100 pb-1">
                  <span className="text-gray-500 font-semibold uppercase text-[10px] tracking-wider">
                    First Party
                  </span>
                  <span className="text-gray-800 font-medium">
                    {viewCase.firstParty || "-"}
                  </span>
                </div>

                <div className="flex flex-col border-b border-gray-100 pb-1">
                  <span className="text-gray-500 font-semibold uppercase text-[10px] tracking-wider">
                    Second Party
                  </span>
                  <span className="text-gray-800 font-medium">
                    {viewCase.secondParty || "-"}
                  </span>
                </div>

                <div className="flex flex-col border-b border-gray-100 pb-1">
                  <span className="text-gray-500 font-semibold uppercase text-[10px] tracking-wider">
                    Appointed By
                  </span>
                  <span className="text-gray-800 font-medium">
                    {viewCase.appointedBy || "-"}
                  </span>
                </div>

                <div className="flex flex-col border-b border-gray-100 pb-1">
                  <span className="text-gray-500 font-semibold uppercase text-[10px] tracking-wider">
                    Case Type
                  </span>
                  <span className="text-gray-800 font-medium">
                    {viewCase.caseType || "-"}
                  </span>
                </div>

                <div className="flex flex-col border-b border-gray-100 pb-1">
                  <span className="text-gray-500 font-semibold uppercase text-[10px] tracking-wider">
                    Court
                  </span>
                  <span className="text-gray-800 font-medium">
                    {viewCase.court || "-"}
                  </span>
                </div>

                <div className="flex flex-col border-b border-gray-100 pb-1">
                  <span className="text-gray-500 font-semibold uppercase text-[10px] tracking-wider">
                    Police Station
                  </span>
                  <span className="text-gray-800 font-medium">
                    {viewCase.policeStation || "-"}
                  </span>
                </div>

                <div className="flex flex-col border-b border-gray-100 pb-1">
                  <span className="text-gray-500 font-semibold uppercase text-[10px] tracking-wider">
                    Fixed For
                  </span>
                  <span className="text-gray-800 font-medium">
                    {viewCase.fixedFor || "-"}
                  </span>
                </div>

                <div className="flex flex-col border-b border-gray-100 pb-1">
                  <span className="text-gray-500 font-semibold uppercase text-[10px] tracking-wider">
                    Mobile No
                  </span>
                  <span className="text-gray-800 font-medium">
                    {viewCase.mobileNo || "-"}
                  </span>
                </div>

                <div className="flex flex-col border-b border-gray-100 pb-1">
                  <span className="text-gray-500 font-semibold uppercase text-[10px] tracking-wider">
                    Status
                  </span>
                  <span
                    className={`inline-block w-fit mt-1 px-3 py-0.5 text-[11px] font-bold rounded-full ${
                      viewCase.status === "Pending"
                        ? "bg-yellow-100 text-yellow-700 border border-yellow-200"
                        : viewCase.status === "Running"
                          ? "bg-blue-100 text-blue-700 border border-blue-200"
                          : "bg-green-100 text-green-700 border border-green-200"
                    }`}
                  >
                    {viewCase.status || "-"}
                  </span>
                </div>

                <div className="flex flex-col border-b border-gray-100 pb-1">
                  <span className="text-gray-500 font-semibold uppercase text-[10px] tracking-wider">
                    Created At
                  </span>
                  <span className="text-gray-800 font-medium text-[12px]">
                    {viewCase.createdAt
                      ? new Date(viewCase.createdAt).toLocaleString()
                      : "-"}
                  </span>
                </div>

                {/* Full width fields on all screens to maintain readability if content is long */}
                <div className="sm:col-span-2 flex flex-col border-b border-gray-100 pb-1">
                  <span className="text-gray-500 font-semibold uppercase text-[10px] tracking-wider">
                    Law & Section
                  </span>
                  <span className="text-gray-800 font-medium">
                    {viewCase.lawSection || "-"}
                  </span>
                </div>

                <div className="sm:col-span-2 flex flex-col border-b border-gray-100 pb-1">
                  <span className="text-gray-500 font-semibold uppercase text-[10px] tracking-wider">
                    Comments
                  </span>
                  <span className="text-gray-800 font-medium">
                    {viewCase.comments || "-"}
                  </span>
                </div>
              </div>

              {/* Close Button */}
              <div className="mt-8 flex justify-end">
                <button
                  className="btn btn-primary px-8 shadow-md"
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

export default AllCases;

import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import toast from "react-hot-toast";
import CasesTable from "../AllCases/CasesTable";
import EditCaseModal from "../AllCases/EditCaseModal";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const LIMIT = 8;

const RunningCases = () => {
  const axiosSecure = useAxiosSecure();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialPage = useMemo(
    () => parseInt(searchParams.get("page")) || 1,
    [],
  );
  const initialSearch = useMemo(() => searchParams.get("search") || "", []);

  const [page, setPage] = useState(initialPage);
  const [search, setSearch] = useState(initialSearch);
  const [editCase, setEditCase] = useState(null);
  const [viewCase, setViewCase] = useState(null);

  const { data, refetch, isLoading } = useQuery({
    queryKey: ["running-cases", page, search],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/running-cases?page=${page}&limit=${LIMIT}&search=${search}`,
      );
      return res.data;
    },
    keepPreviousData: true,
  });

  const totalPages = data?.totalPages || 0;

  // URL sync (same as AllCases)
  useEffect(() => {
    const params = new URLSearchParams();
    if (page > 1) params.set("page", page);
    if (search) params.set("search", search);

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
    } catch {
      toast.error("Failed to update");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosSecure.delete(`/cases/${id}`);
      toast.success("Case deleted");
      refetch();
    } catch {
      toast.error("Failed to delete");
    }
  };
  const handlePrint = () => {
    const printContents = document
      .getElementById("cases-table")
      .cloneNode(true);

    // Hide action columns
    printContents.querySelectorAll(".action-col").forEach((el) => el.remove());

    const printWindow = window.open("", "_blank", "width=900,height=650");

    printWindow.document.write(`
    <html>
      <head>
        <title>Royal Case - Cases Report</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          .header { text-align: center; margin-bottom: 20px; }
          .header h1 { margin: 0; font-size: 28px; font-weight: bold; }
          .header p { margin: 2px 0; font-size: 14px; color: #555; }
          .report-title { margin-top: 10px; font-size: 18px; font-weight: 600; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          th, td { border: 1px solid #ccc; padding: 8px; text-align: left; font-size: 12px; }
          th { background-color: #f3f3f3; }
          tr:nth-child(even) { background-color: #fafafa; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Royal Case</h1>
          <p>123 Legal Street, Dhaka, Bangladesh</p>
          <p>Phone: +880 1234 567890 | Email: info@royalcase.com</p>
          <p>Website: www.royalcase.com</p>
          <div class="report-title">Cases Report - Page ${page}</div>
        </div>
        ${printContents.innerHTML}
      </body>
    </html>
  `);

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <div className="p-4 relative">
      <h2 className="text-2xl font-bold mb-4">Running Cases</h2>

      {/* Search & Buttons */}
      <div className="flex flex-col lg:flex-row lg:justify-end gap-2 mb-2 sticky top-0  z-10 p-2 border-b border-gray-200">
        <input
          type="text"
          placeholder="Search Case No..."
          className="input input-bordered w-full lg:w-64 focus:outline-primary"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
        <div className="flex gap-2">
          <button
            className="btn btn-sm btn-primary flex items-center gap-1"
            onClick={handlePrint}
          >
            <FaPrint /> Print Page
          </button>
          <button
            className="btn btn-sm bg-red-500 text-white flex items-center gap-1"
            onClick={""}
          >
            <FaFilePdf /> Save PDF
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col justify-center items-center h-64">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="mt-2 text-gray-500">Loading running cases...</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto w-full">
            <CasesTable
              cases={data?.cases || []}
              onEdit={setEditCase}
              onDelete={handleDelete}
              onView={setViewCase}
            />
          </div>
        </>
      )}
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

      {/* Edit Modal */}
      {editCase && (
        <EditCaseModal
          caseData={editCase}
          onSave={handleUpdate}
          onClose={() => setEditCase(null)}
        />
      )}

      {/* View Modal (same as AllCases) */}
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
              <h3 className="text-2xl font-bold mb-4 text-center text-gray-800 border-b pb-2">
                Case Details
              </h3>

              {/* Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm">
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
              </div>

              {/* Close Button */}
              <div className="mt-8 flex justify-end">
                <button
                  className="btn btn-primary px-8 shadow-md"
                  onClick={() => setViewCase(null)}
                >
                  Close
                </button>
                <div className="flex ml-3 justify-end mb-4">
                  <button
                    className="btn btn-error shadow-md"
                    onClick={() => {
                      const printWindow = window.open(
                        "",
                        "_blank",
                        "width=900,height=650",
                      );
                      printWindow.document.write(`
                <html>
  <head>
    <title>Royal Case - Case Report</title>
    <style>
      body { font-family: Arial, sans-serif; padding: 20px; color: #222; }
      .header { text-align: center; margin-bottom: 20px; }
      .header h1 { margin: 0; font-size: 28px; font-weight: bold; }
      .header p { margin: 2px 0; font-size: 14px; color: #555; }
      .report-title { margin-top: 10px; font-size: 18px; font-weight: 600; }
      
      table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 14px; }
      th, td { border: 1px solid #ccc; padding: 8px; text-align: left; vertical-align: top; }
      th { background-color: #f3f3f3; font-weight: 600; }
      tr:nth-child(even) { background-color: #fafafa; }
      
      .full-span { width: 100%; }
    </style>
  </head>
  <body>
    <div class="header">
      <h1>Royal Case</h1>
      <p>123 Legal Street, Dhaka, Bangladesh</p>
      <p>Phone: +880 1234 567890 | Email: info@royalcase.com</p>
      <p>Website: www.royalcase.com</p>
      <div class="report-title">Case Report - Page 1</div>
    </div>

    <table>
      <tbody>
        <tr><th>File No</th><td>${viewCase.fileNo || "-"}</td></tr>
        <tr><th>Case No</th><td>${viewCase.caseNo || "-"}</td></tr>
        <tr><th>Date</th><td>${viewCase.date ? new Date(viewCase.date).toLocaleDateString() : "-"}</td></tr>
        <tr><th>Company</th><td>${viewCase.company || "-"}</td></tr>
        <tr><th>First Party</th><td>${viewCase.firstParty || "-"}</td></tr>
        <tr><th>Second Party</th><td>${viewCase.secondParty || "-"}</td></tr>
        <tr><th>Appointed By</th><td>${viewCase.appointedBy || "-"}</td></tr>
        <tr><th>Case Type</th><td>${viewCase.caseType || "-"}</td></tr>
        <tr><th>Court</th><td>${viewCase.court || "-"}</td></tr>
        <tr><th>Police Station</th><td>${viewCase.policeStation || "-"}</td></tr>
        <tr><th>Fixed For</th><td>${viewCase.fixedFor || "-"}</td></tr>
        <tr><th>Mobile No</th><td>${viewCase.mobileNo || "-"}</td></tr>
        <tr><th>Status</th><td>${viewCase.status || "-"}</td></tr>
        <tr><th>Created At</th><td>${viewCase.createdAt ? new Date(viewCase.createdAt).toLocaleString() : "-"}</td></tr>
        <tr><th>Law & Section</th><td>${viewCase.lawSection || "-"}</td></tr>
        <tr><th>Comments</th><td>${viewCase.comments || "-"}</td></tr>
      </tbody>
    </table>
  </body>
</html>

              `);
                      printWindow.document.close();
                      printWindow.focus();
                      printWindow.print();
                    }}
                  >
                    <FaPrint /> Print Case
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default RunningCases;

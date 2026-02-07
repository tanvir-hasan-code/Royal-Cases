import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import toast from "react-hot-toast";
import CasesTable from "./CasesTable";
import EditCaseModal from "./EditCaseModal";
import { FaPrint, FaFilePdf } from "react-icons/fa";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import autoTable from "jspdf-autotable";
import usePageTitle from "../../../Hooks/useTitle";

const LIMIT = 10;

const AllCases = () => {
  usePageTitle("All Cases");
  const axiosSecure = useAxiosSecure();
  const [searchParams, setSearchParams] = useSearchParams();
  const [cases, setCases] = useState([]);


  const initialPage = useMemo(
    () => parseInt(searchParams.get("page")) || 1,
    [],
  );
  const initialSearch = useMemo(() => searchParams.get("search") || "", []);

  const [page, setPage] = useState(initialPage);
  const [search, setSearch] = useState(initialSearch);
  const [editCase, setEditCase] = useState(null);
  const [viewCase, setViewCase] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const { data, refetch, isLoading } = useQuery({
    queryKey: ["cases", page, search, startDate, endDate, selectedCompany],

    queryFn: async () => {
      const res = await axiosSecure.get(
        `/cases?page=${page}&limit=${LIMIT}&search=${search}&startDate=${startDate}&endDate=${endDate}&company=${selectedCompany}`,
      );
      return res.data;
    },

    keepPreviousData: true,
  });

  useEffect(() => {
    if (data?.data) setCases(data.data);
  }, [data?.data]);


  const totalPages = data?.totalPages || 0;

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
    } catch (err) {
      toast.error("Failed to update");
    }
  };

  const handleAddDateUpdate = (updatedCase) => {
    setCases((prev) =>
      prev.map((c) => (c._id === updatedCase._id ? updatedCase : c)),
    );
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

  const handlePrint = () => {
    const printContents = document
      .getElementById("cases-table")
      .cloneNode(true);

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

  const handleSavePDF = () => {
    if (!data?.cases || data.cases.length === 0) {
      toast.error("No data available!");
      return;
    }

    const doc = new jsPDF("l", "mm", "a4");
    const loadingToast = toast.loading("Generating Print-Style PDF...");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(26);
    doc.setTextColor(79, 70, 229);
    doc.text("Royal Case", 148, 18, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("123 Legal Street, Dhaka, Bangladesh", 148, 24, {
      align: "center",
    });
    doc.text("Phone: +880 1234 567890 | Email: info@royalcase.com", 148, 29, {
      align: "center",
    });

    doc.setFontSize(14);
    doc.setTextColor(31, 41, 55);
    doc.setFont("helvetica", "bold");
    doc.text(`RUNNING CASES REPORT - PAGE ${page}`, 148, 38, {
      align: "center",
    });

    doc.setDrawColor(79, 70, 229);
    doc.setLineWidth(0.5);
    doc.line(14, 42, 283, 42);

    const tableColumn = [
      "File No",
      "Case No",
      "Company",
      "First Party",
      "Second Party",
      "Court",
      "Fixed For",
      "Status",
      "Law & Section",
    ];

    const tableRows = data.cases.map((item) => [
      item.fileNo || "-",
      item.caseNo || "-",
      item.company || "-",
      item.firstParty || "-",
      item.secondParty || "-",
      item.court || "-",
      item.fixedFor || "-",
      item.status || "-",
      item.lawSection || "-",
    ]);

    autoTable(doc, {
      startY: 48,
      head: [tableColumn],
      body: tableRows,
      theme: "grid",
      styles: {
        fontSize: 8.5,
        cellPadding: 3,
        valign: "middle",
        font: "helvetica",
      },
      headStyles: {
        fillColor: [79, 70, 229],
        textColor: [255, 255, 255],
        fontStyle: "bold",
        halign: "left",
        lineColor: [255, 255, 255],
        lineWidth: 0.1,
      },
      bodyStyles: {
        lineColor: [229, 231, 235],
        lineWidth: 0.1,
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251],
      },
      columnStyles: {
        8: { cellWidth: 35 },
      },
      margin: { left: 14, right: 14 },
    });

    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(10);
    doc.setTextColor(0);
    doc.text("__________________________", 14, pageHeight - 15);
    doc.text("Prepared By", 14, pageHeight - 10);

    doc.text("__________________________", 235, pageHeight - 15);
    doc.text("Authorized Signature", 235, pageHeight - 10);
    doc.save(`RoyalCase_Print_Style_Page_${page}.pdf`);
    toast.success("Print-Style PDF Downloaded!", { id: loadingToast });
  };
  // Pagination

  const getPages = (current, total) => {
    if (total <= 5) {
      return [...Array(total).keys()].map((n) => n + 1);
    }

    if (current <= 3) {
      return [1, 2, 3, "...", total];
    }

    if (current >= total - 2) {
      return [1, "...", total - 2, total - 1, total];
    }

    return [1, "...", current - 1, current, current + 1, "...", total];
  };
  const { data: companies = [] } = useQuery({
    queryKey: ["companies"],
    queryFn: async () => {
      const res = await axiosSecure.get("/companies");
      return res.data;
    },
  });

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">All Cases</h2>
      <div className="flex flex-col lg:flex-row lg:justify-end gap-2 mb-2  top-0  z-10 p-2 border-b border-gray-200">
        {/* Company Dropdown */}
        <select
          name="company"
          value={selectedCompany}
          onChange={(e) => {
            setSelectedCompany(e.target.value);
            setPage(1);
          }}
          className="select w-fit select-bordered"
        >
          <option value="">--Select Company/Group--</option>
          {companies.map((company) => (
            <option key={company._id} value={company.name}>
              {company.name}
            </option>
          ))}
        </select>

        {/* Date Range */}
        <input
          type="date"
          className="input input-bordered w-full lg:w-32"
          value={startDate}
          onChange={(e) => {
            setStartDate(e.target.value);
            setPage(1);
          }}
        />
        <input
          type="date"
          className="input input-bordered w-full lg:w-32"
          value={endDate}
          onChange={(e) => {
            setEndDate(e.target.value);
            setPage(1);
          }}
        />

        {/* Text Search */}
        <input
          type="text"
          placeholder="Search by CaseNo, Police Station, Comments..."
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
            onClick={handleSavePDF}
          >
            <FaFilePdf /> Save PDF
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col justify-center items-center h-64">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="mt-2 text-gray-500">Loading cases, please wait...</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto w-full">
            <CasesTable
              cases={cases || []}
              onAddDate={handleAddDateUpdate}
              onEdit={setEditCase}
              onDelete={handleDelete}
              onView={setViewCase}
            />
          </div>
        </>
      )}
      {/* Pagination */}
      <div className="mt-6 flex flex-col sm:flex-row justify-center items-center gap-3">
        {/* Prev Button */}
        <button
          className="btn btn-xs sm:btn-sm btn-outline"
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
        >
          Prev
        </button>

        {/* Page Numbers */}
        <div className="flex flex-wrap justify-center items-center gap-1 sm:gap-2 max-w-full">
          {getPages(page, totalPages).map((n, i) =>
            n === "..." ? (
              <span
                key={`dots-${i}`}
                className="px-2 sm:px-3 text-gray-500 select-none"
              >
                …
              </span>
            ) : (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={`
              btn btn-xs sm:btn-sm
              ${page === n ? "btn-primary" : "btn-outline"}
              min-w-[28px] sm:min-w-[40px]
            `}
              >
                {n}
              </button>
            ),
          )}
        </div>

        {/* Next Button */}
        <button
          className="btn btn-xs sm:btn-sm btn-outline"
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages || totalPages === 0}
        >
          Next
        </button>
      </div>

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
                    {viewCase.date && viewCase.date.length > 0
                      ? new Date(
                          viewCase.date[viewCase.date.length - 1],
                        ).toLocaleDateString()
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

export default AllCases;

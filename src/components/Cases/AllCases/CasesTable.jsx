import React from "react";
import { FiPhone, FiEdit, FiTrash2, FiCheckCircle } from "react-icons/fi";
import Swal from "sweetalert2";

const CasesTable = ({ cases, onEdit, onDelete, onView }) => {
  const handleMarkCompleted = (c) => {
    Swal.fire({
      title: "Mark as Completed?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        onEdit({ ...c, status: "Completed" });
      }
    });
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This case will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e11d48",
      confirmButtonText: "Delete",
    }).then((result) => {
      if (result.isConfirmed) {
        onDelete(id);
      }
    });
  };

  return (
    <div className="overflow-x-auto w-full rounded-lg shadow relative">
      <table className="table table-zebra w-full">
        <thead className="bg-base-200">
          <tr>
            <th>Case No</th>
            <th>Court</th>
            <th>Police Station</th>
            <th>1st Party</th>
            <th>2nd Party</th>
            <th>Appointed By</th>
            <th>Law & Section</th>
            <th>Fixed For</th>
            <th>Status</th>
            <th>Call</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {cases.length === 0 ? (
            <tr>
              <td colSpan={11} className="text-center py-4">
                No cases found.
              </td>
            </tr>
          ) : (
            cases.map((c) => (
              <tr key={c._id} className="cursor-pointer">
                {/* Only non-button cells trigger modal */}
                <td onClick={() => onView(c)}>{c.caseNo}</td>
                <td onClick={() => onView(c)}>{c.court}</td>
                <td onClick={() => onView(c)}>{c.policeStation}</td>
                <td onClick={() => onView(c)}>{c.firstParty}</td>
                <td onClick={() => onView(c)}>{c.secondParty}</td>
                <td onClick={() => onView(c)}>{c.appointedBy}</td>
                <td onClick={() => onView(c)}>{c.lawSection}</td>
                <td onClick={() => onView(c)}>{c.fixedFor}</td>
                <td>
                  <span
                    className={`badge ${
                      c.status === "Pending"
                        ? "badge-warning"
                        : c.status === "Running"
                        ? "badge-info"
                        : "badge-success"
                    }`}
                  >
                    {c.status}
                  </span>
                </td>
                <td>
                  {c.mobileNo ? (
                    <a
                      href={`tel:${c.mobileNo}`}
                      className="btn btn-sm btn-circle bg-green-500 hover:bg-green-600 text-white border-none"
                      onClick={(e) => e.stopPropagation()} // prevent modal
                    >
                      <FiPhone />
                    </a>
                  ) : (
                    "-"
                  )}
                </td>
                <td>
                  <div className="dropdown dropdown-left relative z-[9999]">
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={(e) => e.stopPropagation()} // prevent modal
                    >
                      Action
                    </button>
                    <ul className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-44 absolute right-0 z-[9999]">
                      <li>
                        <button
                          className="flex gap-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit(c);
                          }}
                        >
                          <FiEdit /> Edit
                        </button>
                      </li>
                      {c.status !== "Completed" && (
                        <li>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMarkCompleted(c);
                            }}
                            className="flex gap-2 text-green-600"
                          >
                            <FiCheckCircle /> Complete
                          </button>
                        </li>
                      )}
                      <li>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(c._id);
                          }}
                          className="flex gap-2 text-red-600"
                        >
                          <FiTrash2 /> Delete
                        </button>
                      </li>
                    </ul>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CasesTable;

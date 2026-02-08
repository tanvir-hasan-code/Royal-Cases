import React, { useState } from "react";
import {
  FiPhone,
  FiEdit,
  FiTrash2,
  FiCheckCircle,
  FiCalendar,
  FiEye,
} from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

const CasesTable = ({ cases, onEdit, onDelete, onView }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const axiosSecure = useAxiosSecure();
  const [isAddDateOpen, setIsAddDateOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);

  const handleShowDetailEdit = (c) => {
    Swal.fire({
      title: "Go to Edit?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate(`/cases/edit/${c._id}`, {
          state: {
            from: location.pathname,
          },
        });
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

  const handleAddDate = (caseData) => {
    setSelectedCase(caseData);
    setIsAddDateOpen(true);
  };

  const handleAddDateSubmit = async (e) => {
    e.preventDefault();

    const date = e.target.date.value;
    const description = e.target.fixedFor.value;

    try {
      await axiosSecure.post(`/caseDates/${selectedCase._id}/dates`, {
        caseId: selectedCase._id,
        date,
        description,
        isNext: true
      });

      Swal.fire({
        icon: "success",
        title: "Date added successfully",
        timer: 1500,
        showConfirmButton: false,
      });

      setIsAddDateOpen(false);
      setSelectedCase(null);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Failed to add date",
      });
    }
  };

  const ActionDropdown = ({ caseData }) => {
    return (
      <div className="dropdown dropdown-left dropdown">
        <label tabIndex={0} className="btn btn-sm btn-primary m-1">
          Action
        </label>

        <ul
          tabIndex={0}
          className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 z-[999]"
        >
          <li>
            <button
              onClick={() => handleAddDate(caseData)}
              className="flex gap-2 text-blue-600"
            >
              <FiCalendar /> Add Date
            </button>
          </li>

          {/* Edit (as it was) */}
          <li>
            <button onClick={() => onEdit(caseData)} className="flex gap-2">
              <FiEdit /> Edit
            </button>
          </li>

          {/* Show / Details Edit (icon updated, onclick empty) */}
          <li>
            <button
              onClick={() => handleShowDetailEdit(caseData)}
              className="flex gap-2 text-green-600"
            >
              <FiEye /> Show / Details Edit
            </button>
          </li>

          {/* Delete */}
          <li>
            <button
              onClick={() => handleDelete(caseData._id)}
              className="flex gap-2 text-red-600"
            >
              <FiTrash2 /> Delete
            </button>
          </li>
        </ul>
      </div>
    );
  };

  return (
    <div className="w-full rounded-lg shadow">
      <div id="cases-table" className="overflow-visible min-h-auto">
        <table className="table table-zebra w-full border-separate border-spacing-0">
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
              <th className="text-right action-col">Action</th>
            </tr>
          </thead>

          <tbody>
            {cases.length === 0 ? (
              <tr>
                <td colSpan={11} className="text-center py-6">
                  No cases found.
                </td>
              </tr>
            ) : (
              cases.map((c) => (
                <tr key={c._id} className="hover cursor-pointer">
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

                  <td className="text-right action-col overflow-visible">
                    <div onClick={(e) => e.stopPropagation()}>
                      <ActionDropdown caseData={c} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {isAddDateOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60">
          <div className="bg-base-100 w-full max-w-md rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4 text-center">
              Add Case Date
            </h2>

            <form onSubmit={handleAddDateSubmit} className="space-y-4">
              {/* Date */}
              <div>
                <label className="label">
                  <span className="label-text font-medium">Date</span>
                </label>
                <input
                  type="date"
                  name="date"
                  required
                  className="input input-bordered w-full"
                />
              </div>

              {/* Fixed For */}
              <div>
                <label className="label">
                  <span className="label-text font-medium">Fixed For</span>
                </label>
                <input
                  type="text"
                  name="fixedFor"
                  placeholder="Hearing / Argument / Evidence"
                  required
                  className="input input-bordered w-full"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2 flex-col">
                <button type="submit" className="btn btn-primary w-full">
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddDateOpen(false)}
                  className="btn btn-outline w-full"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CasesTable;

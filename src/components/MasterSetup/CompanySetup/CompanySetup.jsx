import { useState } from "react";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import usePageTitle from "../../../Hooks/useTitle";

const CompanySetup = () => {
  usePageTitle("Company Setup")
  const axiosInstance = useAxiosSecure();

  const [editId, setEditId] = useState(null);
  const [editValue, setEditValue] = useState("");

  const [deleteId, setDeleteId] = useState(null);
  const [deleteName, setDeleteName] = useState("");

  /* ================= FETCH ================= */
  const {
    data: companies = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["companies"],
    queryFn: async () => {
      const res = await axiosInstance.get("/companies");
      return res.data;
    },
  });

  /* ================= ADD ================= */
  const handleAdd = async (e) => {
    e.preventDefault();
    const name = e.target.company.value.trim();

    if (!name) {
      toast.error("Company name is required!");
      return;
    }

    const toastId = toast.loading("Adding company...");
    try {
      await axiosInstance.post("/companies", { name });
      toast.success("Company added!", { id: toastId });
      e.target.reset();
      refetch();
    } catch {
      toast.error("Failed to add company", { id: toastId });
    }
  };

  /* ================= UPDATE ================= */
  const handleUpdate = async (id) => {
    if (!editValue.trim()) {
      toast.error("Company name required!");
      return;
    }

    const toastId = toast.loading("Updating...");
    try {
      await axiosInstance.patch(`/companies/${id}`, {
        name: editValue,
      });
      toast.success("Updated successfully!", { id: toastId });
      setEditId(null);
      setEditValue("");
      refetch();
    } catch {
      toast.error("Update failed", { id: toastId });
    }
  };

  /* ================= DELETE ================= */
  const confirmDelete = async () => {
    const toastId = toast.loading("Deleting...");
    try {
      await axiosInstance.delete(`/companies/${deleteId}`);
      toast.success("Deleted successfully!", { id: toastId });
      setDeleteId(null);
      setDeleteName("");
      refetch();
    } catch {
      toast.error("Delete failed", { id: toastId });
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-gray-700">
        Company Setup
      </h2>

      {/* ADD FORM */}
      <form onSubmit={handleAdd} className="flex gap-2 mb-6">
        <input
          type="text"
          name="company"
          placeholder="Enter Company Name"
          className="input input-bordered w-full"
        />
        <button className="btn btn-primary">Add</button>
      </form>

      {/* LIST */}
      {isLoading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : companies.length === 0 ? (
        <p className="text-center text-gray-400">No company added yet</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>#</th>
                <th>Company Name</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {companies.map((item, index) => (
                <tr key={item._id}>
                  <td>{index + 1}</td>

                  <td>
                    {editId === item._id ? (
                      <input
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="input input-sm input-bordered w-full"
                      />
                    ) : (
                      item.name
                    )}
                  </td>

                  <td className="text-right space-x-2">
                    {editId === item._id ? (
                      <>
                        <button
                          onClick={() => handleUpdate(item._id)}
                          className="btn btn-xs btn-success"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditId(null)}
                          className="btn btn-xs btn-ghost"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setEditId(item._id);
                            setEditValue(item.name);
                          }}
                          className="btn btn-xs btn-warning"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            setDeleteId(item._id);
                            setDeleteName(item.name);
                          }}
                          className="btn btn-xs btn-error"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* DELETE CONFIRM MODAL */}
      {deleteId && (
        <dialog open className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg text-red-600">
              Confirm Delete
            </h3>
            <p className="py-4">
              Are you sure you want to delete  
              <span className="font-semibold"> {deleteName}</span>?
            </p>

            <div className="modal-action">
              <button
                onClick={() => {
                  setDeleteId(null);
                  setDeleteName("");
                }}
                className="btn btn-ghost"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="btn btn-error"
              >
                Delete
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default CompanySetup;

import { useState } from "react";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import usePageTitle from "../../../Hooks/useTitle";

const PoliceStationSetup = () => {
  usePageTitle("Police Station Setup")
  const axiosInstance = useAxiosSecure();
  const [editId, setEditId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [deleteId, setDeleteId] = useState(null); // for modal

  /* ================= FETCH POLICE STATIONS ================= */
  const {
    data: stations = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["policeStations"],
    queryFn: async () => {
      const res = await axiosInstance.get("/police-station");
      return res.data;
    },
  });

  /* ================= ADD ================= */
  const handleAdd = async (e) => {
    e.preventDefault();
    const name = e.target.policeStation.value.trim();

    if (!name) {
      toast.error("Police station name is required!");
      return;
    }

    const toastId = toast.loading("Adding police station...");
    try {
      await axiosInstance.post("/police-station", { name });
      toast.success("Police station added!", { id: toastId });
      e.target.reset();
      refetch();
    } catch (err) {
      toast.error("Failed to add police station", { id: toastId });
    }
  };

  /* ================= UPDATE ================= */
  const handleUpdate = async (id) => {
    if (!editValue.trim()) {
      toast.error("Police station name required!");
      return;
    }

    const toastId = toast.loading("Updating...");
    try {
      await axiosInstance.patch(`/police-station/${id}`, { name: editValue });
      toast.success("Updated successfully!", { id: toastId });
      setEditId(null);
      setEditValue("");
      refetch();
    } catch (err) {
      toast.error("Update failed", { id: toastId });
    }
  };

  /* ================= DELETE ================= */
  const confirmDelete = async () => {
    if (!deleteId) return;

    const toastId = toast.loading("Deleting...");
    try {
      await axiosInstance.delete(`/police-station/${deleteId}`);
      toast.success("Deleted successfully!", { id: toastId });
      setDeleteId(null);
      refetch();
    } catch (err) {
      toast.error("Delete failed", { id: toastId });
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-gray-700">
        Police Station Setup
      </h2>

      {/* ADD FORM */}
      <form onSubmit={handleAdd} className="flex gap-2 mb-6">
        <input
          type="text"
          name="policeStation"
          placeholder="Enter Police Station Name"
          className="input input-bordered w-full"
        />
        <button className="btn btn-primary">Add</button>
      </form>

      {/* LIST */}
      {isLoading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : stations.length === 0 ? (
        <p className="text-center text-gray-400">No police station added yet</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>#</th>
                <th>Police Station Name</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {stations.map((item, index) => (
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
                          onClick={() => setDeleteId(item._id)}
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
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="mb-6">
              Are you sure you want to delete this police station?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteId(null)}
                className="btn btn-ghost"
              >
                Cancel
              </button>
              <button onClick={confirmDelete} className="btn btn-error">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PoliceStationSetup;

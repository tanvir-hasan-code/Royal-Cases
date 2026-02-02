import React, { useEffect, useState } from "react";
import {
  FaStickyNote,
  FaPlus,
  FaCalendarDay,
  FaTrash,
  FaEdit,
  FaSave,
  FaTimes,
} from "react-icons/fa";
import toast from "react-hot-toast";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import Swal from "sweetalert2";

const DailyNotes = () => {
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");
  const [notesLoading, setNotesLoading] = useState(true);

  const axiosSecure = useAxiosSecure();

  const today = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  /* ================= GET NOTES ================= */
  const fetchNotes = async () => {
    try {
      setNotesLoading(true);
      const res = await axiosSecure.get("/daily-notes");
      setNotes(res.data);
    } catch (err) {
      toast.error("Failed to load notes");
    } finally {
      setNotesLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  /* ================= ADD NOTE ================= */
  const handleAddNote = async () => {
    if (!note.trim()) {
      toast.error("Please write a note before submitting");
      return;
    }

    try {
      setLoading(true);
      const res = await axiosSecure.post("/daily-notes", {
        note,
        date: new Date(),
      });

      if (res.data?.insertedId) {
        toast.success("Note added successfully");
        setNote("");
        fetchNotes();
      }
    } catch (err) {
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE NOTE ================= */
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This note will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#2563eb", // blue-600
      cancelButtonColor: "#dc2626", // red-600
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await axiosSecure.delete(`/daily-notes/${id}`);

      if (res.data?.deletedCount > 0) {
        toast.success("Note deleted successfully 🗑️");
        fetchNotes();
      } else {
        toast.error("Failed to delete note");
      }
    } catch (err) {
      toast.error("Delete failed!");
    }
  };

  /* ================= UPDATE NOTE ================= */
  const handleUpdate = async (id) => {
    if (!editText.trim()) {
      toast.error("Note cannot be empty");
      return;
    }

    try {
      const res = await axiosSecure.patch(`/daily-notes/${id}`, {
        note: editText,
      });

      if (res.data?.modifiedCount > 0) {
        toast.success("Note updated");
        setEditId(null);
        setEditText("");
        fetchNotes();
      }
    } catch (err) {
      toast.error("Failed to update note");
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-slate-100 to-slate-200">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
          <FaStickyNote className="text-blue-600" /> Daily Notes
        </h1>

        <span className="flex items-center gap-2 text-sm font-semibold text-slate-600 bg-white px-4 py-2 rounded-lg shadow">
          <FaCalendarDay className="text-blue-500" />
          {today}
        </span>
      </div>

      {/* Add Note */}
      <div className="bg-white rounded-xl shadow-md p-5 mb-6 border-l-4 border-blue-600">
        <textarea
          rows="3"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Write today's important note..."
          className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 resize-none"
        />

        <div className="flex justify-end mt-3">
          <button
            onClick={handleAddNote}
            disabled={loading}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg font-semibold
              ${
                loading
                  ? "bg-gray-400"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
          >
            <FaPlus />
            {loading ? "Saving..." : "Add Note"}
          </button>
        </div>
      </div>
      {/* Notes List */}
      <div className="space-y-4">
        {notesLoading ? (
          /* 🔄 Loading Spinner */
          <div className="flex justify-center items-center bg-white rounded-xl p-10 shadow">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-3 text-slate-600 font-medium">
              Loading notes...
            </span>
          </div>
        ) : notes.length === 0 ? (
          /* 📭 No Notes */
          <div className="text-center text-slate-500 bg-white rounded-xl p-10 shadow">
            <FaStickyNote className="text-4xl mx-auto mb-3 text-slate-300" />
            <p>No notes found</p>
          </div>
        ) : (
          /* 📝 Notes */
          notes.map((n) => (
            <div
              key={n._id}
              className="bg-white rounded-xl shadow p-4 border-l-4 border-indigo-500"
            >
              {editId === n._id ? (
                <>
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="w-full border p-2 rounded"
                  />
                  <div className="flex gap-2 justify-end mt-2">
                    <button
                      onClick={() => handleUpdate(n._id)}
                      className="text-green-600"
                    >
                      <FaSave />
                    </button>
                    <button
                      onClick={() => setEditId(null)}
                      className="text-gray-500"
                    >
                      <FaTimes />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-slate-800 font-medium">{n.note}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-slate-500">
                      {new Date(n.date).toLocaleTimeString()}
                    </span>
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setEditId(n._id);
                          setEditText(n.note);
                        }}
                        className="text-blue-600"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(n._id)}
                        className="text-red-600"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DailyNotes;

import { useState } from "react";

const CourtSetup = () => {
  const [courtName, setCourtName] = useState("");
  const [courts, setCourts] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  const handleAdd = () => {
    const name = courtName.trim();
    if (!name) return alert("Please enter a court name!");

    if (editIndex !== null) {
      // update existing
      const updated = [...courts];
      updated[editIndex] = name;
      setCourts(updated);
      setEditIndex(null);
    } else {
      // add new
      setCourts([...courts, name]);
    }

    setCourtName("");
  };

  const handleEdit = (index) => {
    setCourtName(courts[index]);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    if (confirm("Are you sure you want to delete this court?")) {
      setCourts(courts.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">Court Setup</h2>

      {/* Input field and button */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Enter Court Name"
          className="input input-bordered flex-1"
          value={courtName}
          onChange={(e) => setCourtName(e.target.value)}
        />
        <button className="btn btn-primary" onClick={handleAdd}>
          {editIndex !== null ? "Update" : "Add"}
        </button>
      </div>

      {/* Display list of courts */}
      <ul className="flex flex-col gap-2">
        {courts.map((court, i) => (
          <li
            key={i}
            className="flex justify-between items-center p-2 rounded border hover:bg-gray-50"
          >
            <span>{court}</span>
            <div className="flex gap-2">
              <button
                className="btn btn-xs btn-warning"
                onClick={() => handleEdit(i)}
              >
                Edit
              </button>
              <button
                className="btn btn-xs btn-error"
                onClick={() => handleDelete(i)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CourtSetup;

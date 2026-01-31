const EditCaseModal = ({ caseData, onSave, onClose }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;

    onSave(caseData._id, {
      caseNo: form.caseNo.value,
      court: form.court.value,
      status: form.status.value,
    });
  };

  return (
    <dialog className="modal modal-open">
      <form className="modal-box" onSubmit={handleSubmit}>
        <h3 className="font-bold text-lg mb-4">Edit Case</h3>

        <input
          name="caseNo"
          defaultValue={caseData.caseNo}
          className="input input-bordered w-full mb-3"
        />

        <input
          name="court"
          defaultValue={caseData.court}
          className="input input-bordered w-full mb-3"
        />

        <select
          name="status"
          defaultValue={caseData.status}
          className="select select-bordered w-full"
        >
          <option>Pending</option>
          <option>Running</option>
          <option>Completed</option>
        </select>

        <div className="modal-action">
          <button type="submit" className="btn btn-primary">
            Save
          </button>
          <button type="button" onClick={onClose} className="btn">
            Cancel
          </button>
        </div>
      </form>
    </dialog>
  );
};

export default EditCaseModal;

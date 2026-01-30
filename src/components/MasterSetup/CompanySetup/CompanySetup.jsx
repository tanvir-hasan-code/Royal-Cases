const CompanySetup = () => {
  const handleAdd = (e) => {
    e.preventDefault();
    console.log(e.target.court.value);
    alert("Hello From Add");
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">
        Company Setup
      </h2>

      {/* Input field and button */}
      <form onSubmit={handleAdd}>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            name="court"
            placeholder="Enter Court Name"
            className="input input-bordered flex-1"
          />
          <input
            className="bg-blue-700 p-2 text-white font-semibold rounded-lg"
            type="submit"
            value="Add"
          />
        </div>
      </form>
    </div>
  );
};

export default CompanySetup;

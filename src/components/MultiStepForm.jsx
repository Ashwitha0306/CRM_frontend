import React from 'react';

const MultiStepForm = ({ step, setStep, formData, setFormData }) => {
  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const next = () => setStep(step + 1);
  const prev = () => setStep(step - 1);

  const handleSubmit = e => {
    e.preventDefault();
    console.log('Final Submit:', formData);
    // Here you can call axios.post or axios.put depending on the mode
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
      {step === 1 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold">Step 1: Personal Info</h3>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name || ''}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
            required
          />
          <input
            type="text"
            name="contact"
            placeholder="Contact Number"
            value={formData.contact || ''}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email || ''}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
          />
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold">Step 2: Professional Info</h3>
          <input
            type="text"
            name="designation"
            placeholder="Designation"
            value={formData.designation || ''}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
          />
          <input
            type="text"
            name="department"
            placeholder="Department"
            value={formData.department || ''}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
          />
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold">Step 3: Document Upload</h3>
          <input
            type="file"
            name="document"
            onChange={e => setFormData({ ...formData, document: e.target.files[0] })}
            className="w-full"
          />
        </div>
      )}

      <div className="flex justify-between">
        {step > 1 && (
          <button
            type="button"
            onClick={prev}
            className="px-4 py-2 bg-gray-500 text-white rounded"
          >
            Back
          </button>
        )}
        {step < 3 ? (
          <button
            type="button"
            onClick={next}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Next
          </button>
        ) : (
          <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">
            Submit
          </button>
        )}
      </div>
    </form>
  );
};

export default MultiStepForm;

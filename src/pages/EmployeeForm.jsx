import React, { useState } from 'react';
import MultiStepForm from '../components/MultiStepForm';

const EmployeeForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Add/Edit Employee</h2>
      <MultiStepForm step={step} setStep={setStep} formData={formData} setFormData={setFormData} />
    </div>
  );
};

export default EmployeeForm;

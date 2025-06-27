import React, { useEffect, useState } from 'react';
import axios from 'axios'; // ✅

import { useParams } from 'react-router-dom';
import Tabs from '../components/Tabs';

const EmployeeDetail = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    axios.get(`/api/employees/${id}/`).then(res => setEmployee(res.data));
  }, [id]);

  if (!employee) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">{employee.name}</h2>
      <Tabs
        tabs={[
          {
            label: 'Personal Info',
            content: (
              <div>
                <p>Email: {employee.email}</p>
                <p>Contact: {employee.contact}</p>
              </div>
            )
          },
          {
            label: 'Professional Info',
            content: (
              <div>
                <p>Department: {employee.department_name}</p>
                <p>Designation: {employee.designation_name}</p>
              </div>
            )
          },
          {
            label: 'Documents',
            content: (
              <ul>
                {employee.documents?.map((doc, i) => (
                  <li key={i}>
                    <a className="text-blue-500 underline" href={doc.url} target="_blank" rel="noreferrer">
                      {doc.name}
                    </a>
                  </li>
                ))}
              </ul>
            )
          },
          {
            label: 'Timeline',
            content: (
              <ul>
                {employee.timeline?.map((event, i) => (
                  <li key={i}>{event.date} – {event.description}</li>
                ))}
              </ul>
            )
          }
        ]}
      />
    </div>
  );
};

export default EmployeeDetail;

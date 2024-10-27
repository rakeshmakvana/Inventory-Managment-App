import React, { useEffect, useState } from 'react';
import api from '../api';
import { FaTrashAlt } from 'react-icons/fa';

const Supplier = () => {
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await api.get('/api/suppliers');
        setSuppliers(response.data);
      } catch (error) {
        console.error('Error fetching supplier data:', error);
      }
    };

    fetchSuppliers();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this supplier?')) {
      try {
        await api.delete(`/api/suppliers/${id}`);
        setSuppliers(suppliers.filter(supplier => supplier._id !== id));
        alert('Supplier deleted successfully!');
      } catch (error) {
        console.error('Error deleting supplier:', error);
        alert('Failed to delete supplier.');
      }
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white rounded-lg shadow-xl p-8">
        <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">Suppliers List</h1>
        {suppliers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg shadow-md">
              <thead>
                <tr className="bg-gray-200 text-gray-800">
                  <th className="py-3 px-4 border-b text-center font-semibold">Name</th>
                  <th className="py-3 px-4 border-b text-center font-semibold">Email</th>
                  <th className="py-3 px-4 border-b text-center font-semibold">Contact</th>
                  <th className="py-3 px-4 border-b text-center font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {suppliers.map((supplier) => (
                  <tr key={supplier._id} className="hover:bg-gray-100 transition duration-200">
                    <td className="py-4 px-4 border-b text-center">{supplier.name}</td>
                    <td className="py-4 px-4 border-b text-center">{supplier.email}</td>
                    <td className="py-4 px-4 border-b text-center">{supplier.contact}</td>
                    <td className="py-4 px-4 border-b text-center">
                      <button 
                        onClick={() => handleDelete(supplier._id)} 
                        className="text-red-500 hover:text-red-700 transition duration-300 flex items-center justify-center mx-auto p-2 rounded-lg shadow-md hover:shadow-lg"
                      >
                        <FaTrashAlt className="mr-1" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-600">No suppliers available.</p>
        )}
      </div>
    </div>
  );
};

export default Supplier;

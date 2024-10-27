import React, { useEffect, useState } from 'react';
import api from '../api';
import { FaEdit, FaTrashAlt, FaFileImport, FaFileExport } from 'react-icons/fa';
import EditInventoryModal from './EditInventory';
import Papa from 'papaparse';

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await api.get('/api/inventorys');
        setInventory(response.data);
      } catch (error) {
        console.error('Error fetching inventory data:', error);
      }
    };

    fetchInventory();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await api.delete(`/api/inventorys/${id}`);
        setInventory(inventory.filter(item => item._id !== id));
        alert('Item deleted successfully!');
      } catch (error) {
        console.error('Error deleting item:', error);
        alert('Failed to delete item.');
      }
    }
  };

  const openEditModal = (id) => {
    setSelectedItemId(id);
    setModalOpen(true);
  };

  const closeEditModal = () => {
    setModalOpen(false);
    setSelectedItemId(null);
  };

  const refreshInventory = async () => {
    try {
      const response = await api.get('/api/inventorys');
      setInventory(response.data);
    } catch (error) {
      console.error('Error refreshing inventory:', error);
    }
  };

  const handleExport = async () => {
    try {
      const response = await api.get('/api/inventorys/export', {
        headers: {
          Accept: 'text/csv',
        },
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'text/csv' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'inventory.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('Failed to export data.');
    }
  };

  const handleImport = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = async (e) => {
      const csv = e.target.result;
      const parsedData = Papa.parse(csv, { header: true });

      if (parsedData.errors.length) {
        console.error('CSV parsing errors:', parsedData.errors);
        alert('Error parsing CSV file.');
        return;
      }

      const inventoryItems = parsedData.data.map(item => ({
        name: item.name,
        quantity: Number(item.quantity),
        category: item.category,
        supplier: { name: item.supplier },
        lowStockAlert: item.lowStockAlert === 'Yes',
      }));

      try {
        await api.post('/api/inventorys/import', { items: inventoryItems }, {
          headers: { 'Content-Type': 'application/json' },
        });
        alert('Items imported successfully!');
        refreshInventory();
      } catch (error) {
        console.error('Error importing items:', error);
        alert('Failed to import items.');
      }
    };

    reader.readAsText(file);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">All Inventory</h1>
      
      <div className="flex justify-center mb-4">
        <button
          onClick={handleExport}
          className="flex items-center bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-200 mx-2 shadow-md"
        >
          <FaFileExport className="mr-1" /> Export
        </button>
        <label className="flex items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200 cursor-pointer mx-2 shadow-md">
          <FaFileImport className="mr-1" /> Import
          <input type="file" accept=".csv" onChange={handleImport} className="hidden" />
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.isArray(inventory) && inventory.length > 0 ? (
          inventory.map((item) => (
            <div key={item._id} className="bg-white rounded-lg shadow-lg p-6 transition-transform transform hover:scale-105 hover:shadow-xl">
              <h2 className="text-2xl font-semibold text-indigo-600 mb-2">{item.name}</h2>
              <p className="text-gray-700">Quantity: <span className="font-bold">{item.quantity}</span></p>
              <p className="text-gray-700">Category: <span className="font-bold">{item.category}</span></p>
              <p className="text-gray-700">Supplier: <span className="font-bold">{item.supplier?.name || 'N/A'}</span></p>
              <p className={`text-gray-700 ${item.lowStockAlert ? 'text-red-500' : 'text-green-500'}`}>
                Low Stock Alert: <span className="font-bold">{item.lowStockAlert ? 'Yes' : 'No'}</span>
              </p>
              <div className="flex justify-between mt-4">
                <button 
                  onClick={() => openEditModal(item._id)} 
                  className="text-blue-500 hover:text-blue-700 transition duration-200 flex items-center"
                >
                  <FaEdit className="mr-1" /> Edit
                </button>
                <button 
                  onClick={() => handleDelete(item._id)} 
                  className="text-red-500 hover:text-red-700 transition duration-200 flex items-center"
                >
                  <FaTrashAlt className="mr-1" /> Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600">No inventory items available.</p>
        )}
      </div>

      <EditInventoryModal
        isOpen={modalOpen}
        onClose={closeEditModal}
        itemId={selectedItemId}
        onUpdate={refreshInventory}
      />
    </div>
  );
};

export default Inventory;

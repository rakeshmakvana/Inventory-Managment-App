import React, { useEffect, useState } from 'react';
import api from '../api';

const EditInventoryModal = ({ isOpen, onClose, itemId, onUpdate }) => {
    const [formData, setFormData] = useState({ name: '', quantity: '', category: '', supplierId: '' });
    const [suppliers, setSuppliers] = useState([]);

    useEffect(() => {
        const fetchSuppliers = async () => {
            try {
                const response = await api.get('/api/suppliers');
                setSuppliers(response.data);
            } catch (error) {
                console.error('Error fetching suppliers:', error);
            }
        };

        const fetchInventoryItem = async () => {
            if (itemId) {
                try {
                    const response = await api.get(`/api/inventorys/${itemId}`);
                    setFormData({
                        name: response.data.name,
                        quantity: response.data.quantity,
                        category: response.data.category,
                        supplierId: response.data.supplier?._id || ''
                    });
                } catch (error) {
                    console.error('Error fetching inventory item:', error);
                }
            }
        };

        fetchSuppliers();
        fetchInventoryItem();
    }, [itemId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/api/inventorys/${itemId}`, formData);
            onUpdate();
            onClose();
        } catch (error) {
            console.error('Error updating inventory item:', error);
            alert('Failed to update item.');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="fixed inset-0 bg-black opacity-70" onClick={onClose}></div>
            <div className="bg-white rounded-lg shadow-lg p-8 z-10 w-full max-w-2xl mx-4">
                <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Edit Inventory</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-medium mb-1">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400 transition duration-200"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-medium mb-1">Quantity</label>
                        <input
                            type="number"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                            required
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400 transition duration-200"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-medium mb-1">Category</label>
                        <input
                            type="text"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400 transition duration-200"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-medium mb-1">Supplier</label>
                        <select
                            name="supplierId"
                            value={formData.supplierId}
                            onChange={handleChange}
                            required
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400 transition duration-200"
                        >
                            <option value={formData.supplierId}>default</option>
                            {suppliers.map((supplier) => (
                                <option key={supplier._id} value={supplier._id}>
                                    {supplier.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md mr-2 transition duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-200"
                        >
                            Update
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditInventoryModal;
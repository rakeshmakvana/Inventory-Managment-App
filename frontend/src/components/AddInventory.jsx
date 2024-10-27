import React, { useState, useEffect } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

const AddInventory = () => {
    const [form, setForm] = useState({ name: "", category: "", quantity: "", supplierId: "" });
    const [suppliers, setSuppliers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSuppliers = async () => {
            try {
                const response = await api.get("/api/suppliers");
                if (Array.isArray(response.data)) {
                    setSuppliers(response.data);
                } else {
                    console.error("Expected an array but received:", response.data);
                }
            } catch (error) {
                console.error("Error fetching suppliers:", error);
            }
        };
        fetchSuppliers();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post("/api/inventorys", form);
            alert("Inventory item added!");
            navigate('/');
            setForm({ name: "", category: "", quantity: "", supplierId: "" });
        } catch (error) {
            console.error("Error adding inventory item:", error);
            alert("Failed to add inventory item.");
        }
    };

    return (
        <div className="max-w-lg mx-auto p-4 bg-white rounded-lg shadow-lg mt-10">
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Add Inventory</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    name="name"
                    placeholder="Item Name"
                    onChange={handleChange}
                    value={form.name}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
                <input
                    type="text"
                    name="category"
                    placeholder="Category"
                    onChange={handleChange}
                    value={form.category}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
                <input
                    type="number"
                    name="quantity"
                    placeholder="Quantity"
                    onChange={handleChange}
                    value={form.quantity}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
                <select
                    name="supplierId"
                    onChange={handleChange}
                    value={form.supplierId}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                >
                    <option value="" disabled>Select Supplier</option>
                    {(suppliers || []).map((supplier) => (
                        <option key={supplier._id} value={supplier._id}>
                            {supplier.name}
                        </option>
                    ))}
                </select>
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-500 transition duration-300 ease-in-out"
                >
                    Add Item
                </button>
            </form>
        </div>
    );
};

export default AddInventory;

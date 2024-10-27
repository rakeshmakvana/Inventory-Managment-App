import React, { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

const AddSupplier = () => {
    const [form, setForm] = useState({ name: "", contact: "", email: "" });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post("/api/suppliers", form);
            alert("Supplier added successfully!");
            navigate('/supplier')
            setForm({ name: "", contact: "", email: "" });
        } catch (error) {
            console.error("Error adding supplier");
            alert("Failed to add supplier.");
        }
    };

    return (
        <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Add Supplier</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    name="name"
                    placeholder="Supplier Name"
                    onChange={handleChange}
                    value={form.name}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
                <input
                    type="number"
                    name="contact"
                    placeholder="Contact Number"
                    onChange={handleChange}
                    value={form.contact}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    onChange={handleChange}
                    value={form.email}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-500 transition duration-300 ease-in-out"
                >
                    Add Supplier
                </button>
            </form>
        </div>
    );
};

export default AddSupplier;
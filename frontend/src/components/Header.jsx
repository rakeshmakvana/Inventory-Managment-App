import React from "react";
import { Link } from "react-router-dom";
import logo from '../assets/logo.png';

const Header = () => {
    return (
        <header className="bg-gradient-to-r bg-purple-800 text-white p-2 shadow-md">
            <nav className="flex justify-between items-center max-w-6xl mx-auto">
                <div className="flex items-center">
                    <img src={logo} alt="logo" className="h-16 w-auto mr-3 rounded" /> 
                </div>
                <div className="space-x-6 flex items-center">
                    <Link 
                        to="/" 
                        className="text-lg hover:text-yellow-300 transition duration-300 ease-in-out">Inventorys
                    </Link>
                    <Link 
                        to="/addinventory" 
                        className="text-lg hover:text-yellow-300 transition duration-300 ease-in-out">Add Inventory
                    </Link>
                    <Link 
                        to="/addsupplier" 
                        className="text-lg hover:text-yellow-300 transition duration-300 ease-in-out">Add Supplier
                    </Link>
                    <Link 
                        to="/supplier" 
                        className="text-lg hover:text-yellow-300 transition duration-300 ease-in-out">Suppliers
                    </Link>
                </div>
            </nav>
        </header>
    );
};

export default Header;

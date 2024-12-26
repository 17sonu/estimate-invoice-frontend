import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import EstimateForm from "./components/EstimateForm";
import InvoiceForm from "./components/InvoiceForm";
import Homepage from "./components/home";
import EstimateList from "./components/Estimatelist";
import SalesList from "./components/Invoicelist";
import './App.css';
import logo from "./assets/logo512.png";

const LoadingSpinner = () => (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
        <svg
            className="animate-spin h-12 w-12 text-blue-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
        >
            <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
            ></circle>
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C6.48 0 2 4.48 2 10h2zm2 5.29a7.956 7.956 0 01-1.713-2.58l-1.864.777C4.6 15.745 6.235 17.03 8 17.71V15.29z"
            ></path>
        </svg>
    </div>
);

const App = () => {
    const [loading, setLoading] = useState(false);
    const location = useLocation();

    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => setLoading(false), 400); // Simulated delay
        return () => clearTimeout(timer);
    }, [location]);

    return (
        <>
            {loading && <LoadingSpinner />}
            <nav className="navbar">
                <ul className="navbar-list">
                    <li>
                        <Link to="/">
                            <img src={logo} alt="Logo" />
                        </Link>
                    </li>
                    <li className="navbar-item">
                        <Link to="/">Home</Link>
                    </li>
                    <li className="navbar-item">
                        <Link to="/estimates">Estimates</Link>
                    </li>
                    <li className="navbar-item">
                        <Link to="/invoices">Sales</Link>
                    </li>
                </ul>
            </nav>
            <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/estimates" element={<EstimateForm />} />
                <Route path="/invoices" element={<InvoiceForm />} />
                <Route path="/allestimates" element={<EstimateList />} />
                <Route path="/allsales" element={<SalesList />} />
            </Routes>
        </>
    );
};

export default function MainApp() {
    return (
        <Router>
            <App />
        </Router>
    );
}

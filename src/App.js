import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import EstimateForm from "./components/EstimateForm";
import InvoiceForm from "./components/InvoiceForm";
import Homepage from "./components/home";
import EstimateList from "./components/Estimatelist";
import SalesList from "./components/Invoicelist";
import './App.css';
import logo from "./assets/logo512.png"

const App = () => {
    return (
        <Router>
            <nav class="navbar ">
                <ul class="navbar-list">
                <li><Link to="/"><img src={logo} alt="Logo" /></Link></li>
                <li class="navbar-item"><Link to="/">Home</Link></li>
                <li class="navbar-item"><Link to="/estimates">Estimates</Link></li>
                <li class="navbar-item"><Link to="/invoices">Sales</Link></li>
                </ul>
            </nav>
            <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/estimates" element={<EstimateForm />} />
                <Route path="/invoices" element={<InvoiceForm />} />
                <Route path="/allestimates" element={<EstimateList/>} />
                <Route path="/allsales" element={<SalesList/>} />
            </Routes>
        </Router>
    );
};

export default App;
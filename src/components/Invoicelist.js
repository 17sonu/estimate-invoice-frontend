import React, { useEffect, useState } from "react";
import axios from "axios";

function InvoiceList() {
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [uploading, setUploading] = useState(false);


    useEffect(() => {
        const fetchSales = async () => {
            try {
                const response = await axios.get("https://estimate-invoice-backend.vercel.app/api/invoices");
                setSales(response.data);
                setLoading(false);
            } catch (err) {
                setError("Failed to fetch estimates. Please try again later.");
                setLoading(false);
            }
        };

        fetchSales();
    }, []);

    const handleFileUpload = async (invoiceId, file) => {
        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            await axios.post(`https://estimate-invoice-backend.vercel.app/api/invoices/${invoiceId}/upload`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            alert("File uploaded successfully!");
        } catch (err) {
            alert("Error connecting to database!");
        } finally {
            setUploading(false);
        }
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="container mx-auto p-8 bg-gradient-to-b from-blue-50 to-pink-50 min-h-screen">
            {/* Enhanced Heading Section */}
            <div className="bg-gradient-to-r from-blue-600 to-pink-600 text-white py-8 px-6 rounded-lg shadow-lg mb-8 text-center">
                <h1 className="text-5xl font-extrabold tracking-wide">Order Invoice List</h1>
            </div>

            {/* Table Section */}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-gradient-to-r from-blue-100 to-pink-100 border border-gray-300 shadow-2xl rounded-lg">
                    <thead>
                        <tr className="bg-gradient-to-r from-blue-600 to-pink-600 text-white shadow-lg">
                            <th className="py-3 px-6 border-b text-left text-lg font-medium">Client Name</th>
                            <th className="py-3 px-6 border-b text-left text-lg font-medium">Created At</th>
                            <th className="py-3 px-6 border-b text-left text-lg font-medium">Due Date</th>
                            <th className="py-3 px-6 border-b text-left text-lg font-medium">Amount</th>
                            <th className="py-3 px-6 border-b text-left text-lg font-medium">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sales.map((sale) => (
                            <tr
                                key={sale.id}
                                className="hover:bg-gradient-to-r hover:from-pink-100 hover:to-blue-100 transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:-translate-y-1"
                            >
                                <td className="py-4 px-6 border-b text-gray-800 font-semibold">{sale.client.name}</td>
                                <td className="py-4 px-6 border-b text-gray-800">{new Date(sale.createdAt).toLocaleDateString('en-GB')} ( {new Date(sale.createdAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })} )</td>
                                <td className="py-4 px-6 border-b text-gray-800">{new Date(sale.dueDate).toLocaleDateString('en-GB')}</td>
                                <td className="py-4 px-6 border-b text-gray-800 font-bold">₹{sale.total.toFixed(2)}</td>
                                <td className="py-4 px-6 border-b">
                                    <button className="bg-gradient-to-r from-blue-500 to-pink-500 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-pink-600 transform focus:ring-2 focus:ring-offset-2 focus:ring-pink-400 shadow-md">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M12 4.5c-5.52 0-9.94 4.09-10.96 7.5C2.06 15.41 6.48 19.5 12 19.5s9.94-4.09 10.96-7.5C21.94 8.59 17.52 4.5 12 4.5zM12 16a4 4 0 110-8 4 4 0 010 8z"
                                            />
                                        </svg>
                                    </button>
                                    <label className="flex items-center justify-center bg-gradient-to-r from-pink-500 to-blue-500 text-white py-2 px-3 rounded-lg hover:from-pink-600 hover:to-blue-600 shadow-md cursor-pointer w-28 h-10">
                                        <input
                                            type="file"
                                            accept="application/pdf"
                                            className="hidden"
                                            onChange={(e) => handleFileUpload(sale.id, e.target.files[0])}
                                        />
                                        {uploading ? (
                                            <svg
                                                className="animate-spin h-5 w-5 text-white"
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
                                        ) : (
                                            <span className="text-sm">Upload PDFs</span>
                                        )}
                                    </label>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default InvoiceList;
import React, { useEffect, useState } from "react";
import axios from "axios";

function EstimateList() {
    const [estimates, setEstimates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEstimates = async () => {
            try {
                const response = await axios.get("https://estimate-invoice-backend.vercel.app/api/estimates");
                setEstimates(response.data);
                setLoading(false);
            } catch (err) {
                setError("Failed to fetch estimates. Please try again later.");
                setLoading(false);
            }
        };

        fetchEstimates();
    }, []);

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
                <h1 className="text-5xl font-extrabold tracking-wide">Proposal Invoice List</h1>
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
                        {estimates.map((estimate) => (
                            <tr
                                key={estimate.id}
                                className="hover:bg-gradient-to-r hover:from-pink-100 hover:to-blue-100 transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:-translate-y-1"
                            >
                                <td className="py-4 px-6 border-b text-gray-800 font-semibold">{estimate.client.name}</td>
                                <td className="py-4 px-6 border-b text-gray-800">{new Date(estimate.createdAt).toLocaleDateString('en-GB')} ( {new Date(estimate.createdAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })} )</td>
                                <td className="py-4 px-6 border-b text-gray-800">{new Date(estimate.dueDate).toLocaleDateString('en-GB')}</td>
                                <td className="py-4 px-6 border-b text-gray-800 font-bold">₹{estimate.total.toFixed(2)}</td>
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
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default EstimateList;
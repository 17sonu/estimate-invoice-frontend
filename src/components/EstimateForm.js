import React, { useState } from "react";
import {
    TextField,
    Button,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    MenuItem,
    FormControl, 
    InputLabel,
    TableRow,
    Paper,
    IconButton,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const EstimateForm = () => {
    const [clientName, setClientName] = useState("");
    const [clientEmail, setClientEmail] = useState("");
    const [items, setItems] = useState([
        { description: "", quantity: 0, price: 0, discount: 0 },
    ]);
    const [taxRate, setTaxRate] = useState(0);
    const [dueDate, setDueDate] = useState("");
    const [message, setMessage] = useState("");

    // Calculate totals
    const subTotal = items.reduce(
        (total, item) =>
            total + item.quantity * item.price * (1 - item.discount / 100),
        0
    );
    const vat = (subTotal * taxRate) / 100;
    const total = subTotal + vat;

    const handleAddItem = () => {
        setItems([...items, { description: "", quantity: 0, price: 0, discount: 0 }]);
    };

    const handleDeleteItem = (index) => {
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems);
    };

    const handleChange = (index, field, value) => {
        const newItems = [...items];
        newItems[index][field] = value;
        setItems(newItems);
    };
    const [status, setStatus] = useState("Unpaid");

    const handleStatusChange = (event) => {
    setStatus(event.target.value);
};

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("https://estimate-invoice-backend.vercel.app/api/estimates", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    client: {
                        name: clientName,
                        email: clientEmail,
                    },
                    items,
                    taxRate,
                    dueDate,
                    total,
                    status,
                }),
            });
            if (response.ok) {
                setMessage("Proposal submitted successfully!");
                setClientName("");
                setClientEmail("");
                setItems([{ description: "", quantity: 0, price: 0, discount: 0 }]);
                setTaxRate(0);
                setDueDate("");
                setStatus("Unpaid"); // Reset status
            } else {
                setMessage("Failed to submit proposal. Please try again.");
            }
        } catch (error) {
            setMessage("An error occurred. Please try again.");
        }
    };

    // Function to generate and download the PDF
    const handleDownloadInvoice = () => {
        const doc = new jsPDF();

        // Title
        doc.setFontSize(18);
        doc.text("Proposal Invoice", 105, 20, null, null, "center");
        doc.setFontSize(14);
        doc.text(`Bill To:`, 20, 30);
        // Client Info
        doc.setFontSize(12);
        doc.text(`Client Name: ${clientName}`, 20, 40);
        doc.text(`Client Email: ${clientEmail}`, 20, 50);

        doc.setFontSize(12);
        doc.text(`Status: ${status}`, 150, 40);
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 150, 50);
        doc.text(`Due Date: ${dueDate}`, 150, 60);

        // Items Table
        doc.autoTable({
            startY: 80,
            head: [["Item", "Qty", "Price", "Disc (%)", "Amount"]],
            body: items.map((item) => [
                item.description,
                item.quantity,
                item.price,
                item.discount,
                (item.quantity * item.price * (1 - item.discount / 100)).toFixed(2),
            ]),
        });

        // Summary
        doc.text(`Sub Total: INR ${subTotal.toFixed(2)}`, 20, doc.lastAutoTable.finalY + 10);
        doc.text(`GST (${taxRate}%): INR ${vat.toFixed(2)}`, 20, doc.lastAutoTable.finalY + 20);
        doc.text(`Total: INR ${total.toFixed(2)}`, 20, doc.lastAutoTable.finalY + 30);

        // Download PDF
        doc.save("invoice.pdf");
    };

    const handleCombinedActions = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior
        await handleDownloadInvoice(); // Call the handleDownloadInvoice function
        handleSubmit(e); // Call the handleSubmit function
    };

    return (
        <div className="p-4">
            <h1 align="Center" className="text-4xl font-bold text-red-600">Proposal Invoice</h1>
            <form onSubmit={handleCombinedActions}>
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-xl font-bold">Bill To</h2>
                        <table>
                            <tr>
                                <td>
                                    <TextField
                                        type="text"
                                        placeholder="Client Name"
                                        value={clientName}
                                        onChange={(e) => setClientName(e.target.value)}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <TextField
                                        type="email"
                                        placeholder="Client Email"
                                        value={clientEmail}
                                        onChange={(e) => setClientEmail(e.target.value)}
                                    />
                                </td>
                            </tr>
                        </table>
                    </div>
                    <div className="text-right">
                    <FormControl fullWidth>
                        <InputLabel id="status-label">Status</InputLabel>
                            <Select
                                label="Status"
                                value={status}
                                onChange={handleStatusChange}
                            >
                                <MenuItem value="Paid">Paid</MenuItem>
                                <MenuItem value="Partially Paid">Partially Paid</MenuItem>
                                <MenuItem value="Unpaid">Unpaid</MenuItem>
                            </Select>
                        </FormControl>
                        <p>
                            <strong>Date:</strong> {new Date().toLocaleDateString()}
                        </p>
                        <p>
                            <strong>Due Date:</strong>{" "}
                            {dueDate || "Select a due date"}
                        </p>
                        <p>
                            <strong>Amount:</strong> INR {total.toFixed(2)}
                        </p>
                    </div>
                </div>

                <TableContainer component={Paper} className="mt-4">
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Item</TableCell>
                                <TableCell>Qty</TableCell>
                                <TableCell>Price</TableCell>
                                <TableCell>Disc(%)</TableCell>
                                <TableCell>Amount</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {items.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        <TextField
                                            placeholder="Item name or description"
                                            variant="outlined"
                                            fullWidth
                                            value={item.description}
                                            onChange={(e) =>
                                                handleChange(index, "description", e.target.value)
                                            }
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            type="number"
                                            variant="outlined"
                                            fullWidth
                                            value={item.quantity}
                                            onChange={(e) =>
                                                handleChange(index, "quantity", e.target.value)
                                            }
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            type="number"
                                            variant="outlined"
                                            fullWidth
                                            value={item.price}
                                            onChange={(e) =>
                                                handleChange(index, "price", e.target.value)
                                            }
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            type="number"
                                            variant="outlined"
                                            fullWidth
                                            value={item.discount}
                                            onChange={(e) =>
                                                handleChange(index, "discount", e.target.value)
                                            }
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {(item.quantity * item.price * (1 - item.discount / 100)).toFixed(2)}
                                    </TableCell>
                                    <TableCell>
                                        <IconButton
                                            color="error"
                                            onClick={() => handleDeleteItem(index)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <div className="flex justify-between mt-6">
                    <IconButton color="primary" onClick={handleAddItem}>
                        <AddCircleIcon />
                    </IconButton>
                    <div className="text-right">
                        <h3 className="font-bold">Invoice Summary</h3>
                        <p>Sub total: INR {subTotal.toFixed(2)}</p>
                        <p>
                            GST (%):
                            <TextField
                                type="number"
                                size="small"
                                value={taxRate}
                                onChange={(e) => setTaxRate(e.target.value)}
                                className="ml-2 w-20"
                            />
                        </p>
                        <p>Total: INR {total.toFixed(2)}</p>
                    </div>
                </div>

                <div className="flex justify-between items-center mt-6">
                    <TextField
                        label="Tax Rates (%)"
                        type="number"
                        variant="outlined"
                        value={taxRate}
                        onChange={(e) => setTaxRate(e.target.value)}
                    />
                    <TextField
                        label="Due Date"
                        type="date"
                        variant="outlined"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </div>
                <br></br>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    className="mt-4"
                >
                    Submit Proposal
                </Button>
            </form>
            <Button
                variant="contained"
                color="secondary"
                className="mt-4"
                onClick={handleDownloadInvoice}
            >
                Download Invoice as PDF
            </Button>
            {message && <p className="mt-4">{message}</p>}
        </div>
    );
};

export default EstimateForm;
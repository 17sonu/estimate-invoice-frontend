import React, { useState } from "react";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Button,
    IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const NewCustomerForm = ({ open, handleClose, handleSave }) => {
    const [customer, setCustomer] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCustomer({ ...customer, [name]: value });
    };

    const handleSaveCustomer = () => {
        handleSave(customer); // Send customer data back to parent
        setCustomer({ name: "", email: "", phone: "", address: "" }); // Reset the form
        handleClose(); // Close the dialog
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth>
            <DialogTitle>
                New Customer
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{ position: "absolute", right: 8, top: 8 }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <TextField
                    label="Name"
                    name="name"
                    fullWidth
                    margin="dense"
                    variant="outlined"
                    value={customer.name}
                    onChange={handleChange}
                />
                <TextField
                    label="Email"
                    name="email"
                    fullWidth
                    margin="dense"
                    variant="outlined"
                    value={customer.email}
                    onChange={handleChange}
                />
                <TextField
                    label="Phone"
                    name="phone"
                    fullWidth
                    margin="dense"
                    variant="outlined"
                    value={customer.phone}
                    onChange={handleChange}
                />
                <TextField
                    label="Address"
                    name="address"
                    fullWidth
                    margin="dense"
                    variant="outlined"
                    multiline
                    rows={2}
                    value={customer.address}
                    onChange={handleChange}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="secondary">
                    Cancel
                </Button>
                <Button
                    onClick={handleSaveCustomer}
                    color="primary"
                    variant="contained"
                >
                    Save Customer
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default NewCustomerForm;
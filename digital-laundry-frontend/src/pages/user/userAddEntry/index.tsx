"use client";
import React, { useState } from "react";
import {
    Box,
    Typography,
    TextField,
    MenuItem,
    Button,
    Grid,
    Card,
    CardContent,
    Stack,
    IconButton,
    Divider,
} from "@mui/material";
import { AddCircle, Delete, Save } from "@mui/icons-material";

interface Item {
    name: string;
    qty: number;
    photos: string[];
}

export default function AddLaundryEntry() {
    const [order, setOrder] = useState({
        id: "",
        date: new Date().toISOString().split("T")[0],
        items: [] as Item[],
    });

    const ITEM_TYPES = ["Shirts", "Pants", "Bedsheet", "Towel"];

    const addItem = () => {
        const remainingItems = ITEM_TYPES.filter(
            (item) => !order.items.find((i) => i.name === item)
        );
        if (remainingItems.length > 0) {
            setOrder({
                ...order,
                items: [...order.items, { name: remainingItems[0], qty: 1, photos: [] }],
            });
        }
    };

    const removeItem = (index: number) => {
        const updatedItems = order.items.filter((_, i) => i !== index);
        setOrder({ ...order, items: updatedItems });
    };

    const handleItemChange = (index: number, field: string, value: any) => {
        const updatedItems = [...order.items];
        (updatedItems[index] as any)[field] = value;
        setOrder({ ...order, items: updatedItems });
    };

    // Add this function in your component
    const handlePhotoUpload = (index: number, files: FileList | null) => {
        if (!files) return;
        const updatedItems = [...order.items];
        // Convert FileList to array of object URLs
        const newPhotos = Array.from(files).map((file) => URL.createObjectURL(file));
        updatedItems[index].photos = updatedItems[index].photos
            ? [...updatedItems[index].photos, ...newPhotos]
            : newPhotos;
        setOrder({ ...order, items: updatedItems });
    };


    const handleSubmit = () => {
        console.log("Laundry Order Submitted:", order);
        alert("🎉 Laundry entry submitted successfully!");
    };

    const allItemsAdded = order.items.length >= ITEM_TYPES.length;

    return (
        <Box
            sx={{
                px: { xs: 2, md: 4 },
                py: 3,
                background: "linear-gradient(135deg, #e0f2fe, #f0fdfa)",
                minHeight: "82vh",
            }}
        >
            <Typography variant="h4" fontWeight="bold" gutterBottom color="primary">
                🧺 Add Laundry Entry
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
                Add your laundry items with quantities and photos. Duplicate items are not allowed.
            </Typography>

            <Card sx={{ borderRadius: 4, p: 3, boxShadow: "0 8px 30px rgba(0,0,0,0.08)", background: "#fff" }}>
                <CardContent>
                    {/* Order Info */}
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Unique Laundry ID"
                                value={order.id}
                                onChange={(e) => setOrder({ ...order, id: e.target.value })}
                                fullWidth
                                required
                                sx={{ background: "#f9fafb", borderRadius: 2 }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                type="date"
                                label="Date"
                                value={order.date}
                                onChange={(e) => setOrder({ ...order, date: e.target.value })}
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                sx={{ background: "#f9fafb", borderRadius: 2 }}
                            />
                        </Grid>
                    </Grid>

                    {/* Divider */}
                    <Box my={3}>
                        <hr />
                    </Box>

                    {/* Items Section */}
                    <Typography variant="h6" fontWeight={600} gutterBottom color="secondary">
                        Items in this Order
                    </Typography>

                    {order.items.length === 0 ? (
                        <Box
                            sx={{
                                textAlign: "center",
                                py: 5,
                                border: "2px dashed #3b82f6",
                                borderRadius: 4,
                                mb: 2,
                                background: "#f0f9ff",
                            }}
                        >
                            <Typography variant="body1" color="primary" fontWeight={600}>
                                No items added yet.
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Click on "+ Add Item" to start adding laundry items.
                            </Typography>
                        </Box>
                    ) : (
                        <Grid container spacing={3}>
                            {order.items.map((item, index) => (
                                <Grid item xs={12} key={index}>
                                    <Card
                                        sx={{
                                            p: 3,
                                            borderRadius: 3,
                                            boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
                                            background: "linear-gradient(145deg, #dbeafe, #eff6ff)", // lighter blue gradient
                                            transition: "0.3s",
                                            "&:hover": {
                                                transform: "translateY(-4px)",
                                                boxShadow: "0 12px 25px rgba(0,0,0,0.15)",
                                            },
                                        }}
                                    >
                                        {/* Header */}
                                        <Grid container alignItems="center" spacing={2}>
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant="h6" fontWeight={600} color="primary">
                                                    Item {index + 1}: {item.name}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} sm={6} textAlign={{ xs: "left", sm: "right" }}>
                                                {order.items.length > 1 && (
                                                    <Button
                                                        variant="outlined"
                                                        color="error"
                                                        startIcon={<Delete />}
                                                        onClick={() => removeItem(index)}
                                                        sx={{ borderRadius: 2 }}
                                                    >
                                                        Remove
                                                    </Button>
                                                )}
                                            </Grid>
                                        </Grid>

                                        <Divider sx={{ my: 2 }} />

                                        {/* Item Form Fields */}
                                        <Grid container spacing={2}>
                                            {/* Item Type */}
                                            <Grid item xs={12} sm={4}>
                                                <TextField
                                                    select
                                                    label="Item Type"
                                                    value={item.name}
                                                    onChange={(e) => handleItemChange(index, "name", e.target.value)}
                                                    fullWidth
                                                    sx={{ background: "#fff", borderRadius: 2 }}
                                                >
                                                    {ITEM_TYPES.filter((type) =>
                                                        // include types that are either not selected OR currently selected for this row
                                                        !order.items.some((it, i) => it.name === type && i !== index)
                                                    ).map((type) => (
                                                        <MenuItem key={type} value={type}>
                                                            {type}
                                                        </MenuItem>
                                                    ))}
                                                </TextField>
                                            </Grid>

                                            {/* Quantity */}
                                            <Grid item xs={12} sm={4}>
                                                <TextField
                                                    type="number"
                                                    label="Quantity"
                                                    value={item.qty}
                                                    onChange={(e) =>
                                                        handleItemChange(index, "qty", parseInt(e.target.value) || 1)
                                                    }
                                                    fullWidth
                                                    inputProps={{ min: 1 }}
                                                    sx={{ background: "#fff", borderRadius: 2 }}
                                                />
                                            </Grid>

                                            {/* Upload Photos */}
                                            <Grid item xs={12} sm={4}>
                                                <Button
                                                    component="label"
                                                    variant="outlined"
                                                    fullWidth
                                                    sx={{
                                                        borderRadius: 2,
                                                        height: 50, // increased height
                                                        background: "#bfdbfe",
                                                        fontWeight: 600,
                                                        "&:hover": { background: "#93c5fd" },
                                                    }}
                                                >
                                                    Upload Photos
                                                    <input
                                                        hidden
                                                        type="file"
                                                        multiple
                                                        accept="image/*"
                                                        onChange={(e) => handlePhotoUpload(index, e.target.files)}
                                                    />
                                                </Button>
                                            </Grid>
                                        </Grid>

                                        {/* Uploaded Photos Preview */}
                                        {item.photos && item.photos.length > 0 && (
                                            <Grid container spacing={1} mt={2}>
                                                {item.photos.map((photo: string, i: number) => (
                                                    <Grid item xs={4} sm={2} key={i}>
                                                        <Box
                                                            component="img"
                                                            src={photo}
                                                            alt={`Item ${i}`}
                                                            sx={{
                                                                width: "100%",
                                                                height: 80,
                                                                objectFit: "cover",
                                                                borderRadius: 2,
                                                                border: "2px solid #3b82f6",
                                                                transition: "0.3s",
                                                                "&:hover": { transform: "scale(1.1)" },
                                                            }}
                                                        />
                                                    </Grid>
                                                ))}
                                            </Grid>
                                        )}
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    )}

                    {/* Add Item Button */}
                    <Button
                        variant="contained"
                        startIcon={<AddCircle />}
                        onClick={addItem}
                        disabled={allItemsAdded}
                        sx={{
                            mt: 2,
                            borderRadius: 3,
                            background: allItemsAdded ? "#9ca3af" : "linear-gradient(135deg,#3b82f6,#2563eb)",
                            color: "#fff",
                            fontWeight: 600,
                            textTransform: "none",
                            "&:hover": allItemsAdded
                                ? { background: "#9ca3af" }
                                : { background: "linear-gradient(135deg,#1d4ed8,#1e40af)", transform: "translateY(-2px)", boxShadow: "0 6px 16px rgba(30,58,138,0.4)" },
                        }}
                    >
                        {allItemsAdded ? "All items added" : "+ Add Item"}
                    </Button>

                    {/* Submit Buttons */}
                    <Stack direction="row" justifyContent="flex-end" spacing={2} mt={4}>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<Save />}
                            onClick={handleSubmit}
                            sx={{ borderRadius: 3, px: 3, py: 1, textTransform: "none", fontWeight: 600 }}
                        >
                            Submit Entry
                        </Button>
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={() =>
                                setOrder({ id: "", date: new Date().toISOString().split("T")[0], items: [] })
                            }
                            sx={{ borderRadius: 3, px: 3, py: 1, textTransform: "none", fontWeight: 600 }}
                        >
                            Reset
                        </Button>
                    </Stack>
                </CardContent>
            </Card>
        </Box>
    );
}

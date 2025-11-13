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
import {
    AddCircle,
    Delete,
    Save,
    Close as CloseIcon,
    PhotoCamera,
} from "@mui/icons-material";
import { useDispatch } from "react-redux";
import usePageLoader from "@/Redux/hooks/usePageLoader";
import useSnackBar from "@/Redux/hooks/useSnackBar";
import ErrorHandler from "@/lib/errorHandler";
import { useRouter } from "next/navigation";
import { CreateOrder } from "@/Redux/Actions/AuthUser";
import { BaseUrl } from "@/ApiSetUp/AuthApi";

interface Item {
    item_name: string;
    quantity: number;
    photos: string[]; // data URLs
    remark: string;
}

export default function AddLaundryEntry() {
    const router = useRouter();
    const dispatch = useDispatch();
    const setFullPageLoader = usePageLoader();
    const { setSnackBar } = useSnackBar();

    const [order, setOrder] = useState({
        id: "",
        date: new Date().toISOString().split("T")[0],
        items: [] as Item[],
    });

    // removed uploadedImages debug dialog/state so nothing will pop up after submit
    const [submitting, setSubmitting] = useState(false);

    const ITEM_NAMES = ["shirt", "pant", "bedsheet", "towel", "t-shirt"];

    const addItem = () => {
        const remaining = ITEM_NAMES.filter(
            (n) => !order.items.find((i) => i.item_name === n)
        );
        if (remaining.length > 0) {
            setOrder((prev) => ({
                ...prev,
                items: [
                    ...prev.items,
                    {
                        item_name: remaining[0],
                        quantity: 1,
                        photos: [],
                        remark: "",
                    },
                ],
            }));
        }
    };

    const removeItem = (index: number) => {
        setOrder((prev) => ({
            ...prev,
            items: prev.items.filter((_, i) => i !== index),
        }));
    };

    const handleItemChange = (index: number, field: keyof Item, value: any) => {
        setOrder((prev) => {
            const items = [...prev.items];
            (items[index] as any)[field] = value;
            return { ...prev, items };
        });
    };

    const handleItemPhotosUpload = (index: number, files: FileList | null) => {
        if (!files || files.length === 0) return;

        const readers = Array.from(files).map(
            (file) =>
                new Promise<string>((resolve) => {
                    const fr = new FileReader();
                    fr.onload = () => resolve(fr.result as string);
                    fr.readAsDataURL(file);
                })
        );

        Promise.all(readers).then((dataUrls) => {
            setOrder((prev) => {
                const items = [...prev.items];
                items[index].photos = dataUrls;
                return { ...prev, items };
            });
        });
    };

    const removeItemPhoto = (index: number, photoIdx: number) => {
        setOrder((prev) => {
            const items = [...prev.items];
            items[index].photos = items[index].photos.filter((_, i) => i !== photoIdx);
            return { ...prev, items };
        });
    };

    // auth header helpers
    function getAuthToken() {
        return (
            localStorage.getItem("token") ||
            localStorage.getItem("authToken") ||
            ""
        );
    }
    function authHeaders() {
        const token = getAuthToken();
        const headers: Record<string, string> = { "Content-Type": "application/json" };
        if (token) headers["Authorization"] = `Bearer ${token}`;
        return headers;
    }

    const findItemId = (returnedItems: any[], localItem: Item, idx: number) => {
        if (!returnedItems || returnedItems.length === 0) return null;
        const byType = returnedItems.find(
            (ri) =>
                String((ri.itemType ?? ri.item_type ?? ri.name ?? "")).toLowerCase() ===
                String(localItem.item_name).toLowerCase()
        );
        if (byType?.id) return byType.id;
        const atIdx = returnedItems[idx];
        if (atIdx?.id) return atIdx.id;
        const anyWithId = returnedItems.find((ri) => ri.id);
        return anyWithId?.id ?? null;
    };

    // ---------- handle submit (create order -> upload images per item) ----------
    const handleSubmit = async () => {
        if (order.items.length === 0) {
            setSnackBar("warning", "Please add at least one item.");
            return;
        }

        for (let i = 0; i < order.items.length; i++) {
            const it = order.items[i];
            if (!it.item_name || !(it.quantity >= 1)) {
                setSnackBar("warning", `Please provide valid item & quantity for item #${i + 1}.`);
                return;
            }
        }

        setFullPageLoader(true);
        setSubmitting(true);

        try {
            const payload = {
                orderDate: order.date,
                items: order.items.map((it) => ({
                    itemType: it.item_name,
                    quantity: Number(it.quantity) || 0,
                    remark: it.remark || "",
                })),
            };

            // 1) create order via redux action
            const res: any = await dispatch(CreateOrder(payload as any));
            const ok = ErrorHandler(res, setSnackBar);

            if (!ok) {
                setFullPageLoader(false);
                setSubmitting(false);
                return;
            }
            const created = res?.payload ?? res?.data ?? null;
            const orderObj = created?.order ?? created?.data?.order ?? created ?? null;
            const orderId =
                orderObj?.id ?? created?.id ?? created?.orderId ?? created?.order_id ?? null;

            if (!orderId) {
                setSnackBar(
                    "warning",
                    "Order created but server did not return order id. Images could not be uploaded."
                );
                router.push("/user/userHistory");
                return;
            }

            const returnedItems: any[] =
                orderObj?.items ?? created?.items ?? orderObj?.orderItems ?? [];

            // 3) upload images per-item (sequential)
            for (let i = 0; i < order.items.length; i++) {
                const localItem = order.items[i];
                if (!localItem.photos || localItem.photos.length === 0) continue;

                const itemId = findItemId(returnedItems, localItem, i);
                if (!itemId) {
                    setSnackBar(
                        "warning",
                        `Skipping image upload for item "${localItem.item_name}" — server item id not available.`
                    );
                    continue;
                }

                try {
                    const url = `${BaseUrl}/api/orders/${orderId}/items/${itemId}/images`;
                    const body = { images: localItem.photos };

                    const r = await fetch(url, {
                        method: "POST",
                        headers: authHeaders(),
                        body: JSON.stringify(body),
                    });

                    let json = null;
                    try {
                        json = await r.json();
                    } catch {
                        json = null;
                    }

                    if (!r.ok) {
                        const msg = json?.message ?? `Upload failed (${r.status})`;
                        setSnackBar("warning", `Images upload failed for ${localItem.item_name}: ${msg}`);
                    } else {
                        // upload succeeded — no visible debug panel will be shown
                    }
                } catch (err: any) {
                    console.error("upload error", err);
                    setSnackBar("warning", `Images upload failed for ${localItem.item_name}.`);
                }
            }

            setSnackBar("success", "Order created successfully. Images uploaded where possible.");
            router.push("/user/userHistory");
        } catch (err: any) {
            console.error(err);
            setSnackBar("error", err.message || "Please provide correct details.");
        } finally {
            setFullPageLoader(false);
            setSubmitting(false);
        }
    };

    const allItemsAdded = order.items.length >= ITEM_NAMES.length;

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
                Add your laundry items with quantities. Each item can have its own type, photos, and remark.
                Duplicate items are not allowed.
            </Typography>

            <Card
                sx={{
                    borderRadius: 4,
                    p: 3,
                    boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
                    background: "#fff",
                }}
            >
                <CardContent>
                    {/* Order Info */}
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
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

                    <Box my={3}>
                        <Divider />
                    </Box>

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
                                            background: "linear-gradient(145deg, #dbeafe, #eff6ff)",
                                        }}
                                    >
                                        <Grid container alignItems="center" spacing={2}>
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant="h6" fontWeight={600} color="primary">
                                                    Item {index + 1}: {item.item_name}
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

                                        <Grid container spacing={2}>
                                            <Grid item xs={12} sm={3}>
                                                <TextField
                                                    select
                                                    label="Item"
                                                    value={item.item_name}
                                                    onChange={(e) => handleItemChange(index, "item_name", e.target.value)}
                                                    fullWidth
                                                    sx={{ background: "#fff", borderRadius: 2 }}
                                                >
                                                    {ITEM_NAMES.filter(
                                                        (name) => !order.items.some((it, i) => it.item_name === name && i !== index)
                                                    ).map((name) => (
                                                        <MenuItem key={name} value={name}>
                                                            {name}
                                                        </MenuItem>
                                                    ))}
                                                </TextField>
                                            </Grid>

                                            <Grid item xs={12} sm={3}>
                                                <TextField
                                                    type="number"
                                                    label="Quantity"
                                                    value={item.quantity}
                                                    onChange={(e) =>
                                                        handleItemChange(index, "quantity", Math.max(1, parseInt(e.target.value) || 1))
                                                    }
                                                    fullWidth
                                                    inputProps={{ min: 1 }}
                                                    sx={{ background: "#fff", borderRadius: 2 }}
                                                />
                                            </Grid>

                                            <Grid item xs={12} sm={3}>
                                                <Button
                                                    component="label"
                                                    variant="outlined"
                                                    startIcon={<PhotoCamera />}
                                                    fullWidth
                                                    sx={{
                                                        height: 56,
                                                        borderRadius: 2,
                                                        background: "#fff",
                                                        fontWeight: 600,
                                                    }}
                                                >
                                                    Add Photos
                                                    <input
                                                        hidden
                                                        type="file"
                                                        accept="image/*"
                                                        multiple
                                                        onChange={(e) => {
                                                            handleItemPhotosUpload(index, e.target.files);
                                                            if (e.currentTarget) e.currentTarget.value = "";
                                                        }}
                                                    />
                                                </Button>
                                            </Grid>

                                            <Grid item xs={12}>
                                                <TextField
                                                    label="Remark (optional)"
                                                    placeholder="Any special instructions for this item…"
                                                    value={item.remark}
                                                    onChange={(e) => handleItemChange(index, "remark", e.target.value)}
                                                    fullWidth
                                                    multiline
                                                    minRows={2}
                                                    sx={{ background: "#fff", borderRadius: 2 }}
                                                />
                                            </Grid>
                                        </Grid>

                                        {item.photos && item.photos.length > 0 && (
                                            <Grid container spacing={1.5} mt={1}>
                                                {item.photos.map((src, pIdx) => (
                                                    <Grid item xs={6} sm={3} md={2} key={pIdx}>
                                                        <Box
                                                            sx={{
                                                                position: "relative",
                                                                borderRadius: 2,
                                                                overflow: "hidden",
                                                                border: "1px solid #e5e7eb",
                                                            }}
                                                        >
                                                            <img
                                                                src={src}
                                                                alt={`item-${index}-photo-${pIdx}`}
                                                                style={{
                                                                    width: "100%",
                                                                    height: 120,
                                                                    objectFit: "cover",
                                                                    display: "block",
                                                                }}
                                                            />
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => removeItemPhoto(index, pIdx)}
                                                                sx={{
                                                                    position: "absolute",
                                                                    top: 6,
                                                                    right: 6,
                                                                    bgcolor: "rgba(0,0,0,0.5)",
                                                                    color: "#fff",
                                                                    "&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
                                                                }}
                                                            >
                                                                <CloseIcon fontSize="small" />
                                                            </IconButton>
                                                        </Box>
                                                    </Grid>
                                                ))}
                                            </Grid>
                                        )}
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    )}

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
                                : {
                                    background: "linear-gradient(135deg,#1d4ed8,#1e40af)",
                                    transform: "translateY(-2px)",
                                    boxShadow: "0 6px 16px rgba(30,58,138,0.4)",
                                },
                        }}
                    >
                        {allItemsAdded ? "All items added" : "+ Add Item"}
                    </Button>

                    <Stack direction="row" justifyContent="flex-end" spacing={2} mt={4}>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<Save />}
                            onClick={handleSubmit}
                            sx={{
                                borderRadius: 3,
                                px: 3,
                                py: 1,
                                textTransform: "none",
                                fontWeight: 600,
                            }}
                            disabled={submitting}
                        >
                            Submit Entry
                        </Button>
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={() =>
                                setOrder({
                                    id: "",
                                    date: new Date().toISOString().split("T")[0],
                                    items: [],
                                })
                            }
                            sx={{
                                borderRadius: 3,
                                px: 3,
                                py: 1,
                                textTransform: "none",
                                fontWeight: 600,
                            }}
                            disabled={submitting}
                        >
                            Reset
                        </Button>
                    </Stack>
                </CardContent>
            </Card>
        </Box>
    );
}

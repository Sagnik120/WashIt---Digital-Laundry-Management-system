"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Box, Typography, Button, Stack } from "@mui/material";
import { UploadFile } from "@mui/icons-material";
import { useRouter } from "next/router";
import usePageLoader from "@/Redux/hooks/usePageLoader";
import useSnackBar from "@/Redux/hooks/useSnackBar";
import { QrScan } from "@/Redux/Actions/AuthUser";
import ErrorHandler from "@/lib/errorHandler";
import { useDispatch } from "react-redux";

const QrReader = dynamic(
    () => import("react-qr-reader").then((mod) => mod.QrReader || mod),
    { ssr: false }
);

export default function StaffScanEntry() {
    const router = useRouter();
    const [scanData, setScanData] = useState<string | null>(null);
    const [imageScanData, setImageScanData] = useState<string | null>(null);
    const setFullPageLoader = usePageLoader();
    const { setSnackBar } = useSnackBar();
    const dispatch = useDispatch();

    const qrScan = async (qrPayload: string | null) => {
        if (!qrPayload) {
            setSnackBar("warning", "Empty QR payload.");
            return false;
        }
        setFullPageLoader(true);

        try {
            const res: any = await dispatch(QrScan({ qrPayload }) as any);

            const ok = ErrorHandler(res, setSnackBar);

            if (ok) {
                setSnackBar("success", (res?.payload?.message ?? res?.message) || "QR processed successfully.");
                router.push("/staff/staffOrder");
                return true;
            } else {
                setSnackBar("error", res?.payload?.data?.message ?? "Network/error while processing QR.");
                return false;
            }
        } catch (err: any) {
            console.error("qrScan dispatch error:", err);
            setSnackBar("error", err?.message ?? "Network/error while processing QR.");
            return false;
        } finally {
            setFullPageLoader(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async () => {
            const img = new Image();
            img.src = reader.result as string;
            img.onload = async () => {
                try {
                    const jsQR = (await import("jsqr")).default;
                    const canvas = document.createElement("canvas");
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext("2d");
                    ctx?.drawImage(img, 0, 0);
                    const imageData = ctx?.getImageData(0, 0, img.width, img.height);
                    const code = imageData && jsQR(imageData.data, img.width, img.height);
                    if (code && code.data) {
                        setImageScanData(code.data);
                        const res: any = await dispatch(QrScan({ "qrPayload": code.data }) as any);
                        const ok = ErrorHandler(res, setSnackBar);
                        if (ok) {
                            setSnackBar("success", (res?.payload?.message ?? res?.message) || "QR processed successfully.");
                            router.push("/staff/staffOrder");
                            return true;
                        } else {
                            console.log(res, 'ah')
                            setSnackBar("error", res ?.payload?.data?.message ?? "Network/error while processing QR.");
                            return false;
                        }
                        router.push("/staff/staffOrder");
                    } else {
                        setImageScanData("No QR code found in image.");
                        setSnackBar("warning", "No QR code found in the uploaded image.");
                    }
                } catch (err) {
                    console.error(err);
                    setImageScanData("Failed to read QR code.");
                    setSnackBar("error", "Failed to read QR code from image.");
                }
            };
        };
        reader.readAsDataURL(file);
    };

    useEffect(() => {
        if(scanData){
            qrScan(scanData || '');
        }
    }, [scanData])

    return (
        <Box
            sx={{
                px: { xs: 2, md: 4 },
                py: 4,
                minHeight: "90vh",
                background: "linear-gradient(135deg, #e0f2fe, #f0fdfa)",
            }}
        >
            <Typography variant="h4" fontWeight="bold" gutterBottom color="primary">
                🧾 QR Scan Entry
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={4}>
                Scan QR codes from user-generated laundry entries using your camera or upload an image.
            </Typography>

            <Stack spacing={6} alignItems="center">

                {/* Camera Scan Card */}
                <Box
                    sx={{
                        width: "100%",
                        maxWidth: 480,
                        p: 3,
                        borderRadius: 3,
                        bgcolor: "#fef3c7",
                        boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
                        textAlign: "center",
                    }}
                >
                    <Typography variant="h6" fontWeight={600} mb={2}>
                        📷 Scan with Camera
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mb={2}>
                        Use your device camera to scan QR codes in real-time.
                    </Typography>

                    <Box sx={{ position: "relative", borderRadius: 2, overflow: "hidden", background: "#000" }}>
                        <QrReader
                            constraints={{ facingMode: "environment" }}
                            onResult={(result, error) => {
                                if (result) {
                                    setScanData(result.getText());
                                };
                                if (error) console.error(error);
                            }}
                        />

                        {/* Overlay scanning frame */}
                        <Box
                            sx={{
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                width: "60%",
                                height: "60%",
                                transform: "translate(-50%, -50%)",
                                border: "3px dashed rgba(255,255,255,0.7)",
                                borderRadius: 2,
                                pointerEvents: "none",
                            }}
                        >
                            <Box
                                sx={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    width: "100%",
                                    height: "3px",
                                    background: "rgba(37,99,235,0.8)",
                                    animation: "scan 2s linear infinite",
                                }}
                            />
                        </Box>
                    </Box>
                    {scanData && <Typography mt={2}>✅ Scanned: {scanData}</Typography>}
                </Box>

                {/* Upload Image Card */}
                <Box
                    sx={{
                        width: "100%",
                        maxWidth: 480,
                        p: 3,
                        borderRadius: 3,
                        bgcolor: "#e0c3fc",
                        boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
                        textAlign: "center",
                    }}
                >
                    <Typography variant="h6" fontWeight={600} mb={2}>
                        🖼 Upload Image
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mb={2}>
                        Upload a QR code image to scan.
                    </Typography>

                    <Button
                        variant="contained"
                        component="label"
                        startIcon={<UploadFile />}
                        sx={{
                            borderRadius: 3,
                            px: 4,
                            py: 1.5,
                            background: "linear-gradient(135deg,#2563eb,#1d4ed8)",
                            color: "#fff",
                            fontWeight: 600,
                            "&:hover": {
                                background: "linear-gradient(135deg,#1e40af,#1e3a8a)",
                            },
                        }}
                    >
                        Upload Image
                        <input type="file" accept="image/*" hidden onChange={handleImageUpload} />
                    </Button>

                    {imageScanData && <Typography mt={2}>✅ Scanned: {imageScanData}</Typography>}
                </Box>
            </Stack>


            {/* Animation keyframes */}
            <style jsx>{`
        @keyframes scan {
          0% {
            top: 0;
          }
          50% {
            top: calc(100% - 3px);
          }
          100% {
            top: 0;
          }
        }
      `}</style>
        </Box>
    );
}

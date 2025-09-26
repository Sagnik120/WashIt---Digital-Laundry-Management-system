"use client";

import { Box } from "@mui/material";
import { useEffect, useRef, useState } from "react";

interface FadeInOnScrollProps {
    children: React.ReactNode;
    delay?: number;
    variant?: "fade-up" | "fade-left" | "fade-right" | "zoom" | "flip";
}

export default function FadeInOnScroll({
    children,
    delay = 0,
    variant = "fade-up",
}: FadeInOnScrollProps) {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible(true);
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.2 }
        );

        if (ref.current) observer.observe(ref.current);

        return () => observer.disconnect();
    }, []);

    const animations: Record<string, any> = {
        "fade-up": {
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(60px)",
        },
        "fade-left": {
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateX(0)" : "translateX(-60px)",
        },
        "fade-right": {
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateX(0)" : "translateX(60px)",
        },
        zoom: {
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "scale(1)" : "scale(0.8)",
        },
        flip: {
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "rotateY(0)" : "rotateY(90deg)",
            transformStyle: "preserve-3d",
        },
    };

    return (
        <Box
            ref={ref}
            sx={{
                transition: `all 1s ease ${delay}s`,
                ...animations[variant],
            }}
        >
            {children}
        </Box>
    );
}

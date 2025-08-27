"use client";
import { Backdrop, Box, keyframes } from "@mui/material";

const FullWidthLoader = ({ open }) => {
  // Animations
  const spin = keyframes`
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  `;

  const floatUp = keyframes`
    0% { transform: translateY(0) scale(0.9); opacity: 0.9; }
    50% { opacity: 1; }
    100% { transform: translateY(-40px) scale(1.1); opacity: 0; }
  `;

  const pulse = keyframes`
    0%, 100% { box-shadow: 0 0 8px rgba(3,169,244,0.3); }
    50% { box-shadow: 0 0 18px rgba(3,169,244,0.6); }
  `;

  const shine = keyframes`
    0% { transform: rotate(0deg) translateX(0); opacity: 0.2; }
    50% { transform: rotate(180deg) translateX(15px); opacity: 0.5; }
    100% { transform: rotate(360deg) translateX(0); opacity: 0.2; }
  `;

  const bubbleColors = [
    "rgba(0, 123, 255, 0.85)",
    "rgba(0, 191, 255, 0.75)",
    "rgba(173, 216, 230, 0.7)",
    "rgba(255, 255, 255, 0.9)",
  ];

  return (
    <Backdrop
      open={open}
      sx={{
        zIndex: (theme) => theme.zIndex.modal + 1,
        background: "linear-gradient(180deg, #E6F4FF, #B3E5FC)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Wrapper (smaller size) */}
      <Box sx={{ position: "relative", width: 140, height: 180 }}>
        {/* Washing Machine */}
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: 100,
            height: 130,
            background: "linear-gradient(180deg, #fdfdfd, #e6e6e6)",
            borderRadius: "12px",
            border: "2px solid #bbb",
            boxShadow: "0 6px 15px rgba(0,0,0,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            p: 1,
          }}
        >
          {/* Top Panel */}
          <Box
            sx={{
              width: "70%",
              height: 16,
              background: "linear-gradient(180deg, #e0e0e0, #cfcfcf)",
              borderRadius: "6px",
              mb: 0.5,
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
              border: "1px solid #aaa",
              boxShadow: "inset 0 1px 2px rgba(0,0,0,0.1)",
            }}
          >
            <Box
              sx={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: "#0288d1",
              }}
            />
            <Box
              sx={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: "#03a9f4",
              }}
            />
            <Box
              sx={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: "#81d4fa",
              }}
            />
          </Box>

          {/* Drum */}
          <Box
            sx={{
              position: "relative",
              width: 60,
              height: 60,
              borderRadius: "50%",
              border: "4px solid #4a90e2",
              background: "radial-gradient(circle, #BBDEFB, #64B5F6)",
              animation: `${spin} 4s linear infinite, ${pulse} 2s ease-in-out infinite`,
              boxShadow: "0 0 12px rgba(0,0,0,0.2) inset",
              overflow: "hidden",
            }}
          >
            {/* Inner Shine */}
            <Box
              sx={{
                position: "absolute",
                top: "25%",
                left: "25%",
                width: 18,
                height: 32,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.5)",
                filter: "blur(4px)",
                animation: `${shine} 3s linear infinite`,
              }}
            />

            {/* Bubbles inside drum */}
            {Array.from({ length: 4 }).map((_, i) => (
              <Box
                key={i}
                sx={{
                  position: "absolute",
                  bottom: 0,
                  left: `${8 * i}px`,
                  width: `${7 + (i % 2) * 3}px`,
                  height: `${7 + (i % 2) * 3}px`,
                  borderRadius: "50%",
                  backgroundColor: bubbleColors[i % bubbleColors.length],
                  opacity: 0.8,
                  animation: `${floatUp} 2s ease-in-out infinite`,
                  animationDelay: `${i * 0.3}s`,
                }}
              />
            ))}
          </Box>
        </Box>

        {/* Floating bubbles ABOVE machine */}
        {Array.from({ length: 4 }).map((_, i) => (
          <Box
            key={`out-${i}`}
            sx={{
              position: "absolute",
              top: `${5 + i * 12}%`,
              left: `${35 + (i % 2) * 20}%`,
              width: 10,
              height: 10,
              borderRadius: "50%",
              backgroundColor: bubbleColors[i % bubbleColors.length],
              opacity: 0.7,
              animation: `${floatUp} 2.5s ease-in-out infinite`,
              animationDelay: `${i * 0.4}s`,
            }}
          />
        ))}
      </Box>
    </Backdrop>
  );
};

export default FullWidthLoader;

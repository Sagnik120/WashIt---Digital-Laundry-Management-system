import { Box, Card, Container } from "@mui/material";

const AuthWrapper = ({ children }) => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('/Assets/images/laundry-hero.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "white",
        p: 2,
      }}
    >
      <Container maxWidth="md">
        <Card
          sx={{
            p: 2,
            borderRadius: "20px",
            boxShadow: "0 8px 30px rgba(0,0,0,0.4)",
            background: "linear-gradient(135deg, #06b6d4, #3b82f6)",
            color: "white",
            textAlign: "center",
          }}
        >
          {children}
        </Card>
      </Container>
    </Box>
  );
};

export default AuthWrapper;

"use client";
import FadeInOnScroll from "@/Components/Common/FadeInOnScroll";
import {
    AppBar,
    Box,
    Button,
    Card,
    CardContent,
    Container,
    Grid,
    Toolbar,
    Typography,
    useTheme,
} from "@mui/material";
import Image from "next/image";
import LocalLaundryServiceIcon from "@mui/icons-material/LocalLaundryService";
import FullWidthLoader from "@/Components/Common/FullWidthLoader";

export default function HomePage() {

    const theme = useTheme();

    return (
        <Box sx={{ bgcolor: theme?.palette?.background?.default, Width: '100%' }}>
            {/* Header */}
            <AppBar
                position="sticky"
                sx={{
                    background: "linear-gradient(to right, #06b6d4, #3b82f6, #9333ea)",
                    boxShadow: 2,
                    overflow: "hidden"
                }}
            >
                <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Image src="/Assets/images/svg/Logo.svg" alt="Logo" width={38} height={38} />
                        <Typography fontSize="22px" sx={{ color: "white", fontWeight: 700, textShadow: "1px 1px 4px rgba(0,0,0,0.3)" }}>
                            WashIt
                        </Typography>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Hero Section */}
            <Box
                sx={{
                    overflow: "hidden",
                    minHeight: "110vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('/Assets/images/laundry-hero.jpg')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    color: "white",
                    textAlign: "center",
                }}
            >
                <Container>
                    <FadeInOnScroll>
                        <Typography variant="h2" fontWeight="800" sx={{ textShadow: "2px 2px 8px rgba(0,0,0,0.5)", mb: 2 }}>
                            College Laundry Made Easy 🧺
                        </Typography>
                    </FadeInOnScroll>

                    <FadeInOnScroll variant="fade-right" delay={0.3}>
                        <Typography variant="h6" sx={{ mb: 4, fontWeight: 400, maxWidth: "600px", mx: "auto", opacity: 0.9 }}>
                            Schedule laundry pickups from your hostel, track your clothes in real-time, and receive fresh, clean laundry delivered directly to your hostel — all effortlessly, without manual entry.
                        </Typography>
                    </FadeInOnScroll>

                    {/* <FadeInOnScroll variant="fade-left" delay={0.6}>
                        <Grid container spacing={4} justifyContent="center" sx={{ mt: 2 }}>
                            <Grid item xs={12}>
                                <Typography variant="subtitle1" sx={{ mb: 2, opacity: 0.9 }}>
                                    Select your role to continue: Are you a student or laundry staff?
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <Card sx={{
                                    px: 4,
                                    py: 1.5,
                                    fontSize: "18px",
                                    fontWeight: 600,
                                    borderRadius: "50px",
                                    background: "linear-gradient(135deg, #06b6d4, #3b82f6)",
                                    color: "white",
                                    cursor: 'pointer',
                                    boxShadow: "0px 4px 15px rgba(0,0,0,0.3)",
                                    transition: "all 0.3s ease",
                                    "&:hover": {
                                        transform: "scale(1.08)",
                                        boxShadow: "0px 6px 20px rgba(0,0,0,0.4)",
                                    },
                                }} onClick={() => console.log("Student selected")}>
                                    <Typography variant="h5">👤 Student</Typography>
                                    <Typography variant="body2" sx={{ mt: 1 }}>Access student dashboard & manage laundry requests</Typography>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <Card sx={{
                                    width: '100%',
                                    px: 4,
                                    py: 1.5,
                                    fontSize: "18px",
                                    fontWeight: 600,
                                    borderRadius: "50px",
                                    background: "linear-gradient(135deg, #9333ea, #ec4899)",
                                    color: "white",
                                    cursor: 'pointer',
                                    boxShadow: "0px 4px 15px rgba(0,0,0,0.3)",
                                    transition: "all 0.3s ease",
                                    "&:hover": {
                                        transform: "scale(1.08)",
                                        boxShadow: "0px 6px 20px rgba(0,0,0,0.4)",
                                    },
                                }} onClick={() => console.log("Laundry Staff selected")}>
                                    <Box sx={{ display: "flex", justifyContent: 'center', alignItems: 'center' }}>
                                        <LocalLaundryServiceIcon sx={{ fontSize: 32 }} />
                                        <Typography variant="h6" >🧑 Laundry Staff</Typography>
                                    </Box>
                                    <Typography variant="body2" sx={{ mt: 1 }}>Access staff dashboard & handle student laundry requests</Typography>
                                </Card>
                            </Grid>
                        </Grid>
                    </FadeInOnScroll> */}

                    <FadeInOnScroll variant="fade-left" delay={0.6}>
                        <Grid container spacing={4} justifyContent="center" sx={{ mt: 2 }}>

                            <Grid item xs={12} md={3}>
                                <Card sx={{
                                    px: 4,
                                    py: 1.5,
                                    fontSize: "18px",
                                    fontWeight: 600,
                                    borderRadius: "50px",
                                    background: "linear-gradient(135deg, #06b6d4, #3b82f6)",
                                    color: "white",
                                    cursor: 'pointer',
                                    boxShadow: "0px 4px 15px rgba(0,0,0,0.3)",
                                    transition: "all 0.3s ease",
                                    "&:hover": {
                                        transform: "scale(1.08)",
                                        boxShadow: "0px 6px 20px rgba(0,0,0,0.4)",
                                    },
                                }} onClick={() => {
                                    // redirect to login page
                                    window.location.href = "/auth/login";
                                }}>
                                    <Typography variant="h5">🔑 Login</Typography>
                                    <Typography variant="body2" sx={{ mt: 1 }}>Access your account as Student or Laundry Staff</Typography>
                                </Card>
                            </Grid>
                            {/* <Grid item xs={12} md={3}> */}
                            {/* <Card
                                sx={{
                                    px: 5,
                                    py: 2,
                                    fontSize: "18px",
                                    fontWeight: 600,
                                    borderRadius: "50px",
                                    background: "linear-gradient(135deg, #06b6d4, #3b82f6)",
                                    color: "white",
                                    cursor: "pointer",
                                    textAlign: "center",
                                    boxShadow: "0px 4px 15px rgba(0,0,0,0.3)",
                                    transition: "all 0.3s ease",
                                    "&:hover": {
                                        transform: "scale(1.08)",
                                        boxShadow: "0px 6px 20px rgba(0,0,0,0.4)",
                                    },
                                }}
                                onClick={() => {
                                    // redirect to login page
                                    window.location.href = "/login";
                                }}
                            >
                                <Typography variant="h5">🔑 Login</Typography>
                                <Typography variant="body2" sx={{ mt: 1 }}>
                                    Access your account as Student or Laundry Staff
                                </Typography>
                            </Card> */}
                            {/* </Grid> */}
                        </Grid>
                    </FadeInOnScroll>
                </Container>
            </Box>

            {/* Features Section */}
            <Box sx={{ py: 10, bgcolor: "#f0f4f8", overflow: "hidden" }}>
                <Container>
                    <Typography variant="h4" align="center" fontWeight={600} gutterBottom>Laundry Tips for Students</Typography>
                    <Grid container spacing={4} sx={{ mt: 3 }}>
                        {[
                            { title: "Sort Clothes Properly", desc: "Separate whites, colors, and delicates before sending them for wash.", img: "/Assets/images/events/Sort_clothes.jpg" },
                            { title: "Avoid Overpacking", desc: "Send laundry in manageable batches for faster processing.", img: "/Assets/images/events/Avoid_Overpacking.jpg" },
                            { title: "Track Laundry Online", desc: "Quickly use the app to track laundry status in real-time progress.", img: "/Assets/images/events/Track_Laundry_Online.png" },
                        ].map((feature, i) => (
                            <Grid item xs={12} md={4} key={i}>
                                <FadeInOnScroll delay={i * 0.2}>
                                    <Card sx={{
                                        width: "100%",
                                        height: "100%",
                                        textAlign: "center",
                                        borderRadius: 4,
                                        boxShadow: 3,
                                        transition: "transform 0.3s",
                                        "&:hover": { transform: "scale(1.05)" },
                                    }}>
                                        <Box sx={{ position: "relative", width: "100%", height: 250 }}>
                                            <Image
                                                src={feature.img}
                                                alt={feature.title}
                                                fill
                                                style={{
                                                    borderTopLeftRadius: 16,
                                                    borderTopRightRadius: 16,
                                                    objectFit: "cover",
                                                }}
                                            />
                                        </Box>
                                        <CardContent>
                                            <Typography variant="h5" fontWeight="600" gutterBottom>{feature.title}</Typography>
                                            <Typography variant="body2">{feature.desc}</Typography>
                                        </CardContent>
                                    </Card>
                                </FadeInOnScroll>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* Testimonials Section */}
            <Box sx={{ py: 10, bgcolor: "#fff", overflow: "hidden" }}>
                <Container>
                    <Typography variant="h4" align="center" fontWeight={600} gutterBottom>What Students Say</Typography>
                    <Grid container spacing={4} sx={{ mt: 3 }}>
                        {[
                            { name: "Rohit S.", text: "Super convenient! I never have to worry about laundry during exams.", img: "/Assets/images/Rohit.png" },
                            { name: "Ananya P.", text: "Quick and reliable service for all hostel students.", img: "/Assets/images/Ananya.jpg" },
                            { name: "Karan M.", text: "Eco-friendly, Paperless and Sustainable System.", img: "/Assets/images/Karan.png" },
                        ].map((testimonial, i) => (
                            <Grid item xs={12} md={4} key={i}>
                                <FadeInOnScroll delay={i * 0.3}>
                                    <Card sx={{ height: "100%", p: 3, borderRadius: 4, boxShadow: 2, textAlign: "center" }}>
                                        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                                            <Image
                                                src={testimonial?.img}
                                                alt={testimonial?.text}
                                                width={150}
                                                height={150}
                                                style={{ borderRadius: '50%', objectFit: "cover" }}
                                            />
                                        </Box>
                                        <Typography variant="body1" sx={{ mb: 2 }}>“{testimonial?.text}”</Typography>
                                        <Typography variant="subtitle2" fontWeight="bold">- {testimonial?.name}</Typography>
                                    </Card>
                                </FadeInOnScroll>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* Achievement Section */}
            <Box sx={{ py: 10, bgcolor: "#f0f4f8", overflow: "hidden" }}>
                <Container>
                    <Typography variant="h4" align="center" fontWeight={600} gutterBottom>
                        Why Students Love WashIt
                    </Typography>
                    <Grid container spacing={4} sx={{ mt: 3, textAlign: "center" }}>
                        {[
                            { stat: "500+", desc: "Students Served", img: "/Assets/images/events/Students_Served.png" },
                            { stat: "Easy", desc: "Easy Tracking of Clothes", img: "/Assets/images/events/Easy_Tracking.png" },
                            { stat: "Eco-Friendly", desc: "Paperless and Sustainable System", img: "/Assets/images/events/Eco-Friendly.png" },
                            { stat: "5-Star", desc: "Rated by Students", img: "/Assets/images/events/5-Star.jpg" },
                        ].map((item, i) => (
                            <Grid item xs={12} md={3} key={i}>
                                <FadeInOnScroll delay={i * 0.2}>
                                    <Card sx={{ p: 3, borderRadius: 4, boxShadow: 3, bgcolor: "#06b6d4", color: "white", "&:hover": { transform: "scale(1.05)" }, transition: "transform 0.3s" }}>
                                        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                                            <Image
                                                src={item?.img}
                                                alt={item?.desc}
                                                width={250}
                                                height={150}
                                                style={{ borderRadius: '5px', objectFit: "cover" }}
                                            />
                                        </Box>
                                        <Typography variant="h5" fontWeight="700" sx={{ mt: 2, textShadow: "1px 1px 4px rgba(0,0,0,0.3)" }}>
                                            {item?.stat}
                                        </Typography>
                                        <Typography variant="body2" sx={{ textShadow: "1px 1px 4px rgba(0,0,0,0.3)" }}>
                                            {item?.desc}
                                        </Typography>
                                    </Card>
                                </FadeInOnScroll>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* About / Highlights Section */}
            <Box sx={{ py: 12, bgcolor: "linear-gradient(135deg, #f9fafb, #eef2ff)", overflow: "hidden" }}>
                <Container>
                    <FadeInOnScroll>
                        <Typography
                            variant="h4"
                            align="center"
                            fontWeight={700}
                            gutterBottom
                            sx={{
                                mb: 6,
                                textShadow: "1px 1px 6px rgba(0,0,0,0.1)",
                                color: "#1e293b",
                            }}
                        >
                            How <span style={{ color: "#3b82f6" }}>WashIt</span> Makes Life Easier
                        </Typography>
                    </FadeInOnScroll>

                    <Grid container spacing={8} alignItems="center">
                        {/* Left Section */}
                        <Grid item xs={12} md={6}>
                            <FadeInOnScroll variant="fade-right">
                                <Box
                                    sx={{
                                        position: "relative",
                                        width: "100%",
                                        height: { xs: 250, md: 350 },
                                        borderRadius: "20px",
                                        overflow: "hidden",
                                        boxShadow: "0px 6px 20px rgba(0,0,0,0.15)",
                                        mb: 3,
                                        bgcolor: "white",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <Image
                                        src="/Assets/images/events/laundry-service-online.jpg"
                                        alt="Laundry Pickup"
                                        fill
                                        style={{
                                            objectFit: "contain",
                                            padding: "10px",
                                        }}
                                    />
                                </Box>
                                <Typography
                                    variant="h5"
                                    fontWeight={700}
                                    sx={{ mb: 1, color: "#0f172a" }}
                                >
                                    🚚 Hassle-Free Pickup & Delivery
                                </Typography>
                                <Typography
                                    variant="body1"
                                    sx={{ lineHeight: 1.7, opacity: 0.85, maxWidth: "90%" }}
                                >
                                    Schedule laundry pickups <b>directly from your hostel</b> and receive
                                    fresh, clean clothes delivered back to your hostel. No waiting in line,
                                    no confusion — <i>just convenience at your fingertips</i>.
                                </Typography>
                            </FadeInOnScroll>
                        </Grid>

                        {/* Right Section */}
                        <Grid item xs={12} md={6}>
                            <FadeInOnScroll variant="fade-left" delay={0.3}>
                                <Box
                                    sx={{
                                        position: "relative",
                                        width: "100%",
                                        height: { xs: 250, md: 350 },
                                        borderRadius: "20px",
                                        overflow: "hidden",
                                        boxShadow: "0px 6px 20px rgba(0,0,0,0.15)",
                                        mb: 3,
                                        bgcolor: "white",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <Image
                                        src="/Assets/images/events/laundry-services-set.jpg"
                                        alt="Laundry Pickup"
                                        fill
                                        style={{
                                            objectFit: "contain",
                                            padding: "10px",
                                        }}
                                    />
                                </Box>
                                <Typography
                                    variant="h5"
                                    fontWeight={700}
                                    sx={{ mb: 1, color: "#0f172a" }}
                                >
                                    📱 Real-Time Tracking on App
                                </Typography>
                                <Typography
                                    variant="body1"
                                    sx={{ lineHeight: 1.7, opacity: 0.85, maxWidth: "90%" }}
                                >
                                    Stay updated on your laundry journey with{" "}
                                    <b>live tracking, status updates, and notifications</b>. From pickup
                                    to delivery, the <span style={{ color: "#3b82f6", fontWeight: 600 }}>
                                        WashIt
                                    </span>{" "}
                                    keeps you informed.
                                </Typography>
                            </FadeInOnScroll>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* <FullWidthLoader open={true} /> */}

            {/* Footer */}
            <Box sx={{ bgcolor: "#1E293B", color: "white", py: 6, overflow: "hidden" }}>
                <Container maxWidth="lg">
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={4}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Image src="/Assets/images/svg/Logo.svg" alt="Logo" width={38} height={38} />
                                <Typography fontSize="22px" sx={{ color: "white", fontWeight: 700, textShadow: "1px 1px 4px rgba(0,0,0,0.3)" }}>
                                    WashIt
                                </Typography>
                            </Box>
                            <Typography variant="body2" sx={{ mt: 1 }}>Laundry management made easy for college students.</Typography>
                        </Grid>
                        <Grid item xs={0} md={4}>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Typography variant="h6" gutterBottom>Contact</Typography>
                            <Typography variant="body2">Email: support@washit.com</Typography>
                            <Typography variant="body2">Phone: +91 1234567890</Typography>
                        </Grid>
                    </Grid>
                    <Box sx={{ textAlign: "center", mt: 4 }}>
                        <Typography variant="body2">© 2025 WashIt. All rights reserved.</Typography>
                    </Box>
                </Container>
            </Box>

        </Box>
    );
}

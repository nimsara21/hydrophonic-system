import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Grid, CircularProgress, Card, CardContent, Typography, Box, Snackbar, Alert, Paper } from "@mui/material";  // <-- Add Paper here
import { fetchSensorData } from "../redux/hydroponicSlice";
import SensorChart from "./SensorChart";
import ControlPanel from "./ControlPanel";
import { Opacity, LightMode, Science, ElectricBolt, EvStation, WaterDrop } from "@mui/icons-material";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { sensorData, status } = useSelector((state) => state.hydroponic);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    dispatch(fetchSensorData());
    const interval = setInterval(() => {
      dispatch(fetchSensorData());
    }, 5000);
    return () => clearInterval(interval);
  }, [dispatch]);

  useEffect(() => {
    if (status === "succeeded") {
      setOpenSnackbar(true);
    }
  }, [status]);

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const sensorReadings = [
    { label: "pH Level", value: `${sensorData[0]?.pH}`, icon: <Science fontSize="large" />, color: "#4CAF50" },
    { label: "Water Level", value: `${sensorData[0]?.waterLevel} %`, icon: <Opacity fontSize="large" />, color: "#1E88E5" },
    { label: "Humidity", value: `${sensorData[0]?.humidity} %`, icon: <WaterDrop fontSize="large" />, color: "#0288D1" },
    { label: "Temperature", value: `${sensorData[0]?.temperature}°C`, icon: <LightMode fontSize="large" />, color: "#FFB300" },
    { label: "Water Temp", value: `${sensorData[0]?.waterTemp}°C`, icon: <EvStation fontSize="large" />, color: "#F4511E" },
    { label: "Grow Light Cycle", value: `${sensorData[0]?.growLightCycle} Hrs`, icon: <ElectricBolt fontSize="large" />, color: "#FF4081" },
  ];

  return (
    <Box sx={{ padding: 3, backgroundColor: "#f4f6f8" }}>
      {/* Snackbar for Success Notification */}
      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success">
          Sensor data updated successfully!
        </Alert>
      </Snackbar>

      <Grid container spacing={3}>
        {/* Sensor Data Cards */}
        {sensorReadings.map((reading, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              sx={{
                backgroundColor: reading.color,
                borderRadius: 2,
                boxShadow: "0px 4px 12px rgba(0,0,0,0.2)",
                textAlign: "center",
                color: "white",
                transition: "transform 0.3s ease-in-out",
                "&:hover": { transform: "scale(1.05)" },
              }}
            >
              <CardContent>
                {reading.icon}
                <Typography variant="h6" sx={{ marginTop: 1 }}>
                  {reading.label}
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                  {reading.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}

        {/* Sensor Chart - Full Width on Top */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h6" align="center" gutterBottom>
              Sensor Readings Over Time
            </Typography>
            <SensorChart />
          </Paper>
        </Grid>

        {/* Control Panel */}
        <Grid item xs={12}>
          <ControlPanel />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;

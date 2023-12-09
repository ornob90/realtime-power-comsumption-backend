// const express = require("express");
// const TuyAPI = require("tuyapi");

// const app = express();

// const config = {
//   host: "https://openapi.tuyaeu.com",
//   accessKey: "7d39ekut88cauphe5dde", // Your access key
//   secretKey: "5622a79b972e49659beba721473e0ba7", // Your secret key
//   deviceId: "bf6a9e0ea126658d72szmq", // Your device ID
//   localkey: "){Gzv4/}cs2;XE)G",
// };

// const device = new TuyAPI({ id: config.deviceId, key: config.localkey });

// // Function to calculate daily energy usage from device data
// function calculateDailyUsage(deviceData) {
//   const dailyUsage = {};
//   return { dailyUsage };
// }

// // Function to calculate energy usage trend from device data
// function calculateEnergyTrend(deviceData) {
//   // Implement logic to calculate energy usage trend from device data
//   const energyTrend = {};
//   return energyTrend;
// }

// // Function to calculate IT load vs. non-IT loads from device data
// function calculateITLoad(deviceData) {
//   // Implement logic to calculate IT load vs. non-IT loads from device data
//   const itLoad = {};
//   return itLoad;
// }

// // Endpoint to get device status
// app.get("/status", async (req, res) => {
//   const status = await device.get();
//   res.json({ status });
// });

// // Endpoint to get daily energy usage
// app.get("/daily-usage", async (req, res) => {
//   const deviceData = await device.get();
//   const dailyUsage = calculateDailyUsage(deviceData);
//   res.json({ dailyUsage });
// });

// // Endpoint to get energy usage trend
// app.get("/energy-trend", async (req, res) => {
//   const deviceData = await device.get();
//   const energyTrend = calculateEnergyTrend(deviceData);
//   res.json({ energyTrend });
// });

// // Endpoint to get IT load vs. non-IT loads
// app.get("/it-load", async (req, res) => {
//   const deviceData = await device.get();
//   const itLoad = calculateITLoad(deviceData);
//   res.json({ itLoad });
// });

// // Start the Express app
// const port = 3000;
// app.listen(port, () => {
//   console.log(`Server started on port ${port}`);
// });

const express = require("express");
const app = express();
app.use(express.json());

const axios = require("axios");
const crypto = require("crypto");
const qs = require("qs");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");

app.use(
  cors({
    origin: ["http://localhost:5173", "https://smartplug-powerconsumption-trend.vercel.app"], // Replace with your frontend origin
    credentials: true,
  })
);

const port = 3000;

let token = "";
let timestamp = "";

const config = {
  host: "https://openapi.tuyaeu.com",
  accessKey: "7d39ekut88cauphe5dde", // Your access key
  secretKey: "5622a79b972e49659beba721473e0ba7", // Your secret key
  deviceId: "bf6a9e0ea126658d72szmq", // Your device ID
};

const httpClient = axios.create({
  baseURL: config.host,
  timeout: 5 * 1e3,
});

const uri =
  "mongodb+srv://ornonornob:Pk72U0DvKZii3Iln@cluster0.67rsiuv.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const powerDataCollection = client.db("smartURI").collection("powerData");

    app.get("/device-data", async (req, res) => {
      try {
        const data = await powerDataCollection.find().toArray();
        res.send(data);
      } catch (error) {
        console.error(error);
      }
    });

    app.get("/fetch-data", async (req, res) => {
      try {
        await getToken();
        const data = await getDeviceInfo(config.deviceId);
        res.json({ success: true, token, data });
      } catch (error) {
        console.error("Error fetching data:", error.message);
        res.status(500).json({ success: false, error: error.message });
      }
    });

    async function getToken() {
      const method = "GET";
      timestamp = Date.now().toString();
      //   console.log("timestamp: ", timestamp);
      const signUrl = "/v1.0/token?grant_type=1";
      const contentHash = crypto.createHash("sha256").update("").digest("hex");
      const stringToSign = [method, contentHash, "", signUrl].join("\n");
      const signStr = config.accessKey + timestamp + stringToSign;

      const headers = {
        t: timestamp,
        sign_method: "HMAC-SHA256",
        client_id: config.accessKey,
        sign: await encryptStr(signStr, config.secretKey),
      };
      const { data: login } = await httpClient.get("/v1.0/token?grant_type=1", {
        headers,
      });
      if (!login || !login.success) {
        throw Error(`Fetch failed: ${login.msg}`);
      }
      token = login.result.access_token;
    }

    const getDateStringDaysAgo = (daysAgo) => {
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);

      return date.toISOString().slice(0, 10).replace(/-/g, "");
    };

    // // Add this route to your existing Express.js application
    // app.get("/query-energy-trend", async (req, res, next) => {
    //   try {
    //     // Ensure the token is up-to-date
    //     // await getToken();

    //     // Get the current timestamp
    //     // const timestamp = Date.now().toString();

    //     const start_time = getDateStringDaysAgo(30);
    //     const end_time = new Date()
    //       .toISOString()
    //       .slice(0, 10)
    //       .replace(/-/g, "");

    //     // Set parameters for the request
    //     const params = {
    //       energy_type: "electricity",
    //       energy_action: "consume",
    //       statistics_type: "day", // Change "statistics_type" to "statisticsType"
    //       start_time,
    //       end_time,
    //       contain_childs: true,
    //       device_id: config.deviceId, // Add the device_ids parameter
    //     };

    //     // Call getRequestSign to get the headers
    //     const reqHeaders = await getRequestSign(
    //       `/v1.0/iot-03/energy/${params.energy_type}/devices/statistics-trend`,
    //       "GET",
    //       {},
    //       params
    //     );
    //     console.log("trend: ", reqHeaders);

    //     // Make the request to Tuya API
    //     const { data } = await httpClient.get(
    //       `/v1.0/iot-03/energy/${params.energy_type}/devices/statistics-trend`,
    //       {
    //         headers: reqHeaders,
    //         params,
    //       }
    //     );

    //     // Respond with the data
    //     res.json(data);
    //   } catch (err) {
    //     console.log(err);
    //     // Pass the error to the error-handling middleware
    //     next(err);
    //   }
    // });

    async function getDeviceInfo(deviceId) {
      const query = {};
      const method = "GET";
      const url = `/v1.0/iot-03/devices/${deviceId}/status`;
      const reqHeaders = await getRequestSign(url, method, {}, query);
      console.log("fetch-data: ", reqHeaders);

      const { data } = await httpClient.request({
        method,
        data: {},
        params: {},
        headers: reqHeaders,
        url: reqHeaders.path,
      });
      if (!data || !data.success) {
        throw Error(`Request API failed: ${data.msg}`);
      }

      return data.result;
    }

    async function encryptStr(str, secret) {
      return crypto
        .createHmac("sha256", secret)
        .update(str, "utf8")
        .digest("hex")
        .toUpperCase();
    }

    async function getRequestSign(
      path,
      method,
      headers = {},
      query = {},
      body = {}
    ) {
      //   console.log({ path, method, headers, query, body });
      //   const t = Date.now().toString();
      const t = timestamp;
      //   console.log("t: ", timestamp);
      const [uri, pathQuery] = path.split("?");
      const queryMerged = Object.assign(query, qs.parse(pathQuery));
      const sortedQuery = {};
      Object.keys(queryMerged)
        .sort()
        .forEach((i) => (sortedQuery[i] = query[i]));

      const querystring = decodeURIComponent(qs.stringify(sortedQuery));
      // console.log(querystring);
      const url = querystring ? `${uri}?${querystring}` : uri;
      const contentHash = crypto
        .createHash("sha256")
        .update(JSON.stringify(body))
        .digest("hex");
      console.log(url);
      const stringToSign = [method, contentHash, "", url].join("\n");
      const signStr = config.accessKey + token + t + stringToSign;
      return {
        t,
        path: url,
        client_id: config.accessKey,
        sign: await encryptStr(signStr, config.secretKey),
        sign_method: "HMAC-SHA256",
        access_token: token,
      };
    }

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log(
    //   "Pinged your deployment. You successfully connected to MongoDB!"
    // );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Server Running...");
});

app.listen(port, () => {
  console.log("Server Running");
});

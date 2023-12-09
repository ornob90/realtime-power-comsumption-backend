// const express = require("express");
// const axios = require("axios");
// const crypto = require("crypto");
// const qs = require("qs");

// const app = express();
// const port = 3000;

// let token = "";

// const config = {
//   host: "https://openapi.tuyaeu.com",
//   accessKey: "7d39ekut88cauphe5dde", // Your access key
//   secretKey: "5622a79b972e49659beba721473e0ba7", // Your secret key
//   deviceId: "bf6a9e0ea126658d72szmq", // Your device ID
// };

// const httpClient = axios.create({
//   baseURL: config.host,
//   timeout: 5 * 1e3,
// });

// app.get("/fetch-data", async (req, res) => {
//   try {
//     await getToken();
//     const data = await getDeviceInfo(config.deviceId);
//     res.json({ success: true, data });
//   } catch (error) {
//     console.error("Error fetching data:", error.message);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// async function getToken() {
//   const method = "GET";
//   const timestamp = Date.now().toString();
//   const signUrl = "/v1.0/token?grant_type=1";
//   const contentHash = crypto.createHash("sha256").update("").digest("hex");
//   const stringToSign = [method, contentHash, "", signUrl].join("\n");
//   const signStr = config.accessKey + timestamp + stringToSign;

//   const headers = {
//     t: timestamp,
//     sign_method: "HMAC-SHA256",
//     client_id: config.accessKey,
//     sign: await encryptStr(signStr, config.secretKey),
//   };
//   const { data: login } = await httpClient.get("/v1.0/token?grant_type=1", {
//     headers,
//   });
//   if (!login || !login.success) {
//     throw Error(`Fetch failed: ${login.msg}`);
//   }
//   token = login.result.access_token;
// }

// async function getDeviceInfo(deviceId) {
//   const query = {};
//   const method = "POST";
//   const url = `/v1.0/devices/${deviceId}/commands`;
//   const reqHeaders = await getRequestSign(url, method, {}, query);

//   console.log("fetch-data: ", reqHeaders);

//   const { data } = await httpClient.request({
//     method,
//     data: {},
//     params: {},
//     headers: reqHeaders,
//     url: reqHeaders.path,
//   });
//   if (!data || !data.success) {
//     throw Error(`Request API failed: ${data.msg}`);
//   }

//   return data.result;
// }

// async function encryptStr(str, secret) {
//   return crypto
//     .createHmac("sha256", secret)
//     .update(str, "utf8")
//     .digest("hex")
//     .toUpperCase();
// }

// async function getRequestSign(
//   path,
//   method,
//   headers = {},
//   query = {},
//   body = {}
// ) {
//   const t = Date.now().toString();
//   const [uri, pathQuery] = path.split("?");
//   const queryMerged = Object.assign(query, qs.parse(pathQuery));
//   const sortedQuery = {};
//   Object.keys(queryMerged)
//     .sort()
//     .forEach((i) => (sortedQuery[i] = query[i]));

//   const querystring = decodeURIComponent(qs.stringify(sortedQuery));
//   const url = querystring ? `${uri}?${querystring}` : uri;
//   const contentHash = crypto
//     .createHash("sha256")
//     .update(JSON.stringify(body))
//     .digest("hex");
//   const stringToSign = [method, contentHash, "", url].join("\n");
//   const signStr = config.accessKey + token + t + stringToSign;
//   return {
//     t,
//     path: url,
//     client_id: config.accessKey,
//     sign: await encryptStr(signStr, config.secretKey),
//     sign_method: "HMAC-SHA256",
//     access_token: token,
//   };
// }

// app.listen(port, () => {
//   console.log(`Server is running at http://localhost:${port}`);
// });

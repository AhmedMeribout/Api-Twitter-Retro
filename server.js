import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { createBrotliCompress } from "zlib";
import authRoutes from "./routes/auth.js";
import { register } from "./controllers/auth.js";
import YAML from "yamljs";
import { serve, setup } from "swagger-ui-express";

/* CONFIGURATION */
const swaggerDocument = YAML.load("./swagger.yaml");
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

/* FILE STORAGE */

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer(storage);

/* ROUTES WITH FILES */
app.post("/auth/register", upload.single("pictures"), register);

/** ROUTES */
app.use("/api-docs", serve, setup(swaggerDocument));
app.use("/auth", authRoutes);

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 6001;
mongoose
  .connect(process.env.MONGO_URL, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log("server port: " + PORT));
  })
  .catch((error) => console.log("${error} did not connect "));

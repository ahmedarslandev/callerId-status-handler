import { Router } from "express";
import { processCallerIds } from "../controllers/routes.js";

const app = Router();

app.post("/api/process-callerids", async (req, res) => {
  processCallerIds(req, res);
});

export default app;

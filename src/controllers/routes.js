import axios from "axios";
import { handleDidsRes } from "../utils/handelCheckingIds.js";
import { config } from "dotenv";

config()

const SEND_URL = process.env.SEND_URL;

class Routes {
  processCallerIds = async (request, response) => {
    try {
      const data = await request.body;

      if (!data.callerIds || !data.fileInfo) {
        return;
      }

      const didRes = await handleDidsRes(data.callerIds);

      axios.post(SEND_URL, {
        callerIds: didRes,
        totalCallerIds: data.callerIds.length,
        timestamp: new Date().toISOString(),
        fileInfo: data.fileInfo,
      });
    } catch (error) {
      return;
    }
  };
}

const { processCallerIds } = new Routes();

export { processCallerIds };

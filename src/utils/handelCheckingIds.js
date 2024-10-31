import pLimit from "p-limit";
import { getTitle } from "./checkStatus.js";
import { config } from "dotenv";

config({path:"../../.env"})

const limit = pLimit(5); // Limit to 5 concurrent requests
const MAX_RETRIES = 3; // Maximum number of retries for rate limiting
const URL = process.env.CHECK_STATUS_CALLERID_URL

async function fetchWithRetry(
  url,
  retries = MAX_RETRIES
){
  try {
    return await getTitle(url);
  } catch (error) {
    if (
      retries > 0 &&
      (error.response?.status === 429 ||
        error.response?.status === 404 ||
        error.response?.status < 400)
    ) {
      // If rate limited, wait and retry
      console.log(`Rate limited. Retrying... ${retries} attempts left`);
      return fetchWithRetry(url, retries - 1);
    } else {
      throw error; // Rethrow if not rate limited or retries exhausted
    }
  }
}

export async function handleDidsRes(
  callerIds
){
  const titlePromises = callerIds.map((callerId) =>
    limit(async () => {
      const url = `${URL}/${callerId}`;
      try {
        const { callerId: extractedId, status } = await fetchWithRetry(url);
        return { callerId, status: status || "Unknown" }; // Ensure status is always defined
      } catch (error) {
        console.error(`Error fetching title for callerId ${callerId}:`, error);
        return { callerId, status: "Error" };
      }
    })
  );

  return Promise.all(titlePromises);
}

import axios from "axios";

/**
 * Performs an HTTP request using axios.
 * @param {Object} config - Configuration object with url, method, headers, body, apiKey.
 * @returns {Promise<Object>} - Resolves with the Axios response.
 */
const fetchRequestData = async (config) => {
  if (!config?.url) {
    throw new Error("Missing URL in request config");
  }

  const urlObj = new URL(config.url, window.location.origin);
  if (config.apiKey) {
    urlObj.searchParams.set("key", config.apiKey);
  }

  // Use headers as-is, assuming it's a plain object
  const headers =
    typeof config.headers === "object" && config.headers !== null
      ? config.headers
      : {};

  const method = (config.method || "GET").toUpperCase();

  const axiosOptions = {
    method,
    url: urlObj.toString(),
    headers
  };

  if (method !== "GET" && config.body) {
    axiosOptions.data = config.body;
  }

  const response = await axios(axiosOptions);
  return response;
};

export default fetchRequestData;

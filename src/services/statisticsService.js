import axios from "../utils/axiosCustomize";

const getPlatformDashboardStatistics = () => {
  return axios.get("api/Statistics/GetPlatformDashboardStatistics");
};

export { getPlatformDashboardStatistics };

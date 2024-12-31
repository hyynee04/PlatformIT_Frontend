import axios from "../utils/axiosCustomize";

const getPlatformDashboardStatistics = () => {
  return axios.get("api/Statistics/GetPlatformDashboardStatistics");
};

const getCenterDashboardStatistics = (idCenter) => {
  return axios.get("api/Statistics/GetCenterDashboardStatistics", {
    params: {
      idCenter: idCenter,
    },
  });
};

export { getPlatformDashboardStatistics, getCenterDashboardStatistics };

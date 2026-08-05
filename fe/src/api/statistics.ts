import client from "./client";
import { ApiResponse } from "./auth";

export const statisticsApi = {
  getMonthlyCarbonIndex: async (dateStr: string) => {
    // dateStr format: YYYY-MM-DD
    const res = await client.get<ApiResponse<{ total: number }>>(`/v1/statistics/carbon-index?periodType=MONTHLY&date=${dateStr}`);
    return res.data.data.total || 0;
  }
};

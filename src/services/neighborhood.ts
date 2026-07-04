import { api } from "./api";
import type { NeighborhoodDropdownResponse } from "../types/neighborhood";

export const searchNeighborhoods = async (
  title: string
): Promise<NeighborhoodDropdownResponse> => {
  const res = await api.get("/Neighborhoods/Dropdown", {
    params: {
      Title: title,
    },
  });

  return res.data;
};
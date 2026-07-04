export interface Neighborhood {
  id: number;
  title: string;
}

export interface NeighborhoodDropdownResponse {
  value: Neighborhood[];
  isSuccess: boolean;
  isFailure: boolean;
  message: string | null;
  error: {
    code: string;
    message: string;
  };
}
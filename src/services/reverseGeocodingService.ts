const API_KEY = import.meta.env.VITE_NESHAN_SERVICE_API_KEY;

export interface ReverseGeocodeResponse {
  status: string;
  formatted_address: string;
  route_name: string;
  neighbourhood: string;
  city: string;
  state: string;
  municipality_zone: string;
  county: string;
  district: string;
}

export async function ReverseGeocode(
  lat: number,
  lng: number
): Promise<ReverseGeocodeResponse> {
  const response = await fetch(
    `https://api.neshan.org/v5/reverse?lat=${lat}&lng=${lng}`,
    {
      method: "GET",
      headers: {
        "Api-Key": API_KEY,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Reverse geocoding failed");
  }

  return response.json();
}
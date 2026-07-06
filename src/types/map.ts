export interface MapLocation {
  lat: number;
  lng: number;
}

export interface NeshanMapProps {
  value: MapLocation | null;
  onChange: (location: MapLocation) => void;
  editable?: boolean;
  zoom?: number;
}
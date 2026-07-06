export interface MapLocation {
  lat: number;
  lng: number;
}

export interface NeshanMapProps {
  value?: MapLocation;
  onChange?: (location: MapLocation) => void;
  editable?: boolean;
  zoom?: number;
}
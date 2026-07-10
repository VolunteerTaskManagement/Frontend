import { useEffect, useRef } from "react";
import { MapComponent, MapTypes } from "@neshan-maps-platform/mapbox-gl-react";
import "@neshan-maps-platform/mapbox-gl/dist/NeshanMapboxGl.css";
import nmp_mapboxgl from "@neshan-maps-platform/mapbox-gl";
import type {NeshanMapProps} from "../../types/map";

const API_KEY = import.meta.env.VITE_NESHAN_MAP_API_KEY;

export default function NeshanMap({value, onChange, zoom=10, editable=false}: NeshanMapProps)
{
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  // Everytime value has changed from parent:
  useEffect(() => {
    if (!mapRef.current || !value) return;

    if (!markerRef.current) {
      markerRef.current = new nmp_mapboxgl.Marker()
      	.setLngLat([value.lng, value.lat])
        .addTo(mapRef.current);
    }
		else {
      markerRef.current.setLngLat([value.lng, value.lat]);
    }

    mapRef.current.flyTo({
      center: [value.lng, value.lat],
      zoom: zoom,
    });
  }, [value, zoom]);

  return (
    <MapComponent
      style={{
        width: "100%",
        height: "250px",
        borderRadius: "12px",
      }}
      options={{
        mapKey: API_KEY,
        mapType: MapTypes.neshanVector,
        center: value ? [value.lng, value.lat] : [51.3825, 35.7125],
        zoom,
        minZoom: 8,
        maxZoom: 16,
        poi: true,
        mapTypeControllerOptions: {show: false},
      } as any}
      mapSetter={(map: any) => {
        mapRef.current = map;
        map.addControl(
          new nmp_mapboxgl.NavigationControl({showCompass: false}),
          "top-right"
        );

        // If initial location exists
        if (value && !markerRef.current) {
          markerRef.current = new nmp_mapboxgl.Marker()
            .setLngLat([value.lng, value.lat])
            .addTo(map);
        }

				// If the Marker is not editable
        if (!editable) return;

        map.on("click", (e: any) => {
          const location = {
            lat: e.lngLat.lat,
            lng: e.lngLat.lng,
          };

          if (!markerRef.current) {
            markerRef.current = new nmp_mapboxgl.Marker()
              .setLngLat([location.lng, location.lat])
              .addTo(map);
          }
					else {
            markerRef.current.setLngLat([location.lng, location.lat]);
          }

          onChange?.(location);
        });
      }}
    />
  );
}
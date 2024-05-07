import { useState, useRef, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  useMap,
  MapContainerProps,
  Marker,
} from "react-leaflet";
import L, { LatLng, Map as LeafletMap } from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";
import { supabase } from "../supabaseClient";

// Fix Leaflet's default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface MapProps extends MapContainerProps {
  checkpoints: [number, number][];
  mapRef: React.RefObject<LeafletMap>;
}

const CustomMap: React.FC<MapProps> = ({ checkpoints, mapRef }) => {
    const map = useMap();
  
    useEffect(() => {
      mapRef.current = map;
  
      // Remove existing markers and routing controls
      map.eachLayer((layer) => {
        if (layer.options && layer.options.purpose === 'checkpoint') {
          // Check for custom property to identify our layers
          map.removeLayer(layer);
        }
      });
  
      // Add markers for each checkpoint
      checkpoints.forEach((checkpoint) => {
        new L.Marker(new L.LatLng(checkpoint[0], checkpoint[1]), {
          icon: new L.Icon.Default(),
          purpose: 'checkpoint'  // Custom property to identify this layer as our marker
        }).addTo(map);
      });
  
    }, [checkpoints, map, mapRef]);
  
    return null;  // No JSX needed as this component manages layers directly on the map
  };
  

const MapPage: React.FC<any> = ({ points }) => {
  const [checkpoints, setCheckpoints] = useState<[number, number][]>([]);
  const mapRef = useRef<LeafletMap | null>(null);

  useEffect(() => {
    if (points) {
      // Flatten the array of routes to a single array of checkpoints
      const allCheckpoints = points.flat();
      setCheckpoints(allCheckpoints);

      if (allCheckpoints.length > 0 && mapRef.current) {
        mapRef.current.setView(new L.LatLng(allCheckpoints[0][0], allCheckpoints[0][1]), 13);
      }
    }
  }, [points]);

  return (
    <div>
      <MapContainer
        center={checkpoints.length > 0 ? [checkpoints[0][0], checkpoints[0][1]] : [24.6877, 46.7219]}
        zoom={13}
        style={{ height: "400px", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <CustomMap checkpoints={checkpoints} mapRef={mapRef} />
      </MapContainer>
    </div>
  );
};

export default MapPage;
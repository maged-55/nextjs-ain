import { useState, useRef, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  useMap,
  MapContainerProps,
} from "react-leaflet";
import L, { LatLng, Map as LeafletMap } from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";
import { supabase } from "../supabaseClient";

// Fix Leaflet's default icon issue
delete L.Icon.Default.prototype._getIconUrl;
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

const CustomMap: React.FC<MapProps> = ({ checkpoints, mapRef, ...props }) => {
  const map = useMap();

  useEffect(() => {
    mapRef.current = map;

    const markers = checkpoints?.map((checkpoint) => {
      const point = new LatLng(checkpoint[0], checkpoint[1]);
      return L.marker(point).addTo(map);
    });

    let routingControl: L.Routing.Control | null = null;

    if (checkpoints.length >= 2) {
      routingControl = L.Routing.control({
        waypoints: checkpoints.map(
          (checkpoint) => new LatLng(checkpoint[0], checkpoint[1])
        ),
        routeWhileDragging: true,
        show: true,
      }).addTo(map);
    }

    return () => {
      markers.forEach((marker) => marker.remove());
      if (routingControl) {
        map.removeControl(routingControl);
      }
    };
  }, [checkpoints, map, mapRef]);

  return null;
};

const MapPage = (props: any) => {
  const [checkpoints, setCheckpoints] = useState<[number, number][]>(props.points || []);
  const mapRef = useRef<LeafletMap | null>(null);

  useEffect(() => {
    if (props.points && props.points.length > 0) {
      const initialPoint = props.points[0];
      mapRef.current?.setView(new LatLng(initialPoint[0], initialPoint[1]), 13);
    }
  }, [props.points]);

  return (
    <div>
      <MapContainer
        center={props.points && props.points[0] ? [props.points[0][0], props.points[0][1]] : [24.6877, 46.7219]}
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

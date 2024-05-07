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
        });
        
        if (map && routingControl) {
          routingControl.addTo(map);
        }
      }
  
      return () => {
        markers?.forEach((marker) => marker.remove());
        if (map && routingControl) {
          map.removeControl(routingControl);
        }
      };
    }, [checkpoints, map, mapRef]);
  
    return null;
  };
  

const MapPage = (props: any) => {
  const [checkpointInput, setCheckpointInput] = useState("");
  const [checkpoints, setCheckpoints] = useState<[number, number][]>([]);
  const mapRef = useRef<LeafletMap | null>(null);

  const locations = useRef([
    [
      [24.71689071038911, 46.67325487824405],
      [24.75535469788335, 46.634278338613285],
    ],
    [
      [24.769332236299785, 46.64314730430681],
      [24.74512091373306, 46.70546442319801],
    ],
    [
      [24.727967539578216, 46.754795518984565],
      [24.694108948690584, 46.72628913218068],
    ],
    [
      [24.700610718519833, 46.771202121396755],
      [24.652443348267997, 46.792357279631915],
    ],
    [
      [24.626819393462313, 46.74062432336825],
      [24.633240808561588, 46.72379647625871],
    ],
  ]);

  const addCheckpoint = async () => {
    const locationArray = locations.current;
    const randomIndex = Math.floor(Math.random() * locationArray.length);
    const selectedPath = locationArray[randomIndex];

    try {
      const { data, error } = await supabase
        .from("plate")
        .update({ points: selectedPath, status: 'find' })
        .eq("id", props.id);

      if (error) {
        console.error("Error saving selected path:", error.message);
      } else {
        console.log("Path saved successfully to plate ID:", props.id);
      }
    } catch (error) {
      console.error("Error saving selected path:", error);
    }

    setCheckpointInput("");
    setCheckpoints(selectedPath);
    mapRef.current?.setView(
      new LatLng(selectedPath[0][0], selectedPath[0][1]),
      15
    );
  };

  useEffect(() => {
    if (props.plateExists === true) {
      addCheckpoint();
    }
  }, [props.plateExists]);

  return (
    <><div>
          <MapContainer
              center={[24.6877, 46.7219]}
              zoom={13}
              style={{ height: "400px", width: "100%" }}
          >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <CustomMap checkpoints={checkpoints} mapRef={mapRef} />
          </MapContainer>
      </div><div style={{minHeight:'100px'}}>

          </div></>
  );
};

export default MapPage;

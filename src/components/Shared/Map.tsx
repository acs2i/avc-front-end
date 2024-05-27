import React from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon, divIcon, point } from "leaflet";
import { MARKERS } from "../../utils/index";
import MarkerClusterGroup from "react-leaflet-cluster"


export default function Map() {
    const customIcon = new Icon({
      iconUrl: require("../../assets/img/pin.png"),
      iconSize: [38, 38],
    });
  
    const createClusterCustomIcon = function (cluster: any) {
        const count = cluster.getChildCount();
        let className = 'custom-marker-cluster';
        if (count < 10) {
          className += ' small-cluster';
        } else if (count < 20) {
          className += ' medium-cluster';
        } else {
          className += ' large-cluster';
        }
    
        return new (divIcon as any)({
          html: `<span class="cluster-icon">${count}</span>`,
          className,
          iconSize: new (point as any)(33, 33, true),
        });
      };
  
    return (
      <MapContainer
        center={[46.5, 2.5]}
        zoom={6}
        minZoom={5}
        zoomControl={false}
        wheelPxPerZoomLevel={200}
      >
        <TileLayer url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png" />
        <MarkerClusterGroup
          chunkedLoading
          iconCreateFunction={createClusterCustomIcon}
        >
          {MARKERS.map((marker, i) => (
            <Marker position={marker.geocode} icon={customIcon} key={i}>
              <Popup>{marker.name}</Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>
    );
  }
  

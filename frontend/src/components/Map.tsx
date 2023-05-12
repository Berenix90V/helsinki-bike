import {
    MapContainer,
    TileLayer,
    Marker,
    Popup
} from 'react-leaflet'
import icon from "leaflet/dist/images/marker-icon.png";
import L from "leaflet";

let DefaultIcon = L.icon({
    iconUrl: icon
});

L.Marker.prototype.options.icon = DefaultIcon

type MapProps = {
    x:number,
    y: number
}
export function Map({x, y}:MapProps){
    const position:[number, number] = [y, x]

    return(
        <>
            <MapContainer center={position} zoom={17} scrollWheelZoom={true} style={{ height: "450px", width: "100%" }} >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={position}>
                    <Popup>
                        A pretty CSS3 popup. <br /> Easily customizable.
                    </Popup>
                </Marker>
            </MapContainer>
        </>
    )
}
import {Station} from "../interfaces/Station";
import StationDetails from "../components/StationDetails";


function SingleStationView(station:Station){
    return(
        <>
            <h1 className="text-center">{station.Name}</h1>
            <StationDetails
                station={station}
            />
        </>
    )
}

export default SingleStationView
import {Station} from "../interfaces/Station";
import StationDetails from "../components/StationDetails";
import {useEffect, useState} from "react";
import {getStationByID} from "../api/stations_api";
import {useParams} from "react-router-dom";
import {JourneysStats} from "../components/JourneysStats";
import {Map} from "../components/Map";

function SingleStationView(){
    const id =  parseInt(useParams().id!)
    const [station, setStation] = useState<Station>()
    useEffect(()=>{
        const getStation = async() => {
            return await getStationByID(id)
                .then((response) => response.data.station)
                .catch((err) =>err)
        }
        getStation()
            .then(setStation)
            .catch((err)=>err)
    }, [id])
    if(station){
        return(
            <>
                <h1 className="text-center">{station.Name}</h1>
                <h2 className="text-center">Station details</h2>
                <Map x={station.x} y={station.y}/>
                <StationDetails
                    station={station}
                />
                <h2 className="text-center">Station's journeys</h2>
                <JourneysStats id={station.ID}/>
            </>
        )
    }

    else
        return(
            <>
                <h1>Station not found</h1>
            </>
        )
}

export default SingleStationView
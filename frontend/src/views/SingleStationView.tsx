import {Station} from "../interfaces/Station";
import StationDetails from "../components/StationDetails";
import {useEffect, useState} from "react";
import {getStationByID} from "../api/stations_api";
import {useParams} from "react-router-dom";

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
            .catch()
    }, [id])
    if(station){
        console.log(station)
        return(
            <>
                <h1 className="text-center">{station.Name}</h1>
                <StationDetails
                    station={station}
                />
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
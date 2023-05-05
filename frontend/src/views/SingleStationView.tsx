import {Station} from "../interfaces/Station";
import StationDetails from "../components/StationDetails";
import {useEffect, useState} from "react";
import {getStationByID} from "../api/stations_api";
import {useParams} from "react-router-dom";
import {getNJourneysFromStation, getNJourneysToStation} from "../api/journeys_api";
import {JourneysFromToStation} from "../components/JourneysFromToStation";

function SingleStationView(){
    const id =  parseInt(useParams().id!)
    const [station, setStation] = useState<Station>()
    const [nJourneysFrom, setNJourneysFrom] = useState<number>(0)
    const [nJourneysTo, setNJourneysTo] = useState<number>(0)
    useEffect(()=>{
        const getStation = async() => {
            return await getStationByID(id)
                .then((response) => response.data.station)
                .catch((err) =>err)
        }
        const getNJourneysFrom = async () => {
            return await getNJourneysFromStation(id)
                .then((response) => response.data.njourneys)
                .catch((err)=>err)
        }
        const getNJourneysTo = async () =>{
            return await getNJourneysToStation(id)
                .then((response) => response.data.njourneys)
                .catch((err) => err)
        }
        getStation()
            .then(setStation)
            .catch((err)=>err)
        getNJourneysFrom()
            .then(setNJourneysFrom)
            .catch((err)=>err)
        getNJourneysTo()
            .then(setNJourneysTo)
            .catch((err)=>err)
    }, [id])
    if(station){
        console.log(station)
        return(
            <>
                <h1 className="text-center">{station.Name}</h1>
                <h2 className="text-center">Station details</h2>
                <StationDetails
                    station={station}
                />
                <h2 className="text-center">Station's journeys</h2>
                <JourneysFromToStation nJourneysFrom={nJourneysFrom} nJourneysTo={nJourneysTo}/>
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
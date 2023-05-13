import {useEffect, useState} from "react";
import {topNDestinations} from "../api/journeys_api";
import {Table} from "react-bootstrap";
import {Destination} from "../interfaces/Destination";

type DestinationsParameters={
    departure_id: number
}
export function DestinationsTable({departure_id}: DestinationsParameters){
    const [topDestinations, setTopDestinations] = useState<Destination[]>([])
    useEffect(()=>{
        const getTopNDestinations = async () =>{
            return await topNDestinations(departure_id,5)
                .then((response)=> {
                    return response.data.destinations
                })
                .catch((err)=>err)
        }
        getTopNDestinations()
            .then(setTopDestinations)
            .catch((err)=>err)

    }, [departure_id])

    function renderDestination(destination:Destination, index:number){
        return(
            <tr key={index}>
                <td>{destination.Name}</td>
                <td>{destination.count}</td>
            </tr>
        )
    }

    return(
        <Table>
            <thead>
            <tr>
                <th>Destination</th>
                <th>Journeys' count</th>
            </tr>
            </thead>
            <tbody>
            {topDestinations.map(renderDestination)}
            </tbody>
        </Table>
    )
}
import {useEffect, useState} from "react";
import {topNDepartures} from "../api/journeys_api";
import {Table} from "react-bootstrap";
import {Departure} from "../interfaces/Departure";

type DestinationsParameters={
    return_id: number,
    month: string
}

/**
 * Table containing top departure station given a destination station
 * @param {number} return_id : id of destination station
 * @param {number} month : month by which journeys are filtered
 *
 */
export function DeparturesTable({return_id, month}: DestinationsParameters){
    const [topDepartures, setTopDepartures] = useState<Departure[]>([])
    useEffect(()=>{
        const getTopNDepartures = async () =>{
            return await topNDepartures(return_id,5, month)
                .then((response)=> {
                    return response.data.departures
                })
                .catch((err)=>err)
        }
        getTopNDepartures()
            .then(setTopDepartures)
            .catch((err)=>err)

    }, [return_id, month])

    function renderDestination(departure:Departure, index:number){
        return(
            <tr key={index}>
                <td>{departure.Name}</td>
                <td>{departure.count}</td>
                </tr>
        )
    }

    return(
        <Table>
            <thead>
                <tr>
                    <th>Departure</th>
                    <th>Journeys' count</th>
                </tr>
            </thead>
        <tbody>
        {topDepartures.map(renderDestination)}
        </tbody>
        </Table>
    )
}
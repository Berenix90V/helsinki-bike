import http from "./http_common"
import {Destination} from "../interfaces/Destination";
import {Departure} from "../interfaces/Departure";

export function getAllJourneys(take: number){
    return http.get("journeys/", {params:{take:take}})
}

export function getPaginatedJourneys(skip:number, take: number){
    return http.get("journeys/", {params:{skip:skip, take:take}})
}

export function countJourneys(){
    return http.get("journeys/count")
}
export function getNJourneysFromStation(id:number, month?:string){
    if(month==="")
        return http.get<{njourneys:number}>("journeys/from/"+id)
    else
        return http.get<{njourneys:number}>("journeys/from/"+id+"/?month="+parseInt(month as string))
}

export function getNJourneysToStation(id:number, month?:string){
    if(month ==="")
        return http.get<{njourneys:number}>("journeys/to/"+id)
    else
        return http.get<{njourneys:number}>("journeys/to/"+id+"/?month="+parseInt(month as string))
}

export function getPaginatedJourneysByDepartureStation(skip:number, take: number, patternFrom:string, patternTo:string){
    return http.get("journeys/search/", {params:{skip:skip, take:take, patternFrom:patternFrom, patternTo: patternTo}})
}

export function countJourneysWithDepartureStationStartingWith(patternFrom:string, patternTo:string){
    return http.get("journeys/count/search/", {params:{patternFrom:patternFrom, patternTo: patternTo}})
}

export function avgJourneyFromStation(id:number, month:string){
    if(month==="")
        return http.get("journeys/from/"+id+"/distance/avg")
    else
        return http.get("journeys/from/"+id+"/distance/avg?month"+month)
}

export function avgJourneyToStation(id:number, month:string){
    if(month==="")
        return http.get("journeys/to/"+id+"/distance/avg")
    else
        return http.get("journeys/to/"+id+"/distance/avg?month="+month)
}

export function topNDestinations(id:number, limit:number){
    return http.get<{destinations: Destination[]}>("journeys/from/"+id+"/top/destinations/?limit="+limit)
}

export function topNDepartures(id:number, limit:number){
    return http.get<{departures: Departure[]}>("journeys/to/"+id+"/top/departures/?limit="+limit)
}
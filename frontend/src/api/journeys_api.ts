import http from "./http_common"
import {Destination} from "../interfaces/Destination";
import {Departure} from "../interfaces/Departure";
import {Journey} from "../interfaces/Journey";

export function getAllJourneys(take: number){
    return http.get("journeys/", {params:{take:take}})
}

export function getPaginatedJourneys(skip:number, take: number){
    return http.get<{journeys:Journey[]}>("journeys/", {params:{skip:skip, take:take}})
}

export function countJourneys(){
    return http.get<{count:number}>("journeys/count")
}
export function getNJourneysFromStation(id:number, month?:string){
    if(month==="")
        return http.get<{count:number}>("journeys/count/from/"+id)
    else
        return http.get<{count:number}>("journeys/count/from/"+id+"/?month="+parseInt(month as string))
}

export function getNJourneysToStation(id:number, month?:string){
    if(month ==="")
        return http.get<{count:number}>("journeys/count/to/"+id)
    else
        return http.get<{count:number}>("journeys/count/to/"+id+"/?month="+parseInt(month as string))
}

export function getPaginatedJourneysBySearch(skip:number, take: number, patternFrom:string, patternTo:string){
    return http.get<{journeys:Journey[]}>("journeys/search/", {params:{skip:skip, take:take, patternFrom:patternFrom, patternTo: patternTo}})
}

export function countJourneysWithDepartureStationStartingWith(patternFrom:string, patternTo:string){
    return http.get<{count:number}>("journeys/count/search/", {params:{patternFrom:patternFrom, patternTo: patternTo}})
}

export function avgJourneyFromStation(id:number, month:string){
    if(month==="")
        return http.get<{avg:number}>("journeys/from/"+id+"/distance/avg")
    else
        return http.get<{avg:number}>("journeys/from/"+id+"/distance/avg?month="+month)
}

export function avgJourneyToStation(id:number, month:string){
    if(month==="")
        return http.get<{avg:number}>("journeys/to/"+id+"/distance/avg")
    else
        return http.get<{avg:number}>("journeys/to/"+id+"/distance/avg?month="+month)
}

export function topNDestinations(id:number, limit:number, month?:string){
    if(month === "")
        return http.get<{destinations: Destination[]}>("journeys/from/"+id+"/top/destinations/?limit="+limit)
    else
        return http.get<{destinations: Destination[]}>("journeys/from/"+id+"/top/destinations/?limit="+limit+"&month="+month)
}

export function topNDepartures(id:number, limit:number, month?:string){
    if(month==="")
        return http.get<{departures: Departure[]}>("journeys/to/"+id+"/top/departures/?limit="+limit)
    else
        return http.get<{departures: Departure[]}>("journeys/to/"+id+"/top/departures/?limit="+limit+"&month="+month)
}
import http from "./http_common"

export function getAllJourneys(take: number){
    return http.get("journeys/", {params:{take:take}})
}

export function getPaginatedJourneys(skip:number, take: number){
    return http.get("journeys/", {params:{skip:skip, take:take}})
}

export function countJourneys(){
    return http.get("journeys/count")
}
export function getNJourneysFromStation(id:number){
    return http.get<{njourneys:number}>("journeys/from/"+id)
}

export function getNJourneysToStation(id:number){
    return http.get<{njourneys:number}>("journeys/to/"+id)
}

export function getPaginatedJourneysByDepartureStation(skip:number, take: number, patternFrom:string, patternTo:string){
    return http.get("journeys/search/", {params:{skip:skip, take:take, patternFrom:patternFrom, patternTo: patternTo}})
}

export function countJourneysWithDepartureStaionStartingWith(patternFrom:string, patternTo:string){
    return http.get("journeys/count/search/", {params:{patternFrom:patternFrom, patternTo: patternTo}})
}

export function avgJourneyFromStation(id:number){
    return http.get("journeys/from/"+id+"/distance/avg")
}

export function avgJourneyToStation(id:number){
    return http.get("journeys/to/"+id+"/distance/avg")
}
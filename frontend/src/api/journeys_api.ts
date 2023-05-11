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

export function getPaginatedJourneysByDepartureStation(skip:number, take: number, pattern:string){
    return http.get("journeys/search/from/", {params:{skip:skip, take:take, pattern:pattern}})
}

export function countJourneysWithDepartureStaionStartingWith(pattern:string){
    return http.get("journeys/count/search/from/", {params:{pattern:pattern}})
}
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
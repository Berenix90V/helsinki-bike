import http from "./http_common"

export function getAllJourneys(take: number){
    return http.get("journeys/", {params:{take:take}})
}

export function getJourneysFromStation(id:number){
    return http.get<{njourneys:number}>("journeys/from/"+id)
}

export function getJourneysToStation(id:number){
    return http.get<{njourneys:number}>("journeys/to/"+id)
}
import http from "./http_common"

export function getAllJourneys(take: number){
    return http.get("journeys/", {params:{take:take}})
}
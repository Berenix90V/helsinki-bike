import http from "./http_common"

export function getAllStations(){
    return http.get("stations/")
}
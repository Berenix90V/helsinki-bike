import http from "./http_common"

export function getAllStations(){
    return http.get("stations/")
}

export function  getStationByID(id:number){
    return http.get("stations/:id")
}
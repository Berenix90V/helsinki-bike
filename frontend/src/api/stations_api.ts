import http from "./http_common"
import {Station} from "../interfaces/Station";

export function getAllStations(){
    return http.get("stations/")
}

export function getPaginatedStations(skip:number, take: number){
    return http.get("stations/", {params:{skip:skip, take:take}})
}

export function  getStationByID(id:number){
    return http.get<{station: Station}>("stations/"+id)
}
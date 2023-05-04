import http from "./http_common"
import {Station} from "../interfaces/Station";

export function getAllStations(){
    return http.get("stations/")
}

export function  getStationByID(id:number){
    console.log(id)
    return http.get<{station: Station}>("stations/"+id)
}
import http from "./http_common"
import {Station} from "../interfaces/Station";

export function getAllStations(){
    return http.get("stations/")
}

export function getPaginatedStations(skip:number, take: number){
    return http.get("stations/", {params:{skip:skip, take:take}})
}

export function countSearchedStationsByName(patternName:string){
    return http.get("stations/count/search/?patternName="+patternName)
}

export function getPaginatedSearchedStationsByName(skip:number, take:number,patternName:string){
    return http.get("stations/search/", {params:{skip:skip, take:take, patternName:patternName}})
}

export function  getStationByID(id:number){
    return http.get<{station: Station}>("stations/"+id)
}
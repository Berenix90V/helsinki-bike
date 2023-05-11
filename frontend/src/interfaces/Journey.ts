import {Station} from "./Station";

export interface Journey{
    Departure_datetime: string,
    Return_datetime:string,
    Departure_station: Station,
    Return_station: Station,
    Covered_distance: number,
    Duration: number
}
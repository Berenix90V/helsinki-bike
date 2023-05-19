import {Station} from "./Station";

/**
 * Interface of a Journey
 */
export interface Journey{
    Departure_datetime: string,
    Return_datetime:string,
    Departure_station: Station,
    Return_station: Station,
    Covered_distance: number,
    Duration: number
}
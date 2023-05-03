import {Station} from "./Station";

export interface Journey{
    Departure_station: Station,
    Return_station: Station,
    Covered_distance: number,
    Duration: number
}
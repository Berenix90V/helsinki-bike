import {Station} from "../models/Station";

/**
 * Get all stations
 * @returns {Station[]}: Stations list
 */
const getAllStations = async (): Promise<Station[]> => {
    return await Station.fetchAll()
}

/**
 * get count of total stations
 *
 * @returns {number} : total stations
 */
const countStations = async (): Promise<number> => {
    return await Station.countTotal()
}

/**
 * Return m stations after skipping n stations
 * @param {number} skip : stations to be skipped
 * @param {number} take : stations to be taken
 *
 * @returns {Station[]} : station list
 */
const getPaginatedStations = async (skip: number, take:number): Promise<Station[]>=> {
    if (Number.isNaN(take))
        throw TypeError("Provided \"take\" value is not a number. Please provide a numeric value")
    if (Number.isNaN(skip))
        throw TypeError("Provided \"skip\" value is not a number. Please provide a numeric value")
    return await Station.getPaginatedStations(skip, take)
}

/**
 * Return station with given id
 * @param {number} id : id of the station
 *
 * @returns {Station} : station with given id
 */
const getStationByID = async(id:number): Promise<Station> => {
    if(Number.isNaN(id)){
        throw TypeError("Provided \"id\" value is not a number. Please provide a numeric value")
    }
    return await Station.getByID(id)
}

/**
 * Return count of stations that match search criteria
 * @param {string} patternName : search criteria for station name
 *
 * @returns {count} : count stations that match criteria
 */
const countSearchedStations = async(patternName:string):Promise<number>=>{
    return await Station.countStationForSearch(patternName)
}

/**
 * Return stations that match search criteria
 * @param {number} skip : stations to be skipped
 * @param {number} take : stations to be taken
 * @param {string} patternName : search pattern for station name
 *
 * @returns {Station[]} : station list that match the search criteria
 */
const getPaginatedSearchedStations = async(skip:number, take:number, patternName:string): Promise<Station[]> => {
    if (Number.isNaN(take))
        throw TypeError("Provided \"take\" value is not a number. Please provide a numeric value")
    if (Number.isNaN(skip))
        throw TypeError("Provided \"skip\" value is not a number. Please provide a numeric value")
    return await Station.getPaginatedStationsForSearch(skip, take, patternName)
}


export {getAllStations, getPaginatedStations, getStationByID, getPaginatedSearchedStations, countSearchedStations, countStations}
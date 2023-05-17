import {Journey} from "../models/Journey";
import {Destination} from "../models/Destinations";
import {Departure} from "../models/Departure";

/**
 * Get paginated journeys
 * @param {number} skip : journeys to be skipped
 * @param {number} take : journeys to be taken
 *
 * @returns {Journey[]} :  list of journeys
 */
export const getAllJourneys = async (skip: number, take:number):Promise<Journey[]>=>{
    if(Number.isNaN(take))
        throw TypeError("Provided \"take\" value is not a number. Please provide a numeric value")
    if(Number.isNaN(skip))
        throw TypeError("Provided \"skip\" value is not a number. Please provide a numeric value")
    return await Journey.getPaginatedJourneys(skip, take)
}

/**
 * Return count of journeys
 *
 * @returns {number}: count of journeys
 */
export const countTotalJourneys = async():Promise<number>=>{
    return await Journey.countTotal()
}

/**
 * Count journeys from station with a certain id
 * @param {number} id : id of the departure station
 * @param {number} month : month in which journeys begin
 *
 * @returns {number} : count of journeys
 */
export const getNumberOfJourneysFromStation = async(id:number, month?:number): Promise<number> => {
    if(Number.isNaN(id))
        throw TypeError("Provided \"id\" value is not a number. Please provide a numeric value")
    if(month !== undefined)
        if(Number.isNaN(month))
            throw TypeError("Provided \"month\" value is not a number. Please provide a numeric value")
        else
            return await Journey.getNumberOfJourneysFromStation(id, month)
    else
        return await Journey.getNumberOfJourneysFromStation(id)
}

/**
 * Count journeys to station with a certain id
 * @param {number} id : id of the return station
 * @param {number} month : month in which journeys end
 *
 * @returns {number} : count of journeys
 */
export const getNumberOfJourneysToStation = async(id:number, month?:number):Promise<number> => {
    if(Number.isNaN(id))
        throw TypeError("Provided \"id\" value is not a number. Please provide a numeric value")
    if(month!==undefined)
        if(Number.isNaN(month))
            throw TypeError("Provided \"month\" value is not a number. Please provide a numeric value")
        else
            return await Journey.getNumberOfJourneysToStation(id, month)
    else
        return await Journey.getNumberOfJourneysToStation(id)
}

/**
 * Return journeys matching search patterns for departure and return station name
 * @param {number} skip : journeys to be skipped
 * @param {number} take : journeys to be taken
 * @param {string} patternDepartureStation : pattern search for departure station name
 * @param {string} patternReturnStation : pattern search for return station name
 *
 * @returns {Journey[]}: list of journeys
 */
export const getPaginatedJourneysForSearch= async(skip:number, take:number, patternDepartureStation:string, patternReturnStation:string): Promise<Journey[]>=>{
    if(Number.isNaN(take))
        throw TypeError("Provided \"take\" value is not a number. Please provide a numeric value")
    if(Number.isNaN(skip))
        throw TypeError("Provided \"skip\" value is not a number. Please provide a numeric value")
    return await Journey.getPaginatedJourneysForSearch(skip, take, patternDepartureStation, patternReturnStation)
}

/**
 * Return count of journeys matching the search criteria
 * @param {string} patternDepartureStation : search criteria for departure station name
 * @param {string} patternReturnStation : search criteria for return station name
 *
 * @returns {number}: count of searched journeys
 */
export const countJourneysForSearch = async(patternDepartureStation:string, patternReturnStation:string): Promise<number> =>{
    return await Journey.countJourneysForSearch(patternDepartureStation, patternReturnStation)
}

/**
 * Given the id, return average covered distance of journeys from station with given id
 * @param {number} id : departure station id
 * @param {number} month : month in which journeys begin
 *
 * @returns: {number}: average covered distance
 */
export const getAvgDistanceJourneysFrom = async(id:number, month?:number):Promise<number>=>{
    if(Number.isNaN(id))
        throw TypeError("Provided \"id\" value is not a number. Please provide a numeric value")
    if(month !== undefined)
        if(Number.isNaN(month))
            throw TypeError("Provided \"month\" value is not a number. Please provide a numeric value")
        else
            return await Journey.getAverageDistanceFrom(id, month)
    return await Journey.getAverageDistanceFrom(id)
}

/**
 * Given the id, return average covered distance of journeys to station with given id
 * @param {number} id : return station id
 * @param {number} month : month in which journeys end
 *
 * @returns: {number}: average covered distance
 */
export const getAvgDistanceJourneysTo = async(id:number, month?:number): Promise<number>=>{
    if(Number.isNaN(id))
        throw TypeError("Provided \"id\" value is not a number. Please provide a numeric value")
    if(month !== undefined)
        if(Number.isNaN(month))
            throw TypeError("Provided \"month\" value is not a number. Please provide a numeric value")
        else
            return await Journey.getAverageDistanceTo(id, month)
    return await Journey.getAverageDistanceTo(id)
}

/**
 * Get top n destinations of journeys from station with given id
 * @param {number} id : departure station id
 * @param {number} limit : destinations to be taken
 * @param {number} month : month in which the journeys begin
 *
 * @returns {Destination[]}: list of top n destinations
 */
export const getTopNDestinations = async(id:number, limit: number, month?:number): Promise<Destination[]> =>{
    if(Number.isNaN(id))
        throw TypeError("Provided \"id\" value is not a number. Please provide a numeric value")
    if(Number.isNaN(limit))
        throw TypeError("Provided \"limit\" value is not a number. Please provide a numeric value")
    if(month !== undefined)
        if(Number.isNaN(month))
            throw TypeError("Provided \"month\" value is not a number. Please provide a numeric value")
        else
            return await Journey.getTopNDestinations(id, limit, month)
    return await Journey.getTopNDestinations(id, limit)
}

/**
 * Get top n departures of journeys to station with given id
 * @param {number} id : return station id
 * @param {number} limit : departures to be taken
 * @param {number} month : month in which the journeys end
 *
 * @returns {Departure[]}: list of top n Departures
 */
export const getTopNDepartures = async(id:number, limit:number, month?:number): Promise<Departure[]> =>{
    if(Number.isNaN(id))
        throw TypeError("Provided \"id\" value is not a number. Please provide a numeric value")
    if(Number.isNaN(limit))
        throw TypeError("Provided \"limit\" value is not a number. Please provide a numeric value")
    if(month !== undefined)
        if(Number.isNaN(month))
            throw TypeError("Provided \"month\" value is not a number. Please provide a numeric value")
        else
            return await Journey.getTopNDepartures(id, limit, month)
    return await Journey.getTopNDepartures(id, limit)
}

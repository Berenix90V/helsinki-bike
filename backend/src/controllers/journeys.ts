import {Journey} from "../models/Journey";

export const getAllJourneys = async (skip: number, take:number)=>{
    if(Number.isNaN(take))
        throw TypeError("Provided \"take\" value is not a number. Please provide a numeric value")
    if(Number.isNaN(skip))
        throw TypeError("Provided \"skip\" value is not a number. Please provide a numeric value")
    return await Journey.getPaginatedJourneys(skip, take)
}

export const countTotalJourneys = async()=>{
    return await Journey.countTotal()
}

export const getNumberOfJourneysFromStation = async(id:number) => {
    if(Number.isNaN(id))
        throw TypeError("Provided \"id\" value is not a number. Please provide a numeric value")
    return await Journey.getNumberOfJourneysFromStation(id)
}

export const getNumberOfJourneysToStation = async(id:number) => {
    if(Number.isNaN(id))
        throw TypeError("Provided \"id\" value is not a number. Please provide a numeric value")
    return await Journey.getNumberOfJourneysToStation(id)
}

export const getPaginatedJourneysForSearch= async(skip:number, take:number, patternDepartureStation:string, patternReturnStation:string)=>{
    if(Number.isNaN(take))
        throw TypeError("Provided \"take\" value is not a number. Please provide a numeric value")
    if(Number.isNaN(skip))
        throw TypeError("Provided \"skip\" value is not a number. Please provide a numeric value")
    return await Journey.getPaginatedJourneysForSearch(skip, take, patternDepartureStation, patternReturnStation)
}

export const countJourneysForSearch = async(patternDepartureStation:string, patternReturnStation:string) =>{
    return await Journey.countJourneysForSearch(patternDepartureStation, patternReturnStation)
}

export const getAvgDistanceJourneysFrom = async(id:number)=>{
    if(Number.isNaN(id))
        throw TypeError("Provided \"id\" value is not a number. Please provide a numeric value")
    return await Journey.getAverageDistanceFrom(id)
}

export const getAvgDistanceJourneysTo = async(id:number)=>{
    if(Number.isNaN(id))
        throw TypeError("Provided \"id\" value is not a number. Please provide a numeric value")
    return await Journey.getAverageDistanceTo(id)
}

export const getTopNDestinations = async(id:number, limit: number) =>{
    if(Number.isNaN(id))
        throw TypeError("Provided \"id\" value is not a number. Please provide a numeric value")
    if(Number.isNaN(limit))
        throw TypeError("Provided \"limit\" value is not a number. Please provide a numeric value")
    return await Journey.getTopNDestinations(id, limit)
}

export const getTopNDepartures = async(id:number, limit:number) =>{
    if(Number.isNaN(id))
        throw TypeError("Provided \"id\" value is not a number. Please provide a numeric value")
    if(Number.isNaN(limit))
        throw TypeError("Provided \"limit\" value is not a number. Please provide a numeric value")
    return await Journey.getTopNDepartures(id, limit)
}

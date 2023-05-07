import {Journey} from "../models/Journey";

const getAllJourneys = async (skip: number, take:number)=>{
    if(Number.isNaN(take))
        throw TypeError("Provided \"take\" value is not a number. Please provide a numeric value")
    if(Number.isNaN(skip))
        throw TypeError("Provided \"skip\" value is not a number. Please provide a numeric value")
    return await Journey.getPaginatedJourneys(skip, take)
}

const getNumberOfJourneysFromStation = async(id:number) => {
    if(Number.isNaN(id))
        throw TypeError("Provided \"id\" value is not a number. Please provide a numeric value")
    return await Journey.getNumberOfJourneysFromStation(id)
}

const getNumberOfJourneysToStation = async(id:number) => {
    if(Number.isNaN(id))
        throw TypeError("Provided \"id\" value is not a number. Please provide a numeric value")
    return await Journey.getNumberOfJourneysToStation(id)
}

export {getAllJourneys, getNumberOfJourneysFromStation, getNumberOfJourneysToStation}
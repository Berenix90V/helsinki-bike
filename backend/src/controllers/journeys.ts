import {Journey} from "../models/Journey";

const getAllJourneys = async (n: number)=>{
    if(Number.isNaN(n))
        throw TypeError("Provided \"take\" value is not a number. Please provide a numeric value")
    return await Journey.fetchFirstNJourneys(n)
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
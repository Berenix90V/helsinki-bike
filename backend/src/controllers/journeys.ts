import {Journey} from "../models/Journey";

const getAllJourneys = async (n: number)=>{
    if(Number.isNaN(n))
        throw TypeError("Provided \"take\" value is not a number. Please provide a numeric value")
    return await Journey.fetchFirstNJourneys(n)
}

export {getAllJourneys}
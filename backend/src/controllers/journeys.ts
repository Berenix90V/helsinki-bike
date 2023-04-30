import {Journey} from "../models/Journey";

const getAllJourneys = async (n: number)=>{
    return await Journey.fetchFirstNJourneys(n)
}

export {getAllJourneys}
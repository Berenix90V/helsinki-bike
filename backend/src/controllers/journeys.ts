import {Journey} from "../models/Journey";

const getAllJourneys = async ()=>{
    return await Journey.fetchAll()
}

export {getAllJourneys}
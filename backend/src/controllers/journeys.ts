import {Journey} from "../models/Journey";

const getAllJourneys = ()=>{
    return Journey.fetchAll()
}

export {getAllJourneys}
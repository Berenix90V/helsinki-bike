import {Station} from "../models/Station";

const getAllStations = async () => {
    return await Station.fetchAll()
}

const getPaginatedStations = async (skip: number, take:number)=> {
    if (Number.isNaN(take))
        throw TypeError("Provided \"take\" value is not a number. Please provide a numeric value")
    if (Number.isNaN(skip))
        throw TypeError("Provided \"skip\" value is not a number. Please provide a numeric value")
    return await Station.getPaginatedStations(skip, take)
}

const getStationByID = async(id:number) => {
    if(Number.isNaN(id)){
        throw TypeError("Provided \"id\" value is not a number. Please provide a numeric value")
    }
    return await Station.getByID(id)
}

export {getAllStations, getPaginatedStations, getStationByID}
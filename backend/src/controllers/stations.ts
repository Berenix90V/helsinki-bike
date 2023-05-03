import {Station} from "../models/Station";

const getAllStations = async () => {
    return await Station.fetchAll()
}
const getStationByID = async(id:number) => {
    if(Number.isNaN(id)){
        throw TypeError("Provided \"id\" value is not a number. Please provide a numeric value")
    }
    return await Station.getByID(id)
}

export {getAllStations}
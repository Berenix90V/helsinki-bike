import {Station} from "../models/Station";

const getAllStations = async (): Promise<Station[]> => {
    return await Station.fetchAll()
}

const countStations = async (): Promise<number> => {
    return await Station.countTotal()
}

const getPaginatedStations = async (skip: number, take:number): Promise<Station[]>=> {
    if (Number.isNaN(take))
        throw TypeError("Provided \"take\" value is not a number. Please provide a numeric value")
    if (Number.isNaN(skip))
        throw TypeError("Provided \"skip\" value is not a number. Please provide a numeric value")
    return await Station.getPaginatedStations(skip, take)
}

const getStationByID = async(id:number): Promise<Station> => {
    if(Number.isNaN(id)){
        throw TypeError("Provided \"id\" value is not a number. Please provide a numeric value")
    }
    return await Station.getByID(id)
}

const countSearchedStations = async(patternName:string):Promise<number>=>{
    return await Station.countStationForSearch(patternName)
}

const getPaginatedSearchedStations = async(skip:number, take:number, patternName:string): Promise<Station[]> => {
    if (Number.isNaN(take))
        throw TypeError("Provided \"take\" value is not a number. Please provide a numeric value")
    if (Number.isNaN(skip))
        throw TypeError("Provided \"skip\" value is not a number. Please provide a numeric value")
    return await Station.getPaginatedStationsForSearch(skip, take, patternName)
}


export {getAllStations, getPaginatedStations, getStationByID, getPaginatedSearchedStations, countSearchedStations, countStations}
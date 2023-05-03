import {Station} from "../models/Station";

const getAllStations = async () => {
    return await Station.fetchAll()
}

export {getAllStations}
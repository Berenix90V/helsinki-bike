import {AppDataSource} from "../../src/db/data-sources";
import {Station} from "../../src/models/Station";
import {getAllStations, getStationByID} from "../../src/controllers/stations";


beforeEach(async ()=>{
    await AppDataSource.initialize()
} )

afterEach(async ()=>{
    await AppDataSource.destroy()
})

describe("Test stations controller getAllStation", ()=> {
    test("Test that the function call the method to fetch all stations", async() => {
        const spy = jest.spyOn(Station, 'fetchAll')
        await getAllStations()
        expect(spy).toHaveBeenCalled()
    })
})

describe("Test stations controller getStationByID", () => {
    it.each([[-5], [-1], [0]])("Test the function with not valid number", async(id)=>{
        const spy = jest.spyOn(Station, 'getByID')
        await expect(getStationByID(id)).rejects.toThrowError(RangeError("Bad request: The ID must be >= 0"))
        expect(spy).toHaveBeenCalled()
        expect(spy).toBeCalledTimes(1)
    })
    it.each([[4000], [504], [2000]])("Test the function with not valid ids", async(id)=>{
        const spy = jest.spyOn(Station, 'getByID')
        await expect(getStationByID(id)).rejects.toThrowError(RangeError("Not found"))
        expect(spy).toHaveBeenCalled()
        expect(spy).toBeCalledTimes(1)
    })
    test("Test the function with NaN value", async() => {
        const spy = jest.spyOn(Station, 'getByID')
        await expect(getStationByID(NaN)).rejects.toThrowError(TypeError)
        expect(spy).not.toHaveBeenCalled()
    })
})
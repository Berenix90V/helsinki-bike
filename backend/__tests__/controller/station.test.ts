import {AppDataSource} from "../../src/db/data-sources";
import {Station} from "../../src/models/Station";
import {getAllStations, getPaginatedStations, getStationByID} from "../../src/controllers/stations";


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

describe("Test station controller: getPaginatedStations", () => {
    it.each([[0,1], [0,5], [0,12], [5, 1], [5, 10], [103, 1], [103, 7]])
    ("Test with valid numeric values: skip %d and take %d", async (skip, take)=>{
        const spy = jest.spyOn(Station, 'getPaginatedStations');
        const result: Station[] =  await getPaginatedStations(skip, take)
        expect(spy).toHaveBeenCalled()
        expect(spy).toBeCalledTimes(1)
        expect(result).toHaveLength(take)
        result.forEach((element) => {
            expect(element).toBeInstanceOf(Station)
        })
    })
    test("Test skip at limit of range", async() => {
        const spy = jest.spyOn(Station, 'getPaginatedStations');
        const totalStations:number = await Station.countTotal()
        const skip:number = totalStations-2
        const result: Station[] =  await getPaginatedStations(skip, 9)
        expect(spy).toHaveBeenCalled()
        expect(spy).toBeCalledTimes(1)
        expect(result).toHaveLength(totalStations-skip)
        result.forEach((element) => {
            expect(element).toBeInstanceOf(Station)
        })
    })
    it.each([[0,-1], [0,-5], [0,0], [2,0], [-1, 5], [-2,1], [-3,0]])
    ("Test with invalid numeric values: skip %d and take %d", async (skip, take)=>{
        const spy = jest.spyOn(Station, 'getPaginatedStations');
        await expect(getPaginatedStations(skip, take)).rejects.toThrowError(RangeError)
        expect(spy).toHaveBeenCalled()
        expect(spy).toBeCalledTimes(1)
    })
    it.each([[0, NaN], [5, NaN], [NaN, 1], [NaN, 10], [NaN,NaN]])("Test with NaN value", async (skip, take)=>{
        const spy = jest.spyOn(Station, 'getPaginatedStations');
        await expect(getPaginatedStations(skip, take)).rejects.toThrowError(TypeError)
        expect(spy).not.toHaveBeenCalled()
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
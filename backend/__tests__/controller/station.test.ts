import {AppDataSource} from "../../src/db/data-sources";
import {Station} from "../../src/models/Station";
import {
    countStations,
    getAllStations,
    getPaginatedSearchedStations,
    getPaginatedStations,
    getStationByID
} from "../../src/controllers/stations";
import {Journey} from "../../src/models/Journey";
import {count_stations_instances} from "../helpers";

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

describe("Test stations controller countStations", () =>{
    test("Test that the response is correct", async() =>{
        const spy = jest.spyOn(Station, 'countTotal')
        const totalStations = await countStations()
        const expectedTotalStations = await count_stations_instances()
        expect(spy).toHaveBeenCalled()
        expect(totalStations).toEqual(expectedTotalStations)
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

describe("test stations controller getPaginatedSearchedStations", () => {
    it.each([[5,1,"A"], [0,5, "L"], [0,12, ""], [0, 1,"Kirkko"]])
    ("Test with valid numeric and search values: akip %d, take %d and begin witth %s", async(skip, take, patternName)=>{
        const spy = jest.spyOn(Station, 'getPaginatedStationsForSearch')
        const result: Station[] = await getPaginatedSearchedStations(skip, take, patternName)
        expect(spy).toHaveBeenCalled()
        expect(spy).toBeCalledTimes(1)
        expect(result).toHaveLength(take)
        result.forEach((element) => {
            expect(element).toBeInstanceOf(Station)
        })
    })
    it.each([[0,5,"A2", 0], [0,2,"true", 0]])
    ("Test with search input that returns less journeys than the take require: skip %d take %d search %s, %s expected %d", async(skip, take, patternName, expectedLength)=>{
        const spy = jest.spyOn(Station, "getPaginatedStationsForSearch")
        const result:Station[] = await getPaginatedSearchedStations(skip, take, patternName)
        expect(spy).toHaveBeenCalled()
        expect(spy).toBeCalledTimes(1)
        expect(result).toHaveLength(expectedLength)
        result.forEach((element) => {
            expect(element).toBeInstanceOf(Station)
        })
    })
    test("Test skip at limit of range", async() => {
        const patternName:string = "K"
        const spy = jest.spyOn(Station, 'getPaginatedStationsForSearch')
        const totalStations = await Station.countStationForSearch(patternName)
        const skip: number = totalStations-2
        const result: Station[] = await getPaginatedSearchedStations(skip, 9, patternName)
        expect(spy).toHaveBeenCalled()
        expect(spy).toBeCalledTimes(1)
        expect(result).toHaveLength(totalStations-skip)
        result.forEach((element)=>{
            expect(element).toBeInstanceOf(Station)
        })
    })
    it.each([[0,-1, "A"], [0,0,"K"], [2,0,""], [-1,5,"Kirkko"], [-2,1,"A"], [-3,0, ""]])
    ("Test with invalid numeric values: skip %d and take %d beginning with %s", async (skip, take, patternName)=>{
        const spy = jest.spyOn(Station, 'getPaginatedStationsForSearch');
        await expect(getPaginatedSearchedStations(skip, take, patternName)).rejects.toThrowError(RangeError)
        expect(spy).toHaveBeenCalled()
        expect(spy).toBeCalledTimes(1)
    })
    it.each([[0, NaN, ""], [5, NaN, "A"], [NaN, 1, "A"], [NaN, 10,""], [NaN,NaN, "La"]])("Test with NaN value", async (skip, take, patternName)=>{
        const spy = jest.spyOn(Journey, 'getPaginatedJourneysForSearch');
        await expect(getPaginatedSearchedStations(skip, take, patternName)).rejects.toThrowError(TypeError)
        expect(spy).not.toHaveBeenCalled()
    })
})
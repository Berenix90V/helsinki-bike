import {
    countTotalJourneys,
    getAllJourneys,
    getNumberOfJourneysFromStation,
    getNumberOfJourneysToStation,
    getJourneysWithDepartureStationStartingWith, countJourneysWithDepartureStationStartingWith
} from "../../src/controllers/journeys";
import {Journey} from "../../src/models/Journey";
import {AppDataSource} from "../../src/db/data-sources";
import {count_journeys_departure_station_starting_with, count_journeys_instances} from "../helpers";

beforeEach(async ()=>{
    await AppDataSource.initialize()
} )

afterEach(async ()=>{
    await AppDataSource.destroy()
})

describe("Test journey controller: getAllJourneys", () => {
    it.each([[0,1], [0,5], [0,12], [5, 1], [5, 10], [103, 1], [103, 7]])
    ("Test with valid numeric values: skip %d and take %d", async (skip, take)=>{
        const spy = jest.spyOn(Journey, 'getPaginatedJourneys');
        const result: Journey[] =  await getAllJourneys(skip, take)
        expect(spy).toHaveBeenCalled()
        expect(spy).toBeCalledTimes(1)
        expect(result).toHaveLength(take)
        result.forEach((element) => {
            expect(element).toBeInstanceOf(Journey)
        })
    })
    test("Test skip at limit of range", async() => {
        const spy = jest.spyOn(Journey, 'getPaginatedJourneys');
        const totalJourneys:number = await Journey.countTotal()
        const skip:number = totalJourneys-2
        const result: Journey[] =  await getAllJourneys(skip, 9)
        expect(spy).toHaveBeenCalled()
        expect(spy).toBeCalledTimes(1)
        expect(result).toHaveLength(totalJourneys-skip)
        result.forEach((element) => {
            expect(element).toBeInstanceOf(Journey)
        })
    })
    it.each([[0,-1], [0,-5], [0,0], [2,0], [-1, 5], [-2,1], [-3,0]])
    ("Test with invalid numeric values: skip %d and take %d", async (skip, take)=>{
        const spy = jest.spyOn(Journey, 'getPaginatedJourneys');
        await expect(getAllJourneys(skip, take)).rejects.toThrowError(RangeError)
        expect(spy).toHaveBeenCalled()
        expect(spy).toBeCalledTimes(1)
    })
    it.each([[0, NaN], [5, NaN], [NaN, 1], [NaN, 10], [NaN,NaN]])("Test with NaN value", async (skip, take)=>{
        const spy = jest.spyOn(Journey, 'getPaginatedJourneys');
        await expect(getAllJourneys(skip, take)).rejects.toThrowError(TypeError)
        expect(spy).not.toHaveBeenCalled()
    })
})

describe("Test journey controller: countTotalJourneys", () => {
    test("Test that it returns the correct count of journeys", async() => {
        const totalJourneys:number = await countTotalJourneys()
        const expectedTotalJourneys:number = await count_journeys_instances()
        expect(totalJourneys).toEqual(expectedTotalJourneys)
    })
})

describe("Test journey controller: getNumberOfJourneysFromStation", () => {
    it.each([[1, 23800], [503, 3232]])("Test with valid inputs: station ID %d", async(id, nJourneys) => {
        const spy = jest.spyOn(Journey, 'getNumberOfJourneysFromStation')
        const res:number = await getNumberOfJourneysFromStation(id)
        expect(spy).toHaveBeenCalled()
        expect(spy).toBeCalledTimes(1)
        expect(res).toEqual(nJourneys)
    })
    it.each([[-1], [-5]])("Test with invalid numeric inputs, station ID %d", async(id)=>{
        const spy = jest.spyOn(Journey, 'getNumberOfJourneysFromStation')
        await expect(getNumberOfJourneysFromStation(id)).rejects.toThrowError(RangeError)
        expect(spy).toHaveBeenCalled()
        expect(spy).toBeCalledTimes(1)
    })
    it.each([[502, 0], [2000, 0]])("Test with not existent stations, station ID %d", async(id, nJourneys )=>{
        const spy = jest.spyOn(Journey, 'getNumberOfJourneysFromStation')
        const res: number = await getNumberOfJourneysFromStation(id)
        expect(spy).toHaveBeenCalled()
        expect(spy).toBeCalledTimes(1)
        expect(res).toEqual(nJourneys)
    })
})

describe("Test journey controller: getNumberOfJourneysToStation", () => {
    it.each([[1, 24288], [503, 3144]])("Test with invalid inputs: station ID %d", async(id, nJourneys) => {
        const spy = jest.spyOn(Journey, 'getNumberOfJourneysToStation')
        const res: number = await getNumberOfJourneysToStation(id)
        expect(spy).toHaveBeenCalled()
        expect(spy).toBeCalledTimes(1)
        expect(res).toEqual(nJourneys)
    })
    it.each([[-1], [-5]])("Test with invalid numeric inputs: station ID %d", async(id)=>{
        const spy = jest.spyOn(Journey, 'getNumberOfJourneysToStation')
        await expect(getNumberOfJourneysToStation(id)).rejects.toThrowError(RangeError)
        expect(spy).toHaveBeenCalled()
        expect(spy).toBeCalledTimes(1)
    })
    it.each([[502, 0], [2000, 0]])("Test with not existent stations: station ID %d", async(id, nJourneys )=>{
        const spy = jest.spyOn(Journey, 'getNumberOfJourneysToStation')
        const res:number = await getNumberOfJourneysToStation(id)
        expect(spy).toHaveBeenCalled()
        expect(spy).toBeCalledTimes(1)
        expect(res).toEqual(nJourneys)
    })
})

describe("Test journey controller: getJourneysWithDepartureStationStartingWith", () => {
    it.each([[0,1, "A"], [0,5, "Kirkko"], [0,12, "A"], [5, 1, "Ki"], [5, 10, "A"], [103, 1, "La"], [103, 7, "A"]])
    ("Test with valid numeric values: skip %d and take %d", async (skip, take, pattern)=>{
        const spy = jest.spyOn(Journey, 'getPaginatedJourneysWithDepartureStationNameStartingWith');
        const result: Journey[] =  await getJourneysWithDepartureStationStartingWith(skip, take, pattern)
        expect(spy).toHaveBeenCalled()
        expect(spy).toBeCalledTimes(1)
        expect(result).toHaveLength(take)
        result.forEach((element) => {
            expect(element).toBeInstanceOf(Journey)
        })
    })
    it.each([[0, 5, "A2", 0]])
    ("Test with search input that returns less journeys than the take require: skip %d take 5d search %s expectec %d", async(skip, take, pattern, expectedLength)=>{
        const spy = jest.spyOn(Journey, 'getPaginatedJourneysWithDepartureStationNameStartingWith');
        const result: Journey[] =  await getJourneysWithDepartureStationStartingWith(skip, take, pattern)
        expect(spy).toHaveBeenCalled()
        expect(spy).toBeCalledTimes(1)
        expect(result).toHaveLength(expectedLength)
        result.forEach((element) => {
            expect(element).toBeInstanceOf(Journey)
        })
    })
    test("Test skip at limit of range", async() => {
        const pattern:string = "A"
        const spy = jest.spyOn(Journey, 'getPaginatedJourneysWithDepartureStationNameStartingWith');
        const totalJourneys:number = await Journey.countJourneysFromStationNameLike(pattern)
        const skip:number = totalJourneys-2
        const result: Journey[] =  await getJourneysWithDepartureStationStartingWith(skip, 9, pattern)
        expect(spy).toHaveBeenCalled()
        expect(spy).toBeCalledTimes(1)
        expect(result).toHaveLength(totalJourneys-skip)
        result.forEach((element) => {
            expect(element).toBeInstanceOf(Journey)
        })
    })
    it.each([[0,-1, "A"], [0,-5, "Kirkko"], [0,0, "La"], [2,0,"A"], [-1, 5, "A"], [-2,1, "Kirkko"], [-3,0, "Kirkko"]])
    ("Test with invalid numeric values: skip %d and take %d", async (skip, take, pattern)=>{
        const spy = jest.spyOn(Journey, 'getPaginatedJourneysWithDepartureStationNameStartingWith');
        await expect(getJourneysWithDepartureStationStartingWith(skip, take, pattern)).rejects.toThrowError(RangeError)
        expect(spy).toHaveBeenCalled()
        expect(spy).toBeCalledTimes(1)
    })
    it.each([[0, NaN], [5, NaN], [NaN, 1], [NaN, 10], [NaN,NaN]])("Test with NaN value", async (skip, take)=>{
        const spy = jest.spyOn(Journey, 'getPaginatedJourneys');
        await expect(getAllJourneys(skip, take)).rejects.toThrowError(TypeError)
        expect(spy).not.toHaveBeenCalled()
    })

})

describe("Test journey controller: countJourneysWithDepartureStationStartingWith", ()=>{
    it.each([["A"], ["Kirkko"], ["La"], ["A2"]])("Test response to be correct for departure station starting with %s", async(pattern:string) =>{
        const expectedCountJourneys = await count_journeys_departure_station_starting_with(pattern)
        const countJourneys = await countJourneysWithDepartureStationStartingWith(pattern)
    })
})
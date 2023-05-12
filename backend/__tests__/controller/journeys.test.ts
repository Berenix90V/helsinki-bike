import {
    countTotalJourneys,
    getAllJourneys,
    getNumberOfJourneysFromStation,
    getNumberOfJourneysToStation,
    getPaginatedJourneysForSearch, countJourneysForSearch, getAvgDistanceJourneysFrom, getAvgDistanceJourneysTo
} from "../../src/controllers/journeys";
import {Journey} from "../../src/models/Journey";
import {AppDataSource} from "../../src/db/data-sources";
import {
    avg_distance_journeys_from_station,
    avg_distance_journeys_to_station,
    count_journeys_for_search,
    count_journeys_instances
} from "../helpers";

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

describe("Test journey controller: getPaginatedJourneysForSearch", () => {
    it.each([[0,1, "A", ""], [0,5, "", "Kirkko"], [0,12, "", ""], [5, 1, "A", "K"], [5, 10, "La", "A"], [103, 1, "Kirkko", ""], [103, 7, "", "A"]])
    ("Test with valid numeric values: skip %d and take %d and search departure start with %s and return %s", async (skip, take, patternDepartureStation, patternReturnStation)=>{
        const spy = jest.spyOn(Journey, 'getPaginatedJourneysForSearch');
        const result: Journey[] =  await getPaginatedJourneysForSearch(skip, take, patternDepartureStation, patternReturnStation)
        expect(spy).toHaveBeenCalled()
        expect(spy).toBeCalledTimes(1)
        expect(result).toHaveLength(take)
        result.forEach((element) => {
            expect(element).toBeInstanceOf(Journey)
        })
    })
    it.each([[0, 5, "A2", "", 0]])
    ("Test with search input that returns less journeys than the take require: skip %d take 5d search %s, %s expected %d", async(skip, take, patternDepartureStation, patternReturnStation, expectedLength)=>{
        const spy = jest.spyOn(Journey, 'getPaginatedJourneysForSearch');
        const result: Journey[] =  await getPaginatedJourneysForSearch(skip, take, patternDepartureStation, patternReturnStation)
        expect(spy).toHaveBeenCalled()
        expect(spy).toBeCalledTimes(1)
        expect(result).toHaveLength(expectedLength)
        result.forEach((element) => {
            expect(element).toBeInstanceOf(Journey)
        })
    })
    test("Test skip at limit of range", async() => {
        const patternDepartureStation:string = "A"
        const patternReturnStation:string = "K"
        const spy = jest.spyOn(Journey, 'getPaginatedJourneysForSearch');
        const totalJourneys:number = await Journey.countJourneysForSearch(patternDepartureStation, patternReturnStation)
        const skip:number = totalJourneys-2
        const result: Journey[] =  await getPaginatedJourneysForSearch(skip, 9, patternDepartureStation, patternReturnStation)
        expect(spy).toHaveBeenCalled()
        expect(spy).toBeCalledTimes(1)
        expect(result).toHaveLength(totalJourneys-skip)
        result.forEach((element) => {
            expect(element).toBeInstanceOf(Journey)
        })
    })
    it.each([[0,-1, "A", ""], [0,-5, "", "Kirkko"], [0,0, "La", "A"], [2,0,"A", "Ki"], [-1, 5, "", ""], [-2,1, "Kirkko", "A"], [-3,0, "A", "Kirkko"]])
    ("Test with invalid numeric values: skip %d and take %d", async (skip, take, patternDepartureStation, patternReturnStation)=>{
        const spy = jest.spyOn(Journey, 'getPaginatedJourneysForSearch');
        await expect(getPaginatedJourneysForSearch(skip, take, patternDepartureStation, patternReturnStation)).rejects.toThrowError(RangeError)
        expect(spy).toHaveBeenCalled()
        expect(spy).toBeCalledTimes(1)
    })
    it.each([[0, NaN, "", "A"], [5, NaN, "A", ""], [NaN, 1, "A", "K"], [NaN, 10,"", ""], [NaN,NaN, "La", ""]])("Test with NaN value", async (skip, take, patternDepartureStation, patternReturnStation)=>{
        const spy = jest.spyOn(Journey, 'getPaginatedJourneysForSearch');
        await expect(getPaginatedJourneysForSearch(skip, take, patternDepartureStation, patternReturnStation)).rejects.toThrowError(TypeError)
        expect(spy).not.toHaveBeenCalled()
    })

})

describe("Test journey controller: countJourneysWithDepartureStationStartingWith", ()=>{
    it.each([["A", ""], ["","Kirkko"], ["", ""], ["A2", "A"], ["A", "La"], ["A", "K"]])("Test response to be correct for search with departure start with %s and return %s", async(patternDepartureStation:string, patternReturnStation:string) =>{
        const expectedCountJourneys = await count_journeys_for_search(patternDepartureStation, patternReturnStation)
        const countJourneys = await countJourneysForSearch(patternDepartureStation, patternReturnStation)
        expect(countJourneys).toEqual(expectedCountJourneys)
    })
})

describe("Test journey controller: avgJourneysFrom", () => {
    it.each([[1], [503]])("Test with invalid inputs: station ID %d", async(id) => {
        const spy = jest.spyOn(Journey, 'getAverageDistanceFrom')
        const res: number = await getAvgDistanceJourneysFrom(id)
        const expectedAvg = await avg_distance_journeys_from_station(id)
        expect(spy).toHaveBeenCalled()
        expect(spy).toBeCalledTimes(1)
        expect(res).toEqual(expectedAvg)
    })
    it.each([[-1], [-5]])("Test with invalid numeric inputs: station ID %d", async(id)=>{
        const spy = jest.spyOn(Journey, 'getAverageDistanceFrom')
        await expect(getAvgDistanceJourneysFrom(id)).rejects.toThrowError(RangeError)
        expect(spy).toHaveBeenCalled()
        expect(spy).toBeCalledTimes(1)
    })
    test("Test with invalid NaN input", async()=>{
        const spy = jest.spyOn(Journey, 'getAverageDistanceFrom')
        await expect(getAvgDistanceJourneysFrom(NaN)).rejects.toThrowError(TypeError)
    })
    it.each([[502, 0], [2000, 0]])("Test with not existent stations: station ID %d", async(id, nJourneys )=>{
        const spy = jest.spyOn(Journey, 'getAverageDistanceFrom')
        const res:number = await getAvgDistanceJourneysFrom(id)
        expect(spy).toHaveBeenCalled()
        expect(spy).toBeCalledTimes(1)
        expect(res).toEqual(nJourneys)
    })
})

describe("Test journey controller: avgJourneysTo", () => {
    it.each([[1], [503]])("Test with invalid inputs: station ID %d", async(id) => {
        const spy = jest.spyOn(Journey, 'getAverageDistanceTo')
        const res: number = await getAvgDistanceJourneysTo(id)
        const expectedAvg = await avg_distance_journeys_to_station(id)
        expect(spy).toHaveBeenCalled()
        expect(spy).toBeCalledTimes(1)
        expect(res).toEqual(expectedAvg)
    })
    it.each([[-1], [-5]])("Test with invalid numeric inputs: station ID %d", async(id)=>{
        const spy = jest.spyOn(Journey, 'getAverageDistanceTo')
        await expect(getAvgDistanceJourneysTo(id)).rejects.toThrowError(RangeError)
        expect(spy).toHaveBeenCalled()
        expect(spy).toBeCalledTimes(1)
    })
    test("Test with invalid NaN input", async()=>{
        const spy = jest.spyOn(Journey, 'getAverageDistanceTo')
        await expect(getAvgDistanceJourneysTo(NaN)).rejects.toThrowError(TypeError)
    })
    it.each([[502, 0], [2000, 0]])("Test with not existent stations: station ID %d", async(id, nJourneys )=>{
        const spy = jest.spyOn(Journey, 'getAverageDistanceTo')
        const res:number = await getAvgDistanceJourneysTo(id)
        expect(spy).toHaveBeenCalled()
        expect(spy).toBeCalledTimes(1)
        expect(res).toEqual(nJourneys)
    })
})
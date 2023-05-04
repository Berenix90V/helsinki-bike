import {
    getAllJourneys,
    getNumberOfJourneysFromStation,
    getNumberOfJourneysToStation
} from "../../src/controllers/journeys";
import {Journey} from "../../src/models/Journey";
import {AppDataSource} from "../../src/db/data-sources";

beforeEach(async ()=>{
    await AppDataSource.initialize()
} )

afterEach(async ()=>{
    await AppDataSource.destroy()
})

describe("Test journey controller: getAllJourneys", () => {
    it.each([[1], [5], [12]])("Test with valid numeric values: get first %d", async (n)=>{
        const spy = jest.spyOn(Journey, 'fetchFirstNJourneys');
        const result =  await getAllJourneys(n)
        expect(spy).toHaveBeenCalled()
        expect(spy).toBeCalledTimes(1)
        expect(result).toHaveLength(n)
        result.forEach((element) => {
            expect(element).toBeInstanceOf(Journey)
        })
    })
    it.each([[-1], [-5], [0]])("Test with invalid numeric values: get first %d", async (n)=>{
        const spy = jest.spyOn(Journey, 'fetchFirstNJourneys');
        await expect(getAllJourneys(n)).rejects.toThrowError(RangeError)
        expect(spy).toHaveBeenCalled()
        expect(spy).toBeCalledTimes(1)
    })
    test("Test with NaN value", async ()=>{
        const spy = jest.spyOn(Journey, 'fetchFirstNJourneys');
        await expect(getAllJourneys(NaN)).rejects.toThrowError(TypeError)
        expect(spy).not.toHaveBeenCalled()
    })
})

describe("Test journey controller: getNumberOfJourneysFromStation", () => {
    it.each([[1, 23800], [503, 3232]])("Test with valid inputs: station ID %d", async(id, nJourneys) => {
        const spy = jest.spyOn(Journey, 'getNumberOfJourneysFromStation')
        const res = await getNumberOfJourneysFromStation(id)
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
        const res = await getNumberOfJourneysFromStation(id)
        expect(spy).toHaveBeenCalled()
        expect(spy).toBeCalledTimes(1)
        expect(res).toEqual(nJourneys)
    })
})

describe("Test journey controller: getNumberOfJourneysToStation", () => {
    it.each([[1, 24288], [503, 3144]])("Test with invalid inputs: station ID %d", async(id, nJourneys) => {
        const spy = jest.spyOn(Journey, 'getNumberOfJourneysToStation')
        const res = await getNumberOfJourneysToStation(id)
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
        const res = await getNumberOfJourneysToStation(id)
        expect(spy).toHaveBeenCalled()
        expect(spy).toBeCalledTimes(1)
        expect(res).toEqual(nJourneys)
    })
})
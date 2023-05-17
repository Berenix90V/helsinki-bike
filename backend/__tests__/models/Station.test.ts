
import {AppDataSource} from "../../src/db/data-sources";
import {Station} from "../../src/models/Station";
import {
    count_stations_for_search,
    count_stations_instances,
    get_nth_station_id
} from "../helpers";

beforeEach(async ()=>{
    await AppDataSource.initialize()
} )

afterEach(async ()=>{
    await AppDataSource.destroy()
})

describe("Test station entity: countTotal", () => {
    test("Test that it returns the correct number of stations", async() => {
        const countStations: number = await Station.countTotal()
        const expectedCountStation: number = await count_stations_instances()
        expect(countStations).toEqual(expectedCountStation)
    })
})

describe("Test Station entity: getPaginatedStations", ()=>{

    it.each([[0,1],[0, 5], [0, 10], [2,3], [5,1], [5,7]])
    ("Test getPaginatedStations for valid input: skip %d stations and take %d stations", async(skip: number, take: number)=>{
        const result:Station[] = await Station.getPaginatedStations(skip, take)
        const firstStation: number = await get_nth_station_id(skip)
        const lastStation: number = await get_nth_station_id(skip + take-1)
        expect(result).toHaveLength(take)
        result.forEach((element) => {
            expect(element).toBeInstanceOf(Station)
        })
        expect(result[0].ID).toEqual(firstStation)
        expect(result[take-1].ID).toEqual(lastStation)
    })
    test("Test getPaginatedStations for valid input but borderline skip: skip total-n stations and take maximum 10 stations", async()=>{
        const totalStations = await Station.countTotal()
        const take = 10
        const skips: number[] = [totalStations-1, totalStations-6, totalStations-9]
        for(const skip of skips ){
            const result:Station[] = await Station.getPaginatedStations(skip, take)
            const takenStations:number = totalStations-skip
            const firstStation:number = await get_nth_station_id(skip)
            const lastStation:number = await get_nth_station_id(totalStations-1)
            expect(result).toHaveLength(takenStations)
            result.forEach((element: Station) => {
                expect(element).toBeInstanceOf(Station)
            })
            expect(result[0].ID).toEqual(firstStation)
            expect(result[takenStations-1].ID).toEqual(lastStation)
        }
    })
    it.each([[-1, 10], [-5,1], [50000000, 6]])
    ("Test getPaginatedStations for not valid skip value %d", async(skip: number, take: number)=>{
        await expect(Station.getPaginatedStations(skip, take)).rejects.toThrowError(RangeError)
    })
    it.each([[0, -1], [5, -2], [0,0]])
    ("Test getPaginatedJourneys for not valid take value %d", async(skip: number, take:number)=>{
        await expect(Station.getPaginatedStations(skip, take)).rejects.toThrowError(RangeError)
    })
})

describe("Test Station entity: fetchAll", () => {
    test("test fetchAll method", async() => {
        const result = await Station.fetchAll()
        const count = await count_stations_instances()
        expect(result).toHaveLength(count)
        result.forEach((element: Station) => {
            expect(element).toBeInstanceOf(Station)
        })
    })
})
describe("Test Station entity: getByID", () =>{
    it.each([[-5],[-1], [0]])("Test getByID method for not valid inputs: station id %d", async(id: number) => {
        await expect(Station.getByID(id)).rejects.toThrowError(RangeError("Bad request: The ID must be >= 0"))

    })
    it.each([[504], [5000], [2000]])("Test getByID method for not existent inputs: station id %d", async(id: number) => {
        await expect(Station.getByID(id)).rejects.toThrowError(RangeError("Not found"))
    })
    it.each([[1], [5], [10]])("Test getByID method for valid inputs: station id %d", async (id: number) =>{
        const result: Station = await Station.getByID(id)
        expect(result).toBeInstanceOf(Station)
        expect(result.ID).toEqual(id)
    })
})

describe("Test Station entity: countStationForSearch", ()=>{
    it.each([["A"], ["Keilalahti"], ["K"], ["2"], [""]])
    ("Test for valid patterns that returns correct count of journeys for search %s", async (patternName: string)=>{
        const countStations: number = await Station.countStationForSearch(patternName)
        const expectedNumberOfStations: number = await count_stations_for_search(patternName)
        expect(countStations).toEqual(expectedNumberOfStations)
    })
})

describe("Test Station entity: getPaginatedStationsForSearch", ()=>{
    it.each([[0,1, "A"],[0, 5, ""], [0, 10, "K"], [2,3, "L"], [5,1, "K"], [5,7, ""]])
    ("Test for valid input: skip %d stations and take %d stations with name starting with %s", async(skip: number, take: number, patternName: string)=>{
        const result:Station[] = await Station.getPaginatedStationsForSearch(skip, take, patternName)
        expect(result).toHaveLength(take)
        result.forEach((element: Station) => {
            expect(element).toBeInstanceOf(Station)
            expect(element.Name.startsWith(patternName)).toBeTruthy()
        })
    })
    test("Test for valid input but borderline skip: skip total-n stations and take maximum 10 stations", async()=>{
        const patternName = "A"
        const totalStations: number = await Station.countStationForSearch(patternName)
        const take = 10
        const skips: number[] = [totalStations-1, totalStations-6, totalStations-9]
        for(const skip of skips ){
            const result:Station[] = await Station.getPaginatedStationsForSearch(skip, take, patternName)
            const takenStations:number = totalStations-skip
            expect(result).toHaveLength(takenStations)
            result.forEach((element: Station) => {
                expect(element).toBeInstanceOf(Station)
                expect(element.Name.startsWith(patternName))
            })
        }
    })
    it.each([[-1, 10, "A"], [-5,1, "K"], [50000000, 6, ""]])
    ("Test for not valid skip value %d", async(skip: number, take:number, patternName: string)=>{
        await expect(Station.getPaginatedStationsForSearch(skip, take, patternName)).rejects.toThrowError(RangeError)
    })
    it.each([[0, -1, "A"], [5, -2, "La"], [0,0, ""]])
    ("Test for not valid take value %d", async(skip: number, take: number, patternName: string)=>{
        await expect(Station.getPaginatedStationsForSearch(skip, take, patternName)).rejects.toThrowError(RangeError)
    })
    it.each([[0,10, "345"], [0, 10, "abc"], [0, 5, "2"]])
    ("Test for not valid search: skip %d, take %d stations beginning with %s", async (skip: number, take: number, patternName: string) => {
       const stations: Station[] = await Station.getPaginatedStationsForSearch(skip, take, patternName)
        expect(stations).toHaveLength(0)
    })
})
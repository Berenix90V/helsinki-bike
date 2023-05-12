import {Journey} from "../../src/models/Journey";
import {AppDataSource} from "../../src/db/data-sources";
import {
    avg_distance_journeys_from_station,
    avg_distance_journeys_to_station,
    count_journeys_for_search,
    get_nth_journey_id
} from "../helpers";
import {Station} from "../../src/models/Station";

beforeEach(async ()=>{
    await AppDataSource.initialize()
} )

afterEach(async ()=>{
    await AppDataSource.destroy()
})

describe("Test Journey entity", () => {
    test("Test that the method returns the right value", async ()=>{
        const totalJourneys = await Journey.countTotal()
        expect(totalJourneys).toEqual(3126264)
    })
})

describe("Test Journey entity: fetchFirstNJourneys", ()=>{
    it.each([[10], [5], [1]])
    ("Test fetchFirstNJourneys for valid input: first %d journeys", async(n)=>{
        const result:Journey[] = await Journey.fetchFirstNJourneys(n)
        expect(result).toHaveLength(n)
        result.forEach((element) => {
            expect(element).toBeInstanceOf(Journey)
        })
    })
    it.each([[0], [-1], [-5]])
    ("Test fetchFirstNJourneys for not valid input: first %d journeys", async(n)=>{
        await expect(Journey.fetchFirstNJourneys(n)).rejects.toThrowError(RangeError)
    })
})

describe("Test Journey entity: getPaginatedJourneys", ()=>{

    it.each([[0,1],[0, 5], [0, 10], [2,3], [5,1], [5,7], [10003, 20]])
    ("Test getPaginatedJourneys for valid input: skip %d journeys and take %d journeys", async(skip, take)=>{
        const result:Journey[] = await Journey.getPaginatedJourneys(skip, take)
        const firstJourney = await get_nth_journey_id(skip)
        const lastJourney = await get_nth_journey_id(skip + take-1)
        expect(result).toHaveLength(take)
        result.forEach((element) => {
            expect(element).toBeInstanceOf(Journey)
        })
        expect(result[0].ID).toEqual(firstJourney)
        expect(result[take-1].ID).toEqual(lastJourney)
    })
    test("Test getPaginatedJourneys for valid input but borderline skip: skip total-n journeys and take maximum 10 journeys", async()=>{
        const totalJourneys = await Journey.countTotal()
        const take = 10
        const skips = [totalJourneys-1, totalJourneys-6, totalJourneys-9]
        for(const skip of skips ){
            const result:Journey[] = await Journey.getPaginatedJourneys(skip, take)
            const takenJourneys = totalJourneys-skip
            const firstJourney = await get_nth_journey_id(skip)
            const lastJourney = await get_nth_journey_id(totalJourneys-1)
            expect(result).toHaveLength(totalJourneys-skip)
            result.forEach((element) => {
                expect(element).toBeInstanceOf(Journey)
            })
            expect(result[0].ID).toEqual(firstJourney)
            expect(result[takenJourneys-1].ID).toEqual(lastJourney)
        }

    })
    it.each([[-1, 10], [-5,1], [50000000, 6]])
    ("Test getPaginatedJourneys for not valid skip value %d", async(skip, take)=>{
        await expect(Journey.getPaginatedJourneys(skip, take)).rejects.toThrowError(RangeError)
    })
    it.each([[0, -1], [5, -2], [0,0]])
    ("Test getPaginatedJourneys for not valid take value %d", async(skip, take)=>{
        await expect(Journey.getPaginatedJourneys(skip, take)).rejects.toThrowError(RangeError)
    })
})

describe("Test Journey entity: getNumberOfJourneysFromStation", () => {
    it.each([[0], [-2], [-10]])
    ("Test getNumberOfJourneysFromStation for not valid input: station id %d", async(id) => {
        await expect(Journey.getNumberOfJourneysFromStation(id)).rejects.toThrowError(RangeError)
    })
    it.each([[1, 23800], [503, 3232]])
    ("Test getNumberOfJourneysFromStation for valid input: station id %d", async(id, expectedNumberOfJourneys) => {
        const numberOfJourneys = await Journey.getNumberOfJourneysFromStation(id)
        expect(numberOfJourneys).toEqual(expectedNumberOfJourneys)
    })
    it.each([[504, 0], [1000, 0]])
    ("Test getNumberOfJourneysFromStation for not existent station: station id %d", async(id, expectedNumberOfJourneys) => {
        const numberOfJourneys = await Journey.getNumberOfJourneysFromStation(id)
        expect(numberOfJourneys).toEqual(expectedNumberOfJourneys)
    })
})

describe("Test Journey entity: getNumberOfJourneysToStation", () => {
    it.each([[0], [-2], [-10]])
    ("Test getNumberOfJourneysFromStation for not valid input: station id %d", async(id) => {
        await expect(Journey.getNumberOfJourneysToStation(id)).rejects.toThrowError(RangeError)
    })
    it.each([[1, 24288], [503, 3144]])
    ("Test getNumberOfJourneysFromStation for valid input: station id %d", async(id, expectedNumberOfJourneys) => {
        const numberOfJourneys = await Journey.getNumberOfJourneysToStation(id)
        expect(numberOfJourneys).toEqual(expectedNumberOfJourneys)
    })
    it.each([[504, 0], [1000, 0]])
    ("Test getNumberOfJourneysFromStation for not existent station: station id %d", async(id, expectedNumberOfJourneys) => {
        const numberOfJourney = await Journey.getNumberOfJourneysToStation(id)
        await expect(numberOfJourney).toEqual(expectedNumberOfJourneys)
    })
})

describe("Test Journey entity: countJourneysForSearch", ()=>{
    it.each([["A", ""], ["", "Keilalahti"], ["A", "K"], ["2", ""], ["", "2"], ["2", "2"], ["drop", ""], ["", "drop"]])
    ("Test for valid patterns that returns correct count of journeys for search %s, %s", async (patternDepartureStation, patternReturnStation)=>{
        const countJourneys: number = await Journey.countJourneysForSearch(patternDepartureStation, patternReturnStation)
        const expectedNumberOfJourneys = await count_journeys_for_search(patternDepartureStation, patternReturnStation)
        expect(countJourneys).toEqual(expectedNumberOfJourneys)
    })
})

describe("Test Journey entity: getPaginatedJourneysForSearch", ()=>{
    it.each([[0,1, "Kirkko", ""],[0, 5, "A", ""], [0, 10, "", "Ki"], [2,3, "", "K"], [5,1, "A", ""], [5,7, "La", ""], [500, 20, "", ""]])
    ("Test getPaginatedJourneys for valid inputs and Search giving a large number: skip %d journeys and take %d journeys with Departure station beginning with %s", async(skip, take, patternDepartureStation, patternReturnStation)=>{
        const result:Journey[] = await Journey.getPaginatedJourneysForSearch(skip, take, patternDepartureStation, patternReturnStation)
        expect(result).toHaveLength(take)
        result.forEach((element) => {
            expect(element).toBeInstanceOf(Journey)
            expect(element.Departure_station).toBeInstanceOf(Station)
            expect(element.Departure_station.Name.startsWith(patternDepartureStation)).toBeTruthy()
            expect(element.Return_station).toBeInstanceOf(Station)
            expect(element.Return_station.Name.startsWith(patternReturnStation)).toBeTruthy()
        })
    })
    test("Test getPaginatedJourneysForSearch for valid input but borderline skip: skip total-n journeys and take maximum 10 journeys", async()=>{
        const patternDepartureStation = "A"
        const patternReturnStation = "K"
        const totalJourneys = await count_journeys_for_search(patternDepartureStation, patternReturnStation)
        const take = 10
        const skips = [totalJourneys-1, totalJourneys-6, totalJourneys-9]
        for(const skip of skips ){
            const result:Journey[] = await Journey.getPaginatedJourneysForSearch(skip, take, patternDepartureStation, patternReturnStation)
            expect(result).toHaveLength(totalJourneys-skip)
            result.forEach((element) => {
                expect(element).toBeInstanceOf(Journey)
                expect(element.Departure_station).toBeInstanceOf(Station)
                expect(element.Departure_station.Name.startsWith(patternDepartureStation)).toBeTruthy()
                expect(element.Return_station).toBeInstanceOf(Station)
                expect(element.Return_station.Name.startsWith(patternReturnStation)).toBeTruthy()
            })
        }
    })
    it.each([[-1, 10, "A", ""], [-5,1,"", "Kirkko"], [-10,1,"", ""], [50000000, 6, "A", "K"]])
    ("Test getPaginatedJourneysForSearch for not valid skip value %d", async(skip, take, patternDepartureStation, patternReturnStation)=>{
        await expect(Journey.getPaginatedJourneysForSearch(skip, take, patternDepartureStation, patternReturnStation)).rejects.toThrowError(RangeError)
    })
    it.each([[0, -1, "A", ""], [5, -2, "", "A"], [4, -10, "", ""], [0,0, "","A"]])
    ("Test getPaginatedJourneysForSearch for not valid take value %d", async(skip, take, patternDepartureStation, patternReturnStation)=>{
        await expect(Journey.getPaginatedJourneysForSearch(skip, take, patternDepartureStation, patternReturnStation)).rejects.toThrowError(RangeError)
    })
    it.each([[0,10, "a2", ""], [0,10, "", "345"] ])("Test getPaginatedJourneysForSearch for not valid search", async(skip, take, patternDepartureStation, patternReturnStation,)=>{
        const journeys = await Journey.getPaginatedJourneysForSearch(skip, take, patternDepartureStation, patternReturnStation)
        expect(journeys).toHaveLength(0)
    })
})

describe("Test Journey entity: getAverageDistanceFrom", ()=>{
    it.each([[503], [1]])("Test with valid inputs", async(id:number)=>{
        const expectedAvg: number = await avg_distance_journeys_from_station(id)
        const avg: number = await Journey.getAverageDistanceFrom(id)
        expect(avg).toEqual(expectedAvg)
    })
    it.each([[-1], [0]])("Test with valid inputs", async(id:number)=>{
        await expect(Journey.getAverageDistanceFrom(id)).rejects.toThrowError(RangeError)
    })
    it.each([[502]])("Test with valid inputs but not existent station", async(id:number)=>{
        const avg: number = await Journey.getAverageDistanceFrom(id)
        expect(avg).toEqual(0)
    })
})

describe("Test Journey entity: getAverageDistanceTo", ()=>{
    it.each([[503], [1]])("Test with valid inputs", async(id:number)=>{
        const expectedAvg: number = await avg_distance_journeys_to_station(id)
        const avg: number = await Journey.getAverageDistanceTo(id)
        expect(avg).toEqual(expectedAvg)
    })
    it.each([[-1], [0]])("Test with valid inputs", async(id:number)=>{
        await expect(Journey.getAverageDistanceTo(id)).rejects.toThrowError(RangeError)
    })
    it.each([[502]])("Test with valid inputs but not existent station", async(id:number)=>{
        const avg: number = await Journey.getAverageDistanceTo(id)
        expect(avg).toEqual(0)
    })
})
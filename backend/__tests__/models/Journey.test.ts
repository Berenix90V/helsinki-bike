import {Journey} from "../../src/models/Journey";
import {AppDataSource} from "../../src/db/data-sources";
import {get_nth_journey_id} from "../helpers";

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
import {Journey} from "../../src/models/Journey";
import {AppDataSource} from "../../src/db/data-sources";

beforeEach(async ()=>{
    await AppDataSource.initialize()
} )

afterEach(async ()=>{
    await AppDataSource.destroy()
})

describe("Test Journey entity: fetchFirstNJourneys", ()=>{
    it.each([[10], [5], [1]])
    ("Test fetchFirstNJourneys for valid input", async(n)=>{
        const result:Journey[] = await Journey.fetchFirstNJourneys(n)
        expect(result).toHaveLength(n)
        result.forEach((element) => {
            expect(element).toBeInstanceOf(Journey)
        })
    })
    it.each([[0], [-1], [-5]])
    ("Test fetchFirstNJourneys for not valid input", async(n)=>{
        await expect(Journey.fetchFirstNJourneys(n)).rejects.toThrowError(RangeError)
    })
})

describe("Test Journey entity: getNumberOfJourneysFromStation", () => {
    it.each([[0], [-2], [-10]])
    ("Test getNumberOfJourneysFromStation for not valid input", async(id) => {
        await expect(Journey.getNumberOfJourneysFromStation(id)).rejects.toThrowError(RangeError)
    })
    it.each([[1, 23800], [503, 3232]])
    ("Test getNumberOfJourneysFromStation for valid input", async(id, expectedNumberOfJourneys) => {
        const numberOfJourneys = await Journey.getNumberOfJourneysFromStation(id)
        expect(numberOfJourneys).toEqual(expectedNumberOfJourneys)
    })
    it.each([[504, 0], [1000, 0]])
    ("Test getNumberOfJourneysFromStation for not existent station", async(id, expectedNumberOfJourneys) => {
        const numberOfJourneys = await Journey.getNumberOfJourneysFromStation(id)
        expect(numberOfJourneys).toEqual(expectedNumberOfJourneys)
    })
})

describe("Test Journey entity: getNumberOfJourneysToStation", () => {
    it.each([[0], [-2], [-10]])
    ("Test getNumberOfJourneysFromStation for not valid input", async(id) => {
        await expect(Journey.getNumberOfJourneysToStation(id)).rejects.toThrowError(RangeError)
    })
    it.each([[1, 24288], [503, 3144]])
    ("Test getNumberOfJourneysFromStation for valid input", async(id, expectedNumberOfJourneys) => {
        const numberOfJourneys = await Journey.getNumberOfJourneysToStation(id)
        expect(numberOfJourneys).toEqual(expectedNumberOfJourneys)
    })
    it.each([[504, 0], [1000, 0]])
    ("Test getNumberOfJourneysFromStation for not existent station", async(id, expectedNumberOfJourneys) => {
        const numberOfJourney = await Journey.getNumberOfJourneysToStation(id)
        await expect(numberOfJourney).toEqual(expectedNumberOfJourneys)
    })
})
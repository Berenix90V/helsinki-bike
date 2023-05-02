import {Journey} from "../../src/models/Journey";
import {AppDataSource} from "../../src/db/data-sources";

beforeEach(async ()=>{
    await AppDataSource.initialize()
} )

afterEach(async ()=>{
    await AppDataSource.destroy()
})

describe("test Journey entity", ()=>{
    it.each([[10], [5], [1]])("Test fetchFirstNJourneys for valid input", async(n)=>{
        const result:Journey[] = await Journey.fetchFirstNJourneys(n)
        expect(result).toHaveLength(n)
        result.forEach((element) => {
            expect(element).toBeInstanceOf(Journey)
        })
    })
    it.each([[0], [-1], [-5]])("Test fetchFirstNJourneys for not valid input", async(n)=>{
        await expect(Journey.fetchFirstNJourneys(n)).rejects.toThrowError(RangeError)
    })
})
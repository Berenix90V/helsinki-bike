import {getAllJourneys} from "../../src/controllers/journeys";
import {Journey} from "../../src/models/Journey";
import {AppDataSource} from "../../src/db/data-sources";

beforeEach(async ()=>{
    await AppDataSource.initialize()
} )

afterEach(async ()=>{
    await AppDataSource.destroy()
})

describe("Test journey controller: getAllJourneys", () => {
    it.each([[1], [5], [12]])("Test with valid numeric values", async (n)=>{
        const spy = jest.spyOn(Journey, 'fetchFirstNJourneys');
        const result =  await getAllJourneys(n)
        expect(spy).toHaveBeenCalled()
        expect(spy).toBeCalledTimes(1)
        expect(result).toHaveLength(n)
        result.forEach((element) => {
            expect(element).toBeInstanceOf(Journey)
        })
    })
    it.each([[-1], [-5], [0]])("Test with invalid numeric values", async (n)=>{
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
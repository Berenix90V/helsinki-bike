
import {AppDataSource} from "../../src/db/data-sources";
import {Station} from "../../src/models/Station";
import {count_stations_instances} from "../helpers";

beforeEach(async ()=>{
    await AppDataSource.initialize()
} )

afterEach(async ()=>{
    await AppDataSource.destroy()
})

describe("Test Station entity", () => {
    test("test fetchAll method", async() => {
        const result = await Station.fetchAll()
        const count = await count_stations_instances()
        expect(result).toHaveLength(count)
        result.forEach((element) => {
            expect(element).toBeInstanceOf(Station)
        })
    })
    it.each([[-5],[-1], [0]])("Test getByID method for not valid inputs", async(id) => {
        await expect(Station.getByID(id)).rejects.toThrowError(RangeError("Bad request: The ID must be >= 0"))

    })
    it.each([[504], [5000], [2000]])("Test getByID method for not existent inputs", async(id) => {
        await expect(Station.getByID(id)).rejects.toThrowError(RangeError("Not found"))
    })
    it.each([[1], [5], [10]])("Test getByID method for valid inputs", async (id) =>{
        const result = await Station.getByID(id)
        expect(result).toBeInstanceOf(Station)
        expect(result.ID).toEqual(id)
    })
})
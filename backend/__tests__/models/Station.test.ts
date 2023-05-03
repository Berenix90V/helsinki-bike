
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
})
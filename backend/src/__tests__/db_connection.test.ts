import {AppDataSource} from "../db/data-sources";

describe("Test database connection", ()=>{
    test("Initialize AppDataSource", async()=>{
        await expect(AppDataSource.initialize()).resolves.not.toThrowError()
    })
})
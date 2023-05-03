import {AppDataSource} from "../../src/db/data-sources";
import request from "supertest";
import app from "../../src";

beforeEach(async ()=>{
    await AppDataSource.initialize()
} )

afterEach(async ()=>{
    await AppDataSource.destroy()
})

const expectStation = expect.objectContaining({
    ID: expect.any(Number),
    Name_fi: expect.any(String),
    Name_sw: expect.any(String),
    Name: expect.any(String),
    Address_fi: expect.any(String),
    Address_sw: expect.any(String),
    City_fi: expect.any(String),
    City_sw: expect.any(String),
    Operator: expect.any(String),
    Capacity: expect.any(Number),
    x: expect.any(Number),
    y: expect.any(Number)
})

describe("Get all stations route", () => {
    test("Test api returns all stations", async()=>{
        const res = await request(app).get("/api/v1/stations")
        expect(res.statusCode).toBe(200)
        expect(res.body).toHaveProperty('stations')
        // @ts-ignore
        res.body.stations.forEach((element) => {
            expect(element).toEqual(expectStation)
        })
    })
})
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

describe("Test get all stations route", () => {
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

describe("Test get station by ID route", () => {
    it.each([["d", 400], ["abc", 400], [true, 400], [-2, 400], [0, 400], [1, 200], [501, 200], [504, 404], [2000, 404]])
    ("Test correct status code for station %d required", async (id:any, statusCode:number) => {
        const res = await request(app).get("/api/v1/stations/"+id)
        expect(res.statusCode).toEqual(statusCode)
    })
    it.each([[1], [501]])("Test response for station %d required", async(id) =>{
        const res = await request(app).get("/api/v1/stations/"+id)
        expect(res.body).toHaveProperty('station')
        expect(res.body.station).toEqual(expectStation)
        expect(res.body.station.ID).toEqual(id)
    })


})
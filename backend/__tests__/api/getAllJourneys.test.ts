import app from "../../src/index"
import {AppDataSource} from "../../src/db/data-sources";
import request from "supertest";

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
const expectJourney = expect.objectContaining({
    ID: expect.any(Number),
    Departure_datetime: expect.any(String),
    Return_datetime: expect.any(String),
    Covered_distance: expect.any(Number),
    Duration: expect.any(Number),
    Departure_station: expectStation,
    Return_station: expectStation
})

describe("Get all journeys route", () =>{
    it.each([[-2, 400], [0, 400], [1, 200], [10, 200], [50, 200], [100, 200]])
    ("GET /journeys when the first %d journeys are required", async(take:number, statusCode:number) =>{
        const res = await request(app).get('/api/v1/journeys/?take=' + take)
        expect(res.statusCode).toBe(statusCode)
        if(statusCode == 200) {
            expect(res.body).toHaveProperty('journeys')
            expect(res.body.journeys).toHaveLength(take)
            // @ts-ignore
            res.body.journeys.forEach((element) => {expect(element).toEqual(expectJourney)})
        }
    })
})


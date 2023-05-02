import app from "../../src/index"
import {AppDataSource} from "../../src/db/data-sources";
import request from "supertest";

beforeEach(async ()=>{
    await AppDataSource.initialize()
} )

afterEach(async ()=>{
    await AppDataSource.destroy()
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
            res.body.journeys.forEach((element) => {expect(element).toEqual(
                expect.objectContaining({
                    ID: expect.any(Number),
                    Departure_datetime: expect.any(String),
                    Return_datetime: expect.any(String),
                    Departure_station_ID: expect.any(Number),
                    Return_station_ID: expect.any(Number),
                    Covered_distance: expect.any(Number),
                    Duration: expect.any(Number)
                })
            )})
        }
    })
})


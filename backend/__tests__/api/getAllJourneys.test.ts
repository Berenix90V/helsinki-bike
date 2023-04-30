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
    ("GET /journeys", async(take:number, statusCode:number) =>{
        const res = await request(app).get('/api/v1/journeys/?take=' + take)
        expect(res.statusCode).toBe(statusCode)
    })
})


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

describe("GET /journeys/?take route", () =>{
    it.each([["abc", 400],[true, 400],[-2, 400], [0, 400], [1, 200], [10, 200], [50, 200], [100, 200]])
    ("Test status code when the first %d journeys are required", async(take:any, statusCode:number) =>{
        const res = await request(app).get('/api/v1/journeys/?take=' + take)
        expect(res.statusCode).toBe(statusCode)
    })
    it.each([[1], [10], [50], [100]])
    ("Test response when the first %d journeys are required", async(take:number)=> {
        const res = await request(app).get('/api/v1/journeys/?take=' + take)
        expect(res.body).toHaveProperty('journeys')
        expect(res.body.journeys).toHaveLength(take)
        // @ts-ignore
        res.body.journeys.forEach((element) => {expect(element).toEqual(expectJourney)})
    } )
})

describe("GET /journeys/from/:id", ()=>{
    it.each([["abc", 400],[true, 400],[-2, 400], [0, 400], [1, 200], [503, 200], [5000, 200]])
    ("Test status code for trips from station %d", async(id, statusCode)=>{
        const res = await request(app).get('/api/v1/journeys/from/' + id)
        expect(res.statusCode).toBe(statusCode)
    })
    it.each([[1, 23800], [503, 3232], [5000, 0]])
    ("Test response for trips from station %d", async(id: number, njourneys:number)=>{
        const res = await request(app).get('/api/v1/journeys/from/' + id)
        expect(res.body).toHaveProperty('njourneys')
        expect(res.body.njourneys).toEqual(njourneys)
    })
})

describe("GET /journeys/to/:id", ()=>{
    it.each([["abc", 400],[true, 400],[-2, 400], [0, 400], [1, 200], [503, 200], [5000, 200]])
    ("Test status code for trips from station %d", async(id, statusCode)=>{
        const res = await request(app).get('/api/v1/journeys/to/' + id)
        expect(res.statusCode).toBe(statusCode)
    })
    it.each([[1, 24288], [503, 3144], [5000, 0]])
    ("Test response for trips from station %d", async(id: number, njourneys:number)=>{
        const res = await request(app).get('/api/v1/journeys/to/' + id)
        expect(res.body).toHaveProperty('njourneys')
        expect(res.body.njourneys).toEqual(njourneys)
    })
})


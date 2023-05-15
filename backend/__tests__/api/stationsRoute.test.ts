import {AppDataSource} from "../../src/db/data-sources";
import request from "supertest";
import app from "../../src";
import {count_stations_instances, get_nth_station_id} from "../helpers";
import {countSearchedStations} from "../../src/controllers/stations";

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

describe("GET /stations/count/search/ route", ()=>{
    it.each([[""], ["A"], ["Kirkko"], ["La"], ["2"]])("Test count station for station name beginning with %s", async(patternName:string)=>{
        const countStations:number = await countSearchedStations(patternName)
        const res = await request(app).get("/api/v1/stations/count/search/?patternName="+patternName)
        expect(res.statusCode).toBe(200)
        expect(res.body).toHaveProperty('count')
        expect(res.body.count).toEqual(countStations)
    })
})

describe("GET /stations/?take=&skip= route", ()=>{
    it.each([["abc", 2, 400],[true, 3, 400],[-2, 1, 400], [5000000, 2, 400], [0, 1, 200], [2, "abc", 400], [3, false, 400], [5, -3, 400], [2, 10, 200], [3, 50, 200], [5, 100, 200]])
    ("Test status code when the %d stations are skipped and %d are required", async(skip, take, statusCode:number) =>{
        const res = await request(app).get('/api/v1/stations/?skip='+skip+'&take='+take)
        expect(res.statusCode).toBe(statusCode)
    })
    it.each([[0, 1], [0, 10], [5, 1], [5, 8], [23, 15]])("Test response when %d stations are skipped and %d are required", async(skip, take)=>{
        const res = await request(app).get('/api/v1/stations/?skip='+skip+'&take=' + take)
        const firstStationID: number = await get_nth_station_id(skip)
        const lastStationID: number = await get_nth_station_id(skip+take-1)
        expect(res.body).toHaveProperty('stations')
        expect(res.body.stations).toHaveLength(take)
        // @ts-ignore
        res.body.stations.forEach((element) => {expect(element).toEqual(expectStation)})
        const stations = res.body.stations
        expect(stations[0].ID).toEqual(firstStationID)
        expect(stations[take-1].ID).toEqual(lastStationID)
    })
    test("Test response for border line skip: skip totalStations-n stations and take 10", async()=>{
        const totalStations = await count_stations_instances()
        const skip = totalStations-3
        const take = 10
        const firstStationID = await get_nth_station_id(skip)
        const lastStationID = await get_nth_station_id(totalStations-1)
        const res = await request(app).get('/api/v1/stations/?skip='+skip+'&take=' + take)
        expect(res.body).toHaveProperty('stations')
        expect(res.body.stations).toHaveLength(totalStations-skip)
        // @ts-ignore
        res.body.stations.forEach((element) => {expect(element).toEqual(expectStation)})
        expect(res.body.stations[0].ID).toEqual(firstStationID)
        expect(res.body.stations[totalStations-skip-1].ID).toEqual(lastStationID)
    })
})

describe("GET /stations/search/ Test station search", ()=>{
    it.each([["abc", 2, "", 400],[true, 3, "A", 400],[-2, 1, "L", 400], [5000000, 2, "", 400], [0, 1, "Kirkko", 200], [2, "abc", "", 400], [3, false, "La", 400], [5, -3, "", 400], [2, 10, "M", 200], [3, 50, "", 200], [5, 100, "", 200]])
    ("Test status code when the %d stations are skipped and %d are required for station search %s", async(skip, take, patternName: string, statusCode:number) =>{
        const res = await request(app).get('/api/v1/stations/?skip='+skip+'&take='+take+ '&patternName='+patternName)
        expect(res.statusCode).toBe(statusCode)
    })
    it.each([[0, 1, "Kirkko"], [0, 10, "La"], [5, 1, "A"], [5, 8, "L"], [23, 15, ""]])("Test response when %d stations are skipped and %d are required for station search %s", async(skip:number, take:number, patternName:string)=>{
        const res = await request(app).get('/api/v1/stations/search/?skip='+skip+'&take=' + take + '&patternName='+patternName)
        expect(res.body).toHaveProperty('stations')
        expect(res.body.stations).toHaveLength(take)
        // @ts-ignore
        res.body.stations.forEach((element) => {expect(element).toEqual(expectStation)})
        const stations = res.body.stations
        expect(stations[0].Name.startsWith(patternName)).toBeTruthy()
    })
    test("Test response for border line skip: skip totalStations-n stations and take 10", async()=>{
        const patternName = "A"
        const totalStations = await countSearchedStations(patternName)
        const skip = totalStations-3
        const take = 10
        const res = await request(app).get('/api/v1/stations/search/?skip='+skip+'&take=' + take + '&patternName=' + patternName)
        expect(res.body).toHaveProperty('stations')
        expect(res.body.stations).toHaveLength(totalStations-skip)
        // @ts-ignore
        res.body.stations.forEach((element) => {expect(element).toEqual(expectStation)})
        expect(res.body.stations[0].Name.startsWith(patternName)).toBeTruthy()
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
import app from "../../src/index"
import {AppDataSource} from "../../src/db/data-sources";
import request from "supertest";
import {count_journeys_for_search, count_journeys_instances, get_nth_journey_id} from "../helpers";

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

describe("GET /journeys/?take=&skip= route", () =>{
    it.each([["abc", 2, 400],[true, 3, 400],[-2, 1, 400], [5000000, 2, 400], [0, 1, 200], [2, "abc", 400], [3, false, 400], [5, -3, 400], [2, 10, 200], [3, 50, 200], [5, 100, 200]])
    ("Test status code when the %d journeys are skipped and %d are required", async(skip, take, statusCode:number) =>{
        const res = await request(app).get('/api/v1/journeys/?skip='+skip+'&take=' + take)
        expect(res.statusCode).toBe(statusCode)
    })
    it.each([[0, 1], [0, 10], [5, 1], [5, 8], [23, 15]])
    ("Test response when %d journeys are skipped and %d are required", async(skip:number, take:number)=> {
        const res = await request(app).get('/api/v1/journeys/?skip='+skip+'&take=' + take)
        const firstJourneyID:number = await get_nth_journey_id(skip)
        const lastJourneyID:number = await get_nth_journey_id(skip + take -1)
        expect(res.body).toHaveProperty('journeys')
        expect(res.body.journeys).toHaveLength(take)
        // @ts-ignore
        res.body.journeys.forEach((element) => {expect(element).toEqual(expectJourney)})
        const journeys = res.body.journeys
        expect(journeys[0].ID).toEqual(firstJourneyID)
        expect(journeys[take-1].ID).toEqual(lastJourneyID)
    })
    test("Test response for border line skip: skip totalJourneys-n journeys and take 10", async()=>{
        const totalJourneys = await count_journeys_instances()
        const skip = totalJourneys-3
        const take = 10
        const firstJourneyID = await get_nth_journey_id(skip)
        const lastJourneyID = await get_nth_journey_id(totalJourneys-1)
        const res = await request(app).get('/api/v1/journeys/?skip='+skip+'&take=' + take)
        expect(res.body).toHaveProperty('journeys')
        expect(res.body.journeys).toHaveLength(totalJourneys-skip)
        // @ts-ignore
        res.body.journeys.forEach((element) => {expect(element).toEqual(expectJourney)})
        expect(res.body.journeys[0].ID).toEqual(firstJourneyID)
        expect(res.body.journeys[totalJourneys-skip-1].ID).toEqual(lastJourneyID)
    })
})

describe("GET /journeys/count", ()=>{
    test("test response equals the count of journeys", async() => {
        const res = await request(app).get('/api/v1/journeys/count')
        const expectedCountJourneys = await count_journeys_instances()
        expect(res.statusCode).toBe(200)
        expect(res.body).toHaveProperty('count')
        expect(res.body.count).toEqual(expectedCountJourneys)
    })
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


describe("GET /journeys/search/?take=&skip=&patternFrom=&patternTo= route", () =>{
    it.each([["abc", 2, "A", "", 400], [true, 3, "", "La", 400],[-2, 1, "K", "A", 400], [5000000, 2, "", "", 400], [0, 1, "", "", 200], [2, "abc", "", "A", 400], [3, false, "A", "", 400], [5, -3, "A", "", 400], [2, 10, "A", "", 200], [3, 50, "", "A", 200], [5, 100, "A", "K", 200]])
    ("Test status code when the %d journeys are skipped and %d are required", async(skip, take, patternFromStation,patternToStation,  statusCode:number) =>{
        const res = await request(app).get('/api/v1/journeys/search/?skip='+skip+'&take=' + take + '&patternFrom=' + patternFromStation + '&patternTo=' + patternToStation)
        expect(res.statusCode).toBe(statusCode)
    })
    it.each([[0, 1, "A", ""], [0, 10, "", "La"], [5, 1, "", ""], [5, 8, "A", "La"], [23, 15, "Kirkko", "A"]])
    ("Test response when %d journeys are skipped and %d are required", async(skip:number, take:number, patternFromStation:string, patternToStation:string)=> {
        const res = await request(app).get('/api/v1/journeys/search/?skip='+skip+'&take=' + take + '&patternFrom=' + patternFromStation + '&patternTo=' + patternToStation)
        expect(res.body).toHaveProperty('journeys')
        expect(res.body.journeys).toHaveLength(take)
        // @ts-ignore
        res.body.journeys.forEach((element) => {
            expect(element).toEqual(expectJourney)
            expect(element.Departure_station).toEqual(expectStation)
            expect(element.Departure_station.Name.startsWith(patternFromStation)).toBeTruthy()
            expect(element.Return_station).toEqual(expectStation)
            expect(element.Return_station.Name.startsWith(patternToStation)).toBeTruthy()
        })
    })
    test("Test response for border line skip: skip totalJourneys-n journeys and take 10", async()=>{
        const patternFromStation:string = "Kirkko%"
        const patternToStation:string = "A"
        const totalJourneys = await count_journeys_for_search(patternFromStation, patternToStation)
        const skip = totalJourneys-3
        const take = 10
        const res = await request(app).get('/api/v1/journeys/search/?skip='+skip+'&take=' + take + '&patternFrom=' +patternFromStation+'&patternTo='+patternToStation)
        expect(res.body).toHaveProperty('journeys')
        expect(res.body.journeys).toHaveLength(totalJourneys-skip)
        // @ts-ignore
        res.body.journeys.forEach((element) => {
            expect(element).toEqual(expectJourney)
        })
    })
})

describe("GET /journeys/count/search/", ()=>{
    it.each([["A", ""], ["","Kirkko"], ["A", "Kirkko"], ["", ""], ["A2", ""], ["", "A2"], ["A2", "A2"]])
    ("Test response equals the count of journeys for departure station strting with %s and return %s", async(patternFromStation, patternToStation ) => {
        const res = await request(app).get('/api/v1/journeys/count/search/?patternFrom='+patternFromStation+'&patternTo='+patternToStation)
        const expectedCountJourneys = await count_journeys_for_search(patternFromStation, patternToStation)
        expect(res.statusCode).toBe(200)
        expect(res.body).toHaveProperty('count')
        expect(res.body.count).toEqual(expectedCountJourneys)
    })
})


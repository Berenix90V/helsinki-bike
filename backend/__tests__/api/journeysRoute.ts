import app from "../../src/index"
import {AppDataSource} from "../../src/db/data-sources";
import request from "supertest";
import {
    avg_distance_journeys_from_station, avg_distance_journeys_from_station_filtered_by_month,
    avg_distance_journeys_to_station,
    avg_distance_journeys_to_station_filtered_by_month,
    count_journeys_for_search,
    count_journeys_from_station,
    count_journeys_from_station_filter_by_month,
    count_journeys_instances,
    count_journeys_to_station,
    count_journeys_to_station_filter_by_month,
    get_nth_journey_id,
    top_n_departures, top_n_departures_filtered_by_month,
    top_n_destinations, top_n_destinations_filtered_by_month
} from "../helpers";

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
    it.each([[1], [503], [5000]])
    ("Test response for trips from station %d", async(id: number)=>{
        const expectedJourneys =  await count_journeys_from_station(id)
        const res = await request(app).get('/api/v1/journeys/from/' + id)
        expect(res.body).toHaveProperty('njourneys')
        expect(res.body.njourneys).toEqual(expectedJourneys)
    })
    it.each([[503, "abc", 400],[1, true, 400],[2, -2, 400], [503, 0, 400], [503, 1, 200], [503, 13, 400], [1,6, 200]])
    ("Test status code for trips from station %d and month %d", async(id:number, month, statusCode)=>{
        const res = await request(app).get('/api/v1/journeys/from/' + id+'/?month='+month)
        expect(res.statusCode).toBe(statusCode)
    })
    it.each([[503, 6], [503, 4]])("Test with valid ids and months: id %d month %d", async(id:number, month) => {
        const res = await request(app).get('/api/v1/journeys/from/' + id+'/?month='+month)
        const expectedCountJourneys = await count_journeys_from_station_filter_by_month(id, month)
        expect(res.statusCode).toEqual(200)
        expect(res.body).toHaveProperty('njourneys')
        expect(res.body.njourneys).toEqual(expectedCountJourneys)
    } )
    it.each([[504, 6], [5000, 7]])("Test with not valid ids, but valid month: id %d month %d", async (id:number, month:number) => {
        const res = await request(app).get('/api/v1/journeys/from/' + id+'/?month='+month)
        expect(res.statusCode).toEqual(200)
        expect(res.body).toHaveProperty('njourneys')
        expect(res.body.njourneys).toEqual(0)
    })
    it.each([[503, 3], [1, 9]])("Test with valid ids, month not in the database: id %d month %d", async(id:number, month:number) => {
        const res = await request(app).get('/api/v1/journeys/from/' + id+'/?month='+month)
        expect(res.statusCode).toEqual(200)
        expect(res.body).toHaveProperty('njourneys')
        expect(res.body.njourneys).toEqual(0)
    } )
})

describe("GET /journeys/to/:id", ()=>{
    it.each([["abc", 400],[true, 400],[-2, 400], [0, 400], [1, 200], [503, 200], [5000, 200]])
    ("Test status code for trips from station %d", async(id, statusCode)=>{
        const res = await request(app).get('/api/v1/journeys/to/' + id)
        expect(res.statusCode).toBe(statusCode)
    })
    it.each([[1], [503], [5000]])
    ("Test response for trips from station %d", async(id: number)=>{
        const expectedJourneys = await count_journeys_to_station(id)
        const res = await request(app).get('/api/v1/journeys/to/' + id)
        expect(res.body).toHaveProperty('njourneys')
        expect(res.body.njourneys).toEqual(expectedJourneys)
    })
    it.each([[503, "abc", 400],[1, true, 400],[2, -2, 400], [503, 0, 400], [503, 1, 200], [503, 13, 400], [1,6, 200]])
    ("Test status code for trips from station %d and month %d", async(id:number, month, statusCode)=>{
        const res = await request(app).get('/api/v1/journeys/to/' + id+'/?month='+month)
        expect(res.statusCode).toBe(statusCode)
    })
    it.each([[503, 6], [503, 4]])("Test with valid ids and months: id %d month %d", async(id:number, month) => {
        const res = await request(app).get('/api/v1/journeys/to/' + id+'/?month='+month)
        const expectedCountJourneys = await count_journeys_to_station_filter_by_month(id, month)
        expect(res.statusCode).toEqual(200)
        expect(res.body).toHaveProperty('njourneys')
        expect(res.body.njourneys).toEqual(expectedCountJourneys)
    } )
    it.each([[504, 6], [5000, 7]])("Test with not valid ids, but valid month: id %d month %d", async (id:number, month:number) => {
        const res = await request(app).get('/api/v1/journeys/to/' + id+'/?month='+month)
        expect(res.statusCode).toEqual(200)
        expect(res.body).toHaveProperty('njourneys')
        expect(res.body.njourneys).toEqual(0)
    })
    it.each([[503, 3], [1, 9]])("Test with valid ids, month not in the database: id %d month %d", async(id:number, month:number) => {
        const res = await request(app).get('/api/v1/journeys/to/' + id+'/?month='+month)
        expect(res.statusCode).toEqual(200)
        expect(res.body).toHaveProperty('njourneys')
        expect(res.body.njourneys).toEqual(0)
    } )
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

describe("GET /journeys/from/:id/distance/avg", ()=>{
    it.each([["abc", 400],[true, 400],[-2, 400], [0, 400], [1, 200], [503, 200], [5000, 200]])
    ("Test status code for trips from station %d", async(id, statusCode)=>{
        const res = await request(app).get('/api/v1/journeys/from/' +id+'/distance/avg')
        expect(res.statusCode).toBe(statusCode)
    })
    it.each([[1], [503], [5000]])
    ("Test response for trips from station %d", async(id: number)=>{
        const res = await request(app).get('/api/v1/journeys/from/' + id+'/distance/avg')
        const expectedAvg = await avg_distance_journeys_from_station(id)
        expect(res.body).toHaveProperty('avg')
        expect(res.body.avg).toEqual(expectedAvg)
    })
    it.each([[503, "abc",  400],[503, true, 400],[1, -2, 400], [2, 0, 400], [503, 1, 200], [503, 6, 200], [5000, 13, 400]])
    ("Test status code for trips from station %d and month %d", async(id, month, statusCode)=>{
        const res = await request(app).get('/api/v1/journeys/from/' +id+'/distance/avg/?month='+month)
        expect(res.statusCode).toBe(statusCode)
    })
    it.each([[1, 6], [503, 5], [22, 7]])
    ("Test response valid ids and month in databases", async(id: number, month:number)=>{
        const res = await request(app).get('/api/v1/journeys/from/' + id+'/distance/avg/?month='+ month)
        const expectedAvg = await avg_distance_journeys_from_station_filtered_by_month(id, month)
        expect(res.body).toHaveProperty('avg')
        expect(res.body.avg).toEqual(expectedAvg)
    })
    it.each([[504, 6],[5000, 5]])("Test for not existent ids but month in database. id %d month %d", async(id:number, month:number) => {
        const res = await request(app).get('/api/v1/journeys/from/' + id+'/distance/avg/?month='+ month)
        expect(res.body).toHaveProperty('avg')
        expect(res.body.avg).toEqual(0)
    })
    it.each([[503, 9],[1, 2]])("Test for existent ids but month not in database. id %d month %d", async(id:number, month:number) => {
        const res = await request(app).get('/api/v1/journeys/from/' + id+'/distance/avg/?month='+ month)
        expect(res.body).toHaveProperty('avg')
        expect(res.body.avg).toEqual(0)
    })
})

describe("GET /journeys/to/:id/distance/avg", ()=>{
    it.each([["abc", 400],[true, 400],[-2, 400], [0, 400], [1, 200], [503, 200], [5000, 200]])
    ("Test status code for journeys to station %d", async(id, statusCode)=>{
        const res = await request(app).get('/api/v1/journeys/to/' +id+'/distance/avg')
        expect(res.statusCode).toBe(statusCode)
    })
    it.each([[1], [503], [5000]])
    ("Test response for journeys to station %d", async(id: number)=>{
        const res = await request(app).get('/api/v1/journeys/to/' + id+'/distance/avg')
        const expectedAvg = await avg_distance_journeys_to_station(id)
        expect(res.body).toHaveProperty('avg')
        expect(res.body.avg).toEqual(expectedAvg)
    })
    it.each([[503, "abc",  400],[503, true, 400],[1, -2, 400], [2, 0, 400], [503, 1, 200], [503, 6, 200], [5000, 13, 400]])
    ("Test status code for trips from station %d and month %d", async(id, month, statusCode)=>{
        const res = await request(app).get('/api/v1/journeys/to/' +id+'/distance/avg/?month='+month)
        expect(res.statusCode).toBe(statusCode)
    })
    it.each([[1, 6], [503, 5], [22, 7]])
    ("Test response valid ids and month in databases", async(id: number, month:number)=>{
        const res = await request(app).get('/api/v1/journeys/to/' + id+'/distance/avg/?month='+ month)
        const expectedAvg = await avg_distance_journeys_to_station_filtered_by_month(id, month)
        expect(res.body).toHaveProperty('avg')
        expect(res.body.avg).toEqual(expectedAvg)
    })
    it.each([[504, 6],[5000, 5]])("Test for not existent ids but month in database. id %d month %d", async(id:number, month:number) => {
        const res = await request(app).get('/api/v1/journeys/to/' + id+'/distance/avg/?month='+ month)
        expect(res.body).toHaveProperty('avg')
        expect(res.body.avg).toEqual(0)
    })
    it.each([[503, 9],[1, 2]])("Test for existent ids but month not in database. id %d month %d", async(id:number, month:number) => {
        const res = await request(app).get('/api/v1/journeys/to/' + id+'/distance/avg/?month='+ month)
        expect(res.body).toHaveProperty('avg')
        expect(res.body.avg).toEqual(0)
    })
})

describe("GET /journeys/from/:id/top/destinations/", ()=>{
    it.each([["abc", 5, 400], [true, 10, 400], [503, "abc", 400], [1, true, 400], [-1, 5, 400], [1, -5, 400], [5000, 10, 200], [503, 5, 200]])
    ("Test status code for journeys from %d and get top %d destinations ", async(id, limit, statusCode:number)=>{
        const res = await request(app).get('/api/v1/journeys/from/'+id+'/top/destinations/?limit='+limit)
        expect(res.statusCode).toBe(statusCode)
    })
    it.each([[503, 5], [22, 3], [1, 10]])("Test response for journey from %d: get top %d destinations", async (id:number, limit:number)=>{
        const res = await request(app).get('/api/v1/journeys/from/'+id+'/top/destinations/?limit='+limit)
        const expectedTopNDestinations = await top_n_destinations(id, limit)
        expect(res.body).toHaveProperty('destinations')
        expect(res.body.destinations).toHaveLength(limit)
        expect(res.body.destinations).toMatchObject(expectedTopNDestinations)
        for(let i=0; i<res.body.destinations.length; i++){
            expect(res.body.destinations[i]).toMatchObject(expectedTopNDestinations[i])
        }
    })
    it.each([[1, 5, -1, 400], [503, 10, 13, 400], [503, 5, 0, 400], [1, 10, 5, 200], [2, 5, "abc", 400], [1, 4, true, 400], [5000, 10, 6, 200], [503, 5, 5, 200]])
    ("Test status code for journeys from %d and get top %d destinations for every possible value of month: month %d ", async(id, limit, month, statusCode:number)=>{
        const res = await request(app).get('/api/v1/journeys/from/'+id+'/top/destinations/?limit='+limit+'&month='+month)
        expect(res.statusCode).toBe(statusCode)
    })
    it.each([[503, 5, 6], [1, 4, 5], [2, 7, 6], [1, 1, 5], [1, 0, 5]])("Test valid ids, limit and months: id %d, limit %d, month %d", async (id:number, limit:number, month:number) =>{
        const res = await request(app).get('/api/v1/journeys/from/'+id+'/top/destinations/?limit='+limit+'&month='+month)
        const expectedTopNDestinations = await top_n_destinations_filtered_by_month(id, limit, month)
        expect(res.body).toHaveProperty('destinations')
        expect(res.body.destinations).toHaveLength(limit)
        expect(res.body.destinations).toMatchObject(expectedTopNDestinations)
        for(let i=0; i<res.body.destinations.length; i++){
            expect(res.body.destinations[i]).toMatchObject(expectedTopNDestinations[i])
        }
    })
    it.each([[503, 5, 3], [2, 10, 12]])("Test valid ids, limit and month, but month not in database: id %d, limit %d, month %d", async(id:number, limit:number, month:number) => {
        const res = await request(app).get('/api/v1/journeys/from/'+id+'/top/destinations/?limit='+limit+'&month='+month)
        expect(res.body).toHaveProperty('destinations')
        expect(res.body.destinations).toHaveLength(0)
    })
})

describe("GET /journeys/to/:id/top/departures/", ()=>{
    it.each([["abc", 5, 400], [true, 10, 400], [503, "abc", 400], [1, true, 400], [5000, 10, 200], [503, 5, 200]])
    ("Test status code for journeys to %d and get top %d departures ", async(id, limit, statusCode:number)=>{
        const res = await request(app).get('/api/v1/journeys/to/'+id+'/top/departures/?limit='+limit)
        expect(res.statusCode).toBe(statusCode)
    })
    it.each([[503, 5], [22, 3], [1, 10]])("Test response for journey from %d: get top %d departures", async (id:number, limit:number)=>{
        const res = await request(app).get('/api/v1/journeys/to/'+id+'/top/departures/?limit='+limit)
        const expectedTopNDepartures = await top_n_departures(id, limit)
        expect(res.body).toHaveProperty('departures')
        expect(res.body.departures).toHaveLength(limit)
        expect(res.body.departures).toMatchObject(expectedTopNDepartures)
        for(let i=0; i<res.body.departures.length; i++){
            expect(res.body.departures[i]).toMatchObject(expectedTopNDepartures[i])
        }
    })
    it.each([[1, 5, -1, 400], [503, 10, 13, 400], [503, 5, 0, 400], [1, 10, 5, 200], [2, 5, "abc", 400], [1, 4, true, 400], [5000, 10, 6, 200], [503, 5, 5, 200]])
    ("Test status code for journeys from %d and get top %d destinations for every possible value of month: month %d ", async(id, limit, month, statusCode:number)=>{
        const res = await request(app).get('/api/v1/journeys/to/'+id+'/top/departures/?limit='+limit+'&month='+month)
        expect(res.statusCode).toBe(statusCode)
    })
    it.each([[503, 5, 6], [1, 4, 5], [2, 7, 6], [1, 1, 5], [1, 0, 5]])("Test valid ids, limit and months: id %d, limit %d, month %d", async (id:number, limit:number, month:number) =>{
        const res = await request(app).get('/api/v1/journeys/to/'+id+'/top/departures/?limit='+limit+'&month='+month)
        const expectedTopNDepartures = await top_n_departures_filtered_by_month(id, limit, month)
        expect(res.body).toHaveProperty('departures')
        expect(res.body.departures).toHaveLength(limit)
        expect(res.body.departures).toMatchObject(expectedTopNDepartures)
        for(let i=0; i<res.body.departures.length; i++){
            expect(res.body.departures[i]).toMatchObject(expectedTopNDepartures[i])
        }
    })
    it.each([[503, 5, 3], [2, 10, 12]])("Test valid ids, limit and month, but month not in database: id %d, limit %d, month %d", async(id:number, limit:number, month:number) => {
        const res = await request(app).get('/api/v1/journeys/to/'+id+'/top/departures/?limit='+limit+'&month='+month)
        expect(res.body).toHaveProperty('departures')
        expect(res.body.departures).toHaveLength(0)
    })
})



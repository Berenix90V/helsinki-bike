import {Journey} from "../../src/models/Journey";
import {AppDataSource} from "../../src/db/data-sources";
import {
    avg_distance_journeys_from_station,
    avg_distance_journeys_from_station_filtered_by_month,
    avg_distance_journeys_to_station,
    avg_distance_journeys_to_station_filtered_by_month,
    count_journeys_for_search,
    count_journeys_from_station,
    count_journeys_from_station_filter_by_month,
    count_journeys_to_station, count_journeys_to_station_filter_by_month,
    get_nth_journey_id,
    top_n_departures,
    top_n_departures_filtered_by_month,
    top_n_destinations,
    top_n_destinations_filtered_by_month
} from "../helpers";
import {Station} from "../../src/models/Station";

beforeEach(async ()=>{
    await AppDataSource.initialize()
} )

afterEach(async ()=>{
    await AppDataSource.destroy()
})

describe("Test Journey entity", () => {
    test("Test that the method returns the right value", async ()=>{
        const totalJourneys:number = await Journey.countTotal()
        expect(totalJourneys).toEqual(3126264)
    })
})

describe("Test Journey entity: getPaginatedJourneys", ()=>{

    it.each([[0,1],[0, 5], [0, 10], [2,3], [5,1], [5,7], [10003, 20]])
    ("Test getPaginatedJourneys for valid input: skip %d journeys and take %d journeys", async(skip:number, take:number)=>{
        const result:Journey[] = await Journey.getPaginatedJourneys(skip, take)
        const firstJourney:number = await get_nth_journey_id(skip)
        const lastJourney:number = await get_nth_journey_id(skip + take-1)
        expect(result).toHaveLength(take)
        result.forEach((element:Journey) => {
            expect(element).toBeInstanceOf(Journey)
        })
        expect(result[0].ID).toEqual(firstJourney)
        expect(result[take-1].ID).toEqual(lastJourney)
    })
    test("Test getPaginatedJourneys for valid input but borderline skip: skip total-n journeys and take maximum 10 journeys", async()=>{
        const totalJourneys = await Journey.countTotal()
        const take = 10
        const skips: number[] = [totalJourneys-1, totalJourneys-6, totalJourneys-9]
        for(const skip of skips ){
            const result:Journey[] = await Journey.getPaginatedJourneys(skip, take)
            const takenJourneys:number = totalJourneys-skip
            const firstJourney:number = await get_nth_journey_id(skip)
            const lastJourney:number = await get_nth_journey_id(totalJourneys-1)
            expect(result).toHaveLength(totalJourneys-skip)
            result.forEach((element: Journey) => {
                expect(element).toBeInstanceOf(Journey)
            })
            expect(result[0].ID).toEqual(firstJourney)
            expect(result[takenJourneys-1].ID).toEqual(lastJourney)
        }

    })
    it.each([[-1, 10], [-5,1], [50000000, 6]])
    ("Test getPaginatedJourneys for not valid skip value %d", async(skip:number, take:number)=>{
        await expect(Journey.getPaginatedJourneys(skip, take)).rejects.toThrowError(RangeError)
    })
    it.each([[0, -1], [5, -2], [0,0]])
    ("Test getPaginatedJourneys for not valid take value %d", async(skip:number, take:number)=>{
        await expect(Journey.getPaginatedJourneys(skip, take)).rejects.toThrowError(RangeError)
    })
})

describe("Test Journey entity: getNumberOfJourneysFromStation", () => {
    it.each([[1,], [503]])
    ("Test for valid input: station id %d", async(id:number) => {
        const numberOfJourneys = await Journey.getNumberOfJourneysFromStation(id)
        const expectedNumberOfJourneys:number = await count_journeys_from_station(id)
        expect(numberOfJourneys).toEqual(expectedNumberOfJourneys)
    })
    it.each([[504, 0], [1000, 0]])
    ("Test for not existent station: station id %d", async(id:number, expectedNumberOfJourneys:number) => {
        const numberOfJourneys = await Journey.getNumberOfJourneysFromStation(id)
        expect(numberOfJourneys).toEqual(expectedNumberOfJourneys)
    })
    it.each([[0], [-2], [-10]])
    ("Test for not valid input: station id %d", async(id:number) => {
        await expect(Journey.getNumberOfJourneysFromStation(id)).rejects.toThrowError(RangeError)
    })
    it.each([[503, 5], [1, 6], [22, 7]])("Test for valid ids and valid months: id %d, month %d", async(id:number, month:number) =>{
        const numberOfJourneys:number = await Journey.getNumberOfJourneysFromStation(id, month)
        const expectedNumberOfJourneys:number = await count_journeys_from_station_filter_by_month(id, month)
        expect(numberOfJourneys).toEqual(expectedNumberOfJourneys)
    })
    it.each([[503, 4], [1, 8], [503, 1]])("Test for valid ids and month not in database: id %d, month %d", async(id:number, month:number) => {
        const numberOfJourneys:number = await Journey.getNumberOfJourneysFromStation(id, month)
        expect(numberOfJourneys).toEqual(0)
    })
    it.each([[503, -1], [1, 0], [503, 13]])("Test for valid ids and month not in database: id %d, month %d", async(id:number, month:number) => {
        await expect(Journey.getNumberOfJourneysFromStation(id, month)).rejects.toThrowError(RangeError)
    })
    it.each([[502, -1], [5000, 0], [502, 13]])("Test for valid but not existent ids and month not in database: id %d, month %d", async(id:number, month:number) => {
        await expect(Journey.getNumberOfJourneysFromStation(id, month)).rejects.toThrowError(RangeError)
    })
})

describe("Test Journey entity: getNumberOfJourneysToStation", () => {
    it.each([[0], [-2], [-10]])
    ("Test for not valid ids: station id %d", async(id:number) => {
        await expect(Journey.getNumberOfJourneysToStation(id)).rejects.toThrowError(RangeError)
    })
    it.each([[1], [503]])
    ("Test for valid input: station id %d", async(id:number) => {
        const numberOfJourneys:number = await Journey.getNumberOfJourneysToStation(id)
        const expectedNumberOfJourneys:number = await count_journeys_to_station(id)
        expect(numberOfJourneys).toEqual(expectedNumberOfJourneys)
    })
    it.each([[504], [1000]])
    ("Test for not existent station: station id %d", async(id:number) => {
        const numberOfJourney:number = await Journey.getNumberOfJourneysToStation(id)
        await expect(numberOfJourney).toEqual(0)
    })
    it.each([[503, 5], [1, 6], [22, 7]])("Test for valid ids and valid months: id %d, month %d", async(id:number, month:number) =>{
        const numberOfJourneys:number = await Journey.getNumberOfJourneysToStation(id, month)
        const expectedNumberOfJourneys:number = await count_journeys_to_station_filter_by_month(id, month)
        expect(numberOfJourneys).toEqual(expectedNumberOfJourneys)
    })
    it.each([[503, 4], [1, 9], [503, 1]])("Test for valid ids and month not in database: id %d, month %d", async(id:number, month:number) => {
        const numberOfJourneys:number = await Journey.getNumberOfJourneysToStation(id, month)
        expect(numberOfJourneys).toEqual(0)
    })
    it.each([[503, -1], [1, 0], [503, 13]])("Test for valid ids and month not in database: id %d, month %d", async(id:number, month:number) => {
        await expect(Journey.getNumberOfJourneysToStation(id, month)).rejects.toThrowError(RangeError)
    })
    it.each([[502, -1], [5000, 0], [502, 13]])("Test for valid but not existent ids and month not in database: id %d, month %d", async(id:number, month:number) => {
        await expect(Journey.getNumberOfJourneysToStation(id, month)).rejects.toThrowError(RangeError)
    })
})

describe("Test Journey entity: countJourneysForSearch", ()=>{
    it.each([["A", ""], ["", "Keilalahti"], ["A", "K"], ["2", ""], ["", "2"], ["2", "2"], ["drop", ""], ["", "drop"]])
    ("Test for valid patterns that returns correct count of journeys for search %s, %s", async (patternDepartureStation:string, patternReturnStation:string)=>{
        const countJourneys: number = await Journey.countJourneysForSearch(patternDepartureStation, patternReturnStation)
        const expectedNumberOfJourneys: number = await count_journeys_for_search(patternDepartureStation, patternReturnStation)
        expect(countJourneys).toEqual(expectedNumberOfJourneys)
    })
})

describe("Test Journey entity: getPaginatedJourneysForSearch", ()=>{
    it.each([[0,1, "Kirkko", ""],[0, 5, "A", ""], [0, 10, "", "Ki"], [2,3, "", "K"], [5,1, "A", ""], [5,7, "La", ""], [500, 20, "", ""]])
    ("Test getPaginatedJourneys for valid inputs and Search giving a large number: skip %d journeys and take %d journeys with Departure station beginning with %s", async(skip, take, patternDepartureStation, patternReturnStation)=>{
        const result:Journey[] = await Journey.getPaginatedJourneysForSearch(skip, take, patternDepartureStation, patternReturnStation)
        expect(result).toHaveLength(take)
        result.forEach((element) => {
            expect(element).toBeInstanceOf(Journey)
            expect(element.Departure_station).toBeInstanceOf(Station)
            expect(element.Departure_station.Name.startsWith(patternDepartureStation)).toBeTruthy()
            expect(element.Return_station).toBeInstanceOf(Station)
            expect(element.Return_station.Name.startsWith(patternReturnStation)).toBeTruthy()
        })
    })
    test("Test getPaginatedJourneysForSearch for valid input but borderline skip: skip total-n journeys and take maximum 10 journeys", async()=>{
        const patternDepartureStation = "A"
        const patternReturnStation = "K"
        const totalJourneys = await count_journeys_for_search(patternDepartureStation, patternReturnStation)
        const take = 10
        const skips = [totalJourneys-1, totalJourneys-6, totalJourneys-9]
        for(const skip of skips ){
            const result:Journey[] = await Journey.getPaginatedJourneysForSearch(skip, take, patternDepartureStation, patternReturnStation)
            expect(result).toHaveLength(totalJourneys-skip)
            result.forEach((element) => {
                expect(element).toBeInstanceOf(Journey)
                expect(element.Departure_station).toBeInstanceOf(Station)
                expect(element.Departure_station.Name.startsWith(patternDepartureStation)).toBeTruthy()
                expect(element.Return_station).toBeInstanceOf(Station)
                expect(element.Return_station.Name.startsWith(patternReturnStation)).toBeTruthy()
            })
        }
    })
    it.each([[-1, 10, "A", ""], [-5,1,"", "Kirkko"], [-10,1,"", ""], [50000000, 6, "A", "K"]])
    ("Test getPaginatedJourneysForSearch for not valid skip value %d", async(skip, take, patternDepartureStation, patternReturnStation)=>{
        await expect(Journey.getPaginatedJourneysForSearch(skip, take, patternDepartureStation, patternReturnStation)).rejects.toThrowError(RangeError)
    })
    it.each([[0, -1, "A", ""], [5, -2, "", "A"], [4, -10, "", ""], [0,0, "","A"]])
    ("Test getPaginatedJourneysForSearch for not valid take value %d", async(skip, take, patternDepartureStation, patternReturnStation)=>{
        await expect(Journey.getPaginatedJourneysForSearch(skip, take, patternDepartureStation, patternReturnStation)).rejects.toThrowError(RangeError)
    })
    it.each([[0,10, "a2", ""], [0,10, "", "345"] ])("Test getPaginatedJourneysForSearch for not valid search", async(skip, take, patternDepartureStation, patternReturnStation,)=>{
        const journeys = await Journey.getPaginatedJourneysForSearch(skip, take, patternDepartureStation, patternReturnStation)
        expect(journeys).toHaveLength(0)
    })
})

describe("Test Journey entity: getAverageDistanceFrom", ()=>{
    it.each([[503], [1]])("Test with valid id no month selection: id %d", async(id:number)=>{
        const expectedAvg: number = await avg_distance_journeys_from_station(id)
        const avg: number = await Journey.getAverageDistanceFrom(id)
        expect(avg).toEqual(expectedAvg)
    })
    it.each([[-1], [0]])("Test with not valid ids, no month selection", async(id:number)=>{
        await expect(Journey.getAverageDistanceFrom(id)).rejects.toThrowError(RangeError)
    })
    it.each([[502], [5000]])("Test with valid id but not existent station", async(id:number)=>{
        const avg: number = await Journey.getAverageDistanceFrom(id)
        expect(avg).toEqual(0)
    })
    it.each([[503, 5], [1,6], [22,7]])("Test with month selection and valid ids: month %d and  id %d", async(id, month)=>{
        const avg:number = await Journey.getAverageDistanceFrom(id, month)
        const expectedAvg:number = await avg_distance_journeys_from_station_filtered_by_month(id, month)
        expect(avg).toEqual(expectedAvg)
    })
    it.each([[503, 4], [22, 8]])("Test with month not in database and existing id: id %d month %d", async (id:number, month:number) =>{
        const avg:number = await Journey.getAverageDistanceFrom(id, month)
        expect(avg).toEqual(0)
    })
    it.each([[502, 5], [5000, 9]])("Test with not existing id and month not in database: id %id, month %d", async(id:number, month:number) =>{
        const avg: number = await Journey.getAverageDistanceFrom(id, month)
        expect(avg).toEqual(0)
    })
    it.each([[-10, 20], [0, 0], [-2,-4]])("Test with not valid ids and months: id %d and month %d", async(id:number, month:number) =>{
        await expect(Journey.getAverageDistanceFrom(id, month)).rejects.toThrowError(RangeError)
    })
    it.each([[503, -1], [22, 0], [1, 13]])("Test with existing ids and not valid months", async(id:number, month:number) =>{
        await expect(Journey.getAverageDistanceFrom(id, month)).rejects.toThrowError(RangeError)
    })
})

describe("Test Journey entity: getAverageDistanceTo", ()=>{
    it.each([[503], [1]])("Test with valid inputs", async(id:number)=>{
        const expectedAvg: number = await avg_distance_journeys_to_station(id)
        const avg: number = await Journey.getAverageDistanceTo(id)
        expect(avg).toEqual(expectedAvg)
    })
    it.each([[-1], [0]])("Test with valid inputs", async(id:number)=>{
        await expect(Journey.getAverageDistanceTo(id)).rejects.toThrowError(RangeError)
    })
    it.each([[502], [5000]])("Test with valid inputs but not existent station", async(id:number)=>{
        const avg: number = await Journey.getAverageDistanceTo(id)
        expect(avg).toEqual(0)
    })
    it.each([[503, 5], [1,6], [22,7]])("Test with month selection and valid ids: month %d and  id %d", async(id, month)=>{
        const avg:number = await Journey.getAverageDistanceTo(id, month)
        const expectedAvg:number = await avg_distance_journeys_to_station_filtered_by_month(id, month)
        expect(avg).toEqual(expectedAvg)
    })
    it.each([[503, 4], [22, 8]])("Test with month not in database and existing id: id %d month %d", async (id:number, month:number) =>{
        const avg:number = await Journey.getAverageDistanceTo(id, month)
        expect(avg).toEqual(0)
    })
    it.each([[502, 5], [5000, 9]])("Test with not existing id and month not in database: id %id, month %d", async(id:number, month:number) =>{
        const avg: number = await Journey.getAverageDistanceTo(id, month)
        expect(avg).toEqual(0)
    })
    it.each([[-10, 20], [0, 0], [-2,-4]])("Test with not valid ids and months: id %d and month %d", async(id:number, month:number) =>{
        await expect(Journey.getAverageDistanceTo(id, month)).rejects.toThrowError(RangeError)
    })
    it.each([[503, -1], [22, 0], [1, 13]])("Test with existing ids and not valid months", async(id:number, month:number) =>{
        await expect(Journey.getAverageDistanceTo(id, month)).rejects.toThrowError(RangeError)
    })
})

describe("Test Journey entity: getTopNDestinations", ()=>{
    it.each([[503, 5], [1, 1], [22, 3], [503, 0]])("Test with valid inputs id %d limit %d", async(id:number, limit:number)=>{
        const expectedDestinations = await top_n_destinations(id, limit)
        const topNDestinations: {count:number, Return_station_ID: number, Name:string}[] = await Journey.getTopNDestinations(id, limit)
        expect(topNDestinations.length).toEqual(expectedDestinations.length)
        expect(topNDestinations).toMatchObject(expectedDestinations)
        topNDestinations.forEach((element)=>{
            expect(element).toHaveProperty('count')
            expect(element).toHaveProperty('Return_station_ID')
            expect(element).toHaveProperty('Name')
        })
    })
    it.each([[-2, 5], [-3, 1], [0, 3], [1,-1]])("Test with not valid inputs: id %d limit %d", async(id:number, limit:number)=>{
       await expect(Journey.getTopNDestinations(id, limit)).rejects.toThrowError(RangeError)
    })
    it.each([[502, 10], [50000, 1]])("Test with not existent Id %d limit %d", async(id: number, limit: number) => {
        const topNDestinations: {count:number, Return_station_ID: number, Name:string}[] = await Journey.getTopNDestinations(id, limit)
        expect(topNDestinations.length).toBeLessThanOrEqual(0)
    })
    it.each([[503, 5,5], [1, 1,6], [22, 3,7], [503, 0,6]])("Test with valid inputs and filter by month: id %d, limit %d, month %d", async(id:number, limit:number, month:number) => {
        const topNDestinations: {count:number, Return_station_ID: number, Name:string}[] = await Journey.getTopNDestinations(id, limit, month)
        const expectedDestinations = await top_n_destinations_filtered_by_month(id, limit, month)
        expect(topNDestinations.length).toEqual(expectedDestinations.length)
        expect(topNDestinations).toMatchObject(expectedDestinations)
        topNDestinations.forEach((element)=>{
            expect(element).toHaveProperty('count')
            expect(element).toHaveProperty('Return_station_ID')
            expect(element).toHaveProperty('Name')
        })
    })
    it.each([[503, 5, 4], [503, 10, 8]])("Test with valid ids, limit and invalid months: id %d, limit %d, month %d", async(id:number, limit:number, month:number) =>{
        const topNDestinations: {count:number, Return_station_ID: number, Name:string}[] = await Journey.getTopNDestinations(id, limit, month)
        expect(topNDestinations).toHaveLength(0)
    })
    it.each([[502, 5, 5], [5000, 6, 6]])("Test with not existent ids: id %d, limit %d, month %d", async(id:number, limit:number, month:number) =>{
        const topNDestination: {count:number, Return_station_ID: number, Name:string}[] = await Journey.getTopNDestinations(id, limit, month)
        expect(topNDestination).toHaveLength(0)
    })
    it.each([[503,5,-3], [1,10,14]])("Test with valid ids and not valid months: id %d, limit %d, month %d", async(id: number, limit:number, month:number) =>{
        await expect(Journey.getTopNDestinations(id, limit, month)).rejects.toThrowError(RangeError)
    })
    it.each([[-20,5,-3], [0,10,14]])("Test with not valid ids and months: id %d, limit %d, month %d", async(id: number, limit:number, month:number) =>{
        await expect(Journey.getTopNDestinations(id, limit, month)).rejects.toThrowError(RangeError)
    })
})

describe("Test Journey entity: getTopNDepartures", ()=>{
    it.each([[503, 5], [1, 1], [22, 3], [503, 0]])("Test with valid inputs id %d limit %d", async(id:number, limit:number)=>{
        const expectedDepartures = await top_n_departures(id, limit)
        const topNDepartures: {count:number, Departure_station_ID: number, Name:string}[] = await Journey.getTopNDepartures(id, limit)
        expect(topNDepartures.length).toEqual(expectedDepartures.length)
        expect(topNDepartures).toMatchObject(expectedDepartures)
        topNDepartures.forEach((element)=>{
            expect(element).toHaveProperty('count')
            expect(element).toHaveProperty('Departure_station_ID')
            expect(element).toHaveProperty('Name')
        })
    })
    it.each([[-2, 5], [-3, 1], [0, 3], [1,-1]])("Test with not valid inputs: id %d limit %d", async(id:number, limit:number)=>{
        await expect(Journey.getTopNDepartures(id, limit)).rejects.toThrowError(RangeError)
    })
    it.each([[502, 10], [50000, 1]])("Test with not existent Id %d limit %d", async(id: number, limit: number) => {
        const topNDepartures: {count:number, Departure_station_ID: number, Name:string}[] = await Journey.getTopNDepartures(id, limit)
        expect(topNDepartures.length).toBeLessThanOrEqual(0)
    })
    it.each([[503, 5, 5], [1, 10, 6], [22, 12, 7]])("Test with valid inputs and filtering by month: id %d limit %d month %d", async(id:number, limit:number, month: number) => {
        const topNDepartures = await Journey.getTopNDepartures(id, limit, month)
        const expectedTopNDepartures: {count:number, Departure_station_ID: number, Name:string}[] = await top_n_departures_filtered_by_month(id, limit, month)
        expect(topNDepartures.length).toEqual(expectedTopNDepartures.length)
        expect(topNDepartures).toMatchObject(expectedTopNDepartures)
        expectedTopNDepartures.forEach((element)=>{
            expect(element).toHaveProperty('count')
            expect(element).toHaveProperty('Departure_station_ID')
            expect(element).toHaveProperty('Name')
        })
    })
    it.each([[503, 5, -1], [1, 10, 13], [22, 6, 0]])("Test with valid ids and limit, but not valid month: id %d limit %d month %d", async(id:number, limit:number, month:number) =>{
        await expect(Journey.getTopNDepartures(id, limit, month)).rejects.toThrowError(RangeError)
    })
    it.each([[503, 6, 4], [1, 8, 12]])("Test with valid inputs but month not in database: id %d limit %d month %d", async(id:number, limit:number, month:number) =>{
        const topNDepartures = await Journey.getTopNDepartures(id, limit, month)
        expect(topNDepartures).toHaveLength(0)
    })
    it.each([[502, 5, 5], [5000, 6, 6]])("Test with not existent ids: id %d, limit %d, month %d", async(id:number, limit:number, month:number) =>{
        const topNDepartures: {count:number, Departure_station_ID: number, Name:string}[] = await Journey.getTopNDepartures(id, limit, month)
        expect(topNDepartures).toHaveLength(0)
    })
    it.each([[-20,5,-3], [0,10,14]])("Test with not valid ids and months: id %d, limit %d, month %d", async(id: number, limit:number, month:number) =>{
        await expect(Journey.getTopNDepartures(id, limit, month)).rejects.toThrowError(RangeError)
    })
})
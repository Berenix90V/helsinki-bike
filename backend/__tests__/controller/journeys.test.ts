import {
    countTotalJourneys,
    getAllJourneys,
    getNumberOfJourneysFromStation,
    getNumberOfJourneysToStation,
    getPaginatedJourneysForSearch,
    countJourneysForSearch,
    getAvgDistanceJourneysFrom,
    getAvgDistanceJourneysTo,
    getTopNDestinations, getTopNDepartures
} from "../../src/controllers/journeys";
import {Journey} from "../../src/models/Journey";
import {AppDataSource} from "../../src/db/data-sources";
import {
    avg_distance_journeys_from_station, avg_distance_journeys_from_station_filtered_by_month,
    avg_distance_journeys_to_station, avg_distance_journeys_to_station_filtered_by_month,
    count_journeys_for_search,
    count_journeys_from_station,
    count_journeys_from_station_filter_by_month,
    count_journeys_instances,
    count_journeys_to_station,
    count_journeys_to_station_filter_by_month,
    top_n_departures, top_n_departures_filtered_by_month,
    top_n_destinations, top_n_destinations_filtered_by_month
} from "../helpers";

beforeEach(async ()=>{
    await AppDataSource.initialize()
} )

afterEach(async ()=>{
    await AppDataSource.destroy()
})

describe("Test journey controller: getAllJourneys", () => {
    it.each([[0,1], [0,5], [0,12], [5, 1], [5, 10], [103, 1], [103, 7]])
    ("Test with valid numeric values: skip %d and take %d", async (skip: number, take: number)=>{
        const spy = jest.spyOn(Journey, 'getPaginatedJourneys');
        const result: Journey[] =  await getAllJourneys(skip, take)
        expect(spy).toHaveBeenCalled()
        expect(spy).toBeCalledTimes(1)
        expect(result).toHaveLength(take)
        result.forEach((element: Journey) => {
            expect(element).toBeInstanceOf(Journey)
        })
    })
    test("Test skip at limit of range", async() => {
        const spy = jest.spyOn(Journey, 'getPaginatedJourneys');
        const totalJourneys:number = await Journey.countTotal()
        const skip:number = totalJourneys-2
        const result: Journey[] =  await getAllJourneys(skip, 9)
        expect(spy).toHaveBeenCalled()
        expect(spy).toBeCalledTimes(1)
        expect(result).toHaveLength(totalJourneys-skip)
        result.forEach((element: Journey) => {
            expect(element).toBeInstanceOf(Journey)
        })
    })
    it.each([[0,-1], [0,-5], [0,0], [2,0], [-1, 5], [-2,1], [-3,0]])
    ("Test with invalid numeric values: skip %d and take %d", async (skip:number, take: number)=>{
        const spy = jest.spyOn(Journey, 'getPaginatedJourneys');
        await expect(getAllJourneys(skip, take)).rejects.toThrowError(RangeError)
        expect(spy).toHaveBeenCalled()
        expect(spy).toBeCalledTimes(1)
    })
    it.each([[0, NaN], [5, NaN], [NaN, 1], [NaN, 10], [NaN,NaN]])("Test with NaN value", async (skip: number, take: number)=>{
        const spy = jest.spyOn(Journey, 'getPaginatedJourneys');
        await expect(getAllJourneys(skip, take)).rejects.toThrowError(TypeError)
        expect(spy).not.toHaveBeenCalled()
    })
})

describe("Test journey controller: countTotalJourneys", () => {
    test("Test that it returns the correct count of journeys", async() => {
        const totalJourneys:number = await countTotalJourneys()
        const expectedTotalJourneys:number = await count_journeys_instances()
        expect(totalJourneys).toEqual(expectedTotalJourneys)
    })
})

describe("Test journey controller: getNumberOfJourneysFromStation", () => {
    it.each([[1], [503]])("Test with valid inputs: station ID %d", async(id: number) => {
        const expectedNJourneys = await count_journeys_from_station(id)
        const spy = jest.spyOn(Journey, 'getNumberOfJourneysFromStation')
        const res:number = await getNumberOfJourneysFromStation(id)
        expect(spy).toHaveBeenCalled()
        expect(spy).toBeCalledTimes(1)
        expect(res).toEqual(expectedNJourneys)
    })
    it.each([[-1], [-5]])("Test with invalid numeric inputs, station ID %d", async(id: number)=>{
        const spy = jest.spyOn(Journey, 'getNumberOfJourneysFromStation')
        await expect(getNumberOfJourneysFromStation(id)).rejects.toThrowError(RangeError)
        expect(spy).toHaveBeenCalled()
        expect(spy).toBeCalledTimes(1)
    })
    it.each([[502], [2000]])("Test with not existent stations, station ID %d", async(id: number)=>{
        const spy = jest.spyOn(Journey, 'getNumberOfJourneysFromStation')
        const res: number = await getNumberOfJourneysFromStation(id)
        expect(spy).toHaveBeenCalled()
        expect(spy).toBeCalledTimes(1)
        expect(res).toEqual(0)
    })
    it.each([[503, 5], [1,6], [22,7]])("Test with valid ids and month: id %d month%d", async (id:number, month:number) =>{
        const expectedNJourneys:number = await count_journeys_from_station_filter_by_month(id, month)
        const spy = jest.spyOn(Journey, 'getNumberOfJourneysFromStation')
        const res:number = await getNumberOfJourneysFromStation(id, month)
        expect(spy).toHaveBeenCalled()
        expect(spy).toBeCalledTimes(1)
        expect(res).toEqual(expectedNJourneys)
    })
    it.each([[503, 4], [1, 3], [1, 9]])("Test with valid ids and months but month not in database: id %d month %d", async (id:number, month:number) =>{
        const spy = jest.spyOn(Journey, 'getNumberOfJourneysFromStation')
        const res: number = await getNumberOfJourneysFromStation(id, month)
        expect(spy).toHaveBeenCalled()
        expect(spy).toBeCalledTimes(1)
        expect(res).toEqual(0)
    })
    it.each([[503, 0], [1, 14], [503, -2]])("Test with valid ids and month not valid: id %d month %d", async(id:number, month:number) => {
        const spy = jest.spyOn(Journey, 'getNumberOfJourneysFromStation')
        await expect(getNumberOfJourneysFromStation(id, month)).rejects.toThrowError(RangeError)
        expect(spy).toHaveBeenCalled()
        expect(spy).toBeCalledTimes(1)
    })
    it.each([[NaN, 6], [NaN, 1], [NaN, 14], [503, NaN], [502, NaN], [50000, NaN]])("Test for NaN values: id %d month %d", async(id:number, month:number)=>{
        await expect(getNumberOfJourneysFromStation(id, month)).rejects.toThrowError(TypeError)
    })
})

describe("Test journey controller: getNumberOfJourneysToStation", () => {
    it.each([[1], [503]])("Test with invalid inputs: station ID %d", async(id:number) => {
        const spy = jest.spyOn(Journey, 'getNumberOfJourneysToStation')
        const res: number = await getNumberOfJourneysToStation(id)
        const expectedNJourneys = await count_journeys_to_station(id)
        expect(spy).toHaveBeenCalled()
        expect(spy).toBeCalledTimes(1)
        expect(res).toEqual(expectedNJourneys)
    })
    it.each([[-1], [-5]])("Test with invalid numeric inputs: station ID %d", async(id: number)=>{
        const spy = jest.spyOn(Journey, 'getNumberOfJourneysToStation')
        await expect(getNumberOfJourneysToStation(id)).rejects.toThrowError(RangeError)
        expect(spy).toHaveBeenCalled()
        expect(spy).toBeCalledTimes(1)
    })
    it.each([[502], [2000]])("Test with not existent stations: station ID %d", async(id:number)=>{
        const spy = jest.spyOn(Journey, 'getNumberOfJourneysToStation')
        const res:number = await getNumberOfJourneysToStation(id)
        expect(spy).toHaveBeenCalled()
        expect(spy).toBeCalledTimes(1)
        expect(res).toEqual(0)
    })
    it.each([[503, 5], [1,6], [22,7]])("Test with valid ids and month: id %d month%d", async (id:number, month:number) =>{
        const expectedNJourneys:number = await count_journeys_to_station_filter_by_month(id, month)
        const spy = jest.spyOn(Journey, 'getNumberOfJourneysToStation')
        const res:number = await getNumberOfJourneysToStation(id, month)
        expect(spy).toHaveBeenCalled()
        expect(spy).toBeCalledTimes(1)
        expect(res).toEqual(expectedNJourneys)
    })
    it.each([[503, 4], [1, 3], [1, 9]])("Test with valid ids and months but month not in database: id %d month %d", async (id:number, month:number) =>{
        const spy = jest.spyOn(Journey, 'getNumberOfJourneysToStation')
        const res: number = await getNumberOfJourneysToStation(id, month)
        expect(spy).toHaveBeenCalled()
        expect(spy).toBeCalledTimes(1)
        expect(res).toEqual(0)
    })
    it.each([[503, 0], [1, 14]])("Test with valid ids and month not valid: id %d month %d", async(id:number, month:number) => {
        const spy = jest.spyOn(Journey, 'getNumberOfJourneysToStation')
        await expect(getNumberOfJourneysToStation(id, month)).rejects.toThrowError(RangeError)
        expect(spy).toHaveBeenCalled()
        expect(spy).toBeCalledTimes(1)
    })
    it.each([[NaN, 6], [NaN, 1], [NaN, 14], [503, NaN], [502, NaN], [50000, NaN]])("Test for NaN values: id %d month %d", async(id:number, month:number)=>{
        await expect(getNumberOfJourneysToStation(id, month)).rejects.toThrowError(TypeError)
    })
})

describe("Test journey controller: getPaginatedJourneysForSearch", () => {
    it.each([[0,1, "A", ""], [0,5, "", "Kirkko"], [0,12, "", ""], [5, 1, "A", "K"], [5, 10, "La", "A"], [103, 1, "Kirkko", ""], [103, 7, "", "A"]])
    ("Test with valid numeric values: skip %d and take %d and search departure start with %s and return %s", async (skip: number, take: number, patternDepartureStation: string, patternReturnStation: string)=>{
        const spy = jest.spyOn(Journey, 'getPaginatedJourneysForSearch');
        const result: Journey[] =  await getPaginatedJourneysForSearch(skip, take, patternDepartureStation, patternReturnStation)
        expect(spy).toHaveBeenCalled()
        expect(spy).toBeCalledTimes(1)
        expect(result).toHaveLength(take)
        result.forEach((element) => {
            expect(element).toBeInstanceOf(Journey)
        })
    })
    it.each([[0, 5, "A2", "", 0]])
    ("Test with search input that returns less journeys than the take require: skip %d take 5d search %s, %s expected %d", async(skip: number, take: number, patternDepartureStation: string, patternReturnStation: string, expectedLength: number)=>{
        const spy = jest.spyOn(Journey, 'getPaginatedJourneysForSearch');
        const result: Journey[] =  await getPaginatedJourneysForSearch(skip, take, patternDepartureStation, patternReturnStation)
        expect(spy).toHaveBeenCalled()
        expect(spy).toBeCalledTimes(1)
        expect(result).toHaveLength(expectedLength)
        result.forEach((element: Journey) => {
            expect(element).toBeInstanceOf(Journey)
        })
    })
    test("Test skip at limit of range", async() => {
        const patternDepartureStation:string = "A"
        const patternReturnStation:string = "K"
        const spy = jest.spyOn(Journey, 'getPaginatedJourneysForSearch');
        const totalJourneys:number = await Journey.countJourneysForSearch(patternDepartureStation, patternReturnStation)
        const skip:number = totalJourneys-2
        const result: Journey[] =  await getPaginatedJourneysForSearch(skip, 9, patternDepartureStation, patternReturnStation)
        expect(spy).toHaveBeenCalled()
        expect(spy).toBeCalledTimes(1)
        expect(result).toHaveLength(totalJourneys-skip)
        result.forEach((element) => {
            expect(element).toBeInstanceOf(Journey)
        })
    })
    it.each([[0,-1, "A", ""], [0,-5, "", "Kirkko"], [0,0, "La", "A"], [2,0,"A", "Ki"], [-1, 5, "", ""], [-2,1, "Kirkko", "A"], [-3,0, "A", "Kirkko"]])
    ("Test with invalid numeric values: skip %d and take %d", async (skip: number, take: number, patternDepartureStation: string, patternReturnStation:string)=>{
        const spy = jest.spyOn(Journey, 'getPaginatedJourneysForSearch');
        await expect(getPaginatedJourneysForSearch(skip, take, patternDepartureStation, patternReturnStation)).rejects.toThrowError(RangeError)
        expect(spy).toHaveBeenCalled()
        expect(spy).toBeCalledTimes(1)
    })
    it.each([[0, NaN, "", "A"], [5, NaN, "A", ""], [NaN, 1, "A", "K"], [NaN, 10,"", ""], [NaN,NaN, "La", ""]])("Test with NaN value", async (skip: number, take: number, patternDepartureStation:string, patternReturnStation:string)=>{
        const spy = jest.spyOn(Journey, 'getPaginatedJourneysForSearch');
        await expect(getPaginatedJourneysForSearch(skip, take, patternDepartureStation, patternReturnStation)).rejects.toThrowError(TypeError)
        expect(spy).not.toHaveBeenCalled()
    })

})

describe("Test journey controller: countJourneysWithDepartureStationStartingWith", ()=>{
    it.each([["A", ""], ["","Kirkko"], ["", ""], ["A2", "A"], ["A", "La"], ["A", "K"]])("Test response to be correct for search with departure start with %s and return %s", async(patternDepartureStation:string, patternReturnStation:string) =>{
        const expectedCountJourneys: number = await count_journeys_for_search(patternDepartureStation, patternReturnStation)
        const countJourneys: number = await countJourneysForSearch(patternDepartureStation, patternReturnStation)
        expect(countJourneys).toEqual(expectedCountJourneys)
    })
})

describe("Test journey controller: avgJourneysFrom", () => {
    it.each([[1], [503]])("Test with valid inputs: station ID %d", async(id: number) => {
        const spy = jest.spyOn(Journey, 'getAverageDistanceFrom')
        const res: number = await getAvgDistanceJourneysFrom(id)
        const expectedAvg: number = await avg_distance_journeys_from_station(id)
        expect(spy).toHaveBeenCalled()
        expect(spy).toBeCalledTimes(1)
        expect(res).toEqual(expectedAvg)
    })
    it.each([[-1], [-5]])("Test with invalid numeric inputs: station ID %d", async(id: number)=>{
        const spy = jest.spyOn(Journey, 'getAverageDistanceFrom')
        await expect(getAvgDistanceJourneysFrom(id)).rejects.toThrowError(RangeError)
        expect(spy).toHaveBeenCalled()
        expect(spy).toBeCalledTimes(1)
    })
    test("Test with invalid NaN input", async()=>{
        const spy = jest.spyOn(Journey, 'getAverageDistanceFrom')
        await expect(getAvgDistanceJourneysFrom(NaN)).rejects.toThrowError(TypeError)
        expect(spy).not.toHaveBeenCalled()
    })
    it.each([[502], [2000]])("Test with not existent stations: station ID %d", async(id:number )=>{
        const spy = jest.spyOn(Journey, 'getAverageDistanceFrom')
        const res:number = await getAvgDistanceJourneysFrom(id)
        expect(spy).toHaveBeenCalled()
        expect(spy).toBeCalledTimes(1)
        expect(res).toEqual(0)
    })
    it.each([[1, 5], [503, 6], [503, 9]])("Test with valid inputs: station ID %d month %d", async(id:number, month:number) => {
        const spy = jest.spyOn(Journey, 'getAverageDistanceFrom')
        const res: number = await getAvgDistanceJourneysFrom(id, month)
        const expectedAvg: number = await avg_distance_journeys_from_station_filtered_by_month(id, month)
        expect(spy).toHaveBeenCalled()
        expect(spy).toBeCalledTimes(1)
        expect(res).toEqual(expectedAvg)
    })
    it.each([[1, -2], [503, 13], [503, 0]])("Test not valid months: station ID %d month %d", async(id:number, month:number) => {
        const spy = jest.spyOn(Journey, 'getAverageDistanceFrom')
        await expect(getAvgDistanceJourneysFrom(id, month)).rejects.toThrowError(RangeError)
        expect(spy).toHaveBeenCalled()
        expect(spy).toBeCalledTimes(1)
    })
    it.each([[503, NaN], [NaN, NaN]])("Test with not valid types NaN: id %d month %d", async(id: number, month:number) => {
        const spy = jest.spyOn(Journey, 'getAverageDistanceFrom')
        await expect(getAvgDistanceJourneysFrom(id, month)).rejects.toThrowError(TypeError)
        expect(spy).not.toHaveBeenCalled()
    })
})

describe("Test journey controller: avgJourneysTo", () => {
    it.each([[1], [503]])("Test with invalid inputs: station ID %d", async(id: number) => {
        const spy = jest.spyOn(Journey, 'getAverageDistanceTo')
        const res: number = await getAvgDistanceJourneysTo(id)
        const expectedAvg: number = await avg_distance_journeys_to_station(id)
        expect(spy).toHaveBeenCalled()
        expect(spy).toBeCalledTimes(1)
        expect(res).toEqual(expectedAvg)
    })
    it.each([[-1], [-5]])("Test with invalid numeric inputs: station ID %d", async(id)=>{
        const spy = jest.spyOn(Journey, 'getAverageDistanceTo')
        await expect(getAvgDistanceJourneysTo(id)).rejects.toThrowError(RangeError)
        expect(spy).toHaveBeenCalled()
        expect(spy).toBeCalledTimes(1)
    })
    test("Test with invalid NaN input", async()=>{
        const spy = jest.spyOn(Journey, 'getAverageDistanceTo')
        await expect(getAvgDistanceJourneysTo(NaN)).rejects.toThrowError(TypeError)
        expect(spy).not.toHaveBeenCalled()
    })
    it.each([[502], [2000]])("Test with not existent stations: station ID %d", async(id:number)=>{
        const spy = jest.spyOn(Journey, 'getAverageDistanceTo')
        const res:number = await getAvgDistanceJourneysTo(id)
        expect(spy).toHaveBeenCalled()
        expect(spy).toBeCalledTimes(1)
        expect(res).toEqual(0)
    })
    it.each([[1, 5], [503, 6], [503, 9]])("Test with valid inputs: station ID %d month %d", async(id:number, month:number) => {
        const spy = jest.spyOn(Journey, 'getAverageDistanceTo')
        const res: number = await getAvgDistanceJourneysTo(id, month)
        const expectedAvg: number = await avg_distance_journeys_to_station_filtered_by_month(id, month)
        expect(spy).toHaveBeenCalled()
        expect(spy).toBeCalledTimes(1)
        expect(res).toEqual(expectedAvg)
    })
    it.each([[1, -2], [503, 13], [503, 0]])("Test not valid months: station ID %d month %d", async(id:number, month:number) => {
        const spy = jest.spyOn(Journey, 'getAverageDistanceTo')
        await expect(getAvgDistanceJourneysTo(id, month)).rejects.toThrowError(RangeError)
        expect(spy).toHaveBeenCalled()
        expect(spy).toBeCalledTimes(1)
    })
    it.each([[503, NaN], [NaN, NaN]])("Test with not valid types NaN: id %d month %d", async(id: number, month:number) => {
        const spy = jest.spyOn(Journey, 'getAverageDistanceTo')
        await expect(getAvgDistanceJourneysTo(id, month)).rejects.toThrowError(TypeError)
        expect(spy).not.toHaveBeenCalled()
    })
})

describe("Test journey controller: getTopNDestinations", ()=>{
    it.each([[503, 10],[1,5],[1,3], [503, 0]])("Test with invalid inputs: station ID %d and limit %d", async(id:number, limit:number)=>{
        const spy = jest.spyOn(Journey, 'getTopNDestinations')
        const res:{count:number, Return_station_ID: number, Name:string }[] = await getTopNDestinations(id, limit)
        const expectedStations = await top_n_destinations(id, limit)
        expect(spy).toHaveBeenCalled()
        expect(spy).toBeCalledTimes(1)
        expect(res.length).toBeLessThanOrEqual(limit)
        expect(res.length).toEqual(expectedStations.length)
        for(let i: number=0; i<limit-1; i++){
            expect(res[i]).toMatchObject(expectedStations[i])
        }
    })
    it.each([[-5, 10], [0, 5], [503, -1]])("Test with invalid inputs: station ID %d and limit %d", async(id:number, limit:number) =>{
        const spy = jest.spyOn(Journey, 'getTopNDestinations')
        await expect(getTopNDestinations(id, limit)).rejects.toThrowError(RangeError)
        expect(spy).toHaveBeenCalled()
        expect(spy).toBeCalledTimes(1)
    })
    it.each([[5000, 5], [502, 10]])("Test with not existent stations: station ID %d", async(id:number, limit:number)=>{
        const spy = jest.spyOn(Journey, 'getTopNDestinations')
        const res: {count:number, Return_station_ID: number, Name:string}[] = await getTopNDestinations(id, limit)
        expect(spy).toHaveBeenCalled()
        expect(spy).toBeCalledTimes(1)
        expect(res).toHaveLength(0)
    })
    it.each([[503, 10, 5], [1,4,5], [503, 1, 7], [1, 5, 6]])("Test for existent id, valid limit and month in the database: id %d limit %d month %d", async(id:number, limit:number, month:number) =>{
        const spy = jest.spyOn(Journey, 'getTopNDestinations')
        const res: {count:number, Return_station_ID:number, Name:string}[] = await getTopNDestinations(id, limit, month)
        const expectedStations = await top_n_destinations_filtered_by_month(id, limit, month)
        expect(spy).toHaveBeenCalled()
        expect(spy).toBeCalledTimes(1)
        expect(res.length).toBeLessThanOrEqual(limit)
        expect(res.length).toEqual(expectedStations.length)
        for(let i=0; i<limit-1; i++){
            expect(res[i]).toMatchObject(expectedStations[i])
        }
    })
    it.each([[503,10, 2], [1, 4, 12], [2, 5, 9]])("Test for existent id, valid limit and month in database: id %d limit %d month %d", async (id:number, limit:number, month:number) =>{
        const spy = jest.spyOn(Journey, 'getTopNDestinations')
        const res: {count:number, Return_station_ID:number, Name:string}[] = await getTopNDestinations(id, limit, month)
        expect(spy).toHaveBeenCalled()
        expect(spy).toBeCalledTimes(1)
        expect(res).toHaveLength(0)
    })
    it.each([[NaN, 10, 8], [1, NaN, 6], [503, 5, NaN]])("Test Nan values: id %d, limit %d, month %d", async(id:number, limit:number, month:number) => {
        const spy = jest.spyOn(Journey, 'getTopNDestinations')
        await expect(getTopNDestinations(id, limit, month)).rejects.toThrowError(TypeError)
        expect(spy).not.toHaveBeenCalled()
    })
    it.each([[503, 10, 13], [1, 5, 0], [503, 5, -1]])("Test month not valid: id %d, limit %d, month %d", async(id:number, limit:number, month:number) => {
        const spy = jest.spyOn(Journey, 'getTopNDestinations')
        await expect(getTopNDestinations(id, limit, month)).rejects.toThrowError(RangeError)
        expect(spy).toHaveBeenCalled()
        expect(spy).toBeCalledTimes(1)
    })
})

describe("Test journey controller: getTopNDepartures", ()=>{
    it.each([[503, 10],[1,5],[1,3], [503, 0]])("Test with invalid inputs: station ID %d and limit %d", async(id:number, limit:number)=>{
        const spy = jest.spyOn(Journey, 'getTopNDepartures')
        const res:{count:number, Departure_station_ID: number, Name:string }[] = await getTopNDepartures(id, limit)
        const expectedStations = await top_n_departures(id, limit)
        expect(spy).toHaveBeenCalled()
        expect(spy).toBeCalledTimes(1)
        expect(res.length).toBeLessThanOrEqual(limit)
        expect(res.length).toEqual(expectedStations.length)
        for(let i=0; i<limit-1; i++){
            expect(res[i]).toMatchObject(expectedStations[i])
        }
    })
    it.each([[-5, 10], [0, 5], [503, -1]])("Test with invalid inputs: station ID %d and limit %d", async(id:number, limit:number) =>{
        const spy = jest.spyOn(Journey, 'getTopNDepartures')
        await expect(getTopNDepartures(id, limit)).rejects.toThrowError(RangeError)
        expect(spy).toHaveBeenCalled()
        expect(spy).toBeCalledTimes(1)
    })
    it.each([[5000, 5], [502, 10]])("Test with not existent stations: station ID %d", async(id:number, limit:number)=>{
        const spy = jest.spyOn(Journey, 'getTopNDepartures')
        const res: {count:number, Departure_station_ID: number, Name:string}[] = await getTopNDepartures(id, limit)
        expect(spy).toHaveBeenCalled()
        expect(spy).toBeCalledTimes(1)
        expect(res).toHaveLength(0)
    })
    it.each([[503, 10, 5], [503, 1, 7], [1, 5, 6]])("Test for existent id, valid limit and month in the database: id %d limit %d month %d", async(id:number, limit:number, month:number) =>{
        const spy = jest.spyOn(Journey, 'getTopNDepartures')
        const res: {count:number, Departure_station_ID:number, Name:string}[] = await getTopNDepartures(id, limit, month)
        const expectedStations = await top_n_departures_filtered_by_month(id, limit, month)
        expect(spy).toHaveBeenCalled()
        expect(spy).toBeCalledTimes(1)
        expect(res.length).toBeLessThanOrEqual(limit)
        expect(res.length).toEqual(expectedStations.length)
        for(let i=0; i<limit-1; i++){
            expect(res[i]).toMatchObject(expectedStations[i])
        }
    })
    it.each([[503,10, 2], [1, 4, 12], [2, 5, 9]])("Test for existent id, valid limit and month in database: id %d limit %d month %d", async (id:number, limit:number, month:number) =>{
        const spy = jest.spyOn(Journey, 'getTopNDepartures')
        const res: {count:number, Departure_station_ID:number, Name:string}[] = await getTopNDepartures(id, limit, month)
        expect(spy).toHaveBeenCalled()
        expect(spy).toBeCalledTimes(1)
        expect(res).toHaveLength(0)
    })
    it.each([[NaN, 10, 8], [1, NaN, 6], [503, 5, NaN]])("Test Nan values: id %d, limit %d, month %d", async(id:number, limit:number, month:number) => {
        const spy = jest.spyOn(Journey, 'getTopNDepartures')
        await expect(getTopNDepartures(id, limit, month)).rejects.toThrowError(TypeError)
        expect(spy).not.toHaveBeenCalled()
    })
    it.each([[503, 10, 13], [1, 5, 0], [503, 5, -1]])("Test month not valid: id %d, limit %d, month %d", async(id:number, limit:number, month:number) => {
        const spy = jest.spyOn(Journey, 'getTopNDepartures')
        await expect(getTopNDepartures(id, limit, month)).rejects.toThrowError(RangeError)
        expect(spy).toHaveBeenCalled()
        expect(spy).toBeCalledTimes(1)
    })
})
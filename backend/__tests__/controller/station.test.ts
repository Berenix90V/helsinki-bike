import {AppDataSource} from "../../src/db/data-sources";
import {Station} from "../../src/models/Station";
import {getAllStations} from "../../src/controllers/stations";


beforeEach(async ()=>{
    await AppDataSource.initialize()
} )

afterEach(async ()=>{
    await AppDataSource.destroy()
})

describe("Test stations controller: getAllStations", ()=> {
    test("Test that the function call the method to fetch all stations", async() => {
        const spy = jest.spyOn(Station, 'fetchAll')
        await getAllStations()
        expect(spy).toHaveBeenCalled()
    })
})
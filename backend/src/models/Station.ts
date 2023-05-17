import {BaseEntity, Column, Entity, Like, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Journey} from "./Journey";

@Entity({name: "stations", synchronize:false})
export class Station extends BaseEntity{
    @PrimaryGeneratedColumn('increment')
    declare ID: number

    @Column({
        type: "varchar",
        length: 100
    })
    declare Name_fi: string

    @Column({
        type: "varchar",
        length: 100
    })
    declare Name_sw: string

    @Column({
        type: "varchar",
        length: 100
    })
    declare Name: string

    @Column({
        type: "text",
    })
    declare Address_fi: string

    @Column({
        type: "text"
    })
    declare Address_sw: string

    @Column({
        type: "varchar",
        length: 100,
    })
    declare City_fi: string

    @Column({
        type: "varchar",
        length: 100
    })
    declare City_sw: string

    @Column({
        type: "varchar",
        length: 100,
        nullable:false
    })
    declare Operator: string

    @Column({
        type:"int"
    })
    declare Capacity: number

    @Column({
        type: "float",
        nullable:false
    })
    declare x: number

    @Column({
        type: "float",
        nullable:false
    })
    declare y: number

    @OneToMany(() => Journey, journey=> journey.Departure_station)
    declare Departure_journeys: Journey[]

    @OneToMany(() => Journey, journey=> journey.Return_station)
    declare Return_journeys: Journey[]

    /**
     * Return number of stations
     * @returns {number} : total stations
     */
    static async countTotal(): Promise<number>{
        return await Station.count({
            cache:true
        })
    }

    /**
     * Return all stations
     * @returns {Station[]} : list of stations
     */
    static async fetchAll(): Promise<Station[]>{
        return await Station.find({
            order:{
                ID: "ASC"
            }
        })
    }

    /**
     * Return list of n stations after skipping m stations
     * @param {number} skip : stations to be skipped
     * @param {number} take : stations to be taken
     *
     * @returns {Station[]}: list of stations
     */
    static async getPaginatedStations(skip: number, take:number): Promise<Station[]>{
        const totalStations = await Journey.countTotal()
        if (take<=0){
            throw RangeError("Bad request: The number of required objects must be > 0")
        }
        if (skip<0){
            throw RangeError("Bad request: The beginning point must be >= 0")
        }
        if (skip>=totalStations){
            throw RangeError("Bad request: The beginning point must be < total records")
        }
        return await Station.find({
            order:{
                ID:"ASC"
            },
            skip: skip,
            take: take
        })
    }

    /**
     * Return number of stations that match search criteria for station name
     * @param {string} patternName :  search criteria for station name
     */
    static async countStationForSearch(patternName:string): Promise<number>{
        return await Station.count({
            where:{
                Name:Like(patternName+"%")
            }
        })
    }

    /**
     * Return n stations after skipping m stations that match criteria
     * @param {number} skip : number of stations to be skipped
     * @param {number} take :  number of stations to be taken
     * @param {string} patternName : search criteria for station name
     *
     * @returns {Station[]} : list of stations matching the search pattern
     */
    static async getPaginatedStationsForSearch(skip:number, take:number, patternName:string): Promise<Station[]>{
        const totalStations:number = await Station.countStationForSearch(patternName)
        if (take<=0){
            throw RangeError("Bad request: The number of required objects must be > 0")
        }
        if (skip<0){
            throw RangeError("Bad request: The beginning point must be >= 0")
        }
        if (skip !=0 && skip>=totalStations){
            throw RangeError("Bad request: The beginning point must be < total records")
        }
        return await Station.find({
            skip:skip,
            take:take,
            where:{
                Name:Like(patternName+"%")
            }
        })
    }

    /**
     * Return station by id
     * @param {number} id : id of the station to be selected
     *
     * @returns {Station} : station with id == id
     */
    static async getByID(id:number): Promise<Station>{
        if(id<=0)
            throw RangeError("Bad request: The ID must be >= 0")
        const station = await Station.findOneBy({ID:id})
        if(station === null){
            throw RangeError("Not found")
        }
        return station
    }
}
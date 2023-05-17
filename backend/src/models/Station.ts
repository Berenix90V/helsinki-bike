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


    static async countTotal(): Promise<number>{
        return await Station.count({
            cache:true
        })
    }
    static async fetchAll(): Promise<Station[]>{
        return await Station.find({
            order:{
                ID: "ASC"
            }
        })
    }
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

    static async countStationForSearch(patternName:string): Promise<number>{
        return await Station.count({
            where:{
                Name:Like(patternName+"%")
            }
        })
    }

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
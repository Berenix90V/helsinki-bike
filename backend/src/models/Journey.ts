import {BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Station} from "./Station";

@Entity({ name: "trips", synchronize:false})
export class Journey extends BaseEntity{
    @PrimaryGeneratedColumn('increment')
    declare  ID:number

    @Column({
        type: "timestamp",
        nullable: false
    })
    declare Departure_datetime: Date

    @Column({
        type: "timestamp",
        nullable:false
    })
    declare Return_datetime: Date

    @ManyToOne(() => Station, station => station.Departure_journeys)
    @JoinColumn({name:"Departure_station_ID"})
    declare Departure_station:Station

    @ManyToOne(() => Station, station => station.Return_journeys)
    @JoinColumn({name:"Return_station_ID"})
    declare Return_station: Station

    @Column({
        type: "float",
        nullable: false
    })
    declare Covered_distance: number

    @Column({
        type: "int",
        nullable:false
    })
    declare Duration: number

    static async fetchFirstNJourneys(take:number): Promise<Journey[]>{
        if (take<=0){
            throw RangeError("Bad request: The number of required objects must be > 0")
        }
        return await Journey.find({
            relations: {
                Departure_station: true,
                Return_station: true
            },
            skip: 0,
            take: take
        })
    }

    static async getPaginatedJourneys(take:number, skip: number): Promise<Journey[]>{
        if (take<=0){
            throw RangeError("Bad request: The number of required objects must be > 0")
        }
        if (skip<0){
            throw RangeError("Bad request: The beginning point must be >= 0")
        }
        return await Journey.find({
            relations: {
                Departure_station: true,
                Return_station: true
            },
            skip: skip,
            take: take
        })
    }

    static async getNumberOfJourneysFromStation(id:number):Promise<number>{
        if (id<=0){
            throw RangeError("Bad request: ID must be > 0")
        }
        return await Journey
            .createQueryBuilder('trips')
            .select("Departure_station_ID")
            .where("trips.Departure_station_ID = :id", { id: id})
            .getCount()
    }

    static async getNumberOfJourneysToStation(id:number):Promise<number>{
        if (id<=0){
            throw RangeError("Bad request: ID must be > 0")
        }
        return await Journey
            .createQueryBuilder('trips')
            .select("Return_station_ID")
            .where("trips.Return_station_ID = :id", { id: id})
            .getCount()
    }

}
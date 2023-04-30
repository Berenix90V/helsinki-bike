import {BaseEntity, Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity({ name: "trips"})
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
    @Column({
        type: "int",
        nullable:false
    })
    declare Departure_station_ID:number
    @Column({
        type: "int",
        nullable: false
    })
    declare Return_station_ID: number
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
        if (take<=0)
            throw RangeError("Bad request: The number of required objects must be >= 0")
        return await Journey.find({
            skip: 0,
            take: take
        })
}

}
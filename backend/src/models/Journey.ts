import {BaseEntity, Column, Entity} from "typeorm";

@Entity()
export class Journey extends BaseEntity{
    @Column()
    declare  ID:number
    @Column()
    declare Departure_datetime: Date
    @Column()
    declare Return_datetime: Date
    @Column()
    declare Departure_station_ID:number
    @Column()
    declare Return_station_ID: number
    @Column()
    declare Covered_distance: number
    @Column()
    declare Duration: number

    static async fetchAll(): Promise<Journey[]>{
        return Journey.find({
            skip: 0,
            take: 100
        })
}

}
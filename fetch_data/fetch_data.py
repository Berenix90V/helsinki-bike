from pandas import DataFrame, read_csv, concat


def fetch_trips() -> DataFrame:
    may_trips: DataFrame = read_csv(r"https://dev.hsl.fi/citybikes/od-trips-2021/2021-05.csv")
    print("Read may trips")
    print(may_trips.head())

    june_trips: DataFrame = read_csv(r"https://dev.hsl.fi/citybikes/od-trips-2021/2021-06.csv")
    print("Read june trips")
    print(june_trips.head())

    july_trips: DataFrame = read_csv(r"https://dev.hsl.fi/citybikes/od-trips-2021/2021-07.csv")
    print("Read july trips")
    print(july_trips.head())

    return concat([may_trips, june_trips, july_trips], ignore_index=True)


def fetch_stations() -> DataFrame:
    stations: DataFrame = read_csv(r"https://opendata.arcgis.com/datasets/726277c507ef4914b0aec3cbcfcbfafc_0.csv")
    print("Read stations")
    print(stations.head())
    return stations

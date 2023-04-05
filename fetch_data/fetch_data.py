from pandas import DataFrame, read_csv, concat


def fetch_trips() -> DataFrame:
    """
    Read from csv files and return the data into a single dataframe
    Returns
    -------
    trips: DataFrame
        the dataframe containing the data from the 3 csv files
    """
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
    """
    Read from the csv file and return the data into a daataframe.

    Returns
    -------
    stations: DataFrame
        the dataframe containing the stations
    """
    stations: DataFrame = read_csv(r"https://opendata.arcgis.com/datasets/726277c507ef4914b0aec3cbcfcbfafc_0.csv")
    print("Read stations")
    print(stations.head())
    return stations

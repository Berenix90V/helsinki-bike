from pandas import DataFrame, read_csv, concat
from pandera import DataFrameSchema, Column, Check

# Read files
from pandera.errors import SchemaErrors

may_trips: DataFrame = read_csv(r"https://dev.hsl.fi/citybikes/od-trips-2021/2021-05.csv")
print("Read may trips")
print(may_trips.head())

june_trips: DataFrame = read_csv(r"https://dev.hsl.fi/citybikes/od-trips-2021/2021-06.csv")
print("Read june trips")
print(june_trips.head())

july_trips: DataFrame = read_csv(r"https://dev.hsl.fi/citybikes/od-trips-2021/2021-07.csv")
print("Read july trips")
print(july_trips.head())

stations: DataFrame = read_csv(r"https://opendata.arcgis.com/datasets/726277c507ef4914b0aec3cbcfcbfafc_0.csv")
print("Read stations")
print(stations.head())

trips: DataFrame = concat([may_trips, june_trips, july_trips], ignore_index=True)

# Validate data
trips_schema = DataFrameSchema({
    'Departure_datetime': Column(str),
    'Return_datetime': Column(str),
    'Departure_station_id': Column(int),
    'Return_station_id': Column(int),
    'Covered_distance_in_m': Column(float, Check.greater_than_or_equal_to(10.0)),
    'Duration_in_s': Column(int, Check.greater_than_or_equal_to(10))
})
stations_schema = DataFrameSchema({
    'ID': Column(int),
    'Name_fi': Column(str),
    'Name_sv': Column(str),
    'Name_eng': Column(str),
    'Address_fi': Column(str),
    'Address_sv': Column(str),
    'City_fi': Column(str),
    'City_sv': Column(str),
    'Operator': Column(str),
    'Capacity': Column(str),
    'x': Column(str),
    'y': Column(str)
})

# Eliminate redundant or obsolete information
trips.drop(['Departure station name', 'Return station name'], axis=1, inplace=True)
stations.drop(['FID'], axis=1, inplace=True)

# Fix column names
trips.rename(columns={
    'Departure': 'Departure_datetime',
    'Return': 'Return_datetime',
    'Covered distance (m)': 'Covered_distance_in_m',
    'Duration (sec.)': 'Duration_in_s'
}, inplace=True)
trips.columns = trips.columns.str.replace(' ', '_')
stations.columns = ['ID', 'Name_fi', 'Name_sv', 'Name_eng', 'Address_fi', 'Address_sv', 'City_fi',
                    'City_sv', 'Operator', 'Capacity', 'x', 'y']
fail_index: list = []
try:
    trips = trips_schema.validate(trips, lazy=True)
except SchemaErrors as err:
    fail_index = err.failure_cases['index']
finally:
    trips = trips[~trips.index.isin(fail_index)]
    trips = trips.dropna()

print(trips.columns)
print("Types: ", trips.dtypes)
print(stations.columns)

print(trips.loc[trips['Covered_distance_in_m'] < 10.0])
print(trips.loc[trips['Duration_in_s'] < 10])

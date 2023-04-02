from pandas import DataFrame, read_csv
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

print(may_trips.columns)
print("Types: ", may_trips.dtypes)
print(stations.columns)

# Validate data
trips_schema = DataFrameSchema({
    'Departure': Column(str),
    'Return': Column(str),
    'Departure station id': Column(int),
    'Departure station name': Column(str),
    'Return station id': Column(int),
    'Return station name': Column(str),
    'Covered distance (m)': Column(float, Check.greater_than_or_equal_to(10.0)),
    'Duration (sec.)': Column(int, Check.greater_than_or_equal_to(10))
})
trips_dfs: [DataFrame] = [may_trips, june_trips, july_trips]
fail_index: list = []


try:
    may_trips = trips_schema.validate(may_trips, lazy=True)
except SchemaErrors as err:
    fail_index = err.failure_cases['index']
finally:
    may_trips = may_trips[~may_trips.index.isin(fail_index)]
    may_trips = may_trips.dropna()

print(may_trips.loc[may_trips['Covered distance (m)'] < 10.0])
print(may_trips.loc[may_trips['Duration (sec.)'] < 10])

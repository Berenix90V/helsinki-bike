from io import StringIO

from dotenv import dotenv_values
from pandas import DataFrame, read_csv, concat
from pandera import DataFrameSchema, Column, Check
from pandera.errors import SchemaErrors
from sqlalchemy import URL, create_engine, MetaData, Table, Integer, String, Float, DateTime, ForeignKey, \
    CheckConstraint
from sqlalchemy import Column as Kolumn
from sqlalchemy_utils import database_exists, create_database

# Read files
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

# Validation schemas
trips_schema = DataFrameSchema({
    'Departure_datetime': Column(str, Check.str_matches("^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$")),
    'Return_datetime': Column(str, Check.str_matches("^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$")),
    'Departure_station_ID': Column(int, Check.isin(stations['ID']), nullable=False),
    'Return_station_ID': Column(int, Check.isin(stations['ID']), nullable=False),
    'Covered_distance_in_m': Column(float, Check.greater_than_or_equal_to(10.0)),
    'Duration_in_s': Column(int, Check.greater_than_or_equal_to(10))
})
stations_schema = DataFrameSchema({
    'ID': Column(int, nullable=False),
    'Name_fi': Column(str),
    'Name_sv': Column(str),
    'Name_eng': Column(str),
    'Address_fi': Column(str),
    'Address_sv': Column(str),
    'City_fi': Column(str),
    'City_sv': Column(str),
    'Operator': Column(str),
    'Capacity': Column(int),
    'x': Column(float),
    'y': Column(float)
})

# Eliminate redundant or obsolete information
trips.drop(['Departure station name', 'Return station name'], axis=1, inplace=True)
stations.drop(['FID'], axis=1, inplace=True)

# Fix column names
trips.columns = ['Departure_datetime', 'Return_datetime', 'Departure_station_ID', 'Return_station_ID',
                 'Covered_distance_in_m', 'Duration_in_s']
stations.columns = ['ID', 'Name_fi', 'Name_sv', 'Name_eng', 'Address_fi', 'Address_sv', 'City_fi',
                    'City_sv', 'Operator', 'Capacity', 'x', 'y']

# Validate data
fail_index: list = []
try:
    stations = stations_schema.validate(trips, lazy=True)
except SchemaErrors as err:
    fail_index = err.failure_cases['index']
finally:
    stations = stations[~stations.index.isin(fail_index)]


fail_index: list = []
try:
    trips = trips_schema.validate(trips, lazy=True)
except SchemaErrors as err:
    fail_index = err.failure_cases['index']
finally:
    trips = trips[~trips.index.isin(fail_index)]
    trips = trips.dropna()

print(trips.columns)
print(trips.loc[trips['Departure_station_ID'] == 94])
print(stations.loc[stations['ID'] == 94])


# populate db
config = dotenv_values()
url_object = URL.create(
    "postgresql",
    username=config['DB_USER'],
    password=config['DB_PASSWORD'],
    host=config['DB_HOST'],
    database=config['DATABASE'],
)
engine = create_engine(url_object)
if not database_exists(engine.url):
    create_database(engine.url)

meta = MetaData()

station_table = Table(
    'stations', meta,
    Kolumn('ID', Integer, primary_key=True),
    Kolumn('Name_fi', String),
    Kolumn('Name_sv', String),
    Kolumn('Name', String),
    Kolumn('Address_fi', String),
    Kolumn('Address_sv', String),
    Kolumn('City_fi', String, default="Helsinki", nullable=False),
    Kolumn('City_sv', String, default="Helsingfors", nullable=False),
    Kolumn('Operator', String),
    Kolumn('Capacity', Integer),
    Kolumn('x', Float),
    Kolumn('y', Float)
)

trip_table = Table(
    'trips', meta,
    Kolumn('ID', Integer, primary_key=True),
    Kolumn('Departure_datetime', DateTime),
    Kolumn('Return_datetime', DateTime),
    Kolumn('Departure_station_ID', Integer, ForeignKey("stations.ID"), nullable=False),
    Kolumn('Return_station_ID', Integer, ForeignKey('stations.ID'), nullable=False),
    Kolumn('Covered_distance_in_m', Float, CheckConstraint('"Covered_distance_in_m">=10')),
    Kolumn('Duration_in_s', Integer, CheckConstraint('"Duration_in_s">=10'))
)

meta.create_all(engine)

# station insertion
# data preparation
output = StringIO()
stations.to_csv(output, sep='\t', header=False, encoding='utf-8', index=False)
output.seek(0)
# insert data
connection = engine.raw_connection()
cursor = connection.cursor()
cursor.copy_from(output, "stations", sep='\t', null='')
connection.commit()
cursor.close()

# trips insertion
# data preparation
output = StringIO()
trips.to_csv(output, sep='\t', header=False, encoding='utf-8', index=True)
output.seek(0)
# insert data
connection = engine.raw_connection()
cursor = connection.cursor()
cursor.copy_from(output, "trips", sep='\t', null='')
connection.commit()
cursor.close()

stations["Citi_fi"] = stations['City_fi'].str.strip().replace('', 'Helsinki')
stations["Citi_sv"] = stations['City_sv'].str.strip().replace('', 'Helsingfors')




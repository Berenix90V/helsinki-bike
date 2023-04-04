from dotenv import dotenv_values
from pandas import DataFrame, read_csv, concat
from pandera import DataFrameSchema
from sqlalchemy import URL, create_engine, MetaData
from sqlalchemy_utils import database_exists, create_database
from populate_db_functions import populate_db, return_stations_table, return_trips_table
from validation_functions import validate_df, return_stations_schema, return_trips_schema

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
trips_schema: DataFrameSchema = return_trips_schema(stations)
stations_schema: DataFrameSchema = return_stations_schema()

# Eliminate redundant or obsolete information
trips.drop(['Departure station name', 'Return station name'], axis=1, inplace=True)
stations.drop(['FID'], axis=1, inplace=True)

# Fix column names
trips.columns = ['Departure_datetime', 'Return_datetime', 'Departure_station_ID', 'Return_station_ID',
                 'Covered_distance_in_m', 'Duration_in_s']
stations.columns = ['ID', 'Name_fi', 'Name_sv', 'Name_eng', 'Address_fi', 'Address_sv', 'City_fi',
                    'City_sv', 'Operator', 'Capacity', 'x', 'y']

# Validate data
stations = validate_df(stations, stations_schema)
trips = validate_df(trips, trips_schema)
trips = trips.dropna()


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

meta: MetaData = MetaData()

station_table = return_stations_table(meta)

trip_table = return_trips_table(meta)

meta.create_all(engine)

stations["City_fi"] = stations['City_fi'].str.strip().replace('', 'Helsinki')
stations["City_sv"] = stations['City_sv'].str.strip().replace('', 'Helsingfors')

# station insertion
print(stations.columns)
populate_db(engine, stations, "stations", "\t", 'utf-8', False)

# trips insertion
populate_db(engine, trips, "trips", "\t", 'utf-8', True)

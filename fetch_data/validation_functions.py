from pandas import DataFrame
from pandera.errors import SchemaErrors
from pandera import DataFrameSchema, Column, Check


def validate_df(df: DataFrame, schema: DataFrameSchema) -> DataFrame:
    fail_index: list = []
    try:
        df = schema.validate(df, lazy=True)
    except SchemaErrors as err:
        fail_index = err.failure_cases['index']
    finally:
        df = df[~df.index.isin(fail_index)]
    return df


def return_stations_schema() -> DataFrameSchema:
    return DataFrameSchema({
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


def return_trips_schema(stations: DataFrame) -> DataFrameSchema:
    return DataFrameSchema({
        'Departure_datetime': Column(str, Check.str_matches("^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$")),
        'Return_datetime': Column(str, Check.str_matches("^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$")),
        'Departure_station_ID': Column(int, Check.isin(stations['ID']), nullable=False),
        'Return_station_ID': Column(int, Check.isin(stations['ID']), nullable=False),
        'Covered_distance_in_m': Column(float, Check.greater_than_or_equal_to(10.0)),
        'Duration_in_s': Column(int, Check.greater_than_or_equal_to(10))
    })

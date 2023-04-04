# helsinki-bike
Web application to visualize data about journeys of city bikes in Helsinki

## Prerequisites

## Configurations

## Run

## Tests

## Technologies
Data fetch and validation: Python script. I choose Python because it's easier to manage big data structure with this language thanks to its library dedicated to data analysis.
Backend: Node js, Typescript
Frontend: React

## Software structure
### Fetch data
Features implemented:
- import data reading csv files from urls
- validated data filtering out trips that lasts less than 10 seconds or with a length < 10m
- validated data checking their types, format and consistency where necessary (station ID present in trips must exist in stations)
- eliminated unnecessary or redundant columns (FID, Departure station name and Destination station name)
- properly renamed columns into '_' spaced name and more readable names



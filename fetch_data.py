import pandas as pd

may_df = pd.read_csv(r"https://dev.hsl.fi/citybikes/od-trips-2021/2021-05.csv")
june_df = pd.read_csv(r"https://dev.hsl.fi/citybikes/od-trips-2021/2021-06.csv")
july_df = pd.read_csv(r"https://dev.hsl.fi/citybikes/od-trips-2021/2021-07.csv")
stations_df = pd.read_csv(r"https://opendata.arcgis.com/datasets/726277c507ef4914b0aec3cbcfcbfafc_0.csv")
print(may_df.head())

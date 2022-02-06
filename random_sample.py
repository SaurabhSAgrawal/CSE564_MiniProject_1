import pandas as pd

data = pd.read_csv("CarRentalData.csv")
data = data.sample(1000)

print(data)

data.to_csv('CarRentalData_Sampled.csv')

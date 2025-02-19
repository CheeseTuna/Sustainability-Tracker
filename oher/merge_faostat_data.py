import pandas as pd

livestock_df = pd.read_csv("FAOSTAT_data_Emissions-from-Livestock-2025.csv")
crops_df = pd.read_csv("FAOSTAT_data_Emissions-from-Crops-2025.csv")
energy_df = pd.read_csv("FAOSTAT_data_Emissions-from-Energy-use-in-agriculture-2025.csv")

# Select relevant columns
livestock_df = livestock_df[["Year", "Emission_Type", "Emissions_CO2"]]
crops_df = crops_df[["Year", "Emission_Type", "Emissions_CO2"]]
energy_df = energy_df[["Year", "Emission_Type", "Emissions_CO2"]]

# Add a category column
livestock_df["Category"] = "Livestock"
crops_df["Category"] = "Crops"
energy_df["Category"] = "Energy"

# Merge all datasets into one
merged_df = pd.concat([livestock_df, crops_df, energy_df])

# Convert to JSON
merged_df.to_json("uk_agriculture_emissions.json", orient="records")

print("✅ Merged data saved as uk_agriculture_emissions.json")

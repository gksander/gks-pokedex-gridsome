# Pokemon Data

[PokeAPI.co](https://pokeapi.co/) provides an awesome, free API for Pokemon data. (And man, do they have LOTS of data). The project is open source ([found here](https://github.com/PokeAPI/pokeapi)) and the raw data is actually in CSV form.

I used the raw CSVs to drastically speed up build time. I parsed the CSV files as JSON, and did some manual massaging of the data to get it into the form I wanted it to be in. This meant handling some of the relational data by hand, but it made the data processing somewhere around 100 times faster.
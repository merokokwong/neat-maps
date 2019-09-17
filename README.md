# neat-maps

To Test:  
On login page, there's only one login button mocking the user login,  
After clicking login, the app will redirect user to /home.

Select a valid CSV to load the address into Google Map.  
(You can download the sample CSV attached in this repo [north.csv/ south.csv])

After select a CSV, the preview modal will pop up, assign the correct column name.  
The mapping will take 10s, trying to avoid hitting the Google Map API OVER_QUERY_LIMIT.

After getting the geo location form Google API, will load each marker into Google Map.  

Validations that haven't implement:
- check CSV row <= 20
- check CSV column === 5
- check address valid

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

App running at:
http://localhost:8080/

### Run your unit tests

```
npm run test:unit
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

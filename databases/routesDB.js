/**
 * Database for the travel routes.
 * "id" has to be unique.
 * @type {{routes: [{duration: string, price: string, start: string, destination: string, company: string, id: string}]}}
 */
let RDB = {
    "routes" :
        [{
            "id" : "r0",
            "start" : "0", //id
            "destination" : "1", //id
            "price" : "1000", // In SD
            "duration" : "5", // In days
            "company" : "Solar Travels"
        },  {
            "id" : "r2",
            "start" : "2", //id
            "destination" : "3", //id
            "price" : "2000", // In SD
            "duration" : "10", // In days
            "company" : "Frogstar Travels"
        },  {
            "id" : "r4",
            "start" : "0", //id
            "destination" : "2", //id
            "price" : "15000", // In SD
            "duration" : "25", // In days
            "company" : "The Heart of Gold"
        }]
};
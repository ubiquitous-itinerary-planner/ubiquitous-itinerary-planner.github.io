/**
 * Database for the travel routes.
 * "id" has to be unique.
 * Routes are double-ended and a route from system a to system b will only find that route within the a's system route according to comments.
 * At the moment the travel companies in order takes 500, 750, 600, 300, 1000 SD / duration.
 * @type {{routes: [{duration: string, price: string, start: string, destination: string, company: string, id: string}]}}
 */
let RDB = {
    "routes" :
        [{ /* Routes within solar system and to planets in the closest proximity systems the-star-jump-planet can go to. */
            "id" : "r0",
            "start" : "0", //id
            "destination" : "1", //id
            "price" : "1000", // In SD
            "duration" : "2", // In days
            "company" : "Solar Travels"
        },  {
            "id" : "r1",
            "start" : "0", //id
            "destination" : "2", //id
            "price" : "15000", // In SD
            "duration" : "20", // In days
            "company" : "The Heart of Gold"
        },  {
            "id" : "r2",
            "start" : "0", //id
            "destination" : "6", //id
            "price" : "10200", // In SD
            "duration" : "17", // In days
            "company" : "Frogstar Travels"
        },  { /* Routes within Frogstar system and to planets in the closest proximity systems the-star-jump-planet can go to. */
            "id" : "r3",
            "start" : "2", //id
            "destination" : "3", //id
            "price" : "1500", // In SD
            "duration" : "5", // In days
            "company" : "The Republic"
        },  {
            "id" : "r4",
            "start" : "2", //id
            "destination" : "4", //id
            "price" : "5000", // In SD
            "duration" : "5", // In days
            "company" : "Winged Riders"
        },  {
            "id" : "r5",
            "start" : "2", //id
            "destination" : "6", //id
            "price" : "7500", // In SD
            "duration" : "15", // In days
            "company" : "Solar Travels"
        },  {
            "id" : "r6",
            "start" : "3", //id
            "destination" : "4", //id
            "price" : "3750", // In SD
            "duration" : "5", // In days
            "company" : "The Heart of Gold"
        },  {
            "id" : "r7",
            "start" : "3", //id
            "destination" : "5", //id
            "price" : "1800", // In SD
            "duration" : "3", // In days
            "company" : "Frogstar Travels"
        },  {
            "id" : "r8",
            "start" : "4", //id
            "destination" : "5", //id
            "price" : "1200", // In SD
            "duration" : "4", // In days
            "company" : "The Republic"
        },  { /* Routes within Warstar system and to planets in the closest proximity systems the-star-jump-planet can go to. */
            "id" : "r9",
            "start" : "6", //id
            "destination" : "7", //id
            "price" : "8000", // In SD
            "duration" : "8", // In days
            "company" : "Winged Riders"
        },  {
            "id" : "r10",
            "start" : "6", //id
            "destination" : "8", //id
            "price" : "3000", // In SD
            "duration" : "6", // In days
            "company" : "Solar Travels"
        },  {
            "id" : "r11",
            "start" : "6", //id
            "destination" : "11", //id
            "price" : "18750", // In SD
            "duration" : "25", // In days
            "company" : "The Heart of Gold"
        },  {
            "id" : "r12",
            "start" : "7", //id
            "destination" : "9", //id
            "price" : "1800", // In SD
            "duration" : "3", // In days
            "company" : "Frogstar Travels"
        },  {
            "id" : "r13",
            "start" : "7", //id
            "destination" : "10", //id
            "price" : "1800", // In SD
            "duration" : "6", // In days
            "company" : "The Republic"
        },  {
            "id" : "r14",
            "start" : "8", //id
            "destination" : "10", //id
            "price" : "8000", // In SD
            "duration" : "8", // In days
            "company" : "Winged Riders"
        },  {
            "id" : "r15",
            "start" : "9", //id
            "destination" : "10", //id
            "price" : "1000", // In SD
            "duration" : "2", // In days
            "company" : "Solar Travels"
        },  { /* Routes within Ringlord system and to planets in the closest proximity systems the-star-jump-planet can go to. */
            "id" : "r16",
            "start" : "11", //id
            "destination" : "12", //id
            "price" : "3000", // In SD
            "duration" : "4", // In days
            "company" : "The Heart of Gold"
        },  {
            "id" : "r17",
            "start" : "11", //id
            "destination" : "13", //id
            "price" : "3000", // In SD
            "duration" : "5", // In days
            "company" : "Frogstar Travels"
        },  {
            "id" : "r18",
            "start" : "12", //id
            "destination" : "14", //id
            "price" : "3600", // In SD
            "duration" : "6", // In days
            "company" : "The Republic"
        },  {
            "id" : "r19",
            "start" : "13", //id
            "destination" : "14", //id
            "price" : "5000", // In SD
            "duration" : "5", // In days
            "company" : "Winged Riders"
        }]
};
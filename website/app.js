/* Global Variables */
let baseUrl = "http://api.openweathermap.org/data/2.5/weather?zip=";
const apiKey = "780a485a40abeed22e8ca8b550f6ef38";

const dateHolder = document.getElementById('date');
const tempHolder = document.getElementById('temp');
const contentHolder = document.getElementById('content');


document.getElementById('generate').addEventListener('click', async ()=>{
    const zipcode = document.getElementById('zip').value;
    await getWeatherData(baseUrl, zipcode, apiKey).then(async (data)=>{
        // console.log('Posting data back to app ' + data);
        await postData({temperature: data.main.temp, date: obtainDate(), userResponse: document.getElementById('feelings').value});
    }).then(async ()=>{
        // console.log('Now we are updating the web page');
        await updatePage();
    });
});

const getWeatherData = async(baseUrl, zipcode, apiKey)=>{
    const res = await fetch(baseUrl + zipcode + "&units=metric" + "&appid=" + apiKey);
    try {
        const data = await res.json();
        // console.log(data);
        return data;
    } catch (error) {
        console.log("ERROR fetching weather data!", error);
    }
}

const postData = async (data = {})=>{
    // console.log(data);
    const response = await fetch('http://localhost:8000/weatherData/', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    try {
        const newData = await response.json();
        // console.log("Data after post " + newData.temperature);
        return newData;
    } catch (error) {
        console.log("ERROR posting weather data!", error);
    }
}

const updatePage = async ()=>{
    const response = await fetch('http://localhost:8000/weatherData');

    try {
        const pageData = await response.json();
        // console.log('Data obtained from pageData', pageData.temperature);
        dateHolder.innerHTML = pageData.date;
        tempHolder.innerHTML = pageData.temperature;
        contentHolder.innerHTML = pageData.userResponse;
    } catch (error) {
        console.log("ERROR updating web page!", error);
    }
}

// Create a new date instance dynamically with JS
function obtainDate(){
    let d = new Date();
    let newDate = d.getMonth() + 1 +'.'+ d.getDate()+'.'+ d.getFullYear();
    return newDate;
}
// Initialize Swiper
var swiper = new Swiper(".mySwiper", {
    slidesPerView: 4,
    spaceBetween: 10,
    freeMode: false,
    breakpoints: {
        0: {
            slidesPerView: 1
        },
        576: {
            slidesPerView: 2
        },
        768: {
            slidesPerView: 3
        },
        1400: {
            slidesPerView: 4
        }
    }
});

// display weather
const cityName = document.querySelector("#city-input");
const searchbtn = document.querySelector("#search-btn");
const unitSelect = document.querySelector("#unit-select");
let unit = "f";
const errorTxt = document.querySelector("#error");
const weatherInfo = document.querySelector("#weather-info");
const place = document.querySelector("#place");
const forecast = document.querySelectorAll(".swiper-slide");
const loading = document.querySelector(".loading");
const main = document.querySelector(".weather-details");
let count = 0;
let timeString = "";
// show current time
function showTime() {
    const dateObj = new Date();
    let hour = dateObj.getHours();
    let mins = dateObj.getMinutes();
    let period = "AM";
    if (hour >= 12) {
        hour = hour - 12;
        period = "PM";
    }
    timeString = `${hour.toString().padStart(2, 0)}:${mins.toString().padStart(2, 0)} ${period}`;
};

unitSelect.addEventListener("change", () => {
    unit = unitSelect.options[unitSelect.selectedIndex].value;
    if (cityName.value === "") {
        weatherDetails("Karachi");
    } else {
        weatherDetails(cityName.value);
    }
});

searchbtn.addEventListener("click", () => {
    weatherDetails(cityName.value);
});

async function weatherDetails(city) {

    const url = `https://yahoo-weather5.p.rapidapi.com/weather?location=${city}&format=json&u=${unit}`;
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': '4ad738607amshe86028eb9f5358ap13ab04jsncf6f7322c7e4',
            'x-rapidapi-host': 'yahoo-weather5.p.rapidapi.com'
        }
    };

    try {
        loading.classList.remove("d-none");
        main.classList.add("d-none");
        const response = await fetch(url, options);
        const data = await response.json();
        if (!response.ok) {
            loading.classList.add("d-none");
            main.classList.remove("d-none");
            errorTxt.classList.add("d-block");
            errorTxt.classList.remove("d-none");
        }
        else {
            loading.classList.add("d-none");
            main.classList.remove("d-none");
            const { current_observation, location, forecasts } = data;
            errorTxt.classList.add("d-none");
            errorTxt.classList.remove("d-block");
            place.innerHTML = `${location.city}, ${location.country}`;
            // showing the current time 
            showTime();
            weatherInfo.innerHTML = `
            <div class="d-flex justify-content-between align-items-start">
                <h5>Current weather</h5>
                <p class="small m-0">${timeString}</p>
            </div>
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <div class="d-flex align-items-start">
                        <h1 class="lh-1">${current_observation.condition.temperature}</h1>
                        <sup class="mt-3 fs-6">${unitSelect.options[unitSelect.selectedIndex].innerHTML}</sup>
                    </div>
                    <h6 class="mb-4">${current_observation.condition.text}</h6>
                </div>
                <div>
                    <span class="small">Visibility</span>
                    <p class="small">${current_observation.atmosphere.visibility} mi</p>
                </div>
            </div>
            <div class="d-flex justify-content-between">
                <div>
                    <span class="small">Wind <i class="ri-windy-line"></i></span>
                    <p class="small">${current_observation.wind.speed} mph</p>
                </div>
                <div>
                    <span class="small">Humidity <i class="ri-drop-line"></i></span>
                    <p class="small">${current_observation.atmosphere.humidity} %</p>
                </div>
                <div>
                    <span class="small">Pressure</span>
                    <p class="small">${current_observation.atmosphere.pressure} mb</p>
                </div>
            </div>
            `;
            forecast.forEach(elem => {
                const { day, date, text, high, low } = forecasts[count];
                elem.innerHTML = `
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <h6>${day}</h6>
                            <h5>${text}</h5>
                        </div>
                        <div>
                            <h6>${high}°</h6>
                            <h6>${low}°</h6>
                        </div>
                    </div>
                    `;
                count++;
            });
        }
        count = 0;
    } catch (error) {
        console.error(error);
    }
};
weatherDetails("Karachi");
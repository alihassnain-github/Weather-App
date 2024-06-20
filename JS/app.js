// Initialize Swiper
var swiper = new Swiper(".mySwiper", {
    slidesPerView: 3,
    spaceBetween: 10,
    freeMode: false,
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
let count = 0;

unitSelect.addEventListener("change", () => {
    unit = unitSelect.options[unitSelect.selectedIndex].value;
    weatherDetails(cityName.value);
});

searchbtn.addEventListener("click", () => {
    weatherDetails(cityName.value);
});

async function weatherDetails(city) {
    const url = `https://yahoo-weather5.p.rapidapi.com/weather?location=${city}&format=json&u=${unit}`;
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': '019cc03732msh35959c3707eca24p1fae6fjsnda10f7d58814',
            'x-rapidapi-host': 'yahoo-weather5.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        const data = await response.json();
        if (!response.ok) {
            errorTxt.classList.add("d-block");
            errorTxt.classList.remove("d-none");
        }
        else {
            const { current_observation, location, forecasts } = data;
            errorTxt.classList.add("d-none");
            errorTxt.classList.remove("d-block");
            place.innerHTML = `${location.city}, ${location.country}`;
            weatherInfo.innerHTML = `
            <h5>Current weather</h5>
            <div class="d-flex align-items-start">
                <h1 class="lh-1">${current_observation.condition.temperature}</h1>
                <sup class="mt-3 fs-6">${unitSelect.options[unitSelect.selectedIndex].innerHTML}</sup>
            </div>
            <h6 class="mb-4">${current_observation.condition.text}</h6>
            <div class="d-flex justify-content-between">
                <div>
                    <span class="small">Wind <i class="ri-windy-line"></i></span>
                    <p class="small">${current_observation.wind.speed} mph</p>
                </div>
                <div>
                    <span class="small">Humidity <i class="ri-drop-line"></i></span>
                    <p class="small">${current_observation.atmosphere.humidity} %</p>
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
        console.log(data);
    } catch (error) {
        console.error(error);
    }
};
weatherDetails("Karachi");
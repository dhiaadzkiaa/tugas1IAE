document.addEventListener("DOMContentLoaded", function () {
    let input = document.getElementById("city");
    let suggestionsBox = document.getElementById("suggestions");

    input.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            getWeather();
        }
    });

    const cityList = [
        "Jakarta", "Bandung", "Surabaya", "Yogyakarta", "Medan", "Bali",
        "Makassar", "Semarang", "Palembang", "Malang", "Bogor", "Padang"
    ];

    input.addEventListener("input", function () {
        let query = input.value.trim().toLowerCase();
        suggestionsBox.innerHTML = "";

        if (query.length > 2) {
            let filteredCities = cityList.filter(city => city.toLowerCase().includes(query));

            filteredCities.forEach(city => {
                let option = document.createElement("div");
                option.classList.add("suggestion-item");
                option.innerText = city;
                option.onclick = function () {
                    input.value = city;
                    suggestionsBox.innerHTML = "";
                    getWeather();
                };
                suggestionsBox.appendChild(option);
            });

            suggestionsBox.style.display = filteredCities.length > 0 ? "block" : "none";
        } else {
            suggestionsBox.style.display = "none";
        }
    });

    document.addEventListener("click", function (event) {
        if (!input.contains(event.target) && !suggestionsBox.contains(event.target)) {
            suggestionsBox.style.display = "none";
        }
    });
});

function getWeather() {
    let city = document.getElementById("city").value.trim();
    if (!city) {
        alert("Masukkan nama kota!");
        return;
    }

    fetch(`/weather?city=${city}`)
        .then(response => response.json())
        .then(data => {
            let resultDiv = document.getElementById("result");
            if (data.error) {
                resultDiv.innerHTML = `<p style="color:red;">${data.error}</p>`;
            } else {
                let weatherIcon = getWeatherIcon(data.weather);
                resultDiv.innerHTML = `
                    <div class="weather-box">
                        <h3>🌍 Cuaca di ${data.city}</h3>
                        ${weatherIcon}
                        <p class="temperature">${data.temperature}°C</p>
                        <p class="description">${data.weather}</p>
                    </div>
                `;
            }
        })
        .catch(error => {
            console.error("Error:", error);
            document.getElementById("result").innerHTML = `<p style="color:red;">⚠ Terjadi kesalahan, coba lagi!</p>`;
        });
}

function getWeatherIcon(condition) {
    const weatherIcons = {
        "clear sky": { icon: "fa-solid fa-sun", color: "clear-sky" },
        "few clouds": { icon: "fa-solid fa-cloud-sun", color: "few-clouds" },
        "overcast clouds": { icon: "fa-solid fa-cloud", color: "overcast-clouds" },
        "broken clouds": { icon: "fa-solid fa-cloud", color: "broken-clouds" },
        "shower rain": { icon: "fa-solid fa-cloud-showers-heavy", color: "shower-rain" },
        "rain": { icon: "fa-solid fa-cloud-rain", color: "rain" },
        "thunderstorm": { icon: "fa-solid fa-bolt", color: "thunderstorm" },
        "snow": { icon: "fa-solid fa-snowflake", color: "snow" },
        "mist": { icon: "fa-solid fa-smog", color: "mist" },
    };

    const selected = weatherIcons[condition] || { icon: "fa-solid fa-question", color: "default" };
    return `<i class="weather-icon ${selected.color} ${selected.icon}"></i>`;
}

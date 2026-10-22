// index.js
 const weatherApi = "https://api.weather.gov/alerts/active?area=";

const stateInput = document.getElementById("state-input");
const fetchButton = document.getElementById("fetch-alerts");
const weatherAlerts = document.getElementById("alerts-display");
const errorMessage = document.getElementById("error-message");

async function fetchWeatherAlerts(state) {
    try {
        const response = await fetch(
            `${weatherApi}${encodeURIComponent(state)}`
        );

        if (!response.ok) {
            throw new Error("Unable to fetch weather alerts.");
        }

        const data = await response.json();
        console.log(data);

        displayAlerts(data);

        errorMessage.textContent = "";
        errorMessage.classList.add("hidden");

    } catch (error) {
        console.log(error.message);
        errorMessage.textContent = error.message;
        errorMessage.classList.remove("hidden");
    }
}

function displayAlerts(data) {
    weatherAlerts.replaceChildren();

    const alerts = data.features || [];
    const heading = document.createElement("h2");

    heading.textContent = `${data.title}: ${alerts.length}`;
    weatherAlerts.appendChild(heading);

    const list = document.createElement("ul");

    alerts.forEach(alert => {
        const item = document.createElement("li");
        item.textContent =
            alert.properties?.headline || "No headline available";
        list.appendChild(item);
    });

    weatherAlerts.appendChild(list);
}

// Keep all validation and return statements inside this callback.
fetchButton.addEventListener("click", async function () {
    const state = stateInput.value.trim().toUpperCase();

    weatherAlerts.replaceChildren();
    errorMessage.textContent = "";
    errorMessage.classList.add("hidden");

    if (!state) {
        errorMessage.textContent =
            "Please enter a state abbreviation.";
        errorMessage.classList.remove("hidden");
        return;
    }

    if (!/^[A-Z]{2}$/.test(state)) {
        errorMessage.textContent =
            "Please enter a valid two-letter state abbreviation, such as MN.";
        errorMessage.classList.remove("hidden");
        return;
    }

    stateInput.value = "";

    await fetchWeatherAlerts(state);
});

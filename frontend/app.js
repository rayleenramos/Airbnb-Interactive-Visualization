// global variables
let priceNeighborhood = [];
let priceReviews = [];
let priceBorough = [];

// destroy and update charts variable
let chart1 = null;
let chart2 = null;

// controls which data table is visible
window.openCity = function (evt, cityName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    // controls which tab is active
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    // display selected tab
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " active";
};

// page load
document.addEventListener("DOMContentLoaded", () => {
    // UI elements 
    const messageArea = document.getElementById("message_area");
    const loginForm = document.getElementById("loginForm");
    const logoutBtn = document.getElementById("logoutBtn");
    const loadDataBtn = document.getElementById("loadDataBtn");
    const saveSettingsBtn = document.getElementById("saveSettingsBtn");

    const priceSlider = document.getElementById("priceSlider");
    const boroughSelect = document.getElementById("boroughSelect");

    const priceLowSpan = document.getElementById("priceLow");
    const priceHighSpan = document.getElementById("priceHigh");

    // force slider to max value
    priceSlider.value = priceSlider.max;

    google.charts.load("current", { packages: ["table"] });

    // authenticates user against the database
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        // get login form data
        const formData = new FormData(loginForm);

        // send login form data to server
        const res = await fetch("../backend/login.php", { method: "POST", body: formData });
        const data = await res.json();

        if (data.success) {
            messageArea.textContent = 'Login successful.';
            loadDataBtn.disabled = false;
            // hide login form and show logout button
            loginForm.style.display = 'none';
            logoutBtn.style.display = 'inline-block';
        } else {
            messageArea.textContent = data.message || "Login failed.";
        }
    });

    // logout
    logoutBtn.addEventListener("click", async () => {
        const res = await fetch("../backend/logout.php");
        const data = await res.json();

        //  restore log in page
        if (data.success) {
            messageArea.textContent = "Logged out.";
            loginForm.style.display = "block";
            logoutBtn.style.display = "none";
            // disable load data and save settings buttons
            loadDataBtn.disabled = true;
            saveSettingsBtn.disabled = true;

            // clear login inputs
            loginForm.reset();

            // reset UI
            priceSlider.value = priceSlider.max;
            if (chart1) chart1.destroy();
            if (chart2) chart2.destroy();
            // clear tables
            document.getElementById('table_airbnb').innerHTML = '';
            document.getElementById('table_neighborhood').innerHTML = '';
            document.getElementById('table_reviews').innerHTML = '';
            document.getElementById('table_borough').innerHTML = '';
            // reset price arrays
            priceNeighborhood = [];
            priceBorough = [];
            priceReviews = [];
        }
    });

    // load data
    loadDataBtn.addEventListener("click", async () => {
        const res = await fetch("../backend/load_data.php");
        const data = await res.json();

        if (!data.success) {
            messageArea.textContent = data.message || "Failed to load data.";
            return;
        }

        messageArea.textContent = "Data loaded from database.";

        // stores dataset locally
        priceNeighborhood = data.price_neighborhood;
        priceReviews = data.price_reviews;
        priceBorough = data.price_borough;

        // enable save settings button
        saveSettingsBtn.disabled = false;

        // slider setup 
        const prices = priceNeighborhood.map((r) => parseFloat(r.avg_price));
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);

        priceSlider.min = minPrice;
        priceSlider.max = maxPrice;
        priceSlider.value = maxPrice;
        priceSlider.disabled = false;

        // display slider values
        priceLowSpan.textContent = minPrice.toFixed(2);
        priceHighSpan.textContent = maxPrice.toFixed(2);

        // draw charts
        drawNeighborhoodChart();
        drawReviewsChart();

        // draw table after google charts is loaded
        google.charts.setOnLoadCallback(() => {
            drawAirbnbTable(data.airbnb_raw);
            drawNeighborhoodTable(priceNeighborhood);
            drawReviewsTable(priceReviews);
            drawBoroughTable(priceBorough);

            // load saved settings if exists
            loadUserSettings();
        });
    });

    // sends slider values to User_Setting table
    saveSettingsBtn.addEventListener("click", saveUserSettings);

    // help button
    const helpBtn = document.getElementById("helpBtn");
    if (helpBtn) {
        helpBtn.addEventListener("click", () => {
            const googleDocUrl = "https://docs.google.com/document/d/1ED9IarPDhnoQ3OjOBej5USI8nq3VKitY/edit?usp=sharing&ouid=114634988629445007276&rtpof=true&sd=true";
            window.open(googleDocUrl, "_blank");
        });
    }

    async function saveUserSettings() {
        // slider values
        const slider_low_value = parseFloat(priceSlider.min);
        const slider_high_value = parseFloat(priceSlider.value);

        const formData = new FormData();
        formData.append("slider_low_value", slider_low_value);
        formData.append("slider_high_value", slider_high_value);

        const res = await fetch("../backend/save_setting.php", {
            method: "POST",
            body: formData
        });

        const data = await res.json();

        if (data.success) {
            messageArea.textContent = data.message;
        } else {
            messageArea.textContent = data.message || "Failed to save settings.";
        }
    }

    // load saved settings if exists
    async function loadUserSettings() {
        const res = await fetch("../backend/get_settings.php");
        const data = await res.json();

        if (data.success && data.setting) {
            // apply saved slider value
            const saved_high = parseFloat(data.setting.slider_high_value);

            priceSlider.value = saved_high;
            priceHighSpan.textContent = saved_high.toFixed(2);

            messageArea.textContent = "Loaded your saved settings.";
        }
    }


    // drop down and slider events
    boroughSelect.addEventListener("change", () => {
        if (priceNeighborhood.length) drawNeighborhoodChart();
    });

    priceSlider.addEventListener("input", () => {
        priceHighSpan.textContent = parseFloat(priceSlider.value).toFixed(2);
        if (priceNeighborhood.length) drawNeighborhoodChart();
    });

    // draw neighborhood chart
    function drawNeighborhoodChart() {
        const borough = boroughSelect.value;
        const sliderMax = parseFloat(priceSlider.value);

        const ctx = document.getElementById("chart1").getContext("2d");
        if (chart1) chart1.destroy();

        // show borough-level averages
        if (borough === "All") {
            const labels = priceBorough.map((r) => r.borough);
            const values = priceBorough.map((r) => parseFloat(r.avg_price));

            chart1 = new Chart(ctx, {
                type: "bar",
                data: {
                    labels,
                    datasets: [{
                        label: "Average Price ($)",
                        data: values,
                        backgroundColor: "rgba(157, 129, 231, 0.5)",
                        borderColor: "rgba(124, 97, 193, 1)",
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: { display: true, text: "Average Price by Borough" }
                    }
                }
            });
            return;
        }

        // show neighborhood-level averages
        let rows = priceNeighborhood.filter(
            (r) => r.borough === borough && parseFloat(r.avg_price) <= sliderMax
        );

        // default chart to most listings 
        rows.sort((a, b) => parseInt(b.listing_count) - parseInt(a.listing_count));

        rows = rows.slice(0, 15);

        const labels = rows.map((r) => r.neighborhood);
        const values = rows.map((r) => parseFloat(r.avg_price));

        // visuals for chart
        chart1 = new Chart(ctx, {
            type: "bar",
            data: {
                labels,
                datasets: [{
                    label: `Avg Price in ${borough}`,
                    data: values,
                    backgroundColor: "rgba(240, 168, 183, 0.91)",
                    borderColor: "rgba(234, 48, 88, 1)",
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: { display: true, text: `Neighborhoods in ${borough}` }
                }
            }
        });
    }

    // price vs number of reviews 
    function drawReviewsChart() {
        const labels = priceReviews.map((r) =>
            parseInt(r.number_of_reviews)
        );
        const values = priceReviews.map((r) =>
            parseFloat(r.avg_price)
        );

        const ctx = document.getElementById("chart2").getContext("2d");
        if (chart2) chart2.destroy();

        // visuals for chart
        chart2 = new Chart(ctx, {
            type: "line",
            data: {
                labels,
                datasets: [{
                    label: "Average Price ($)",
                    data: values,
                    pointBackgroundColor: "rgba(255, 99, 132, 0.6)",
                    pointBorderColor: "rgba(255, 99, 132, 1)",
                    backgroundColor: "rgba(157, 129, 231, 0.5)",
                    borderColor: "rgba(124, 97, 193, 1)",
                    borderWidth: 1
                }]
            },
            options: { responsive: true }
        });
    }

    // google table
    // airbnb table + outlier detection
    function drawAirbnbTable(rows) {
        if (!rows || rows.length === 0) return;

        // outlier detection
        const prices = rows
            .map((r) => parseFloat(String(r.price).replace(/[$,]/g, "")) || 0)
            .sort((a, b) => a - b);

        const q1 = prices[Math.floor(prices.length / 4)];
        const q3 = prices[Math.ceil((prices.length * 3) / 4)];
        const iqr = q3 - q1;

        const lower = q1 - 1.5 * iqr;
        const upper = q3 + 1.5 * iqr;

        const msg = document.getElementById("outlier_message");
        if (msg) {
            msg.innerHTML = `<strong>Outlier Detection:</strong> Rows with price < $${lower.toFixed(
                2
            )} or > $${upper.toFixed(2)} are highlighted.`;
        }

        const dataTable = new google.visualization.DataTable();

        dataTable.addColumn("string", "neighbourhood_cleansed");
        dataTable.addColumn("string", "neighbourhood_group_cleansed");
        dataTable.addColumn("string", "property_type");
        dataTable.addColumn("number", "bedrooms");
        dataTable.addColumn("number", "bathrooms");
        dataTable.addColumn("number", "price");
        dataTable.addColumn("number", "number_of_reviews");
        dataTable.addColumn("number", "review_scores_rating");

        rows.forEach((r) => {
            const price =
                parseFloat(String(r.price).replace(/[$,]/g, "")) || 0;

            const rowIndex = dataTable.addRow([
                r.neighbourhood_cleansed,
                r.neighbourhood_group_cleansed,
                r.property_type,
                parseInt(r.bedrooms) || 0,
                parseFloat(r.bathrooms) || 0,
                price,
                parseInt(r.number_of_reviews),
                parseFloat(r.review_scores_rating) || 0
            ]);

            if (price < lower || price > upper) {
                for (let col = 0; col < dataTable.getNumberOfColumns(); col++) {
                    dataTable.setProperty(
                        rowIndex,
                        col,
                        "style",
                        "background-color:#ffff99"
                    );
                }
            }
        });

        const table = new google.visualization.Table(
            document.getElementById("table_airbnb")
        );
        table.draw(dataTable, {
            showRowNumber: true,
            width: "100%",
            allowHtml: true,
            page: "enable",
            pageSize: 10
        });
    }

    // neighborhood table + outlier detection
    function drawNeighborhoodTable(rows) {
        if (!rows || rows.length === 0) return;

        const prices = rows
            .map((r) => parseFloat(r.avg_price))
            .sort((a, b) => a - b);

        const q1 = prices[Math.floor(prices.length / 4)];
        const q3 = prices[Math.ceil((prices.length * 3) / 4)];
        const iqr = q3 - q1;

        const lower = q1 - 1.5 * iqr;
        const upper = q3 + 1.5 * iqr;

        const msg = document.getElementById("outlier_message_neighborhood");
        if (msg) {
            msg.innerHTML = `<strong>Outlier Detection:</strong> Rows with Avg Price < $${lower.toFixed(
                2
            )} or > $${upper.toFixed(2)} are highlighted.`;
        }

        const dataTable = new google.visualization.DataTable();

        dataTable.addColumn("string", "Neighborhood");
        dataTable.addColumn("string", "Borough");
        dataTable.addColumn("number", "Total Price");
        dataTable.addColumn("number", "Listing Count");
        dataTable.addColumn("number", "Average Price");

        rows.forEach((r) => {
            const price = parseFloat(r.avg_price);

            const rowIndex = dataTable.addRow([
                r.neighborhood,
                r.borough,
                parseFloat(r.total_price),
                parseInt(r.listing_count),
                price
            ]);

            if (price < lower || price > upper) {
                for (
                    let col = 0;
                    col < dataTable.getNumberOfColumns();
                    col++
                ) {
                    dataTable.setProperty(
                        rowIndex,
                        col,
                        "style",
                        "background-color:#ffff99"
                    );
                }
            }
        });

        const table = new google.visualization.Table(
            document.getElementById("table_neighborhood")
        );
        table.draw(dataTable, {
            showRowNumber: true,
            width: "100%",
            allowHtml: true,
            page: "enable",
            pageSize: 10
        });
    }

    // reviews table + outlier detection
    function drawReviewsTable(rows) {
        if (!rows || rows.length === 0) return;

        const prices = rows
            .map((r) => parseFloat(r.avg_price))
            .sort((a, b) => a - b);

        const q1 = prices[Math.floor(prices.length / 4)];
        const q3 = prices[Math.ceil((prices.length * 3) / 4)];
        const iqr = q3 - q1;

        const lower = q1 - 1.5 * iqr;
        const upper = q3 + 1.5 * iqr;

        const msg = document.getElementById("outlier_message_reviews");
        if (msg) {
            msg.innerHTML = `<strong>Outlier Detection:</strong> Rows with Avg Price < $${lower.toFixed(
                2
            )} or > $${upper.toFixed(2)} are highlighted.`;
        }

        const dataTable = new google.visualization.DataTable();

        dataTable.addColumn("number", "Reviews");
        dataTable.addColumn("number", "Total Price");
        dataTable.addColumn("number", "Count");
        dataTable.addColumn("number", "Avg Price");

        rows.forEach((r) => {
            const price = parseFloat(r.avg_price);

            const rowIndex = dataTable.addRow([
                parseInt(r.number_of_reviews),
                parseFloat(r.total_price),
                parseInt(r.listing_count),
                price
            ]);

            if (price < lower || price > upper) {
                for (
                    let col = 0;
                    col < dataTable.getNumberOfColumns();
                    col++
                ) {
                    dataTable.setProperty(
                        rowIndex,
                        col,
                        "style",
                        "background-color:#ffff99"
                    );
                }
            }
        });

        const table = new google.visualization.Table(
            document.getElementById("table_reviews")
        );
        table.draw(dataTable, {
            showRowNumber: true,
            width: "100%",
            allowHtml: true,
            page: "enable",
            pageSize: 10
        });
    }

    // borough table + outlier detection
    function drawBoroughTable(rows) {
        if (!rows || rows.length === 0) return;

        const prices = rows
            .map((r) => parseFloat(r.avg_price))
            .sort((a, b) => a - b);

        const q1 = prices[Math.floor(prices.length / 4)];
        const q3 = prices[Math.ceil((prices.length * 3) / 4)];
        const iqr = q3 - q1;

        const lower = q1 - 1.5 * iqr;
        const upper = q3 + 1.5 * iqr;

        const msg = document.getElementById("outlier_message_borough");
        if (msg) {
            msg.innerHTML = `<strong>Outlier Detection:</strong> Rows with Avg Price < $${lower.toFixed(
                2
            )} or > $${upper.toFixed(2)} are highlighted.`;
        }

        const dataTable = new google.visualization.DataTable();

        dataTable.addColumn("string", "Borough");
        dataTable.addColumn("number", "Total Price");
        dataTable.addColumn("number", "Listing Count");
        dataTable.addColumn("number", "Average Price");

        rows.forEach((r) => {
            const price = parseFloat(r.avg_price);

            const rowIndex = dataTable.addRow([
                r.borough,
                parseFloat(r.total_price),
                parseInt(r.listing_count),
                price
            ]);

            if (price < lower || price > upper) {
                for (
                    let col = 0;
                    col < dataTable.getNumberOfColumns();
                    col++
                ) {
                    dataTable.setProperty(
                        rowIndex,
                        col,
                        "style",
                        "background-color:#ffff99"
                    );
                }
            }
        });

        const table = new google.visualization.Table(
            document.getElementById("table_borough")
        );
        table.draw(dataTable, {
            showRowNumber: true,
            width: "100%",
            allowHtml: true,
            page: "enable",
            pageSize: 10
        });
    }
});

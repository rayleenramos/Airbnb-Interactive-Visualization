# Airbnb-Interactive-Visualization
A full-stack interactive data visualization system exploring Airbnb pricing trends across New York City using real-world data.

## Overview
This project analyzes 36,000+ Airbnb listings and enables users to dynamically explore pricing behavior by borough, neighborhood, and number of reviews.

The system follows a three-tier architecture:
- Presentation Layer: HTML, CSS, JavaScript (Chart.js, Google Charts)
- Application Layer: PHP with AJAX-based client-server communication
- Data Layer: MySQL with aggregated data marts

## Folder Structure

Airbnb-Interactive-Visualization/
│
├── frontend/
├── backend/
├── sql/
├── screenshots/
└── README.md

📁 frontend/
Contains all client-side files:
index.html – Page structure and layout
style.css – Visual styling and UI theme
app.js – Handles interactivity, event listeners, AJAX requests, and dynamic chart updates

📁 backend/
Contains server-side PHP scripts:
login.php / logout.php – User authentication and session handling
load_data.php – Retrieves raw and aggregated data from MySQL
save_setting.php – Stores user slider preferences
get_settings.php – Restores saved user preferences
dbconfig.example.php – Example database configuration template

📁 sql/
Contains database schema and data mart definitions:
schema.sql – Main Airbnb table and aggregated data mart creation scripts

📁 explanation/
Contains demo report with images of charts, filters, and interactive components.

## Features
- User authentication system
- Dynamic borough filtering
- Price range slider (real-time updates)
- Aggregated SQL data marts
- Statistical outlier detection (IQR method)
- Save & restore user settings
- Tabbed raw and aggregated data views
- AJAX-driven updates (no page reloads)

## Dataset
Source: Inside Airbnb NYC dataset  
https://insideairbnb.com/get-the-data/

Raw dataset not included due to size.

## Architecture
User interactions trigger AJAX requests from app.js to PHP scripts in the backend.
The backend queries MySQL data marts and returns JSON responses.
Charts and tables update dynamically without page reloads.

## Live Demo
🔗 Link: https://obi.kean.edu/~ramorayl@kean.edu/CPS5745/index.html

Demo Login:
- Login: tiger
- Password: 5920

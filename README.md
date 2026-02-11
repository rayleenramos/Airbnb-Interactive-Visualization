# Airbnb Interactive Visualization
A full-stack interactive data visualization system exploring Airbnb pricing trends across New York City using real-world data.

## Overview
This project analyzes 36,000+ Airbnb listings and enables users to dynamically explore pricing behavior by borough, neighborhood, and number of reviews.

The system is built using a three-tier architecture:
- **Presentation Layer** – HTML, CSS, JavaScript (Chart.js, Google Charts)
- **Application Layer** – PHP with AJAX-based client-server communication
- **Data Layer** – MySQL database with aggregated SQL data marts

## Folder Structure
Airbnb-Interactive-Visualization/

- `frontend/` – Client-side files (HTML, CSS, JavaScript)
- `backend/` – Server-side PHP scripts for authentication, data retrieval, and session management
- `sql/` – Database schema and data mart creation scripts
- `screenshots/` – Demo images of charts and interactive components
- `docs/` – Technical report and presentation slides

## Features
- User authentication system  
- Dynamic borough filtering  
- Price range slider with real-time updates  
- Aggregated SQL data marts for efficient querying  
- Statistical outlier detection using the IQR method  
- Save & restore user preferences  
- Tabbed views for raw and aggregated datasets  
- AJAX-driven updates (no page reloads)  

## Dataset
Source: Inside Airbnb NYC dataset  
https://insideairbnb.com/get-the-data/

Raw dataset is not included in this repository due to size constraints.

## Architecture
User interactions trigger AJAX requests from `app.js` to backend PHP scripts.  
The backend queries MySQL data marts and returns JSON responses.  
Charts and tables update dynamically without page reloads.

## Live Demo
🔗 https://obi.kean.edu/~ramorayl@kean.edu/CPS5745/index.html  

Demo Credentials:  
Login: tiger  
Password: 5920  

## Documentation
Detailed technical report and project presentation are available in the `/docs` folder.


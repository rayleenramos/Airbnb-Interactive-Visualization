# Airbnb-Interactive-Visualization
A full-stack interactive data visualization system exploring Airbnb pricing trends across New York City.

## Overview
This project analyzes 36,000+ real-world Airbnb listings and enables users to dynamically explore pricing patterns by borough, neighborhood, and review count.

The system follows a three-tier architecture:
- Presentation Layer: HTML, CSS, JavaScript (Chart.js, Google Charts)
- Application Layer: PHP (AJAX-based requests)
- Data Layer: MySQL with aggregated data marts

## Features
- User authentication system
- Dynamic borough filtering
- Price range slider (real-time updates)
- Aggregated SQL data marts
- Statistical outlier detection (IQR method)
- Save & restore user settings
- Tabbed raw and aggregated data views

## Dataset
Source: Inside Airbnb NYC dataset  
https://insideairbnb.com/get-the-data/

Raw dataset not included due to size.

## Architecture
The system processes user requests via AJAX, retrieves aggregated data from MySQL, and dynamically updates charts and tables without page reloads.

## Live Demo
Link: https://obi.kean.edu/~ramorayl@kean.edu/CPS5745/index.html

Demo Login:
Login: tiger
Password: 5920

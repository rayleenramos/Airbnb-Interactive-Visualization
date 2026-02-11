-- =========================================
--      Airbnb NYC Database Schema
-- =========================================

--  Main Airbnb Table
CREATE TABLE airbnb (
    id BIGINT primary key,
    name VARCHAR(300),
    neighbourhood_cleansed VARCHAR(100),
    neighbourhood_group_cleansed VARCHAR(100),
    latitude DOUBLE,
    longitude DOUBLE,
    property_type VARCHAR(150),
    room_type VARCHAR(100),
    accommodates INT,
    bathrooms DECIMAL(3,1),
    bedrooms INT,
    beds INT,
    price DECIMAL(10,2),
    number_of_reviews INT,
    review_scores_rating DECIMAL(3,2),
    review_scores_location DECIMAL(3,2)
);


-- Data Mart 1: Price by Borough
CREATE TABLE price_borough AS SELECT 
    neighbourhood_group_cleansed AS borough,
    SUM(price) AS total_price,
    COUNT(price) AS listing_count,
    SUM(price) / COUNT(price) AS avg_price
FROM airbnb
WHERE price > 0
  AND neighbourhood_group_cleansed IS NOT NULL
GROUP BY neighbourhood_group_cleansed
ORDER BY avg_price DESC;

ALTER TABLE price_borough MODIFY avg_price DECIMAL(16,2);
ALTER TABLE price_borough MODIFY total_price DECIMAL(12,2);


-- Data Mart 2: Price by Neighborhood
CREATE TABLE price_neighborhood AS SELECT 
    neighbourhood_cleansed AS neighborhood,
    neighbourhood_group_cleansed AS borough,
    SUM(price) AS total_price,
    COUNT(price) AS listing_count,
    (SUM(price) / COUNT(price)) AS avg_price
FROM airbnb
WHERE price > 0
  AND neighbourhood_cleansed IS NOT NULL
  AND neighbourhood_group_cleansed IS NOT NULL
GROUP BY neighbourhood_cleansed, neighbourhood_group_cleansed;

ALTER TABLE price_neighborhood MODIFY avg_price DECIMAL(12,2);
ALTER TABLE price_neighborhood MODIFY total_price DECIMAL(12,2);


-- Data Mart 3: Price by Number of Reviews
CREATE TABLE price_reviews AS SELECT
    number_of_reviews,
    SUM(price) AS total_price,
    COUNT(price) AS listing_count,
    SUM(price) / COUNT(price) AS avg_price
FROM airbnb
WHERE price > 0
  AND number_of_reviews IS NOT NULL
GROUP BY number_of_reviews
ORDER BY number_of_reviews;

ALTER TABLE price_reviews MODIFY total_price DECIMAL(12,2);
ALTER TABLE price_reviews MODIFY avg_price DECIMAL(12,2);


-- User Settings Table
CREATE TABLE User_Setting (
    uid INT NOT NULL,
    login VARCHAR(50) NOT NULL,
    slider_low_value DECIMAL(10,2) NOT NULL,
    slider_high_value DECIMAL(10,2) NOT NULL,
    datetime DATETIME NOT NULL,
    PRIMARY KEY (uid),
);
CREATE TABLE IF NOT EXISTS air_quality_measurements (
    id BIGSERIAL PRIMARY KEY,
    measured_at TIMESTAMP NOT NULL,
    pm10 DOUBLE PRECISION,
    pm2_5 DOUBLE PRECISION,
    carbon_monoxide DOUBLE PRECISION,
    nitrogen_dioxide DOUBLE PRECISION,
    sulphur_dioxide DOUBLE PRECISION,
    ozone DOUBLE PRECISION,
    european_aqi INTEGER,
    city_name VARCHAR(100) NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    timezone VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_forecast BOOLEAN NOT NULL DEFAULT FALSE,
    
    UNIQUE (measured_at, latitude, longitude)
);
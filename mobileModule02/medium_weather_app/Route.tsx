import { ScrollView,  View } from 'react-native';
import { DataTable, Text} from 'react-native-paper';
import { useState, useEffect } from 'react';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';

export function CurrentlyRoute({ coordinates, cityName }: any) {
    const [weatherData, setWeatherData] = useState<any>(null);

    useEffect(() => {
        if (coordinates) {
            fetch(`https://api.open-meteo.com/v1/forecast?latitude=${coordinates.latitude}&longitude=${coordinates.longitude}&current_weather=true`)
                .then(res => res.json())
                .then(data => setWeatherData(data))
                .catch(err => console.error(err));
        }
        console.log('Coordinates in CurrentlyRoute:', cityName, coordinates);
    }, [coordinates]);

    const getWeatherDescription = (code: number) => {
        const weatherCodes: { [key: number]: string } = {
            0: 'Clear sky',
            1: 'Mainly clear',
            2: 'Partly cloudy',
            3: 'Overcast',
            45: 'Foggy',
            48: 'Depositing rime fog',
            51: 'Light drizzle',
            53: 'Moderate drizzle',
            55: 'Dense drizzle',
            61: 'Slight rain',
            63: 'Moderate rain',
            65: 'Heavy rain',
            71: 'Slight snow',
            73: 'Moderate snow',
            75: 'Heavy snow',
            95: 'Thunderstorm',
        };
        return weatherCodes[code] || 'Unknown';
    };

    return (
        <View style={{ flex: 1 }}>
            {weatherData && (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    {cityName && <Text style={{fontWeight: 'bold', fontSize: 24}}>
                        <MaterialDesignIcons name="map-marker" size={28} />
                        {cityName}</Text>}
                    <Text style={{ fontSize: 48 }}>{weatherData.current_weather.temperature}°C</Text>
                    <Text style={{ fontSize: 20 }}>{getWeatherDescription(weatherData.current_weather.weathercode)}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <MaterialDesignIcons name="weather-windy" size={24} />
                        <Text style={{ fontSize: 18 }}>{weatherData.current_weather.windspeed} km/h</Text>
                    </View>
                </View>
            )}
        </View>
    );
}
export function WeeklyRoute({ coordinates, cityName }: any) {
    const [weatherData, setWeatherData] = useState<any>(null);

    useEffect(() => {
        if (coordinates) {
            fetch(`https://api.open-meteo.com/v1/forecast?latitude=${coordinates.latitude}&longitude=${coordinates.longitude}&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto&forecast_days=7`)
                .then(res => res.json())
                .then(data => setWeatherData(data))
                .catch(err => console.error(err));
        }
    }, [coordinates]);

    const getWeatherDescription = (code: number) => {
        const weatherCodes: { [key: number]: string } = {
            0: 'Clear sky',
            1: 'Mainly clear',
            2: 'Partly cloudy',
            3: 'Overcast',
            45: 'Foggy',
            48: 'Depositing rime fog',
            51: 'Light drizzle',
            53: 'Moderate drizzle',
            55: 'Dense drizzle',
            61: 'Slight rain',
            63: 'Moderate rain',
            65: 'Heavy rain',
            71: 'Slight snow',
            73: 'Moderate snow',
            75: 'Heavy snow',
            95: 'Thunderstorm',
        };
        return weatherCodes[code] || 'Unknown';
    };

    return (
        <View>
            {weatherData && weatherData.daily && (
                <ScrollView>
                    {cityName && <Text style={{fontWeight: 'bold'}}><MaterialDesignIcons name="map-marker" size={16} />{cityName}</Text>}
                    <DataTable>
                        <DataTable.Header>
                            <DataTable.Title>Date</DataTable.Title>
                            <DataTable.Title>Min</DataTable.Title>
                            <DataTable.Title>Max</DataTable.Title>
                            <DataTable.Title>Weather</DataTable.Title>
                        </DataTable.Header>
                        {weatherData.daily.time.map((date: string, index: number) => (
                            <DataTable.Row key={index}>
                                <DataTable.Cell>{new Date(date).toLocaleDateString()}</DataTable.Cell>
                                <DataTable.Cell>{weatherData.daily.temperature_2m_min[index]}°C</DataTable.Cell>
                                <DataTable.Cell>{weatherData.daily.temperature_2m_max[index]}°C</DataTable.Cell>
                                <DataTable.Cell>{getWeatherDescription(weatherData.daily.weathercode[index])}</DataTable.Cell>
                            </DataTable.Row>
                        ))}
                    </DataTable>
                </ScrollView>
            )}
        </View>
    );
}
export function TodayRoute({ coordinates, cityName }: any) {
    const [weatherData, setWeatherData] = useState<any>(null);

    useEffect(() => {
        if (coordinates) {
            fetch(`https://api.open-meteo.com/v1/forecast?latitude=${coordinates.latitude}&longitude=${coordinates.longitude}&hourly=temperature_2m,weathercode,windspeed_10m&timezone=auto&forecast_days=1`)
                .then(res => res.json())
                .then(data => setWeatherData(data))
                .catch(err => console.error(err));
        }
    }, [coordinates]);

    const getWeatherDescription = (code: number) => {
        const weatherCodes: { [key: number]: string } = {
            0: 'Clear sky',
            1: 'Mainly clear',
            2: 'Partly cloudy',
            3: 'Overcast',
            45: 'Foggy',
            48: 'Depositing rime fog',
            51: 'Light drizzle',
            53: 'Moderate drizzle',
            55: 'Dense drizzle',
            61: 'Slight rain',
            63: 'Moderate rain',
            65: 'Heavy rain',
            71: 'Slight snow',
            73: 'Moderate snow',
            75: 'Heavy snow',
            95: 'Thunderstorm',
        };
        return weatherCodes[code] || 'Unknown';
    };

    return (
        <View>
            {weatherData && weatherData.hourly && (
                <ScrollView>
                    {cityName && <Text style={{fontWeight: 'bold'}}><MaterialDesignIcons name="map-marker" size={16} />{cityName}</Text>}
                <DataTable>
                    <DataTable.Header>
                        <DataTable.Title>Time</DataTable.Title>
                        <DataTable.Title>Temp</DataTable.Title>
                        <DataTable.Title>Weather</DataTable.Title>
                        <DataTable.Title>Wind</DataTable.Title>
                    </DataTable.Header>
                    {weatherData.hourly.time.map((time: string, index: number) => (
                        <DataTable.Row key={index}>
                            <DataTable.Cell>{new Date(time).toLocaleTimeString()}</DataTable.Cell>
                            <DataTable.Cell>{weatherData.hourly.temperature_2m[index]}°C</DataTable.Cell>
                            <DataTable.Cell>{getWeatherDescription(weatherData.hourly.weathercode[index])}</DataTable.Cell>
                            <DataTable.Cell>{weatherData.hourly.windspeed_10m[index]} km/h</DataTable.Cell>
                        </DataTable.Row>
                    ))}
                </DataTable>
                </ScrollView>
            )}
        </View>
    );
}
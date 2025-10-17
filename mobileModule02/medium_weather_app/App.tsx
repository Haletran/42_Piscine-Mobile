import { PaperProvider, Appbar, Searchbar, BottomNavigation, Text, Divider } from 'react-native-paper';
import { useState, useEffect, use } from 'react';
import * as Location from 'expo-location';
import { CurrentlyRoute, TodayRoute, WeeklyRoute } from './Route';
import { Keyboard } from 'react-native';

export function TopBar({ searchQuery, setSearchQuery, onLocationPress, onSearchPress }: any) {
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        onSearchPress(searchQuery);
      }
    }, 50);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  return (
    <Appbar.Header>
      <Searchbar
        placeholder="Search location"
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={{ flex: 1, marginHorizontal: 8 }}
        onSubmitEditing={() => {
          if (searchQuery.trim()) {
            onSearchPress(searchQuery);
          }
        }}
        returnKeyType="search"
      />
      <Appbar.Action icon="crosshairs" onPress={onLocationPress} />
    </Appbar.Header>
  );
}

export default function App() {
  const [index, setIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState<string | null>(null);
  const [coordinates, setCoordinates] = useState<{ latitude: number; longitude: number } | null>(null);
  const [cityName, setCityName] = useState<string>('');
  const [routes] = useState([
    { key: 'currently', title: 'Currently', focusedIcon: 'weather-sunny' },
    { key: 'today', title: 'Today', focusedIcon: 'calendar-outline' },
    { key: 'weekly', title: 'Weekly', focusedIcon: 'calendar-multiselect' },
  ]);


  useEffect(() => {
    handleLocationPress();
  }, []);

const handleLocationPress = async () => {
  try {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permission denied');
      return;
    }
    
    let location = await Location.getLastKnownPositionAsync();
    if (!location) {
      location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Low,
      });
    }
    
    setCoordinates({
      latitude: location.coords.latitude, 
      longitude: location.coords.longitude
    }); 
    Location.reverseGeocodeAsync({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude
    }).then(geocode => {
      setCityName(geocode[0]?.city || '');
    }).catch(err => console.error('Geocoding error:', err));
    
    setResult(null);
  } catch (error) {
    console.error('Error getting location:', error);
  }
};

  const handleSearch = async (cityName: string) => {
    if (!cityName.trim()) return;
    
    try {
      const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}`);
      const data = await response.json();
      setResult(data);
      return data;
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setError('Failed to fetch weather data');
    }
  };

  const handleChosenCity = async (cityName: string, latitude: number, longitude: number) => {
    setCityName(cityName);
    setCoordinates({latitude, longitude});
    setResult(null);
    setSearchQuery('');
    Keyboard.dismiss();
  }

  const renderScene = ({ route }: any) => {
    switch (route.key) {
      case 'currently':
        return <CurrentlyRoute coordinates={coordinates} cityName={cityName} />;
      case 'today':
        return <TodayRoute cityName={cityName} coordinates={coordinates} />;
      case 'weekly':
        return <WeeklyRoute cityName={cityName} coordinates={coordinates} />;
      default:
        return null;
    }
  };

  return (
    <PaperProvider>
      <TopBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onLocationPress={handleLocationPress}
        onSearchPress={handleSearch}
      />
      {error && <Text style={{ color: 'red', padding: 10 }}>{error}</Text>}
      {result && result.results && result.results.map((res: any) => (
        <>
        <Text style={{ padding: 10 }} key={res.id} onPress={() => handleChosenCity(res.name, res.latitude, res.longitude)}>
          <Text style={{ fontWeight: 'bold'}}> {res.name}</Text>, {res.admin1} {res.country}
        </Text>
        <Divider />
        </>
      ))}
      <BottomNavigation
        key={`${searchQuery}-${coordinates?.latitude}-${coordinates?.longitude}`}
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        renderScene={renderScene}
      />
    </PaperProvider>
  );
}
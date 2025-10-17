import { StyleSheet, Text, View } from 'react-native';
import { PaperProvider, Appbar, Searchbar, BottomNavigation } from 'react-native-paper';
import { useState } from 'react';
import * as Location from 'expo-location';

export function TopBar({ searchQuery, setSearchQuery, onLocationPress }: any) {
  return (
    <Appbar.Header>
      <Searchbar
        placeholder="Search location"
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={{ flex: 1, marginHorizontal: 8 }}
      />
      <Appbar.Action icon="crosshairs" onPress={onLocationPress} />
    </Appbar.Header>
  );
}

function CurrentlyRoute({ city }: { city: string }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text_route}>Currently</Text>
      {city && <Text style={styles.cityText}>{city}</Text>}
    </View>
  );
}
function TodayRoute({ city }: { city: string }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text_route}>Today</Text>
      {city && <Text style={styles.cityText}>{city}</Text>}
    </View>
  );
}
function WeeklyRoute({ city }: { city: string }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text_route}>Weekly</Text>
      {city && <Text style={styles.cityText}>{city}</Text>}
    </View>
  );
}

export default function App() {
  const [index, setIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentCity, setCurrentCity] = useState('');
  const [routes] = useState([
    { key: 'currently', title: 'Currently', focusedIcon: 'weather-sunny' },
    { key: 'today', title: 'Today', focusedIcon: 'calendar-outline' },
    { key: 'weekly', title: 'Weekly', focusedIcon: 'calendar-multiselect' },
  ]);

  const handleLocationPress = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission denied');
        return;
      }
      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      let geocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      });
      
      if (geocode.length > 0) {
        const address = geocode[0];
        const cityName = address.city || address.subregion || address.region || 'Unknown';
        setCurrentCity(cityName);
        setSearchQuery('');
      }
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  const renderScene = BottomNavigation.SceneMap({
    currently: () => <CurrentlyRoute city={searchQuery || currentCity} />,
    today: () => <TodayRoute city={searchQuery || currentCity} />,
    weekly: () => <WeeklyRoute city={searchQuery || currentCity} />,
  });

  return (
    <PaperProvider>
      <TopBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onLocationPress={handleLocationPress}
      />
      <BottomNavigation
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        renderScene={renderScene}
      />
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text_route: {
    fontSize: 24,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  cityText: {
    fontSize: 18,
    marginTop: 10,
    color: '#666',
  }
});
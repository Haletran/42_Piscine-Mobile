import { StyleSheet, Text, View, Pressable } from 'react-native';
import row_layout from './assets/layout.json';
import { useState } from 'react';

export default function App() {

  const rows = row_layout.rows;
  const [textvalue, setTextValue] = useState('0');

  function handleButtonPress(value: any) {
    console.log(`button pressed :${value}`);
    setTextValue(value);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Calculator</Text>
      <View style={styles.grid}>
        <Text style={styles.render_box}>{textvalue}</Text>
        {rows.map((row, rowIndex) => (
          <View key={rowIndex} style={{ flexDirection: 'row' }}>
            {row.map((item, itemIndex) => (
              <Pressable
                key={itemIndex}
                style={{
                  width: 70,
                  height: 70,
                  backgroundColor: '#607D8B',
                  margin: 5,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 10,
                }}
                onPress={() => handleButtonPress(item.value)}
              >
                <Text style={{ fontSize: 24, color: '#35444bff' }}>
                  {typeof item === 'object' ? item.value || item.label || '' : item}
                </Text>
              </Pressable>
            ))}
          </View>
        ))}
      </View>
    </View>
  );            
}    

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#485E68',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 20,
  },
  grid : {
    justifyContent: 'center',
    alignItems: 'center',
  },
  render_box: {
    width: 340,
    height: 80,
    backgroundColor: '#35444bff',
    color: '#ffffff',
    fontSize: 40,
    padding: 10,
    textAlign: 'right',
    margin: 5,
    justifyContent: 'center',
    alignItems: 'flex-end',
    borderRadius: 10,
  },
  title: {
    color: '#fff',
    fontSize: 20,
  },
});

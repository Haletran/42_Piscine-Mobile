import { StyleSheet, Text, View, Pressable, useWindowDimensions } from 'react-native';
import row_layout from './assets/layout.json';
import { use, useState, useEffect } from 'react';
import React from "react";
import * as ScreenOrientation from 'expo-screen-orientation';

export class AppBar extends React.Component {
  render() {
    return (
      <View style={styles.appbar}>
        <Text style={styles.title}>Calculator</Text>
      </View>
    );
  }
}

export default function App() {
  const rows = row_layout.rows;
  const [textvalue, setTextValue] = useState('0');
  const { width, height } = useWindowDimensions();
  
  const isLandscape = width > height;
  const numCols = 5;
  const numRows = 5;
  const marginSize = isLandscape ? 1 : 5;
  
  const buttonSize = isLandscape 
    ? Math.min(
        (width - (marginSize * 2 * numCols + 10)) / numCols,
        (height - 170 - (marginSize * 2 * numRows + 10)) / numRows
      )
    : Math.min((width - 60) / 5, 70);
  
  
  useEffect(() => {
    async function unlockOrientation() {
      await ScreenOrientation.unlockAsync();
    }
    unlockOrientation();
  }, []);

  function handleButtonPress(value: any) {
    console.log(`button pressed :${value}`);
    setTextValue(value);
  }

return (
    <View style={{ flex: 1, backgroundColor: '#37474F' }}>
      <AppBar />
        <Text style={styles.render_box}>{textvalue}</Text>
        <Text style={styles.render_box}>{textvalue}</Text>
      <View style={[
        styles.grid, 
        isLandscape && { 
          paddingHorizontal: 2,
          paddingVertical: 2,
          gap: 0,
        }, 
      ]}>
        {rows.map((row, rowIndex) => (
          <View key={rowIndex} style={{ 
            flexDirection: 'row',
            justifyContent: isLandscape ? 'space-evenly' : 'center',
            width: '100%',
            backgroundColor: '#607D8B'
          }}>
            {row.map((item, itemIndex) => (
              <Pressable
                key={itemIndex}
                style={{
                  width: buttonSize,
                  height: buttonSize,
                  backgroundColor: '#607D8B',
                  margin: marginSize,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={() => handleButtonPress(item.value)}
              >
                <Text style={{ 
                  fontSize: isLandscape ? 18 : 24, 
                  color: ('color' in item && typeof item.color === 'string') ? item.color : '#35444bff' 
                }}>
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
  appbar: {
    backgroundColor: '#607D8B',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 20,
  },
  grid: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: '#37474F',
  },
  render_box: {
    color: '#607D8B',
    fontSize: 40,
    textAlign: 'right',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  title: {
    color: '#fff',
    fontSize: 20,
  },
});

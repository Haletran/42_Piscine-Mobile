import { StyleSheet, Text, View, Pressable } from 'react-native';
import { useState } from 'react';

export default function App() {
  function handleButtonPress() {
    if (textvalue === "Hello World") {
      setTextValue("A simple text");
      return;
    }
    setTextValue("Hello World");
  }

  const [textvalue, setTextValue] = useState('A simple text');
  return (
    <View style={styles.container}>
      <Text style={styles.title} >{textvalue}</Text>
      <Pressable
        onPress={() => {handleButtonPress()}}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Click me</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    color: '#ffffff',
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#626200',
  },
  button: {
    backgroundColor: '#F6F3F2',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  buttonText: {
    color: '#626200',
    fontSize: 16,
    fontWeight: '600',
  }
});

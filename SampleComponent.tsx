import * as React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

function CustomButton() {
  return (
    <TouchableOpacity onPress={() => console.log('Alhamdulillah!')}>
      <Text>Bismillah</Text>
    </TouchableOpacity>
  );
}

export default function MyNewWormhole() {
  const message = React.useMemo(() => 'Hello, world!', []);
  return (
    <View style={{ flex: 1, backgroundColor: 'red' }}>
      <Text>{message}</Text>
      <CustomButton />
    </View>
  );
}
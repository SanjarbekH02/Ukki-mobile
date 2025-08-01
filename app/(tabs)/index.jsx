// index.jsx yoki App.jsx faylda
// import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StatusBar } from 'react-native';
import BottomTabNavigator from '../../components/BottomTabNavigator';

export default function App() {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#fff',
      }}
    >
      <StatusBar backgroundColor="transparent" translucent barStyle="dark-content" />
      <BottomTabNavigator />
    </SafeAreaView>
  );
}

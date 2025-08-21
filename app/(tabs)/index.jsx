// index.jsx yoki App.jsx faylda
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as NavigationBar from "expo-navigation-bar";
import { useEffect } from 'react';
import { SafeAreaView } from 'react-native';
import BottomTabNavigator from '../../components/BottomTabNavigator';
import StepScreen from '../../Courses/English/Unit1/StepScreen';
import CourseDetailScreen from '../../Screens/CourseDetail';
import FeedbackForm from '../../Screens/FeedbackForm';
// import KaraokePlayer from "../../Screens/Karaoke";


// import WordGame from "../../components/WordGame";

const Stack = createNativeStackNavigator();
export default function App() {
  useEffect(() => {
    // Navigation bar’ni yashirish
    NavigationBar.setVisibilityAsync("hidden");

    // Qorong‘i fon qilish (ixtiyoriy)
    NavigationBar.setBackgroundColorAsync("black");
  }, []);
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#fff',
      }}
    >
      {/* <StatusBar backgroundColor="transparent" translucent barStyle="dark-content" /> */}
      <Stack.Navigator>
        <Stack.Screen name="Main" component={BottomTabNavigator} options={{ headerShown: false }} />
        <Stack.Screen
          name="Feedback"
          component={FeedbackForm}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CourseDetail"
          component={CourseDetailScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="StepScreen"
          component={StepScreen}
          options={{ headerShown: false }}
        />

      </Stack.Navigator>

    </SafeAreaView>
  );
}

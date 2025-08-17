// index.jsx yoki App.jsx faylda
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native';
import BottomTabNavigator from '../../components/BottomTabNavigator';
import CourseDetailScreen from '../../Screens/CourseDetail';
import FeedbackForm from '../../Screens/FeedbackForm';
import StepScreen from '../../Courses/English/Unit1/StepScreen';

// import KaraokePlayer from "../../Screens/Karaoke";


// import WordGame from "../../components/WordGame";

const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#fff',
      }}
    >
      <StatusBar backgroundColor="transparent" translucent barStyle="dark-content" />
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

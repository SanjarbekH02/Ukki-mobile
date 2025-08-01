import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import HomeScreen from '../Screens/HomeScreens';
import MyCoursesScreen from '../Screens/MyCourses';
import ProfileScreen from '../Screens/Profile';
import CoursesScreen from '../Screens/Courses';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
    return (
        <Tab.Navigator screenOptions={{ headerShown: false }}>
            <Tab.Screen
                name="Asosiy"
                component={HomeScreen}
                options={{
                    tabBarIcon: ({ color, size, focused }) => (
                        <Icon name={focused ? 'home' : 'home-outline'} color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen
                name="Kurslar"
                component={CoursesScreen}
                options={{
                    tabBarIcon: ({ color, size, focused }) => (
                        <Icon name={focused ? 'school' : 'school-outline'} color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen
                name="Kurslarim"
                component={MyCoursesScreen}
                options={{
                    tabBarIcon: ({ color, size, focused }) => (
                        <Icon name={focused ? 'book' : 'book-outline'} color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen
                name="Profil"
                component={ProfileScreen}
                options={{
                    tabBarIcon: ({ color, size, focused }) => (
                        <Icon name={focused ? 'person' : 'person-outline'} color={color} size={size} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}

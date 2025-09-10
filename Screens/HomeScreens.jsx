import { useNavigation } from "expo-router";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const courses = [
  { id: 1, title: "Ingliz tili", desc: "Lorem Ipsum is simply dummy text of", lessons: 3, image: require("../assets/images/english.png"),},
  { id: 2, title: "Matematika", desc: "Lorem Ipsum is simply dummy text", lessons: 3, image: require("../assets/images/math.png"), },
  { id: 3, title: "Tasviriy San'at", desc: "Lorem Ipsum is simply", lessons: 3, image: require("../assets/images/iskus.png"), },
  { id: 4, title: "Geometriya", desc: "Lorem Ipsum is simply dummy text of the printing", lessons: 3, image: require("../assets/images/geometry.png"), },
  { id: 5, title: "Fizika", desc: "Lorem Ipsum is simply dummy", lessons: 3, image: require("../assets/images/physics.png"), },
  { id: 6, title: "Fizika", desc: "Lorem Ipsum is simply dummy text of the printing and typesetting", lessons: 3, image: require("../assets/images/physics.png"), },
];

export default function HomeScreen() {
  const navigation = useNavigation();

  const renderCourse = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("CourseDetail", { course: item });
      }}
      style={styles.courseItem}
    >
      <Text style={styles.courseTitle}>{item.title}</Text>
      <Text style={styles.courseSubtitle}>{item.lessons}ta dars</Text>
      <Image
        source={item.image}
        style={styles.courseImage}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.userInfo}>
        <Image source={require("../assets/images/user.png")} />
        <View style={{ marginRight: "auto", marginLeft: 10 }}>
          <Text style={styles.greeting}>Salom,</Text>
          <Text style={styles.name}>Fakhriyor</Text>
        </View>
        <Ionicons name="notifications-outline" size={30} />
      </View>

      <View style={styles.homeContainer}>
        <Text style={styles.continueTitle}>Darsni davom ettirish...</Text>
        <Image
          source={require("../assets/images/continue.png")}
          style={styles.continueImage}
        />
        <View>
          <Text style={styles.language}>English</Text>
          <Text style={styles.module}>1-Modul 2-dars</Text>
        </View>

        <Text style={styles.allCoursesTitle}>Barcha kurslar</Text>
        <FlatList
          data={courses}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderCourse}
          numColumns={2}
          contentContainerStyle={{
            gap: 10,
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#EEFFFC" },
  homeContainer: {
    flex: 1,
    padding: 20,
    paddingBottom: 0,
    borderTopRightRadius: 12,
    borderTopLeftRadius: 12,
    backgroundColor: "#fff",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "",
    padding: 20,
    paddingTop: 60,
  },
  greeting: { fontSize: 14, color: "#000", fontWeight: 400 },
  name: { fontSize: 24, fontWeight: 600, color: "#000" },
  continueTitle: { fontSize: 16, fontWeight: "600", marginBottom: 15 },
  continueBox: {
    flexDirection: "row",
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    alignItems: "center",
  },
  continueImage: {
    width: "40%",
    height: 100,
    marginRight: 10,
    borderRadius: 8,
  },
  language: {
    fontSize: 12,
    fontWeight: "400",
    color: "#00000067",
    paddingTop: 5,
    paddingBottom: 5,
  },
  module: { fontSize: 14, color: "#000", fontWeight: 400, paddingBottom: 10 },
  allCoursesTitle: { fontSize: 16, fontWeight: "600", marginBottom: 10 },
  coursesContainer: { gap: 10 },
  courseItem: {
    width: "47%",
    backgroundColor: "#EFF4F8",
    margin: "1.5%",
    padding: 15,
    borderRadius: 12,
  },
  courseImage: { margin: "auto", width: 80, height: 80 },
  courseTitle: { fontSize: 16, fontWeight: "600" },
  courseSubtitle: { fontSize: 13, color: "#666" },
});
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
const courses = [
    {
        id: '1',
        title: 'Ingliz tili',
        lessons: '3ta dars',
        image: require('../assets/images/english.png'),
    },
    {
        id: '2',
        title: 'Matematika',
        lessons: '3ta dars',
        image: require('../assets/images/math.png'),
    },
    {
        id: '3',
        title: 'Himiya',
        lessons: '3ta dars',
        image: require('../assets/images/chemistry.png'),
    },
    {
        id: '4',
        title: 'Geometriya',
        lessons: '3ta dars',
        image: require('../assets/images/geometry.png'),
    },
    {
        id: '5',
        title: 'Fizika',
        lessons: '3ta dars',
        image: require('../assets/images/physics.png'),
    },
];

const CourseCard = ({ course }) => (
    <TouchableOpacity style={styles.card}>
        <Text style={styles.title}>{course.title}</Text>
        <Text style={styles.subtitle}>{course.lessons}</Text>
        <Image source={course.image} style={styles.image} resizeMode="contain" />
    </TouchableOpacity>
);

const CoursesScreen = () => {
    return (
        <>
            <View style={styles.top}>
                <Text style={styles.header}>Kurslar</Text>
                <Ionicons name='notifications-outline' size={30} />
            </View>
            <View style={styles.container}>
                <FlatList
                    data={courses}
                    keyExtractor={(item) => item.id}
                    numColumns={2}
                    columnWrapperStyle={styles.row}
                    contentContainerStyle={styles.list}
                    renderItem={({ item }) => <CourseCard course={item} />}
                />
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eff4f8',
        paddingTop: 50,
        paddingHorizontal: 16,
    },
    top: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingTop: 60,
        paddingBottom: 20,
        backgroundColor: "#fff",
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12
    },
    header: {
        fontSize: 24,
        fontWeight: '',
        marginBottom: 20,
    },
    list: {
        paddingBottom: 20,
    },
    row: {
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 12,
        width: '48%',
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 3,
    },
    title: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 12,
        color: '#595E62',
        marginBottom: 8,
    },
    image: {
        width: '100%',
        height: 80,
    },
});

export default CoursesScreen;

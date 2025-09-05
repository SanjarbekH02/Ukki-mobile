import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';

const courses = [
    {
        title: 'Ingliz tili',
        completed: 4,
        total: 12,
        image: require('../assets/images/english.png'), // O'zingizga mos joyda rasmni saqlang
    },
    {
        title: 'Matematika',
        completed: 11,
        total: 12,
        image: require('../assets/images/math.png'),
    },
    {
        title: 'Himiya',
        completed: 6,
        total: 12,
        image: require('../assets/images/chemistry.png'),
    },
];

const MyCoursesScreen = () => {
    return (
        <>
            <View style={styles.top}>
                <Text style={styles.header}>Kurslarim</Text>
                <Ionicons name='notifications-outline' size={30} />
            </View>
            <View style={styles.container}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    {courses.map((course, index) => {
                        const progress = course.completed / course.total;

                        return (
                            <View key={index} style={styles.card}>
                                <View style={styles.courseRow}>
                                    <View>
                                        <Text style={styles.title}>{course.title}</Text>
                                        <Text style={styles.subTitle}>Yakunlangan darslar: {course.completed}/{course.total}</Text>
                                    </View>     
                                    <Image source={course.image} style={styles.courseImage} />
                                </View>

                                <View style={styles.progressContainer}>
                                    <ProgressBar
                                        progress={progress}
                                        color="#007bff"
                                        style={styles.progressBar}
                                    />
                                    <Text style={styles.percentText}>{Math.round(progress * 100)}%</Text>
                                </View>

                                <TouchableOpacity style={styles.button}>
                                    <Text style={styles.buttonText}>Davom ettirish</Text>
                                </TouchableOpacity>
                            </View>
                        );
                    })}
                </ScrollView>
            </View>
        </>
    );
};

export default MyCoursesScreen;

const styles = StyleSheet.create({
    top: {
        paddingTop: 60,
        paddingBottom: 30,
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12
    },
    container: {
        flex: 1,
        paddingTop: 15,
        paddingHorizontal: 16,
        backgroundColor: '#f1f8ff',
    },
    header: {
        fontSize: 24,
        fontWeight: '600',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 18,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    courseRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 16,
        fontWeight: '500',
    },
    subTitle: {
        fontSize: 11,
        color: '#595E62',
        marginTop: 4,
        
    },
    courseImage: {
        width: 50,
        height: 50,
        resizeMode: 'contain',
    },
    progressContainer: {
        marginTop: 12,
        position: "relative"
        // flexDirection: 'row',
        // alignItems: 'center',
    },
    progressBar: {
        flex: 1,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#d0d0d0', 
    },

    percentText: {
        marginTop: 8,
        fontSize: 12,
        color: '#595E62',
    },
    button: {
        marginTop: 12,
        backgroundColor: '#EFF4F8',
        paddingVertical: 10,
        borderRadius: 50,
        alignItems: 'center',
    },
    buttonText: {
        color: '#000',
        fontWeight: '500',
        fontSize: 14,
    },
});

import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import axios from 'axios';
import { useEffect, useState } from 'react';
import {
    Alert,
    FlatList,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { courseData } from '../constants/CourseData';

export default function CourseDetailScreen() {
    const courseId = 1;
    const userId = 1;
    const [openUnit, setOpenUnit] = useState(null);
    const [progress, setProgress] = useState(null);
    const navigation = useNavigation();

    // Progress yuklash
    useEffect(() => {
        const loadProgress = async () => {
            try {
                const res = await axios.get(
                    `https://your-api.com/api/course-progress/${userId}/${courseId}`
                );
                if (res.data) {
                    setProgress(res.data);
                    setOpenUnit(res.data.unitId);
                } else {
                    setProgress({
                        unitId: 1,
                        lastCompletedStep: 0
                    });
                }
            } catch (err) {
                console.error("Progress yuklashda xatolik:", err);
                setProgress({
                    unitId: 1,
                    lastCompletedStep: 0
                });
            }
        };
        loadProgress();
    }, [courseId, userId]);

    // Progress saqlash
    const saveProgress = async (unitId, stepOrder) => {
        try {
            await axios.post(`https://your-api.com/api/course-progress`, {
                userId,
                courseId,
                unitId,
                lastCompletedStep: stepOrder
            });
        } catch (err) {
            console.error("Progress saqlashda xatolik:", err);
        }
        setProgress({ unitId, lastCompletedStep: stepOrder });
    };

    // Unitni ochish
    const toggleUnit = (unitId) => {
        // Oldingi unit tugaganmi tekshirish
        const unitIndex = courseData.findIndex(u => u.id === unitId);
        if (unitIndex > 0) {
            const prevUnit = courseData[unitIndex - 1];
            const lastStepOrder = prevUnit.steps[prevUnit.steps.length - 1].order;

            const isPrevUnitCompleted =
                progress?.unitId > prevUnit.id ||
                (progress?.unitId === prevUnit.id &&
                    progress?.lastCompletedStep >= lastStepOrder);

            if (!isPrevUnitCompleted) {
                Alert.alert("Diqqat", "Oldingi bo'lim tugallanmagan!");
                return;
            }
        }

        setOpenUnit(openUnit === unitId ? null : unitId);
    };

    if (!progress) {
        return <Text>Yuklanmoqda...</Text>;
    }

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="chevron-back" size={24} color="black" />
                    </TouchableOpacity>
                    <Text style={styles.headerText}>Kurs haqida</Text>
                    <TouchableOpacity>
                        <Ionicons name="heart-outline" size={24} color="black" />
                    </TouchableOpacity>
                </View>

                {/* Image */}
                <Image
                    source={require('../assets/images/english.png')}
                    style={styles.image}
                    resizeMode="contain"
                />

                {/* Info */}
                <View style={styles.infoBottom}>
                    <View style={styles.infoRow}>
                        <Text style={styles.date}>26.06.2025, 15:50</Text>
                        <View style={styles.iconRow}>
                            <Ionicons name="eye-outline" size={16} color="gray" />
                            <Text style={styles.iconText}>2318</Text>
                            <Ionicons name="person-outline" size={16} color="gray" style={{ marginLeft: 10 }} />
                            <Text style={styles.iconText}>2318</Text>
                        </View>
                    </View>

                    <Text style={styles.title}>English</Text>
                    <Text style={styles.description}>
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry...
                    </Text>
                </View>

                {/* Units */}
                <View style={styles.infoBottom}>
                    <Text style={styles.subTitle}>Kurslar</Text>

                    <FlatList
                        data={courseData}
                        keyExtractor={(unit) => unit.id.toString()}
                        renderItem={({ item: unit }) => (
                            <View style={styles.unitContainer}>
                                {/* Unit Header */}
                                <TouchableOpacity style={styles.unitHeader} onPress={() => toggleUnit(unit.id)}>
                                    <Ionicons name="book" size={24} color="#0059FF" />
                                    <Text style={styles.unitTitle}>{unit.name}</Text>
                                    <Ionicons
                                        name={openUnit === unit.id ? "chevron-up" : "chevron-down"}
                                        size={24}
                                        color="black"
                                    />
                                </TouchableOpacity>

                                {/* Steps */}
                                {openUnit === unit.id && (
                                    <View style={styles.stepsContainer}>
                                        {unit.steps.map((step, index) => {
                                            const isCompleted =
                                                unit.id < progress.unitId ||
                                                (unit.id === progress.unitId && step.order <= progress.lastCompletedStep);

                                            const isNextAfterCompleted =
                                                index > 0 &&
                                                (unit.id < progress.unitId ||
                                                    (unit.id === progress.unitId &&
                                                        unit.steps[index - 1].order <= progress.lastCompletedStep));

                                            const isFirstStep = index === 0;

                                            return (
                                                <TouchableOpacity
                                                    key={step.order}
                                                    style={styles.stepButton}
                                                    onPress={() => {
                                                        if (!isCompleted && !isNextAfterCompleted && !isFirstStep) {
                                                            Alert.alert("Diqqat", "Oldingi qadam tugallanmagan!");
                                                            return;
                                                        }
                                                        navigation.navigate("StepScreen", {
                                                            unitId: unit.id,
                                                            step,
                                                            unitSteps: unit.steps,
                                                            progress,
                                                            setProgress,
                                                        });
                                                    }}
                                                >
                                                    <Text style={styles.stepText}>{step.title}</Text>

                                                    {isCompleted ? (
                                                        <Text>✅</Text>
                                                    ) : isNextAfterCompleted || isFirstStep ? (
                                                        null
                                                    ) : (
                                                        <Ionicons name="lock-closed" size={16} color="gray" />
                                                    )}
                                                </TouchableOpacity>
                                            );
                                        })}

                                    </View>
                                )}
                            </View>
                        )}
                    />
                </View>

                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>O'qishni boshlash</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#EFF4F8', marginBottom: 20 },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        paddingTop: 60,
        backgroundColor: "#fff"
    },
    headerText: { fontSize: 16, fontWeight: '500' },
    image: {
        width: '100%',
        height: 200,
        marginBottom: 16,
        backgroundColor: "#fff",
        padding: 6,
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
    },
    infoBottom: {
        marginTop: 10, backgroundColor: "#fff", borderRadius: 12,
        padding: 16, marginBottom: 20
    },
    infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    date: { fontSize: 14, color: '#595E62' },
    iconRow: { flexDirection: 'row', alignItems: 'center' },
    iconText: { fontSize: 14, color: '#595E62', marginLeft: 4 },
    title: { fontSize: 20, fontWeight: '600', marginTop: 12 },
    description: { fontSize: 14, color: '#595E62', marginTop: 8 },
    subTitle: { fontSize: 16, fontWeight: '600', marginVertical: 16 },
    unitContainer: {
        backgroundColor: "#fff", marginVertical: 5, borderRadius: 8,
        overflow: "hidden", padding: 10, shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08,
        shadowRadius: 16, elevation: 4, borderWidth: 1, borderColor: '#eee'
    },
    unitHeader: {
        backgroundColor: "#ffffffff", flexDirection: "row",
        justifyContent: "space-between", paddingVertical: 10,
    },
    unitTitle: { fontSize: 18, color: "black", fontWeight: "600", marginRight: "auto", marginLeft: 10 },
    stepsContainer: { backgroundColor: "#e9f3ff", paddingLeft: 20 },
    stepButton: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "#ddd", flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 10 },
    stepText: { fontSize: 15 },
    button: {
        backgroundColor: '#007AFF', paddingVertical: 20,
        alignItems: 'center', borderRadius: 50,
        marginTop: 10, marginHorizontal: 10,
    },
    buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 }
});

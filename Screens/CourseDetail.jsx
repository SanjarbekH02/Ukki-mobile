import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { courseData } from "../constants/CourseData";

export default function CourseDetailScreen() {
  const route = useRoute();
  const { course } = route.params;
  const userId = 1;
  const [openUnit, setOpenUnit] = useState(null);
  const [progress, setProgress] = useState(null);
  const navigation = useNavigation();

  const selectedCourse = courseData.find((c) => c.id === course.id);
  const selectedCourseData = selectedCourse ? selectedCourse.units : [];

  useEffect(() => {
    // const loadProgress = async () => {
    //     try {
    //         const res = await axios.get(
    //             `https://your-api.com/api/course-progress/${userId}/${course.id}`
    //         );
    //         if (res.data) {
    //             setProgress(res.data);
    //             setOpenUnit(res.data.unitId);
    //         } else {
    //             setProgress({
    //                 unitId: 1,
    //                 lastCompletedStep: 0
    //             });
    //         }
    //     } catch (err) {
    //         console.error("Progress yuklashda xatolik:", err);
    //         setProgress({
    //             unitId: 1,
    //             lastCompletedStep: 0
    //         });
    //     }
    // };
    // loadProgress();

    setProgress({
      unitId: 1,
      lastCompletedStep: 0,
    });
    setOpenUnit(1);
  }, [course.id, userId]);

  const saveProgress = async (unitId, stepOrder) => {
    // try {
    //     await axios.post(`https://your-api.com/api/course-progress`, {
    //         userId,
    //         courseId: course.id,
    //         unitId,
    //         lastCompletedStep: stepOrder
    //     });
    // } catch (err) {
    //     console.error("Progress saqlashda xatolik:", err);
    // }

    // For now, just update local state instead of making API call
    setProgress({ unitId, lastCompletedStep: stepOrder });
  };

  const toggleUnit = (unitId) => {
    // const unitIndex = selectedCourseData.findIndex(u => u.id === unitId);
    // if (unitIndex > 0) {
    //     const prevUnit = selectedCourseData[unitIndex - 1];
    //     const lastStepOrder = prevUnit.steps[prevUnit.steps.length - 1].order;

    //     const isPrevUnitCompleted =
    //         progress?.unitId > prevUnit.id ||
    //         (progress?.unitId === prevUnit.id &&
    //             progress?.lastCompletedStep >= lastStepOrder);

    //     if (!isPrevUnitCompleted) {
    //         Alert.alert("Diqqat", "Oldingi bo'lim tugallanmagan!");
    //         return;
    //     }
    // }

    setOpenUnit(openUnit === unitId ? null : unitId);
  };

  if (!progress) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <FlatList
      data={[{ key: "header" }]}
      renderItem={() => (
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="chevron-back" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.headerText}>Kurs haqida</Text>
            <TouchableOpacity>
              <Ionicons name="heart-outline" size={24} color="black" />
            </TouchableOpacity>
          </View>

          <Image
            source={course.image}
            style={styles.image}
            resizeMode="contain"
          />

          <View style={styles.infoBottom}>
            <View style={styles.infoRow}>
              <Text style={styles.date}>11.09.2025, 00:00</Text>
              <View style={styles.iconRow}>
                <Ionicons
                  name="person-outline"
                  size={16}
                  color="gray"
                  style={{ marginLeft: 10 }}
                />
                <Text style={styles.iconText}>2318 </Text>
              </View>
            </View>

            <Text style={styles.title}>{course.title}</Text>
            <Text style={styles.description}>{course.desc}</Text>
          </View>

          <View style={styles.infoBottom}>
            <Text style={styles.subTitle}>Kurslar</Text>

            {selectedCourseData.length > 0 ? (
              <FlatList
                data={selectedCourseData}
                keyExtractor={(unit) => unit.id.toString()}
                renderItem={({ item: unit }) => (
                  <View style={styles.unitContainer}>
                    <TouchableOpacity
                      style={styles.unitHeader}
                      onPress={() => toggleUnit(unit.id)}
                    >
                      <Ionicons name="book" size={24} color="#0059FF" />
                      <Text style={styles.unitTitle}>{unit.name}</Text>
                      <Ionicons
                        name={
                          openUnit === unit.id ? "chevron-up" : "chevron-down"
                        }
                        size={24}
                        color="black"
                      />
                    </TouchableOpacity>

                    {openUnit === unit.id && (
                      <View style={styles.stepsContainer}>
                        {unit.steps.map((step, index) => {
                          const isCompleted =
                            unit.id < progress.unitId ||
                            (unit.id === progress.unitId &&
                              step.order <= progress.lastCompletedStep);

                          const isNextAfterCompleted =
                            index > 0 &&
                            (unit.id < progress.unitId ||
                              (unit.id === progress.unitId &&
                                unit.steps[index - 1].order <=
                                  progress.lastCompletedStep));

                          const isFirstStep = index === 0;

                          return (
                            <TouchableOpacity
                              key={step.order}
                              style={styles.stepButton}
                              onPress={() => {
                                // if (!isCompleted && !isNextAfterCompleted && !isFirstStep) {
                                //     Alert.alert("Diqqat", "Oldingi qadam tugallanmagan!");
                                //     return;
                                // }
                                if (course.id === 1) {
                                  navigation.navigate("StepScreen", {
                                    unitId: unit.id,
                                    step,
                                    unitSteps: unit.steps,
                                    progress,
                                    setProgress,
                                  });
                                } else if (course.id === 2) {
                                  navigation.navigate("Drawing", {
                                    unitId: unit.id,
                                    step,
                                    unitSteps: unit.steps,
                                    progress,
                                    setProgress,
                                  });
                                }
                              }}
                            >
                              <Text style={styles.stepText}>
                                {step.order}. {step.title}
                              </Text>

                              {isCompleted ? (
                                <Text>✅</Text>
                              ) : isNextAfterCompleted || isFirstStep ? null : (
                                <Ionicons
                                  name="lock-closed"
                                  size={16}
                                  color="gray"
                                />
                              )}
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    )}
                  </View>
                )}
              />
            ) : (
              <Text style={styles.noDataText}>
                Bu kurs uchun ma'lumotlar hozircha mavjud emas.
              </Text>
            )}
          </View>

          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>O'qishni boshlash</Text>
          </TouchableOpacity>
        </View>
      )}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ flexGrow: 1 }}
    />
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: "#EFF4F8", marginBottom: 20 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    paddingTop: 60,
    backgroundColor: "#fff",
  },
  headerText: { fontSize: 16, fontWeight: "500" },
  image: {
    width: "100%",
    height: 200,
    marginBottom: 16,
    backgroundColor: "#fff",
    padding: 6,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  infoBottom: {
    marginTop: 10,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  date: { fontSize: 14, color: "#595E62" },
  iconRow: { flexDirection: "row", alignItems: "center" },
  iconText: { fontSize: 14, color: "#595E62", marginLeft: 4 },
  title: { fontSize: 20, fontWeight: "600", marginTop: 12 },
  description: { fontSize: 14, color: "#595E62", marginTop: 8 },
  subTitle: { fontSize: 16, fontWeight: "600", marginVertical: 16 },
  unitContainer: {
    backgroundColor: "#fff",
    marginVertical: 5,
    borderRadius: 8,
    overflow: "hidden",
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#eee",
  },
  unitHeader: {
    backgroundColor: "#ffffffff",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  unitTitle: {
    fontSize: 18,
    color: "black",
    fontWeight: "600",
    marginRight: "auto",
    marginLeft: 10,
  },
  stepsContainer: { backgroundColor: "#e9f3ff", paddingLeft: 20 },
  stepButton: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
  },
  stepText: { fontSize: 15, width: "90%" },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 20,
    alignItems: "center",
    borderRadius: 50,
    marginTop: 10,
    marginHorizontal: 10,
  },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EFF4F8",
  },
  noDataText: {
    fontSize: 14,
    color: "#595E62",
    textAlign: "center",
    marginVertical: 20,
  },
});

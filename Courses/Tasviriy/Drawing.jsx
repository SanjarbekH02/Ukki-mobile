import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  Dimensions,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Video } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import { images } from "./unit";

const { width, height } = Dimensions.get("window");
const imageSize = width / 2.4;

const Drawing = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { step, unitId, unitSteps, progress, setProgress } = route.params;
  const [showVideo, setShowVideo] = useState(false);
  const [enlargedImage, setEnlargedImage] = useState(null);
  const [orientation, setOrientation] = useState("portrait");

  const selectedImageData = images.find((item) => item.id === step.id);

  useEffect(() => {
    const handleOrientationChange = () => {
      const { width, height } = Dimensions.get("window");
      setOrientation(width > height ? "landscape" : "portrait");
    };

    const subscription = Dimensions.addEventListener(
      "change",
      handleOrientationChange
    );
    handleOrientationChange();
    return () => subscription?.remove();
  }, []);

  if (!selectedImageData) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.noDataText}>Malumotlar topilmadi</Text>
      </View>
    );
  }

  const handleComplete = () => {
    if (progress.unitId === unitId && step.order > progress.lastCompletedStep) {
      setProgress({ unitId, lastCompletedStep: step.order });
    }

    const currentStepIndex = unitSteps.findIndex((s) => s.id === step.id);
    const nextStep = unitSteps[currentStepIndex + 1];

    if (nextStep) {
      navigation.replace("Drawing", {
        unitId,
        step: nextStep,
        unitSteps,
        progress,
        setProgress,
      });
    } else {
      navigation.goBack();
    }
  };

  const handleImagePress = (imageUri) => {
    setEnlargedImage(imageUri);
  };

  const renderImageItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleImagePress(item)}>
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: item }}
          style={styles.smallImage}
          resizeMode="cover"
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>{step.title}</Text>
        <TouchableOpacity>
          <Ionicons name="heart-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={() => handleImagePress(selectedImageData.mainImage)}
      >
        <Image
          source={{ uri: selectedImageData.mainImage }}
          style={styles.mainImage}
          resizeMode="contain"
        />
      </TouchableOpacity>

      <Text style={styles.subTitle}>Rasm chizish tartibi:</Text>
      <FlatList
        data={selectedImageData.images}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
        contentContainerStyle={styles.imageList}
        renderItem={renderImageItem}
      />

      <TouchableOpacity
        style={styles.videoButton}
        onPress={() => setShowVideo(true)}
      >
        <Ionicons name="play-circle" size={24} color="#fff" />
        <Text style={styles.videoButtonText}>Videoni ko‘rish</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.completeButton} onPress={handleComplete}>
        <Text style={styles.completeButtonText}>Tugallandi</Text>
      </TouchableOpacity>

      <Modal visible={showVideo} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <Video
            source={{ uri: selectedImageData.video }}
            useNativeControls
            resizeMode="contain"
            style={
              orientation === "portrait" ? styles.video : styles.videoLandscape
            }
            isLooping
          />
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowVideo(false)}
          >
            <Ionicons name="close" size={28} color="#fff" />
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal visible={!!enlargedImage} transparent={true} animationType="fade">
        <View style={styles.modalContainer}>
          <Image
            source={{ uri: enlargedImage }}
            style={
              orientation === "portrait"
                ? styles.enlargedImage
                : styles.enlargedImageLandscape
            }
            resizeMode="contain"
          />
          <TouchableOpacity
            style={[styles.videoButton, styles.enlargedVideoButton]}
            onPress={() => {
              setEnlargedImage(null);
              setShowVideo(true);
            }}
          >
            <Ionicons name="play-circle" size={24} color="#fff" />
            <Text style={styles.videoButtonText}>Videoni ko‘rish</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setEnlargedImage(null)}
          >
            <Ionicons name="close" size={28} color="#fff" />
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    paddingTop: 50,
    backgroundColor: "#f8f9fa",
  },
  headerText: {
    fontSize: 16,
    fontWeight: "600",
  },
  mainImage: {
    width: "100%",
    height: 220,
    marginBottom: 20,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginVertical: 10,
    textAlign: "center",
  },
  imageList: {
    paddingHorizontal: 10,
    alignItems: "center",
  },
  imageWrapper: {
    margin: 5,
    alignItems: "center",
    justifyContent: "center",
    width: imageSize,
    height: imageSize,
  },
  smallImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
    backgroundColor: "#eee",
  },
  videoButton: {
    flexDirection: "row",
    backgroundColor: "#333",
    padding: 10,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    margin: 20,
    marginBottom: 2,
  },
  videoButtonText: {
    color: "#fff",
    fontWeight: "600",
    marginLeft: 10,
  },
  completeButton: {
    backgroundColor: "#008000",
    padding: 14,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    margin: 20,
  },
  completeButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  video: {
    width: "100%",
    height: 300,
  },
  videoLandscape: {
    width: height * 0.9,
    height: width * 0.6,
  },
  enlargedImage: {
    width: "100%",
    height: "70%",
  },
  enlargedImageLandscape: {
    width: height * 0.9,
    height: width * 0.7,
  },
  enlargedVideoButton: {
    position: "absolute",
    bottom: 20,
    margin: 0,
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  noDataText: {
    fontSize: 14,
    color: "#595E62",
    textAlign: "center",
  },
});

export default Drawing;

import { Audio } from "expo-av";
import { useRef, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import OnError from "../../../components/Utils/OnError";
import Success from "../../../components/Utils/Success";
import ThreeButtons from "../../../components/Utils/ThreeButtons";
import FlashCards from "../../../components/YangiSozlar";
import Styles from "../../../Styles/Styles";

export default function U3Step1({ next }) {
  const [infoClick, setInfoClick] = useState(true);
  const [clicked, setClicked] = useState(true);
  const [dictionary, setDictionary] = useState(false);

  // Game state management
  const [currentPhase, setCurrentPhase] = useState(1); // 1-5 for CD1-40-1 through CD1-40-5
  const [gameMode, setGameMode] = useState("waiting"); // 'waiting', 'playing_audio', 'character_selection', 'object_finding'
  const [foundObjects, setFoundObjects] = useState([]);
  const [currentObjectIndex, setCurrentObjectIndex] = useState(0); // Track which object to find next
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [currentSubtitle, setCurrentSubtitle] = useState("");
  const [currentTranslation, setCurrentTranslation] = useState("");
  const soundRef = useRef(null);

  // Button positions for clickable circles
  const buttonPositions = {
    tina: { top: "50%", left: "26%", width: 50, height: 50 },
    olivia: { top: "50%", left: "53%", width: 50, height: 50 },
    david: { top: "70%", left: "80%", width: 50, height: 50 },
    bike: { top: "43%", left: "8%", width: 25, height: 25 },
    ball: { top: "35%", left: "35%", width: 25, height: 25 },
    kite: { top: "28%", left: "47%", width: 25, height: 25 },
    doll: { top: "27%", left: "60%", width: 25, height: 25 },
    teddy1: { top: "25%", left: "72%", width: 25, height: 25 },
    camera: { top: "42%", left: "67%", width: 25, height: 25 },
    laptop: { top: "70%", left: "16%", width: 25, height: 25 },
    computergames: { top: "68%", left: "40%", width: 25, height: 25 },
    artset: { top: "75%", left: "69%", width: 25, height: 25 },
  };

  const allButtons = [
    "tina",
    "olivia",
    "david",
    "bike",
    "ball",
    "kite",
    "doll",
    "teddy1",
    "camera",
    "laptop",
    "computergames",
    "artset",
  ];

  // Dialogue data for each phase with individual object audio
  const dialogueData = {
    1: {
      speaker: "tina",
      audioUrl: "https://ukkibackend.soof.uz/media/audio/CD1-40-1.mp3",
      subtitles: [
        {
          text: "These are my toys!",
          translation: "Bular mening o'yinchoqlarim!",
          start: 0,
          end: 2,
        },
        {
          text: "My yellow bike, my blue ball, my green and yellow kite...",
          translation:
            "Mening sariq velosipedim, ko'k koptogim, yashil va sariq varragim...",
          start: 3,
          end: 6,
        },
      ],
      needsCharacterIdentification: true,
      objects: [],
    },
    2: {
      speaker: "olivia",
      audioUrl: "https://ukkibackend.soof.uz/media/audio/CD1-40-2.mp3",
      subtitles: [
        {
          text: "Hmm, and here's a doll.",
          translation: "Mmm, bu yerda esa qo'g'irchoq bor.",
          start: 0,
          end: 2,
        },
        {
          text: "And three teddy bears...",
          translation: "Va uchta yumshoq ayiqcha...",
          start: 4,
          end: 6,
        },
      ],
      objects: ["doll", "teddy1"],
      phaseAudioUrl: "https://ukkibackend.soof.uz/media/audio/CD1-40-2.mp3",
    },
    3: {
      speaker: "david",
      audioUrl: "https://ukkibackend.soof.uz/media/audio/CD1-40-3.mp3",
      subtitles: [
        {
          text: "Wow! Nice computer!",
          translation: "Voy! Qanday chiroyli kompyuter!",
          start: 0,
          end: 3,
        },
        {
          text: "Oh, and computer games! One, two, three, four, five, six, seven, eight computer games! Let's play!",
          translation:
            "Oh, va kompyuter o'yinlari! Bir, ikki, uch, to'rt, besh, olti, yetti, sakkizta kompyuter o'yini! Keling, o'ynaymiz!",
          start: 3,
          end: 8,
        },
      ],
      objects: ["laptop", "computergames"],
      phaseAudioUrl: "https://ukkibackend.soof.uz/media/audio/CD1-40-3.mp3",
    },
    4: {
      speaker: "tina",
      audioUrl: "https://ukkibackend.soof.uz/media/audio/CD1-40-4.mp3",
      subtitles: [
        {
          text: "OK, OK, but look at my favorite toy – my art set.",
          translation:
            "Mayli, mayli, lekin mening sevimli o'yinchog'imga qara – mening rasm chizish to'plamim.",
          start: 0,
          end: 7,
        },
        {
          text: "What's your favorite toy, Olivia?",
          translation: "Sening sevimli o'yinchog'ing nima, Olivia?",
          start: 7,
          end: 6,
        },
      ],
      objects: ["artset"],
      phaseAudioUrl: "https://ukkibackend.soof.uz/media/audio/CD1-40-4.mp3",
    },
    5: {
      speaker: "olivia",
      audioUrl: "https://ukkibackend.soof.uz/media/audio/CD1-40-5.mp3",
      subtitles: [
        {
          text: "Hmm... my camera!",
          translation: "Mmm... mening kameram!",
          start: 0,
          end: 2,
        },
        {
          text: "Bleep!",
          translation: "Bip!",
          start: 3,
          end: 4,
        },
        {
          text: "Oh, and iPal – our robot! Now, let's play!",
          translation:
            "Oh, va iPal – bizning robotimiz! Endi, keling, o'ynaymiz!",
          start: 5,
          end: 8,
        },
      ],
      objects: ["camera"],
      phaseAudioUrl: "https://ukkibackend.soof.uz/media/audio/CD1-40-5.mp3",
    },
  };

  // Play audio with subtitles
  const playPhaseAudio = async (phase) => {
    const phaseData = dialogueData[phase];
    if (!phaseData) return;

    try {
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
      }

      setGameMode("playing_audio");
      const { sound } = await Audio.Sound.createAsync(
        { uri: phaseData.audioUrl },
        { shouldPlay: true }
      );
      soundRef.current = sound;

      // Handle subtitle timing (simplified - show all subtitles)
      phaseData.subtitles.forEach((subtitle, index) => {
        setTimeout(() => {
          setCurrentSubtitle(subtitle.text);
          setCurrentTranslation(subtitle.translation);
        }, subtitle.start * 1000);
      });

      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          setCurrentSubtitle("");
          setCurrentTranslation("");

          // Check if this phase needs character identification
          if (phaseData.needsCharacterIdentification) {
            setGameMode("character_selection");
          } else {
            setGameMode("object_finding");
            setFoundObjects([]);
            setCurrentObjectIndex(0);
          }
        }
      });
    } catch (error) {
      console.error("Audio playback error:", error);
      setGameMode("object_finding");
    }
  };

  // Play individual object audio
  const playObjectAudio = async (objectData) => {
    try {
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
      }

      const { sound } = await Audio.Sound.createAsync(
        { uri: objectData.audioUrl },
        { shouldPlay: true }
      );
      soundRef.current = sound;

      // Show object subtitle
      setCurrentSubtitle(objectData.text);
      setCurrentTranslation(objectData.translation);

      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          setCurrentSubtitle("");
          setCurrentTranslation("");
        }
      });
    } catch (error) {
      console.error("Object audio playback error:", error);
    }
  };

  // Play phase audio for object finding (no subtitles)
  const playPhaseAudioForObjects = async (audioUrl) => {
    try {
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
      }

      const { sound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: true }
      );
      soundRef.current = sound;
    } catch (error) {
      console.error("Phase audio playback error:", error);
    }
  };

  // Handle circle press based on game mode
  const handleCirclePress = (buttonId) => {
    const phaseData = dialogueData[currentPhase];
    const characterButtons = ["tina", "olivia", "david"];

    if (gameMode === "character_selection") {
      // Only respond to character buttons
      if (characterButtons.includes(buttonId)) {
        if (buttonId === phaseData.speaker) {
          setShowSuccess(true);
          setTimeout(() => {
            setShowSuccess(false);
            // Move to next phase for character identification phases
            if (currentPhase < 5) {
              setCurrentPhase(currentPhase + 1);
              setGameMode("waiting");
              setFoundObjects([]);
              setCurrentObjectIndex(0);
            } else {
              setGameCompleted(true);
            }
          }, 1000);
        } else {
          setShowError(true);
          setTimeout(() => setShowError(false), 1500);
        }
      }
    } else if (gameMode === "object_finding") {
      // Check if user clicked a valid object for current phase
      if (
        phaseData.objects.includes(buttonId) &&
        !foundObjects.includes(buttonId)
      ) {
        const newFoundObjects = [...foundObjects, buttonId];
        setFoundObjects(newFoundObjects);
        setShowSuccess(true);

        setTimeout(() => {
          setShowSuccess(false);

          // Check if all objects found
          if (newFoundObjects.length === phaseData.objects.length) {
            setTimeout(() => {
              if (currentPhase < 5) {
                setCurrentPhase(currentPhase + 1);
                setGameMode("waiting");
                setFoundObjects([]);
                setCurrentObjectIndex(0);
              } else {
                setGameCompleted(true);
              }
            }, 1000);
          }
        }, 800);
      } else if (!phaseData.objects.includes(buttonId)) {
        // Wrong object clicked
        setShowError(true);
        setTimeout(() => setShowError(false), 1500);
      }
    }
  };

  // Custom play button handler
  const handlePlayPress = () => {
    if (gameMode === "waiting") {
      playPhaseAudio(currentPhase);
    }
  };

  // Render unified status/subtitle component
  const renderUnifiedStatus = () => {
    if (gameCompleted) {
      return (
        <View style={gameStyles.statusContainer}>
          <Text style={gameStyles.completedText}>
            Tabriklaymiz! O'yin tugadi!
          </Text>
          <Text style={gameStyles.completedSubtext}>
            Barcha vazifalar bajarildi!
          </Text>
        </View>
      );
    }

    // Show subtitles during audio playback
    if (
      gameMode === "playing_audio" &&
      (currentSubtitle || currentTranslation)
    ) {
      return (
        <View style={gameStyles.statusContainer}>
          <Text style={gameStyles.subtitleText}>{currentSubtitle}</Text>
          <Text style={gameStyles.translationText}>{currentTranslation}</Text>
        </View>
      );
    }

    // Show object subtitles during object finding
    if (
      gameMode === "object_finding" &&
      (currentSubtitle || currentTranslation)
    ) {
      const phaseData = dialogueData[currentPhase];
      return (
        <View style={gameStyles.statusContainer}>
          <Text style={gameStyles.subtitleText}>{currentSubtitle}</Text>
          <Text style={gameStyles.translationText}>{currentTranslation}</Text>
          <Text style={gameStyles.progressText}>
            {foundObjects.length} / {phaseData?.objects.length}
          </Text>
        </View>
      );
    }

    if (gameMode === "character_selection") {
      return (
        <View style={gameStyles.statusContainer}>
          <Text style={gameStyles.questionText}>
            Kim gapirmoqda? / Who's speaking?
          </Text>
        </View>
      );
    }

    if (gameMode === "object_finding") {
      const phaseData = dialogueData[currentPhase];
      return (
        <View style={gameStyles.statusContainer}>
          <Text style={gameStyles.instructionText}>
            Eshitilgan narsalarni toping / Find the mentioned objects
          </Text>
          <Text style={gameStyles.progressText}>
            {foundObjects.length} / {phaseData?.objects.length}
          </Text>
          <TouchableOpacity
            style={gameStyles.smallPlayButton}
            onPress={() => {
              if (phaseData.phaseAudioUrl) {
                playPhaseAudioForObjects(phaseData.phaseAudioUrl);
              }
            }}
          >
            <Text style={gameStyles.smallPlayButtonText}>
              🔊 Play Audio Again
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (gameMode === "waiting") {
      const buttonText = currentPhase === 1 ? "▶ Play" : "▶ Play Next";
      return (
        <TouchableOpacity
          style={gameStyles.playButton}
          onPress={handlePlayPress}
        >
          <Text style={gameStyles.playButtonText}>{buttonText}</Text>
        </TouchableOpacity>
      );
    }

    return null;
  };

  return (
    <>
      {dictionary ? (
        <FlashCards
          setDictionary={setDictionary}
          data={[
            {
              word: "toys",
              translation: "o'yinchoqlar",
              audioUrl:
                "https://ukkibackend.soof.uz/media/audio/oyinchoqlar.mp3",
            },
            {
              word: "bike",
              translation: "velosiped",
              audioUrl: "https://ukkibackend.soof.uz/media/audio/velosiped.mp3",
            },
            {
              word: "ball",
              translation: "koptok",
              audioUrl: "https://ukkibackend.soof.uz/media/audio/koptok.mp3",
            },
            {
              word: "kite",
              translation: "varrak",
              audioUrl: "https://ukkibackend.soof.uz/media/audio/varrak.mp3",
            },
            {
              word: "doll",
              translation: "qo'g'irchoq",
              audioUrl:
                "https://ukkibackend.soof.uz/media/audio/qo'girchoq.mp3",
            },
            {
              word: "teddy bears",
              translation: "yumshoq ayiqchalar",
              audioUrl:
                "https://ukkibackend.soof.uz/media/audio/yumshoq ayiqchalar.mp3",
            },
            {
              word: "computer",
              translation: "kompyuter",
              audioUrl: "https://ukkibackend.soof.uz/media/audio/komputer.mp3",
            },
            {
              word: "games",
              translation: "o'yinlar",
              audioUrl: "https://ukkibackend.soof.uz/media/audio/o'yinlar.mp3",
            },
            {
              word: "favorite",
              translation: "sevimli",
              audioUrl: "https://ukkibackend.soof.uz/media/audio/sevimli.mp3",
            },
            {
              word: "art set",
              translation: "rasm chizish to'plami",
              audioUrl:
                "https://ukkibackend.soof.uz/media/audio/rasmchizish toplami.mp3",
            },
            {
              word: "camera",
              translation: "kamera",
              audioUrl: "https://ukkibackend.soof.uz/media/audio/o'yinlar.mp3",
            },
          ]}
        />
      ) : (
        <View style={Styles.container}>
          <Image
            style={[Styles.ImgFull, { height: "75%" }]}
            source={require("../../../assets/images/unit-3/unit-2-step-1.png")}
          />

          {/* Clickable circle overlays */}
          <View style={overlayStyles.overlayContainer}>
            {allButtons.map((buttonId) => {
              const characterButtons = ["tina", "olivia", "david"];
              const objectButtons = [
                "bike",
                "ball",
                "kite",
                "doll",
                "teddy1",
                "camera",
                "laptop",
                "computergames",
                "artset",
              ];

              const isCharacter = characterButtons.includes(buttonId);
              const isObject = objectButtons.includes(buttonId);
              const isFound = foundObjects.includes(buttonId);

              // Show only characters during character selection
              const showCharacterSelection =
                gameMode === "character_selection" && isCharacter;

              // During object finding, show all objects
              const showObjectSelection =
                gameMode === "object_finding" && isObject;

              // Don't render if not in appropriate mode
              if (!showCharacterSelection && !showObjectSelection) {
                return null;
              }

              return (
                <TouchableOpacity
                  key={buttonId}
                  style={[
                    overlayStyles.buttonOverlay,
                    buttonPositions[buttonId],
                    isFound && overlayStyles.foundButton,
                  ]}
                  onPress={() => handleCirclePress(buttonId)}
                />
              );
            })}
          </View>

          {/* Unified Status/Subtitle/Play Component */}
          {renderUnifiedStatus()}

          {/* Success and Error feedback */}
          {showSuccess && <Success />}
          {showError && <OnError message="Qayta urinib ko'ring / Try again" />}

          <ThreeButtons
            setDictionary={setDictionary}
            infoClick={infoClick}
            clicked={clicked}
            setClicked={setClicked}
            setInfoClick={setInfoClick}
            audioUrl="https://ukkibackend.soof.uz/media/audio/Aziz-bolajon,-suhbatni-tingla-va-qahramonlarga-moslashtir.mp3"
            playBtn={true}
          />
        </View>
      )}
    </>
  );
}

const overlayStyles = {
  overlayContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "75%",
  },
  buttonOverlay: {
    position: "absolute",
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 12.5,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.8)",
  },
  foundButton: {
    backgroundColor: "rgba(76, 175, 80, 0.6)",
    borderColor: "#4CAF50",
  },
  targetButton: {
    borderColor: "#FF6B35",
    backgroundColor: "rgba(255, 107, 53, 0.5)",
    borderWidth: 3,
  },
  activeButton: {
    borderColor: "#FFD700",
    backgroundColor: "rgba(255, 215, 0, 0.4)",
  },
};

const gameStyles = {
  statusContainer: {
    position: "absolute",
    bottom: 80,
    left: 20,
    right: 20,
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    padding: 15,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  playButton: {
    position: "absolute",
    bottom: 80,
    left: 0,
    right: 0,
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "#FF6B35",
    paddingVertical: 18,
    paddingHorizontal: 60,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    marginHorizontal: 50,
  },
  smallPlayButton: {
    backgroundColor: "#C200F3",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  questionText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },
  instructionText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#555",
    textAlign: "center",
    marginBottom: 5,
  },
  progressText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#C200F3",
    textAlign: "center",
  },
  currentObjectText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FF6B35",
    textAlign: "center",
    marginVertical: 8,
    paddingHorizontal: 10,
  },
  phaseText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FF6B35",
    textAlign: "center",
    marginBottom: 5,
  },
  playButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  smallPlayButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  subtitleText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
    marginBottom: 8,
  },
  translationText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    fontStyle: "italic",
  },
  completedText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4CAF50",
    textAlign: "center",
    marginBottom: 5,
  },
  completedSubtext: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
  },
};

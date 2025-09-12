import { Audio } from "expo-av";
import { useEffect, useRef, useState } from "react";
import { Animated, Image, Text, TouchableOpacity, View } from "react-native";
import OnError from "../../../components/Utils/OnError";
import Success from "../../../components/Utils/Success";
import WordPractice from "../../../components/Utils/Talaffuz";
import ThreeButtons from "../../../components/Utils/ThreeButtons";
import WordGameAssist from "../../../components/Utils/WordGame";
import FlashCards from "../../../components/YangiSozlar";
import Styles from "../../../Styles/Styles";

export default function U3Step1({ next }) {
  const [infoClick, setInfoClick] = useState(true);
  const [clicked, setClicked] = useState(true);
  const [dictionary, setDictionary] = useState(false);
  const [wordgame, setWordgame] = useState(true);
  const [talaffuz, setTalaffuz] = useState(false)

  // Workshop state management
  const [workshopMode, setWorkshopMode] = useState(false);
  const [workshopStage, setWorkshopStage] = useState(1);
  const [checkedAnswers, setCheckedAnswers] = useState([
    null,
    null,
    null,
    null,
  ]);
  const [workshopCompleted, setWorkshopCompleted] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [helpTimer, setHelpTimer] = useState(null);
  const [isExampleStage, setIsExampleStage] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showErrorFeedback, setShowErrorFeedback] = useState(false);
  const soundRef = useRef(null);
  const shakeAnimation = useRef(new Animated.Value(0)).current;
  const helpButtonScale = useRef(new Animated.Value(1)).current;

  // Workbook data structure
  const workbookData = [
    {
      stage: 1,
      audio: "https://ukkibackend.soof.uz/media/audio/CD1-43-1.mp3", // Placeholder - need actual audio
      script: "It's a computer.",
      image: require("../../../assets/images/unit-3/workbook-1-1.png"),
      exampleAudio: "https://ukkibackend.soof.uz/media/audio/CD1-43-1.mp3", // Placeholder
    },
    {
      stage: 2,
      audio: "https://ukkibackend.soof.uz/media/audio/CD1-43-2.mp3", // Placeholder
      script: "It's an art set.",
      image: require("../../../assets/images/unit-3/workbook-1-2.png"),
      correctAnswer: 1, // A is correct
    },
    {
      stage: 3,
      audio: "https://ukkibackend.soof.uz/media/audio/CD1-43-3.mp3", // Placeholder
      script: "It's a robot.",
      image: require("../../../assets/images/unit-3/workbook-1-3.png"),
      correctAnswer: 2, // B is correct
    },
    {
      stage: 4,
      audio: "https://ukkibackend.soof.uz/media/audio/CD1-43-4.mp3", // Placeholder
      script: "It's a ball.",
      image: require("../../../assets/images/unit-3/workbook-1-4.png"),
      correctAnswer: 2, // B is correct
    },
  ];

  // Game state management
  const [currentPhase, setCurrentPhase] = useState(1); // 1-5 for CD1-40-1 through CD1-40-5
  const [gameMode, setGameMode] = useState("waiting"); // 'waiting', 'playing_audio', 'character_selection', 'object_finding'
  const [foundObjects, setFoundObjects] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [currentSubtitle, setCurrentSubtitle] = useState("");
  const [currentTranslation, setCurrentTranslation] = useState("");

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
      phaseData.subtitles.forEach((subtitle) => {
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
          }
        }
      });
    } catch (error) {
      console.error("Audio playback error:", error);
      setGameMode("object_finding");
    }
  };

  // Play individual object audio (unused but kept for future functionality)
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
    if (gameCompleted && !workshopMode) {
      return (
        <View style={gameStyles.statusContainer}>
          <Text style={gameStyles.completedText}>
            Tabriklaymiz! O&apos;yin tugadi!
          </Text>
          <Text style={gameStyles.completedSubtext}>
            Barcha vazifalar bajarildi!
          </Text>
          <TouchableOpacity
            style={gameStyles.workshopButton}
            onPress={() => {
              setWorkshopMode(true);
              setWorkshopStage(1);
              setIsExampleStage(true);
              setCheckedAnswers([null, null, null, null]);
              setWorkshopCompleted(false);
            }}
          >
            <Text style={gameStyles.workshopButtonText}>📖 Start Workbook</Text>
          </TouchableOpacity>
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
            Kim gapirmoqda? / Who&apos;s speaking?
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

  // Workshop audio functions
  const playWorkshopAudio = async (audioUrl) => {
    try {
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
      }
      const { sound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: true }
      );
      soundRef.current = sound;

      // Set up audio completion listener - no auto-advance
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          // Audio finished, wait for user interaction
        }
      });
    } catch (error) {
      console.error("Workshop audio error:", error);
    }
  };

  // Shake animation function
  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Auto-play audio when entering workshop stage
  useEffect(() => {
    if (workshopMode && !workshopCompleted) {
      const currentData = workbookData[workshopStage - 1];
      if (currentData && currentData.audio) {
        // Auto-play audio after a short delay
        setTimeout(() => {
          playWorkshopAudio(currentData.audio);
        }, 500);
      }
    }
  }, [workshopMode, workshopStage, workshopCompleted, workbookData]);

  // Help button pulse animation
  useEffect(() => {
    if (workshopMode && !showHelp) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(helpButtonScale, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(helpButtonScale, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      helpButtonScale.setValue(1);
    }
  }, [workshopMode, showHelp, helpButtonScale]);

  // Handle example stage auto-setup
  useEffect(() => {
    if (workshopMode && isExampleStage && workshopStage === 1) {
      // Auto-play example audio after a short delay
      setTimeout(() => {
        playWorkshopAudio(workbookData[0].exampleAudio);
      }, 1000);
    }
  }, [workshopMode, isExampleStage, workshopStage, workbookData]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (helpTimer) clearTimeout(helpTimer);
    };
  }, [helpTimer]);

  // Handle tick box selection - allow free selection
  const handleTickBoxSelect = (tickBoxIndex) => {
    const newCheckedAnswers = [...checkedAnswers];
    newCheckedAnswers[workshopStage - 1] = tickBoxIndex;
    setCheckedAnswers(newCheckedAnswers);
  };

  // Handle check answer
  const handleCheckAnswer = () => {
    const currentStage = workshopStage - 1;
    const selectedAnswer = checkedAnswers[currentStage];

    // Example stage (stage 1) - just advance to next stage
    if (isExampleStage && workshopStage === 1) {
      if (workshopStage < 4) {
        setWorkshopStage(workshopStage + 1);
        setIsExampleStage(false);
      } else {
        setWorkshopCompleted(true);
      }
      return;
    }

    if (selectedAnswer === null) {
      // No selection made - shake to prompt selection
      shake();
      return;
    }

    const correctAnswer = workbookData[currentStage].correctAnswer;
    const isCorrect = selectedAnswer === correctAnswer;

    if (isCorrect) {
      // Advance to next stage after delay
      setTimeout(() => {
        if (workshopStage < 4) {
          setWorkshopStage(workshopStage + 1);
          setIsExampleStage(false);
        } else {
          // Workshop completed
          setWorkshopCompleted(true);
        }
      }, 1500);
    } else {
      // Wrong answer - shake and show visual feedback
      shake();
      // Show error feedback temporarily
      setShowErrorFeedback(true);
      setTimeout(() => setShowErrorFeedback(false), 1500);
    }
  };

  // Render workshop component
  const renderWorkshop = () => {
    if (workshopCompleted) {
      return (
        <View style={workshopStyles.container}>
          <Text style={workshopStyles.title}>🎉 Excellent!</Text>
          <Text style={workshopStyles.subtitle}>Workbook completed!</Text>
          <View style={workshopStyles.buttonContainer}>
            <TouchableOpacity
              style={workshopStyles.nextButton}
              onPress={() => {
                setWorkshopMode(false);
                next();
              }}
            >
              <Text style={workshopStyles.buttonText}>Next</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={workshopStyles.menuButton}
              onPress={() => setWorkshopMode(false)}
            >
              <Text style={workshopStyles.buttonText}>Main Menu</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    const currentData = workbookData[workshopStage - 1];

    // Example stage (Stage 1) - just show image with next button
    if (isExampleStage && workshopStage === 1) {
      return (
        <View style={workshopStyles.container}>
          {/* Progress indicator */}
          <View style={workshopStyles.progressContainer}>
            {[1, 2, 3, 4].map((stage) => (
              <View
                key={stage}
                style={[
                  workshopStyles.progressDot,
                  stage <= workshopStage && workshopStyles.progressDotActive,
                ]}
              />
            ))}
          </View>

          {/* Help modal */}
          {showHelp && (
            <View style={workshopStyles.helpModal}>
              <View style={workshopStyles.helpModalHeader}>
                <Text style={workshopStyles.helpModalTitle}>💡 Hint</Text>
                <TouchableOpacity
                  style={workshopStyles.closeHelpButton}
                  onPress={() => {
                    setShowHelp(false);
                    if (helpTimer) clearTimeout(helpTimer);
                  }}
                >
                  <Text style={workshopStyles.closeHelpText}>✕</Text>
                </TouchableOpacity>
              </View>
              <View style={workshopStyles.helpModalContent}>
                <Text style={workshopStyles.helpText}>
                  {currentData.script}
                </Text>
              </View>
            </View>
          )}

          {/* Play button */}
          <TouchableOpacity
            style={workshopStyles.playButton}
            onPress={() => playWorkshopAudio(currentData.exampleAudio)}
          >
            <Text style={workshopStyles.playButtonText}>🔊 Play</Text>
          </TouchableOpacity>

          {/* Single image for example */}
          <Image
            source={currentData.image}
            style={workshopStyles.exampleImage}
          />

          {/* Next button */}
          <TouchableOpacity
            style={workshopStyles.nextButton}
            onPress={() => {
              setWorkshopStage(2);
              setIsExampleStage(false);
            }}
          >
            <Text style={workshopStyles.buttonText}>Next</Text>
          </TouchableOpacity>

          {/* Three buttons component */}
          <ThreeButtons
            setDictionary={setDictionary}
            infoClick={infoClick}
            clicked={clicked}
            setClicked={setClicked}
            setInfoClick={setInfoClick}
            audioUrl="https://ukkibackend.soof.uz/media/audio/Listen_and_check_example.mp3"
          />
        </View>
      );
    }

    // Main stages (2-4) - interactive selection
    return (
      <View style={{ flex: 1 }}>
        {/* Three buttons positioned at top-right */}
        <View style={workshopStyles.topRightContainer}>
          <ThreeButtons
            setDictionary={setDictionary}
            infoClick={infoClick}
            clicked={clicked}
            setClicked={setClicked}
            setInfoClick={setInfoClick}
            audioUrl="https://ukkibackend.soof.uz/media/audio/Listen_and_check.mp3"
          />
        </View>

        <Animated.View
          style={[
            workshopStyles.container,
            {
              transform: [{ translateX: shakeAnimation }],
            },
          ]}
        >
          {/* Error feedback using existing component */}
          {showErrorFeedback && (
            <OnError
              visible={showErrorFeedback}
              message="Qayta urinib ko'ring / Try again"
            />
          )}
          {/* Progress indicator */}
          <View style={workshopStyles.progressContainer}>
            {[1, 2, 3, 4].map((stage) => (
              <View
                key={stage}
                style={[
                  workshopStyles.progressDot,
                  stage <= workshopStage && workshopStyles.progressDotActive,
                ]}
              />
            ))}
          </View>

          {/* Help modal */}
          {showHelp && (
            <View style={workshopStyles.helpModal}>
              <View style={workshopStyles.helpModalHeader}>
                <Text style={workshopStyles.helpModalTitle}>
                  💡 Audio Script
                </Text>
                <TouchableOpacity
                  style={workshopStyles.closeHelpButton}
                  onPress={() => {
                    setShowHelp(false);
                    if (helpTimer) clearTimeout(helpTimer);
                  }}
                >
                  <Text style={workshopStyles.closeHelpText}>✕</Text>
                </TouchableOpacity>
              </View>
              <View style={workshopStyles.helpModalContent}>
                <Text style={workshopStyles.helpText}>
                  {currentData.script}
                </Text>
              </View>
            </View>
          )}

          {/* Play button */}
          <TouchableOpacity
            style={workshopStyles.playButton}
            onPress={() => playWorkshopAudio(currentData.audio)}
          >
            <Text style={workshopStyles.playButtonText}>🔊 Play</Text>
          </TouchableOpacity>

          {/* Single image with tick boxes */}
          <View style={workshopStyles.imageContainer}>
            <Image
              source={currentData.image}
              style={workshopStyles.singleImage}
              resizeMode="contain"
            />

            {/* Tick box 1 - above */}
            <TouchableOpacity
              style={[
                workshopStyles.tickBox,
                workshopStyles.tickBoxAbove,
                checkedAnswers[workshopStage - 1] === 1 &&
                workshopStyles.tickBoxSelected,
              ]}
              onPress={() => handleTickBoxSelect(1)}
            >
              {checkedAnswers[workshopStage - 1] === 1 && (
                <Text style={workshopStyles.tickBoxCheckmark}>✓</Text>
              )}
            </TouchableOpacity>

            {/* Tick box 2 - bottom right */}
            <TouchableOpacity
              style={[
                workshopStyles.tickBox,
                workshopStyles.tickBoxBottomRight,
                checkedAnswers[workshopStage - 1] === 2 &&
                workshopStyles.tickBoxSelected,
              ]}
              onPress={() => handleTickBoxSelect(2)}
            >
              {checkedAnswers[workshopStage - 1] === 2 && (
                <Text style={workshopStyles.tickBoxCheckmark}>✓</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Check button */}
          <TouchableOpacity
            style={[workshopStyles.checkButton]}
            onPress={handleCheckAnswer}
            disabled={checkedAnswers[workshopStage - 1] === null}
          >
            <Text style={workshopStyles.checkButtonText}>Check</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  };

  return (
    <>
      {/* Debug button - floating workshop skip */}


      {workshopMode ? (
        renderWorkshop()
      ) :
        dictionary ? (
          <>

            {wordgame ? (
              <FlashCards
                setDictionary={setWordgame}
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
                    audioUrl:
                      "https://ukkibackend.soof.uz/media/audio/velosiped.mp3",
                  },
                  {
                    word: "ball",
                    translation: "koptok",
                    audioUrl:
                      "https://ukkibackend.soof.uz/media/audio/koptok.mp3",
                  },
                  {
                    word: "kite",
                    translation: "varrak",
                    audioUrl:
                      "https://ukkibackend.soof.uz/media/audio/varrak.mp3",
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
                    audioUrl:
                      "https://ukkibackend.soof.uz/media/audio/komputer.mp3",
                  },
                  {
                    word: "games",
                    translation: "o'yinlar",
                    audioUrl:
                      "https://ukkibackend.soof.uz/media/audio/o'yinlar.mp3",
                  },
                  {
                    word: "favorite",
                    translation: "sevimli",
                    audioUrl:
                      "https://ukkibackend.soof.uz/media/audio/sevimli.mp3",
                  },
                  {
                    word: "art set",
                    translation: "rasm chizish to'plami",
                    audioUrl:
                      "https://ukkibackend.soof.uz/media/audio/rasmchizish toplami.mp3",
                  },

                ]}
              />

            ) : talaffuz ? (
              <WordPractice
                setWordgame={setWordgame}
                setDictionary={setDictionary}
                setTalaffuz={setTalaffuz}
                words={[
                  { text: "Toys", audioUrl: "https://ukkibackend.soof.uz/media/audio/oyinchoqlar.mp3" },
                  { text: "Bike", audioUrl: "https://ukkibackend.soof.uz/media/audio/velosiped.mp3" },
                  { text: "Ball", audioUrl: "https://ukkibackend.soof.uz/media/audio/koptok.mp3" },
                  { text: "Kite", audioUrl: "https://ukkibackend.soof.uz/media/audio/varrak.mp3" },
                  { text: "Doll", audioUrl: "https://ukkibackend.soof.uz/media/audio/qo'girchoq.mp3" },
                  { text: "Teddy bears", audioUrl: "https://ukkibackend.soof.uz/media/audio/yumshoq ayiqchalar.mp3" },
                  { text: "Computer", audioUrl: "https://ukkibackend.soof.uz/media/audio/komputer.mp3" },
                  { text: "Games", audioUrl: "https://ukkibackend.soof.uz/media/audio/o'yinlar.mp3" },
                  { text: "favorite", audioUrl: "https://ukkibackend.soof.uz/media/audio/sevimli.mp3" },
                ]}
              />
            ) : (
              <WordGameAssist
                setDictionary={setTalaffuz}
                words={[
                  "toys",
                  "bike",
                  "ball",
                  "kite",
                  "doll",
                  "teddy bear",
                  "computer",
                  "games",
                  "favorite",
                ]}
                audios={[
                  "https://ukkibackend.soof.uz/media/audio/oyinchoqlar.mp3",
                  "https://ukkibackend.soof.uz/media/audio/velosiped.mp3",
                  "https://ukkibackend.soof.uz/media/audio/koptok.mp3",
                  "https://ukkibackend.soof.uz/media/audio/varrak.mp3",
                  "https://ukkibackend.soof.uz/media/audio/qo'girchoq.mp3",
                  "https://ukkibackend.soof.uz/media/audio/yumshoq ayiqchalar.mp3",
                  "https://ukkibackend.soof.uz/media/audio/komputer.mp3",
                  "https://ukkibackend.soof.uz/media/audio/o'yinlar.mp3",
                  "https://ukkibackend.soof.uz/media/audio/sevimli.mp3",
                ]}
              />
            )}
          </>
        ) : (
          <View style={Styles.container}>
            <Image
              style={[Styles.ImgFull, { height: "75%" }]}
              source={require("../../../assets/images/unit-3/unit-2-step-1.png")}
            />

            {/* Clickable circle overlays */}
            {!gameCompleted && (
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
            )}

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
              audioUrl="https://ukkibackend.soof.uz/media/audio/Aziz bolajon, suhbatni tingla va qahramonlarga moslashtir..mp3"
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
  workshopButton: {
    backgroundColor: "#8B5CF6",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 25,
    marginTop: 15,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
    alignItems: "center",
  },
  workshopButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
};

// Workshop styles
const workshopStyles = {
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  progressContainer: {
    flexDirection: "row",
    marginBottom: 30,
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#ddd",
    marginHorizontal: 6,
  },
  progressDotActive: {
    backgroundColor: "#8B5CF6",
  },
  helpButton: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "#8B5CF6",
    zIndex: 1000,
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  helpButtonNearButtons: {
    backgroundColor: "#8B5CF6",
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
    marginRight: 10,
    marginBottom: 10,
  },
  topRightContainer: {
    position: "absolute",
    top: 10,
    right: 0,
    zIndex: 1000,
  },
  helpButtonInner: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  helpButtonText: {
    fontSize: 22,
  },
  helpModal: {
    position: "absolute",
    top: 70,
    left: 15,
    backgroundColor: "#fff",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
    maxWidth: 280,
    zIndex: 100,
    overflow: "hidden",
  },
  helpModalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#8B5CF6",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  helpModalTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  helpModalContent: {
    padding: 16,
  },
  helpText: {
    fontSize: 15,
    color: "#333",
    lineHeight: 20,
    fontWeight: "500",
  },
  closeHelpButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  closeHelpText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
  stageTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  playButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    marginBottom: 30,
  },
  playButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  imagesContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 30,
  },
  imageOption: {
    alignItems: "center",
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 10,
    marginBottom: 10,
  },
  exampleImage: {
    width: 280,
    height: 280,
    borderRadius: 10,
    marginBottom: 40,
    resizeMode: "contain",
  },
  imageLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxSelected: {
    borderColor: "#8B5CF6",
    backgroundColor: "#f3f4f6",
  },
  checkboxCorrect: {
    borderColor: "#4CAF50",
    backgroundColor: "#dcfce7",
  },
  checkmark: {
    fontSize: 16,
    color: "#4CAF50",
    fontWeight: "bold",
  },
  checkButton: {
    backgroundColor: "#FF6B35",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 40,
  },
  checkButtonDisabled: {
    backgroundColor: "#ccc",
  },
  checkButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4CAF50",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: "#333",
    marginBottom: 30,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 15,
  },
  nextButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
  },
  menuButton: {
    backgroundColor: "#6B7280",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  largeImage: {
    width: 180,
    height: 180,
    borderRadius: 10,
  },
  singleImage: {
    width: 320,
    height: 320,
    borderRadius: 10,
  },
  imageContainer: {
    position: "relative",
    alignItems: "center",
    marginBottom: 40,
  },
  imageWrapper: {
    position: "relative",
    alignItems: "center",
  },
  checkmarkOverlay: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(76, 175, 80, 0.9)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#4CAF50",
  },
  checkmarkOverlayText: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
  },
  imageOverlay: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderWidth: 2,
    borderColor: "#ccc",
    alignItems: "center",
    justifyContent: "center",
  },
  overlaySelected: {
    borderColor: "#8B5CF6",
    backgroundColor: "rgba(139, 92, 246, 0.2)",
  },
  overlayCorrect: {
    borderColor: "#4CAF50",
    backgroundColor: "rgba(76, 175, 80, 0.2)",
  },
  overlayLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  overlayCheckmark: {
    position: "absolute",
    fontSize: 20,
    color: "#4CAF50",
    fontWeight: "bold",
  },
  tickBox: {
    position: "absolute",
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  tickBoxBottomRight: {
    bottom: 13,
    right: 65,
  },
  tickBoxAbove: {
    bottom: "57%",
    right: 65,
  },
  tickBoxSelected: {
    backgroundColor: "transparent",
  },
  tickBoxCheckmark: {
    fontSize: 24,
    color: "#666",
    fontWeight: "bold",
  },
  tickBoxLabel: {
    fontSize: 16,
    color: "#666",
    fontWeight: "bold",
  },
  tickBoxLabelSelected: {
    color: "#8B5CF6",
  },
};

// Debug styles
const debugStyles = {
  debugButton: {
    position: "absolute",
    top: 20,
    left: 20,
    backgroundColor: "#ff4444",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    zIndex: 1000,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  debugButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
};

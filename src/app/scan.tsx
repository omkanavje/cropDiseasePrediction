import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ScanScreen() {
  const router = useRouter();
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async (camera: boolean) => {
    const permission = camera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Permission required",
        "Please allow camera or photo library access to continue.",
      );
      return;
    }

    const result = camera
      ? await ImagePicker.launchCameraAsync({
          mediaTypes: ["images"],
          allowsEditing: true,
          quality: 1,
        })
      : await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ["images"],
          allowsEditing: true,
          quality: 1,
        });

    if (!result.canceled && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const analysePlant = () => {
    if (!image) {
      Alert.alert(
        "No image selected",
        "Please take a photo or choose a leaf image first.",
      );
      return;
    }

    router.push({
      pathname: "/results",
      params: {
        imageUri: encodeURIComponent(image),
      },
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <View style={styles.logo}>
          <MaterialCommunityIcons name="sprout" size={25} color="#FFFFFF" />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.brand}>CropCare AI</Text>
          <Text style={styles.tagline}>Smarter Farming. Healthier Crops.</Text>
        </View>

        <MaterialCommunityIcons name="bell-outline" size={25} color="#414844" />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.roundButton}
            onPress={() => router.back()}
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={23}
              color="#012D1D"
            />
          </TouchableOpacity>

          <Text style={styles.screenTitle}>Scan Your Plant</Text>

          <TouchableOpacity
            style={styles.roundButton}
            onPress={() =>
              Alert.alert(
                "Photo Guide",
                "Place one affected leaf in good natural light. Keep the leaf in focus and avoid shadows.",
              )
            }
          >
            <MaterialCommunityIcons
              name="help-circle-outline"
              size={23}
              color="#012D1D"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.statusPill}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Ready for a photo</Text>
          </View>

          <Text style={styles.heading}>Let's check your crop's health</Text>

          <Text style={styles.description}>
            Take a clear photo of an affected leaf or choose an existing image
            from your gallery.
          </Text>

          <View style={styles.viewfinder}>
            {image ? (
              <View style={styles.previewContainer}>
                <Image source={{ uri: image }} style={styles.previewImage} />

                <View style={styles.previewOverlay}>
                  <MaterialCommunityIcons
                    name="check-circle"
                    size={30}
                    color="#92F7C3"
                  />

                  <Text style={styles.previewTitle}>Photo selected</Text>

                  <Text style={styles.previewSubtitle}>
                    Your image is ready to continue
                  </Text>

                  <TouchableOpacity onPress={() => setImage(null)}>
                    <Text style={styles.retake}>Choose another photo</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <>
                <View style={styles.scannerCircle}>
                  <MaterialCommunityIcons
                    name="leaf"
                    size={105}
                    color="#116C4A"
                  />
                  <View style={styles.scanRing} />
                </View>

                <Text style={styles.targetText}>
                  Place the affected leaf here
                </Text>

                <View style={styles.formatPill}>
                  <MaterialCommunityIcons
                    name="image-outline"
                    size={16}
                    color="#116C4A"
                  />
                  <Text style={styles.formatText}>
                    Choose a JPG or PNG image
                  </Text>
                </View>
              </>
            )}
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.captureButton}
              onPress={() => pickImage(true)}
            >
              <View style={styles.iconBox}>
                <MaterialCommunityIcons
                  name="camera"
                  size={22}
                  color="#005236"
                />
              </View>
              <Text style={styles.captureText}>Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.captureButton}
              onPress={() => pickImage(false)}
            >
              <View style={[styles.iconBox, { backgroundColor: "#E6EEFF" }]}>
                <MaterialCommunityIcons
                  name="image-multiple"
                  size={22}
                  color="#012D1D"
                />
              </View>
              <Text style={styles.captureText}>Gallery</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.tipCard}>
            <View style={styles.tipHeader}>
              <View style={styles.tipIcon}>
                <MaterialCommunityIcons
                  name="white-balance-sunny"
                  size={20}
                  color="#005236"
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.tipTitle}>
                  Take your photo in good light
                </Text>

                <Text style={styles.tipDescription}>
                  Make sure the leaf is clearly visible and the affected area is
                  in focus.
                </Text>
              </View>
            </View>

            <View style={styles.microTips}>
              <View style={styles.microTip}>
                <MaterialCommunityIcons
                  name="focus-field"
                  size={19}
                  color="#116C4A"
                />
                <Text style={styles.microText}>Keep leaf in focus</Text>
              </View>

              <View style={styles.microTip}>
                <MaterialCommunityIcons
                  name="weather-sunny"
                  size={19}
                  color="#116C4A"
                />
                <Text style={styles.microText}>Avoid shadows</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.analyseButton} onPress={analysePlant}>
            <MaterialCommunityIcons
              name="arrow-right"
              size={23}
              color="#A1F4C8"
            />
            <Text style={styles.analyseText}>View Sample Results</Text>
          </TouchableOpacity>

          <View style={styles.trustNote}>
            <MaterialCommunityIcons
              name="information-outline"
              size={17}
              color="#116C4A"
            />
            <Text style={styles.trustText}>
              AI disease analysis is not connected yet
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/")}
        >
          <MaterialCommunityIcons name="leaf" size={23} color="#116C4A" />
          <Text style={styles.activeNavText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/history")}
        >
          <MaterialCommunityIcons name="magnify" size={23} color="#717973" />
          <Text style={styles.navText}>History</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/profile")}
        >
          <MaterialCommunityIcons
            name="account-outline"
            size={23}
            color="#717973"
          />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F8F9FF",
  },
  header: {
    height: 76,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    gap: 12,
  },
  logo: {
    width: 39,
    height: 39,
    borderRadius: 12,
    backgroundColor: "#012D1D",
    alignItems: "center",
    justifyContent: "center",
  },
  brand: {
    fontSize: 17,
    fontWeight: "700",
    color: "#012D1D",
  },
  tagline: {
    fontSize: 10,
    color: "#414844",
    marginTop: 3,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  roundButton: {
    width: 43,
    height: 43,
    borderRadius: 22,
    backgroundColor: "#E6EEFF",
    alignItems: "center",
    justifyContent: "center",
  },
  screenTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#012D1D",
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 28,
  },
  statusPill: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#A1F4C8",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 8,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#116C4A",
    marginRight: 7,
  },
  statusText: {
    color: "#1B724F",
    fontSize: 11,
    fontWeight: "700",
  },
  heading: {
    fontSize: 25,
    fontWeight: "700",
    color: "#012D1D",
    marginTop: 15,
  },
  description: {
    fontSize: 13,
    color: "#414844",
    lineHeight: 21,
    marginTop: 8,
  },
  viewfinder: {
    minHeight: 315,
    backgroundColor: "#EFF4FF",
    borderRadius: 20,
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
    padding: 18,
    overflow: "hidden",
  },
  scannerCircle: {
    width: 190,
    height: 190,
    borderRadius: 100,
    backgroundColor: "#DDF4E8",
    alignItems: "center",
    justifyContent: "center",
  },
  scanRing: {
    ...StyleSheet.absoluteFill,
    borderWidth: 2,
    borderColor: "#86D7AD",
    borderRadius: 100,
  },
  targetText: {
    color: "#012D1D",
    fontSize: 14,
    fontWeight: "700",
    marginTop: 18,
  },
  formatPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#D9E3F6",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    marginTop: 12,
  },
  formatText: {
    fontSize: 10,
    color: "#414844",
  },
  previewContainer: {
    width: "100%",
    height: 280,
    borderRadius: 14,
    overflow: "hidden",
  },
  previewImage: {
    width: "100%",
    height: "100%",
  },
  previewOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(1,45,29,0.88)",
    alignItems: "center",
    justifyContent: "center",
  },
  previewTitle: {
    fontSize: 19,
    fontWeight: "700",
    color: "#FFFFFF",
    marginTop: 8,
  },
  previewSubtitle: {
    fontSize: 12,
    color: "#C1ECD4",
    marginTop: 5,
  },
  retake: {
    color: "#FFFFFF",
    fontWeight: "700",
    marginTop: 16,
    textDecorationLine: "underline",
  },
  actionRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 18,
  },
  captureButton: {
    flex: 1,
    height: 58,
    borderRadius: 13,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
  },
  iconBox: {
    width: 33,
    height: 33,
    borderRadius: 9,
    backgroundColor: "#A1F4C8",
    alignItems: "center",
    justifyContent: "center",
  },
  captureText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#012D1D",
  },
  tipCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    marginTop: 18,
  },
  tipHeader: {
    flexDirection: "row",
    gap: 12,
  },
  tipIcon: {
    width: 34,
    height: 34,
    borderRadius: 18,
    backgroundColor: "#A1F4C8",
    alignItems: "center",
    justifyContent: "center",
  },
  tipTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#012D1D",
  },
  tipDescription: {
    fontSize: 12,
    color: "#414844",
    lineHeight: 19,
    marginTop: 5,
  },
  microTips: {
    flexDirection: "row",
    gap: 10,
    marginTop: 15,
  },
  microTip: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#EFF4FF",
    padding: 9,
    borderRadius: 9,
  },
  microText: {
    fontSize: 10,
    color: "#121C2A",
  },
  analyseButton: {
    height: 56,
    borderRadius: 13,
    backgroundColor: "#1B4332",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginTop: 20,
  },
  analyseText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  trustNote: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    marginTop: 12,
  },
  trustText: {
    fontSize: 10,
    color: "#414844",
  },
  bottomNav: {
    height: 65,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
  },
  activeNavText: {
    fontSize: 10,
    color: "#116C4A",
    fontWeight: "700",
  },
  navText: {
    fontSize: 10,
    color: "#717973",
  },
});

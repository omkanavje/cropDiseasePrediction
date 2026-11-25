import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ResultsScreen() {
  const { imageUri } = useLocalSearchParams<{ imageUri?: string }>();
  const router = useRouter();
  const [saved, setSaved] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialCommunityIcons
              name="arrow-left"
              size={26}
              color="#012D1D"
            />
          </TouchableOpacity>

          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Analysis Results</Text>
            <Text style={styles.subtitle}>Sample report preview</Text>
          </View>

          <TouchableOpacity
            onPress={() =>
              Alert.alert(
                "Coming soon",
                "Report sharing will be available soon.",
              )
            }
          >
            <MaterialCommunityIcons
              name="share-variant-outline"
              size={23}
              color="#012D1D"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.container}>
          <View style={styles.statusRow}>
            <View style={styles.statusBadge}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>Sample Analysis</Text>
            </View>
            <Text style={styles.modelText}>Preview only</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionLabel}>SELECTED PHOTO</Text>

            <View style={styles.plantRow}>
              {imageUri ? (
                <Image
                  source={{ uri: imageUri }}
                  style={styles.plantImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={[styles.plantImage, styles.imagePlaceholder]}>
                  <MaterialCommunityIcons
                    name="image-outline"
                    size={34}
                    color="#717973"
                  />
                </View>
              )}

              <View style={styles.plantInfo}>
                <Text style={styles.plantName}>Your plant photo</Text>
                <Text style={styles.scientificName}>
                  The selected image is shown here
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.diseaseBadge}>
              <Text style={styles.diseaseBadgeText}>EXAMPLE DIAGNOSIS</Text>
            </View>

            <View style={styles.diseaseRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.diseaseName}>Early Blight</Text>
                <Text style={styles.scientificName}>Tomato plant example</Text>
                <Text style={styles.scientificName}>
                  Sample information only
                </Text>
              </View>

              <View style={styles.confidenceCircle}>
                <Text style={styles.confidence}>--</Text>
                <Text style={styles.confLabel}>PENDING</Text>
              </View>
            </View>

            <View style={styles.severityBox}>
              <Text style={styles.sectionTitle}>Infection Severity</Text>
              <Text style={styles.severity}>Pending model analysis</Text>

              <View style={styles.severityBar}>
                <View style={styles.severitySegmentEmpty} />
                <View style={styles.severitySegmentEmpty} />
                <View style={styles.severitySegmentEmpty} />
              </View>

              <View style={styles.severityLabels}>
                <Text style={styles.smallText}>Mild</Text>
                <Text style={styles.smallText}>Moderate</Text>
                <Text style={styles.smallText}>Severe</Text>
              </View>

              <Text style={styles.description}>
                The actual disease and severity will be displayed after the AI
                model is connected.
              </Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Possible Symptoms</Text>

          <View style={styles.card}>
            <Text style={styles.symptomTitle}>Brown spots on leaves</Text>
            <Text style={styles.description}>
              Example symptom associated with Early Blight. This is not an
              assessment of your selected photo.
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.symptomTitle}>
              Yellowing around affected areas
            </Text>
            <Text style={styles.description}>
              Example symptom associated with Early Blight. Actual symptoms will
              depend on the model's result.
            </Text>
          </View>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.push("/treatment")}
          >
            <MaterialCommunityIcons
              name="medical-bag"
              size={22}
              color="#FFFFFF"
            />
            <Text style={styles.primaryButtonText}>
              View Treatment & Action Plan
            </Text>
            <MaterialCommunityIcons
              name="arrow-right"
              size={20}
              color="#FFFFFF"
            />
          </TouchableOpacity>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => {
                const nextSaved = !saved;
                setSaved(nextSaved);
                Alert.alert(
                  nextSaved ? "Marked as saved" : "Removed from saved",
                  nextSaved
                    ? "This report is marked as saved on this screen. It is not stored permanently yet."
                    : "This report is no longer marked as saved.",
                );
              }}
            >
              <MaterialCommunityIcons
                name={saved ? "bookmark-check" : "bookmark-outline"}
                size={19}
                color="#116C4A"
              />
              <Text style={styles.saveButtonText}>
                {saved ? "Saved" : "Save Report"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.askButton}
              onPress={() =>
                Alert.alert(
                  "Coming soon",
                  "You will be able to contact an agricultural specialist here.",
                )
              }
            >
              <MaterialCommunityIcons
                name="account-question-outline"
                size={19}
                color="#012D1D"
              />
              <Text style={styles.askButtonText}>Ask Agronomist</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.notice}>
            <MaterialCommunityIcons
              name="information-outline"
              size={25}
              color="#116C4A"
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.noticeTitle}>Sample information</Text>
              <Text style={styles.description}>
                This screen currently displays example disease information. It
                does not diagnose the selected photo. Actual predictions,
                confidence scores and severity levels will appear when the AI
                model is connected. Confirm diagnoses with a qualified
                agricultural specialist before taking action.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8F9FF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 14,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#012D1D",
  },
  subtitle: {
    fontSize: 12,
    color: "#717973",
    marginTop: 3,
  },
  container: {
    padding: 20,
    gap: 15,
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#A1F4C8",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    gap: 7,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 5,
    backgroundColor: "#116C4A",
  },
  statusText: {
    color: "#1B724F",
    fontSize: 11,
    fontWeight: "700",
  },
  modelText: {
    color: "#717973",
    fontSize: 11,
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 16,
    gap: 12,
    elevation: 2,
  },
  sectionLabel: {
    color: "#717973",
    fontSize: 11,
    fontWeight: "700",
  },
  plantRow: {
    flexDirection: "row",
    gap: 15,
    alignItems: "center",
  },
  plantImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
    backgroundColor: "#E6EEFF",
  },
  imagePlaceholder: {
    alignItems: "center",
    justifyContent: "center",
  },
  plantInfo: {
    flex: 1,
    gap: 7,
  },
  plantName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#012D1D",
  },
  scientificName: {
    fontSize: 12,
    color: "#717973",
  },
  diseaseBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#E6EEFF",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  diseaseBadgeText: {
    color: "#234D3D",
    fontSize: 11,
    fontWeight: "700",
  },
  diseaseRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  diseaseName: {
    fontSize: 25,
    fontWeight: "700",
    color: "#012D1D",
  },
  confidenceCircle: {
    width: 72,
    height: 72,
    borderRadius: 40,
    borderWidth: 5,
    borderColor: "#B8C7BE",
    justifyContent: "center",
    alignItems: "center",
  },
  confidence: {
    fontSize: 19,
    fontWeight: "700",
    color: "#012D1D",
  },
  confLabel: {
    fontSize: 9,
    color: "#717973",
  },
  severityBox: {
    backgroundColor: "#EFF4FF",
    padding: 14,
    borderRadius: 12,
    gap: 10,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#012D1D",
  },
  severity: {
    color: "#717973",
    fontSize: 13,
    fontWeight: "700",
  },
  severityBar: {
    flexDirection: "row",
    height: 8,
    gap: 5,
  },
  severitySegmentEmpty: {
    flex: 1,
    backgroundColor: "#D9E3F6",
    borderRadius: 10,
  },
  severityLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  smallText: {
    fontSize: 10,
    color: "#717973",
  },
  description: {
    fontSize: 12,
    lineHeight: 19,
    color: "#414844",
  },
  symptomTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#012D1D",
  },
  primaryButton: {
    backgroundColor: "#012D1D",
    minHeight: 56,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    paddingHorizontal: 12,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
    flex: 1,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
  },
  saveButton: {
    flex: 1,
    backgroundColor: "#A1F4C8",
    padding: 13,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  saveButtonText: {
    color: "#116C4A",
    fontSize: 12,
    fontWeight: "700",
  },
  askButton: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 13,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  askButtonText: {
    color: "#012D1D",
    fontSize: 12,
    fontWeight: "700",
  },
  notice: {
    backgroundColor: "#EFF4FF",
    padding: 14,
    borderRadius: 12,
    flexDirection: "row",
    gap: 12,
  },
  noticeTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#012D1D",
    marginBottom: 5,
  },
});

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TreatmentScreen() {
  const router = useRouter();

  const treatments = [
    {
      icon: "sprout",
      title: "Bio-Fungicide or Copper Spray",
      tag: "Treatment Option",
      description:
        "Some locally registered products may be suitable for specific crop diseases. Confirm that the product is approved for the crop and disease, follow its label, and seek specialist advice.",
      info: "Check product label",
      repeat: "As directed",
    },
    {
      icon: "content-cut",
      title: "Canopy Airflow & Pruning",
      tag: "Sanitation",
      description:
        "Remove affected lower foliage when appropriate. Maintain good spacing and airflow around plants. Clean pruning tools between plants.",
      info: "Maintain airflow",
      repeat: "Inspect regularly",
    },
    {
      icon: "layers",
      title: "Soil Mulching & Splash Guard",
      tag: "Physical Barrier",
      description:
        "Clean organic mulch may help reduce soil splashing onto leaves. Keep the material away from direct contact with the plant stem.",
      info: "Use clean mulch",
      repeat: "Check periodically",
    },
  ];

  const prevention = [
    {
      title: "Water Near the Roots",
      description:
        "Water near the roots where possible. Avoid keeping leaves wet for long periods.",
    },
    {
      title: "Handle Affected Foliage Carefully",
      description:
        "Remove affected leaves carefully and dispose of them according to local agricultural guidance. Do not add infected material to ordinary compost.",
    },
    {
      title: "Inspect Plants Regularly",
      description:
        "Inspect nearby plants regularly for new spots, yellowing, or other unusual symptoms.",
    },
  ];

  const renderTreatment = (item: (typeof treatments)[number]) => (
    <View style={styles.treatmentCard} key={item.title}>
      <View style={styles.cardTop}>
        <View style={styles.treatmentIcon}>
          <MaterialCommunityIcons
            name={item.icon as any}
            size={25}
            color="#005236"
          />
        </View>

        <View style={styles.cardContent}>
          <View style={styles.titleRow}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.tag}>{item.tag}</Text>
          </View>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      </View>

      <View style={styles.infoBar}>
        <Text style={styles.infoText}>◷ {item.info}</Text>
        <Text style={styles.infoRepeat}>{item.repeat}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <MaterialCommunityIcons name="arrow-left" size={25} color="#121C2A" />
        </TouchableOpacity>

        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Treatment & Remedies</Text>
          <Text style={styles.headerSubtitle}>CropCare AI</Text>
        </View>

        <MaterialCommunityIcons name="leaf" size={25} color="#116C4A" />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.diagnosisCard}>
          <View style={styles.diagnosisTop}>
            <View style={styles.diagnosisLabel}>
              <MaterialCommunityIcons
                name="information-outline"
                size={19}
                color="#1B724F"
              />
              <Text style={styles.confirmedText}>Example Diagnosis</Text>
            </View>
            <Text style={styles.stageTag}>Severity Pending</Text>
          </View>

          <Text style={styles.diseaseTitle}>Early Blight</Text>
          <Text style={styles.scientificName}>
            Example: Alternaria solani • Tomato
          </Text>

          <View style={styles.badgeRow}>
            <Text style={styles.metaBadge}>Fungal Disease Example</Text>
            <Text style={styles.metaBadge}>Leaf Symptoms</Text>
          </View>

          <Text style={styles.sampleNotice}>
            This is an example diagnosis and is not based on your selected plant
            photo. Actual disease predictions and treatment guidance will be
            shown after the AI model and advisory system are connected.
          </Text>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Treatment Options</Text>
          <Text style={styles.countTag}>3 Examples</Text>
        </View>

        {treatments.map(renderTreatment)}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Preventive Field Protocols</Text>
        </View>

        {prevention.map((item, index) => (
          <View style={styles.preventionCard} key={item.title}>
            <View style={styles.numberCircle}>
              <Text style={styles.numberText}>{index + 1}</Text>
            </View>
            <View style={styles.preventionContent}>
              <Text style={styles.preventionTitle}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
          </View>
        ))}

        <View style={styles.warningCard}>
          <View style={styles.warningHeader}>
            <MaterialCommunityIcons
              name="alert-circle"
              size={26}
              color="#93000A"
            />
            <Text style={styles.warningTitle}>
              Important Safety Precautions
            </Text>
          </View>
          <Text style={styles.description}>
            Always follow the safety instructions on agricultural product
            labels. Use suitable protective equipment when handling treatments.
            Consult a qualified agricultural specialist before applying
            pesticides or other crop treatments.
          </Text>
        </View>

        <View style={styles.advisoryCard}>
          <MaterialCommunityIcons
            name="shield-check"
            size={23}
            color="#116C4A"
          />
          <Text style={styles.advisoryText}>
            These are general example options, not personalized treatment
            advice. Verify treatment decisions with your local Agricultural
            Extension Service or a qualified agronomist.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => router.replace("/")}
        >
          <MaterialCommunityIcons name="home" size={22} color="#FFFFFF" />
          <Text style={styles.homeButtonText}>Back to Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.downloadButton}
          onPress={() =>
            Alert.alert(
              "Coming Soon",
              "Treatment summary PDF download will be added later.",
            )
          }
        >
          <MaterialCommunityIcons name="download" size={21} color="#116C4A" />
          <Text style={styles.downloadText}>
            Download Treatment Summary (PDF)
          </Text>
        </TouchableOpacity>
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
    height: 65,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    backgroundColor: "#F8F9FF",
    borderBottomWidth: 1,
    borderBottomColor: "#E6EEFF",
  },
  backButton: {
    width: 40,
    height: 44,
    justifyContent: "center",
  },
  headerText: {
    flex: 1,
    marginLeft: 7,
  },
  headerTitle: {
    fontFamily: "PlusJakartaSans_700Bold",
    fontSize: 17,
    color: "#012D1D",
  },
  headerSubtitle: {
    fontFamily: "PlusJakartaSans_400Regular",
    fontSize: 11,
    color: "#717973",
    marginTop: 2,
  },
  scrollContent: {
    padding: 18,
    paddingBottom: 35,
  },
  diagnosisCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 17,
    marginBottom: 24,
    elevation: 2,
  },
  diagnosisTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
  },
  diagnosisLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  confirmedText: {
    fontFamily: "PlusJakartaSans_700Bold",
    fontSize: 11,
    color: "#1B724F",
    letterSpacing: 0.5,
  },
  stageTag: {
    backgroundColor: "#FFDDD8",
    color: "#93000A",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontSize: 10,
    fontFamily: "PlusJakartaSans_600SemiBold",
  },
  diseaseTitle: {
    fontFamily: "PlusJakartaSans_700Bold",
    fontSize: 26,
    color: "#012D1D",
    marginTop: 13,
  },
  scientificName: {
    fontFamily: "PlusJakartaSans_400Regular",
    fontSize: 12,
    fontStyle: "italic",
    color: "#414844",
    marginTop: 3,
  },
  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 7,
    marginTop: 15,
  },
  metaBadge: {
    backgroundColor: "#EFF4FF",
    color: "#121C2A",
    paddingHorizontal: 9,
    paddingVertical: 7,
    borderRadius: 18,
    fontSize: 10,
    overflow: "hidden",
    fontFamily: "PlusJakartaSans_600SemiBold",
  },
  sampleNotice: {
    marginTop: 14,
    fontSize: 11,
    lineHeight: 17,
    color: "#717973",
    fontFamily: "PlusJakartaSans_400Regular",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    marginTop: 4,
  },
  sectionTitle: {
    fontFamily: "PlusJakartaSans_700Bold",
    fontSize: 17,
    color: "#012D1D",
    flex: 1,
  },
  countTag: {
    fontSize: 10,
    color: "#414844",
    backgroundColor: "#DEE9FC",
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 15,
    fontFamily: "PlusJakartaSans_600SemiBold",
  },
  treatmentCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 17,
    padding: 14,
    marginBottom: 13,
    elevation: 1,
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 11,
  },
  treatmentIcon: {
    width: 43,
    height: 43,
    borderRadius: 12,
    backgroundColor: "#A1F4C8",
    alignItems: "center",
    justifyContent: "center",
  },
  cardContent: {
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 6,
  },
  cardTitle: {
    flexShrink: 1,
    fontFamily: "PlusJakartaSans_700Bold",
    fontSize: 14,
    color: "#012D1D",
  },
  tag: {
    backgroundColor: "#A1F4C8",
    color: "#116C4A",
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 9,
    fontFamily: "PlusJakartaSans_600SemiBold",
  },
  description: {
    fontFamily: "PlusJakartaSans_400Regular",
    fontSize: 12,
    lineHeight: 19,
    color: "#414844",
    marginTop: 7,
  },
  infoBar: {
    backgroundColor: "#EFF4FF",
    borderRadius: 10,
    padding: 10,
    marginTop: 13,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 5,
  },
  infoText: {
    fontSize: 10,
    color: "#414844",
    fontFamily: "PlusJakartaSans_600SemiBold",
  },
  infoRepeat: {
    fontSize: 10,
    color: "#116C4A",
    fontFamily: "PlusJakartaSans_700Bold",
  },
  preventionCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    gap: 12,
    elevation: 1,
  },
  numberCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#DEE9FC",
    alignItems: "center",
    justifyContent: "center",
  },
  numberText: {
    fontFamily: "PlusJakartaSans_700Bold",
    color: "#012D1D",
    fontSize: 13,
  },
  preventionContent: {
    flex: 1,
  },
  preventionTitle: {
    fontFamily: "PlusJakartaSans_700Bold",
    fontSize: 13,
    color: "#012D1D",
  },
  warningCard: {
    backgroundColor: "#DEE9FC",
    borderRadius: 17,
    padding: 16,
    marginTop: 13,
  },
  warningHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    marginBottom: 5,
  },
  warningTitle: {
    fontFamily: "PlusJakartaSans_700Bold",
    fontSize: 15,
    color: "#121C2A",
    flex: 1,
  },
  advisoryCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    backgroundColor: "#EFF4FF",
    borderRadius: 15,
    padding: 14,
    marginTop: 15,
  },
  advisoryText: {
    flex: 1,
    fontFamily: "PlusJakartaSans_600SemiBold",
    fontSize: 11,
    lineHeight: 18,
    color: "#414844",
  },
  homeButton: {
    height: 53,
    backgroundColor: "#1B4332",
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 9,
    marginTop: 22,
  },
  homeButtonText: {
    fontFamily: "PlusJakartaSans_700Bold",
    fontSize: 15,
    color: "#FFFFFF",
  },
  downloadButton: {
    height: 49,
    backgroundColor: "#DEE9FC",
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 9,
    marginTop: 11,
  },
  downloadText: {
    fontFamily: "PlusJakartaSans_700Bold",
    fontSize: 12,
    color: "#012D1D",
  },
});

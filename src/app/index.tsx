import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  useFonts,
} from "@expo-google-fonts/plus-jakarta-sans";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const leafImage =
  "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=300";

export default function HomeScreen() {
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    Regular: PlusJakartaSans_400Regular,
    SemiBold: PlusJakartaSans_600SemiBold,
    Bold: PlusJakartaSans_700Bold,
  });

  if (!fontsLoaded) return null;

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.brandSection}>
          <LinearGradient colors={["#012D1D", "#116C4A"]} style={styles.logo}>
            <MaterialCommunityIcons name="sprout" size={27} color="white" />
          </LinearGradient>

          <View>
            <Text style={styles.logoTitle}>CropCare AI</Text>
            <Text style={styles.tagline}>
              Smarter Farming. Healthier Crops.
            </Text>
          </View>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity>
            <MaterialCommunityIcons
              name="bell-outline"
              size={25}
              color="#414844"
            />
          </TouchableOpacity>

          <View style={styles.avatar}>
            <MaterialCommunityIcons name="account" size={24} color="#116C4A" />
          </View>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Greeting */}
        <View style={styles.greeting}>
          <Text style={styles.heading}>Hello, Farmer! 👋</Text>
          <Text style={styles.subheading}>
            Check your plants for possible signs of disease.
          </Text>
        </View>

        {/* Scan Card */}
        <LinearGradient
          colors={["#012D1D", "#1B4332", "#116C4A"]}
          style={styles.scanCard}
        >
          <View style={styles.scanContent}>
            <Image source={{ uri: leafImage }} style={styles.leafImage} />

            <View style={styles.scanInfo}>
              <Text style={styles.scanTitle}>Scan Your Plant</Text>
              <Text style={styles.scanDescription}>
                Take a clear photo of a leaf to get started.
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.scanButton}
            onPress={() => router.push("/scan")}
          >
            <MaterialCommunityIcons
              name="camera-outline"
              size={23}
              color="#012D1D"
            />
            <Text style={styles.scanButtonText}>Start Scanning</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* Explore */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Explore Features</Text>
            <Text style={styles.sectionSubtitle}>
              Information to help you care for your crops
            </Text>
          </View>
        </View>

        <View style={styles.toolsRow}>
          <ToolCard
            icon="leaf"
            title="Crop Diseases"
            description="Learn about common crop diseases and their symptoms."
          />
        </View>

        {/* Recent Scans */}
        <View style={styles.recentHeader}>
          <Text style={styles.sectionTitle}>Recent Scans</Text>
          <Text style={styles.seeAll}>See All ›</Text>
        </View>

        <View style={styles.recentCard}>
          <MaterialCommunityIcons name="leaf" size={35} color="#116C4A" />
          <View style={{ flex: 1 }}>
            <Text style={styles.recentTitle}>No scans yet</Text>
            <Text style={styles.sectionSubtitle}>
              Your previous scans will appear here.
            </Text>
          </View>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <NavItem icon="leaf" title="Home" active />
        <NavItem icon="text-search" title="History" />
        <NavItem icon="account-outline" title="Profile" />
      </View>
    </SafeAreaView>
  );
}

function ToolCard({ icon, title, description }: any) {
  return (
    <TouchableOpacity style={styles.toolCard}>
      <MaterialCommunityIcons name={icon} size={29} color="#116C4A" />
      <Text style={styles.toolTitle}>{title}</Text>
      <Text style={styles.toolDescription}>{description}</Text>
    </TouchableOpacity>
  );
}

function NavItem({ icon, title, active = false }: any) {
  const router = useRouter();

  const handlePress = () => {
    if (title === "Home") {
      router.push("/");
    } else if (title === "History") {
      router.push("/history");
    } else if (title === "Profile") {
      router.push("/profile");
    }
  };

  return (
    <TouchableOpacity style={styles.navItem} onPress={handlePress}>
      <View style={active ? styles.activeIcon : styles.inactiveIcon}>
        <MaterialCommunityIcons
          name={icon}
          size={23}
          color={active ? "#116C4A" : "#414844"}
        />
      </View>

      <Text style={active ? styles.activeNavText : styles.navText}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FF",
  },
  header: {
    height: 78,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F8F9FF",
  },
  brandSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  logo: {
    width: 47,
    height: 47,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  logoTitle: {
    fontFamily: "Bold",
    fontSize: 20,
    color: "#012D1D",
  },
  tagline: {
    fontFamily: "SemiBold",
    fontSize: 10,
    color: "#414844",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 17,
  },
  avatar: {
    width: 37,
    height: 37,
    borderRadius: 20,
    backgroundColor: "#DDF4E9",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 20,
    gap: 23,
  },
  greeting: {
    gap: 7,
  },
  heading: {
    fontFamily: "Bold",
    fontSize: 25,
    color: "#012D1D",
  },
  subheading: {
    fontFamily: "Regular",
    fontSize: 14,
    lineHeight: 21,
    color: "#414844",
  },
  scanCard: {
    borderRadius: 29,
    padding: 20,
    gap: 19,
    elevation: 7,
  },
  scanContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  leafImage: {
    width: 100,
    height: 100,
    borderRadius: 19,
  },
  scanInfo: {
    flex: 1,
    gap: 5,
  },
  scanTitle: {
    fontFamily: "Bold",
    fontSize: 23,
    color: "white",
  },
  scanDescription: {
    fontFamily: "Regular",
    fontSize: 14,
    lineHeight: 21,
    color: "#C0D9CC",
  },
  scanButton: {
    height: 66,
    borderRadius: 19,
    backgroundColor: "#A1F4C8",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
  },
  scanButtonText: {
    fontFamily: "SemiBold",
    fontSize: 18,
    color: "#012D1D",
  },
  sectionHeader: {
    gap: 4,
  },
  sectionTitle: {
    fontFamily: "Bold",
    fontSize: 19,
    color: "#121C2A",
  },
  sectionSubtitle: {
    fontFamily: "Regular",
    fontSize: 11,
    color: "#717973",
    marginTop: 4,
  },
  toolsRow: {
    flexDirection: "row",
    gap: 12,
  },
  toolCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 16,
    minHeight: 150,
    gap: 10,
    elevation: 2,
  },
  toolTitle: {
    fontFamily: "Bold",
    fontSize: 14,
    color: "#121C2A",
  },
  toolDescription: {
    fontFamily: "Regular",
    fontSize: 11,
    lineHeight: 16,
    color: "#717973",
  },
  recentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  seeAll: {
    fontFamily: "SemiBold",
    fontSize: 12,
    color: "#116C4A",
  },
  recentCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 19,
    padding: 17,
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
  },
  recentTitle: {
    fontFamily: "Bold",
    fontSize: 14,
    color: "#121C2A",
  },
  bottomNav: {
    height: 72,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    elevation: 12,
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
    width: 80,
  },
  activeIcon: {
    backgroundColor: "#A1F4C8",
    borderRadius: 25,
    paddingHorizontal: 18,
    paddingVertical: 5,
  },
  inactiveIcon: {
    paddingHorizontal: 18,
    paddingVertical: 5,
  },
  activeNavText: {
    fontFamily: "Bold",
    fontSize: 12,
    color: "#012D1D",
  },
  navText: {
    fontFamily: "SemiBold",
    fontSize: 12,
    color: "#414844",
  },
});

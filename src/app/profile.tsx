import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState(false);

  const showComingSoon = (feature: string) => {
    Alert.alert(feature, "This feature will be available soon.");
  };

  const SettingItem = ({ icon, title, subtitle, value, onPress }: any) => (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.settingIcon}>
        <MaterialCommunityIcons name={icon} size={21} color="#116C4A" />
      </View>

      <View style={styles.settingTextContainer}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingSubtitle}>{subtitle}</Text>
      </View>

      {value ? (
        <View style={styles.settingRight}>
          <Text style={styles.settingValue}>{value}</Text>
          <MaterialCommunityIcons
            name="chevron-right"
            size={21}
            color="#849188"
          />
        </View>
      ) : (
        <MaterialCommunityIcons
          name="chevron-right"
          size={21}
          color="#849188"
        />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoRow}>
          <View style={styles.logo}>
            <MaterialCommunityIcons name="sprout" size={24} color="#FFFFFF" />
          </View>

          <View>
            <Text style={styles.logoText}>CropCare AI</Text>
            <Text style={styles.tagline}>
              Smarter Farming. Healthier Crops.
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => showComingSoon("Notifications")}
        >
          <MaterialCommunityIcons
            name="bell-outline"
            size={23}
            color="#414844"
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Page Title */}
        <View style={styles.titleRow}>
          <View style={styles.titleLeft}>
            <MaterialCommunityIcons
              name="account-cog-outline"
              size={25}
              color="#116C4A"
            />
            <Text style={styles.pageTitle}>My Profile</Text>
          </View>

          <View style={styles.onlineBadge}>
            <MaterialCommunityIcons
              name="account-outline"
              size={13}
              color="#1B724F"
            />
            <Text style={styles.onlineText}>Account</Text>
          </View>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileTop}>
            <View style={styles.avatar}>
              <MaterialCommunityIcons
                name="account"
                size={39}
                color="#34764B"
              />
            </View>

            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>CropCare AI User</Text>

              <Text style={styles.welcomeText}>Welcome to CropCare AI</Text>

              <View style={styles.verifiedRow}>
                <MaterialCommunityIcons name="leaf" size={15} color="#34764B" />
                <Text style={styles.verifiedText}>Your farming companion</Text>
              </View>
            </View>
          </View>

          {/* Profile Information */}
          <View style={styles.infoContainer}>
            <MaterialCommunityIcons
              name="information-outline"
              size={17}
              color="#34764B"
            />
            <Text style={styles.infoText}>
              Your personal profile and farming details can be added here when
              account features are connected.
            </Text>
          </View>
        </View>

        {/* Account Settings */}
        <View style={styles.section}>
          <View style={styles.sectionHeading}>
            <Text style={styles.sectionTitle}>ACCOUNT SETTINGS</Text>
            <Text style={styles.sectionNote}>Personal Details</Text>
          </View>

          <View style={styles.settingsCard}>
            <SettingItem
              icon="account-edit-outline"
              title="Edit Profile"
              subtitle="Name and personal details"
              onPress={() => showComingSoon("Edit Profile")}
            />

            <View style={styles.separator} />

            <SettingItem
              icon="translate"
              title="Preferred Language"
              subtitle="Choose your app language"
              value="English"
              onPress={() => showComingSoon("Preferred Language")}
            />

            <View style={styles.separator} />

            <SettingItem
              icon="map-marker-outline"
              title="Location Settings"
              subtitle="Manage your farm location"
              onPress={() => showComingSoon("Location Settings")}
            />
          </View>
        </View>

        {/* App Settings */}
        <View style={styles.section}>
          <View style={styles.sectionHeading}>
            <Text style={styles.sectionTitle}>APP SETTINGS</Text>
            <Text style={styles.sectionNote}>Preferences & Support</Text>
          </View>

          <View style={styles.settingsCard}>
            <View style={styles.settingItem}>
              <View style={styles.settingIcon}>
                <MaterialCommunityIcons
                  name="bell-ring-outline"
                  size={21}
                  color="#116C4A"
                />
              </View>

              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>Notifications</Text>
                <Text style={styles.settingSubtitle}>
                  Notification preference (preview only)
                </Text>
              </View>

              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{
                  false: "#D9E3D9",
                  true: "#86D7AD",
                }}
                thumbColor={notifications ? "#116C4A" : "#FFFFFF"}
              />
            </View>

            <View style={styles.separator} />

            <SettingItem
              icon="face-agent"
              title="Help & Support"
              subtitle="Get help using CropCare AI"
              onPress={() => showComingSoon("Help & Support")}
            />

            <View style={styles.separator} />

            <SettingItem
              icon="information-outline"
              title="About CropCare AI"
              subtitle="App information and details"
              onPress={() => showComingSoon("About CropCare AI")}
            />
          </View>
        </View>

        {/* App Information */}
        <View style={styles.aboutCard}>
          <MaterialCommunityIcons name="sprout" size={25} color="#116C4A" />
          <Text style={styles.aboutTitle}>CropCare AI</Text>
          <Text style={styles.aboutSubtitle}>
            Smarter Farming. Healthier Crops.
          </Text>
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/")}
        >
          <MaterialCommunityIcons name="leaf" size={23} color="#87948B" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/history")}
        >
          <MaterialCommunityIcons
            name="text-search"
            size={23}
            color="#87948B"
          />
          <Text style={styles.navText}>History</Text>
        </TouchableOpacity>

        <View style={styles.navItem}>
          <View style={styles.activeNavIcon}>
            <MaterialCommunityIcons name="account" size={23} color="#116C4A" />
          </View>
          <Text style={styles.activeNavText}>Profile</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FF",
  },
  header: {
    height: 76,
    paddingHorizontal: 20,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#EDF0ED",
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  logo: {
    width: 39,
    height: 39,
    borderRadius: 12,
    backgroundColor: "#116C4A",
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#012D1D",
  },
  tagline: {
    fontSize: 10,
    color: "#717973",
    marginTop: 2,
  },
  headerButton: {
    width: 42,
    height: 42,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 18,
  },
  titleLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  pageTitle: {
    fontSize: 25,
    fontWeight: "700",
    color: "#012D1D",
  },
  onlineBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#A1F4C8",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  onlineText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#1B724F",
  },
  profileCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 17,
    padding: 17,
    marginBottom: 22,
    shadowColor: "#1B4332",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  profileTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
  },
  avatar: {
    width: 67,
    height: 67,
    borderRadius: 34,
    backgroundColor: "#EAF3E9",
    borderWidth: 4,
    borderColor: "#A1F4C8",
    alignItems: "center",
    justifyContent: "center",
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 19,
    fontWeight: "700",
    color: "#012D1D",
  },
  welcomeText: {
    fontSize: 12,
    color: "#717973",
    marginTop: 4,
  },
  verifiedRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 6,
  },
  verifiedText: {
    fontSize: 10,
    color: "#116C4A",
    fontWeight: "600",
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    backgroundColor: "#EFF4F0",
    borderRadius: 12,
    padding: 12,
    marginTop: 18,
  },
  infoText: {
    flex: 1,
    fontSize: 11,
    lineHeight: 17,
    color: "#52645A",
  },
  section: {
    marginBottom: 22,
  },
  sectionHeading: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    paddingHorizontal: 2,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: "#414844",
    letterSpacing: 1,
  },
  sectionNote: {
    fontSize: 10,
    color: "#116C4A",
  },
  settingsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    elevation: 1,
  },
  settingItem: {
    minHeight: 76,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  settingIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#A1F4C8",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#121C2A",
  },
  settingSubtitle: {
    fontSize: 10,
    color: "#717973",
    marginTop: 4,
  },
  settingRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  settingValue: {
    fontSize: 10,
    color: "#012D1D",
    backgroundColor: "#EFF4FF",
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 12,
  },
  separator: {
    height: 1,
    backgroundColor: "#E6EEFF",
    marginHorizontal: 15,
  },
  aboutCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    marginBottom: 10,
  },
  aboutTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#012D1D",
    marginTop: 8,
  },
  aboutSubtitle: {
    fontSize: 11,
    color: "#717973",
    marginTop: 4,
  },
  versionText: {
    fontSize: 10,
    color: "#87948B",
    marginTop: 9,
  },
  bottomNav: {
    height: 66,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E8EDE8",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
  },
  activeNavIcon: {
    width: 48,
    height: 30,
    borderRadius: 18,
    backgroundColor: "#A1F4C8",
    alignItems: "center",
    justifyContent: "center",
  },
  navText: {
    fontSize: 10,
    color: "#87948B",
  },
  activeNavText: {
    fontSize: 10,
    color: "#116C4A",
    fontWeight: "700",
  },
});

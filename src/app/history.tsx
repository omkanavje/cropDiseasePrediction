import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const scans: {
  id: string;
  crop: string;
  disease: string;
  status: string;
  stage: string;
  location: string;
  date: string;
  confidence: string;
  icon: string;
  color: string;
  iconColor: string;
}[] = [];

const filters = [
  { label: "All", value: "All" },
  { label: "Healthy", value: "Healthy" },
  { label: "Diseases", value: "Disease" },
  { label: "Requires Action", value: "Action" },
];

export default function HistoryScreen() {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [showEmptyPreview, setShowEmptyPreview] = useState(true);

  const filteredScans = useMemo(() => {
    return scans.filter((scan) => {
      const matchesSearch =
        scan.crop.toLowerCase().includes(search.toLowerCase()) ||
        scan.disease.toLowerCase().includes(search.toLowerCase()) ||
        scan.location.toLowerCase().includes(search.toLowerCase());

      const matchesFilter =
        activeFilter === "All" ||
        (activeFilter === "Action"
          ? scan.status === "Disease" && scan.id === "1"
          : scan.status === activeFilter);

      return matchesSearch && matchesFilter;
    });
  }, [search, activeFilter]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoRow}>
          <View style={styles.logo}>
            <MaterialCommunityIcons name="leaf" size={23} color="#FFFFFF" />
          </View>
          <Text style={styles.logoText}>CropCare AI</Text>
        </View>

        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => router.push("/")}
        >
          <MaterialCommunityIcons
            name="home-outline"
            size={23}
            color="#294B36"
          />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.titleSection}>
          <Text style={styles.heading}>Scan History</Text>
          <Text style={styles.subtitle}>
            Keep track of your crop health over time.
          </Text>
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryIcon}>
            <MaterialCommunityIcons
              name="clipboard-text-clock-outline"
              size={25}
              color="#34764B"
            />
          </View>
          <View>
            <Text style={styles.summaryNumber}>{scans.length}</Text>
            <Text style={styles.summaryLabel}>Saved scans</Text>
          </View>
          <View style={styles.summaryRight}>
            <MaterialCommunityIcons
              name="chart-line"
              size={25}
              color="#34764B"
            />
            <Text style={styles.summarySmall}>Your crop overview</Text>
          </View>
        </View>

        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <MaterialCommunityIcons name="magnify" size={22} color="#84918A" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search crops or diseases..."
              placeholderTextColor="#9AA59E"
              value={search}
              onChangeText={setSearch}
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch("")}>
                <MaterialCommunityIcons
                  name="close-circle"
                  size={19}
                  color="#84918A"
                />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.value}
              style={[
                styles.filterChip,
                activeFilter === filter.value && styles.activeFilter,
              ]}
              onPress={() => setActiveFilter(filter.value)}
            >
              <Text
                style={[
                  styles.filterText,
                  activeFilter === filter.value && styles.activeFilterText,
                ]}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Scans</Text>
          <Text style={styles.resultCount}>{filteredScans.length} shown</Text>
        </View>

        {filteredScans.length > 0 ? (
          filteredScans.map((scan) => (
            <View style={styles.scanCard} key={scan.id}>
              <View style={styles.cardTop}>
                <View
                  style={[styles.cropIcon, { backgroundColor: scan.color }]}
                >
                  <MaterialCommunityIcons
                    name={scan.icon as any}
                    size={30}
                    color={scan.iconColor}
                  />
                </View>

                <View style={styles.cropInfo}>
                  <Text style={styles.cropName}>{scan.crop}</Text>
                  <Text style={styles.diseaseName}>{scan.disease}</Text>
                  <Text style={styles.scanDate}>{scan.date}</Text>
                </View>

                <View
                  style={[
                    styles.statusBadge,
                    scan.status === "Healthy"
                      ? styles.healthyBadge
                      : styles.diseaseBadge,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      scan.status === "Healthy"
                        ? styles.healthyText
                        : styles.diseaseText,
                    ]}
                  >
                    {scan.status}
                  </Text>
                </View>
              </View>

              <View style={styles.cardDivider} />

              <View style={styles.cardBottom}>
                <View>
                  <Text style={styles.detailLabel}>CONDITION</Text>
                  <Text style={styles.detailValue}>{scan.stage}</Text>
                </View>
                <View>
                  <Text style={styles.detailLabel}>LOCATION</Text>
                  <Text style={styles.detailValue}>{scan.location}</Text>
                </View>
                <View>
                  <Text style={styles.detailLabel}>CONFIDENCE</Text>
                  <Text style={styles.confidenceValue}>{scan.confidence}</Text>
                </View>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.noResults}>
            <MaterialCommunityIcons
              name="clipboard-text-search-outline"
              size={38}
              color="#84918A"
            />
            <Text style={styles.noResultsTitle}>
              {search.length > 0 || activeFilter !== "All"
                ? "No scans found"
                : "No scan records yet"}
            </Text>
            <Text style={styles.noResultsText}>
              {search.length > 0 || activeFilter !== "All"
                ? "Try another search or choose a different filter."
                : "Your completed plant scans will appear here."}
            </Text>
          </View>
        )}

        <View style={styles.emptyPreview}>
          <TouchableOpacity
            style={styles.emptyPreviewHeader}
            onPress={() => setShowEmptyPreview(!showEmptyPreview)}
          >
            <View>
              <Text style={styles.emptyTitle}>Empty State Preview</Text>
              <Text style={styles.emptySubtitle}>
                Preview when no scans are available
              </Text>
            </View>
            <MaterialCommunityIcons
              name={showEmptyPreview ? "chevron-up" : "chevron-down"}
              size={24}
              color="#45634F"
            />
          </TouchableOpacity>

          {showEmptyPreview && (
            <View style={styles.emptyContent}>
              <View style={styles.emptyIcon}>
                <MaterialCommunityIcons
                  name="image-search-outline"
                  size={36}
                  color="#559268"
                />
              </View>
              <Text style={styles.emptyMessage}>No scans yet!</Text>
              <Text style={styles.emptyDescription}>
                Start scanning your crops to keep track of their health.
              </Text>
              <TouchableOpacity
                style={styles.scanButton}
                onPress={() => router.push("/scan")}
              >
                <MaterialCommunityIcons
                  name="camera-outline"
                  size={19}
                  color="#FFFFFF"
                />
                <Text style={styles.scanButtonText}>Scan First Crop</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/")}
        >
          <MaterialCommunityIcons
            name="home-outline"
            size={23}
            color="#87948B"
          />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>

        <View style={styles.navItem}>
          <MaterialCommunityIcons name="history" size={23} color="#34764B" />
          <Text style={styles.activeNavText}>History</Text>
        </View>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/profile")}
        >
          <MaterialCommunityIcons
            name="account-circle-outline"
            size={23}
            color="#87948B"
          />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F9F6",
  },
  header: {
    height: 65,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E9EEE9",
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },
  logo: {
    width: 36,
    height: 36,
    borderRadius: 11,
    backgroundColor: "#34764B",
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#244531",
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#EFF5EF",
    alignItems: "center",
    justifyContent: "center",
  },
  titleSection: {
    paddingHorizontal: 22,
    paddingTop: 25,
    paddingBottom: 18,
  },
  heading: {
    fontSize: 27,
    fontWeight: "700",
    color: "#203D2B",
  },
  subtitle: {
    fontSize: 13,
    color: "#7B8980",
    marginTop: 5,
  },
  summaryCard: {
    marginHorizontal: 20,
    backgroundColor: "#EAF3E9",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  summaryIcon: {
    width: 45,
    height: 45,
    borderRadius: 13,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  summaryNumber: {
    fontSize: 23,
    fontWeight: "700",
    color: "#244B32",
  },
  summaryLabel: {
    fontSize: 11,
    color: "#64786A",
  },
  summaryRight: {
    marginLeft: "auto",
    alignItems: "center",
  },
  summarySmall: {
    fontSize: 9,
    color: "#64786A",
    marginTop: 3,
  },
  searchRow: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  searchBox: {
    height: 48,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E4EAE4",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 13,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: "#294B36",
    marginLeft: 9,
  },
  filterRow: {
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 5,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 15,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E9E2",
  },
  activeFilter: {
    backgroundColor: "#34764B",
    borderColor: "#34764B",
  },
  filterText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#64756A",
  },
  activeFilterText: {
    color: "#FFFFFF",
  },
  sectionHeader: {
    marginHorizontal: 20,
    marginTop: 23,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#294B36",
  },
  resultCount: {
    fontSize: 11,
    color: "#849188",
  },
  scanCard: {
    marginHorizontal: 20,
    marginBottom: 13,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 15,
    borderWidth: 1,
    borderColor: "#E9EEE9",
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "center",
  },
  cropIcon: {
    width: 53,
    height: 53,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  cropInfo: {
    flex: 1,
    marginLeft: 12,
  },
  cropName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#294B36",
  },
  diseaseName: {
    fontSize: 12,
    color: "#63746A",
    marginTop: 3,
  },
  scanDate: {
    fontSize: 10,
    color: "#9AA59D",
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  healthyBadge: {
    backgroundColor: "#E8F4E9",
  },
  diseaseBadge: {
    backgroundColor: "#FFF0E8",
  },
  statusText: {
    fontSize: 10,
    fontWeight: "700",
  },
  healthyText: {
    color: "#38804C",
  },
  diseaseText: {
    color: "#C66B43",
  },
  cardDivider: {
    height: 1,
    backgroundColor: "#EDF0ED",
    marginVertical: 14,
  },
  cardBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  detailLabel: {
    fontSize: 9,
    color: "#9AA59D",
    fontWeight: "600",
    marginBottom: 5,
  },
  detailValue: {
    fontSize: 10,
    color: "#53665A",
    fontWeight: "600",
  },
  confidenceValue: {
    fontSize: 11,
    color: "#34764B",
    fontWeight: "700",
  },
  noResults: {
    marginHorizontal: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 30,
    alignItems: "center",
  },
  noResultsTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#294B36",
    marginTop: 10,
  },
  noResultsText: {
    fontSize: 12,
    color: "#849188",
    textAlign: "center",
    marginTop: 5,
  },
  emptyPreview: {
    marginHorizontal: 20,
    marginTop: 15,
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#E6ECE6",
    overflow: "hidden",
  },
  emptyPreviewHeader: {
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#294B36",
  },
  emptySubtitle: {
    fontSize: 10,
    color: "#8A978E",
    marginTop: 4,
  },
  emptyContent: {
    borderTopWidth: 1,
    borderTopColor: "#EDF0ED",
    padding: 22,
    alignItems: "center",
  },
  emptyIcon: {
    width: 65,
    height: 65,
    borderRadius: 33,
    backgroundColor: "#EAF3E9",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyMessage: {
    fontSize: 16,
    fontWeight: "700",
    color: "#294B36",
    marginTop: 12,
  },
  emptyDescription: {
    fontSize: 11,
    color: "#849188",
    textAlign: "center",
    marginTop: 6,
    lineHeight: 18,
  },
  scanButton: {
    backgroundColor: "#34764B",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 16,
  },
  scanButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  bottomNav: {
    height: 65,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E8EDE8",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
  },
  navText: {
    fontSize: 10,
    color: "#87948B",
  },
  activeNavText: {
    fontSize: 10,
    color: "#34764B",
    fontWeight: "700",
  },
});

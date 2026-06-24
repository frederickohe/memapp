import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { scaleFont } from "@/components/scale";

export default function AffiliationScreen() {
  const router = useRouter();

  const history = [
    { year: "2026", paid: false, price: "120 $", image: "https://picsum.photos/seed/aff2026/120/120" },
    { year: "2025", paid: true, image: "https://picsum.photos/seed/aff2025/120/120" },
    { year: "2024", paid: true, image: "https://picsum.photos/seed/aff2024/120/120" },
    { year: "2023", paid: true, image: "https://picsum.photos/seed/aff2023/120/120" },
    { year: "2022", paid: true, image: "https://picsum.photos/seed/aff2022/120/120" },
    { year: "2021", paid: true, image: "https://picsum.photos/seed/aff2021/120/120" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <ArrowLeft size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Affiliation</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {history.map((item) => (
          <View key={item.year} style={styles.card}>
            <View style={styles.cardRow}>
              <Image source={{ uri: item.image }} style={styles.cardImage} />
              <View style={styles.cardDetails}>
                <Text style={styles.cardTitle}>Member Affiliation</Text>
                <Text style={styles.cardYear}>{item.year}</Text>
              </View>
              
              <View style={styles.actionContainer}>
                {item.paid ? (
                  <View style={styles.paidRow}>
                    <View style={styles.paidBadge}>
                      <Text style={styles.paidText}>Paid</Text>
                    </View>
                    <TouchableOpacity style={styles.receiptButton} activeOpacity={0.7}>
                      <Text style={styles.receiptText}>Receipt</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.payNowButton}
                    activeOpacity={0.8}
                    onPress={() => router.push("/payment-method")}
                  >
                    <Text style={styles.payNowText}>Pay Now</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
            {!item.paid && (
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalAmount}>{item.price}</Text>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "500",
    color: "#111",
    textAlign: "center",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 30,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    padding: 16,
    marginBottom: 16,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: "#F5F5F7",
  },
  cardDetails: {
    flex: 1,
    marginLeft: 12,
  },
  cardTitle: {
    fontSize: 11,
    color: "#888",
    fontWeight: "400",
  },
  cardYear: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111",
    marginTop: 2,
  },
  actionContainer: {
    alignItems: "flex-end",
  },
  payNowButton: {
    backgroundColor: "#FF3B30",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  payNowText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "500",
  },
  paidRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  paidBadge: {
    backgroundColor: "#EAFBF0",
    borderWidth: 1,
    borderColor: "#A3E6B8",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
  paidText: {
    color: "#34C759",
    fontSize: 11,
    fontWeight: "500",
  },
  receiptButton: {
    backgroundColor: "#F5F5F7",
    borderWidth: 1,
    borderColor: "#E5E5E7",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  receiptText: {
    color: "#666",
    fontSize: 11,
    fontWeight: "400",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#F5F5F7",
    marginTop: 12,
    paddingTop: 12,
  },
  totalLabel: {
    fontSize: 11,
    color: "#888",
    marginRight: 8,
    fontWeight: "400",
  },
  totalAmount: {
    fontSize: 14,
    fontWeight: "400",
    color: "#111",
  },
});

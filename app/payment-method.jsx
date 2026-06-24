import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { ArrowLeft, ChevronRight, CreditCard, Smartphone, Wallet, Landmark } from "lucide-react-native";
import { scaleFont } from "@/components/scale";

export default function PaymentMethodScreen() {
  const router = useRouter();

  const methods = [
    {
      id: "upi",
      title: "UPI",
      subtitle: "Google Pay, Apple Pay, PhonePe",
      icon: Smartphone,
      color: "#34C759",
      route: "/pay-upi",
    },
    {
      id: "cards",
      title: "Credit & Debit Cards",
      subtitle: "Visa, Mastercard, RuPay, Axis",
      icon: CreditCard,
      color: "#007AFF",
      route: "/pay-card",
    },
    {
      id: "wallet",
      title: "Wallet",
      subtitle: "Paytm, Mobikwik, Amazon Pay",
      icon: Wallet,
      color: "#FF9500",
      route: null,
    },
    {
      id: "netbanking",
      title: "Net Banking",
      subtitle: "All major banks supported",
      icon: Landmark,
      color: "#FF3B30",
      route: null,
    },
  ];

  const handleSelectMethod = (item) => {
    if (item.route) {
      router.push(item.route);
    } else {
      Alert.alert(
        "Payment Method",
        `"${item.title}" payment is currently not integrated. Please choose UPI or Credit & Debit Cards.`
      );
    }
  };

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
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        {/* Title */}
        <Text style={styles.screenTitle}>Choose payment method:</Text>

        {/* Methods List */}
        <View style={styles.methodsList}>
          {methods.map((item) => {
            const Icon = item.icon;
            return (
              <TouchableOpacity
                key={item.id}
                style={styles.methodCard}
                activeOpacity={0.8}
                onPress={() => handleSelectMethod(item)}
              >
                <View style={styles.cardLeft}>
                  <View style={[styles.iconContainer, { backgroundColor: item.color + "15" }]}>
                    <Icon size={20} color={item.color} />
                  </View>
                  <View style={styles.textContainer}>
                    <Text style={styles.methodTitle}>{item.title}</Text>
                    <Text style={styles.methodSubtitle}>{item.subtitle}</Text>
                  </View>
                </View>
                <ChevronRight size={18} color="#C7C7CC" />
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: "400",
    color: "#111",
    marginBottom: 24,
  },
  methodsList: {
    width: "100%",
  },
  methodCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    padding: 16,
    marginBottom: 16,
  },
  cardLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    marginLeft: 14,
    flex: 1,
  },
  methodTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111",
  },
  methodSubtitle: {
    fontSize: 11,
    color: "#888",
    fontWeight: "500",
    marginTop: 2,
  },
});

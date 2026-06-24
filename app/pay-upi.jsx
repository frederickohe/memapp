import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { ArrowLeft, Plus } from "lucide-react-native";
import { scaleFont } from "@/components/scale";

export default function PayUpiScreen() {
  const router = useRouter();
  const [selectedUpi, setSelectedUpi] = useState("gpay"); // 'gpay' or 'applepay'
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      // Route to success screen
      router.replace("/(onboarding)/success");
    }, 1500);
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
        <Text style={styles.headerTitle}>UPI</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        {/* Amount Section */}
        <View style={styles.amountCard}>
          <Text style={styles.amountLabel}>Amount:</Text>
          <Text style={styles.amountValue}>120 $</Text>
        </View>

        {/* UPI Provider List */}
        <Text style={styles.sectionTitle}>UPI</Text>
        
        {/* Google Pay */}
        <TouchableOpacity
          style={[
            styles.providerCard,
            selectedUpi === "gpay" ? styles.providerCardSelected : styles.providerCardUnselected,
          ]}
          activeOpacity={0.9}
          onPress={() => setSelectedUpi("gpay")}
        >
          <View style={styles.providerLeft}>
            <Image
              source={{ uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png" }}
              style={styles.logoImage}
            />
            <Text
              style={[
                styles.providerText,
                selectedUpi === "gpay" ? styles.providerTextSelected : styles.providerTextUnselected,
              ]}
            >
              Google pay
            </Text>
          </View>
          <View
            style={[
              styles.radioOuter,
              selectedUpi === "gpay" ? styles.radioOuterSelected : styles.radioOuterUnselected,
            ]}
          >
            {selectedUpi === "gpay" && <View style={styles.radioInner} />}
          </View>
        </TouchableOpacity>

        {/* Apple Pay */}
        <TouchableOpacity
          style={[
            styles.providerCard,
            selectedUpi === "applepay" ? styles.providerCardSelected : styles.providerCardUnselected,
          ]}
          activeOpacity={0.9}
          onPress={() => setSelectedUpi("applepay")}
        >
          <View style={styles.providerLeft}>
            <Image
              source={{
                uri: selectedUpi === "applepay"
                  ? "https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Apple_logo_white.svg/512px-Apple_logo_white.svg.png"
                  : "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/512px-Apple_logo_black.svg.png"
              }}
              style={[styles.logoImage, { width: 16, height: 19 }]}
            />
            <Text
              style={[
                styles.providerText,
                selectedUpi === "applepay" ? styles.providerTextSelected : styles.providerTextUnselected,
              ]}
            >
              Apple pay
            </Text>
          </View>
          <View
            style={[
              styles.radioOuter,
              selectedUpi === "applepay" ? styles.radioOuterSelected : styles.radioOuterUnselected,
            ]}
          >
            {selectedUpi === "applepay" && <View style={styles.radioInner} />}
          </View>
        </TouchableOpacity>

        {/* Add New Link */}
        <TouchableOpacity style={styles.addNewRow} activeOpacity={0.7}>
          <Text style={styles.addNewText}>Add new</Text>
        </TouchableOpacity>

        {/* Bottom Button */}
        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={[styles.payButton, isProcessing && styles.payButtonDisabled]}
            onPress={handlePayment}
            disabled={isProcessing}
            activeOpacity={0.8}
          >
            {isProcessing ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.payButtonText}>Top up</Text>
            )}
          </TouchableOpacity>
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
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  amountCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F5F5F7",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: "#EEF0F2",
  },
  amountLabel: {
    fontSize: 13,
    color: "#666",
    fontWeight: "400",
  },
  amountValue: {
    fontSize: 16,
    fontWeight: "400",
    color: "#111",
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "400",
    color: "#111",
    marginBottom: 16,
  },
  providerCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 14,
    borderWidth: 1,
  },
  providerCardSelected: {
    backgroundColor: "#000000",
    borderColor: "#000000",
  },
  providerCardUnselected: {
    backgroundColor: "#FFFFFF",
    borderColor: "#F0F0F0",
  },
  providerText: {
    fontSize: 14,
    fontWeight: "500",
  },
  providerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoImage: {
    width: 20,
    height: 20,
    marginRight: 14,
    resizeMode: "contain",
  },
  providerTextSelected: {
    color: "#FFFFFF",
  },
  providerTextUnselected: {
    color: "#111",
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  radioOuterSelected: {
    borderColor: "#FF3B30", // Red radio outer circle
    backgroundColor: "#FF3B30",
  },
  radioOuterUnselected: {
    borderColor: "#D1D1D6",
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FFFFFF",
  },
  addNewRow: {
    alignSelf: "flex-end",
    marginTop: 10,
    paddingVertical: 4,
  },
  addNewText: {
    fontSize: 13,
    color: "#FF3B30",
    fontWeight: "500",
  },
  bottomContainer: {
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
  },
  payButton: {
    backgroundColor: "#000000",
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    height: 50,
  },
  payButtonDisabled: {
    backgroundColor: "#666",
  },
  payButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "400",
  },
});

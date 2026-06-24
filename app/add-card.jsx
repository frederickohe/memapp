import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { X, CreditCard, Lock } from "lucide-react-native";
import { scaleFont } from "@/components/scale";

export default function AddCardScreen() {
  const router = useRouter();
  
  const [cardNumber, setCardNumber] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardName, setCardName] = useState("");

  const handleSaveCard = () => {
    if (!cardNumber.trim() || cardNumber.length < 12) {
      Alert.alert("Invalid Input", "Please enter a valid card number.");
      return;
    }
    if (!month.trim() || month.length > 2 || parseInt(month) > 12) {
      Alert.alert("Invalid Input", "Please enter a valid expiry month.");
      return;
    }
    if (!year.trim() || year.length !== 2) {
      Alert.alert("Invalid Input", "Please enter a valid 2-digit expiry year.");
      return;
    }
    if (!cvv.trim() || cvv.length < 3) {
      Alert.alert("Invalid Input", "Please enter a valid CVV.");
      return;
    }

    const finalCardName = cardName.trim() || "Visa Card";

    // Pass details back to pay-card screen
    router.replace({
      pathname: "/pay-card",
      params: {
        cardNumber: cardNumber,
        cardName: finalCardName,
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Top Header Row with Close button */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Add new card</Text>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <X size={20} color="#111" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* Card Number Input */}
        <Text style={styles.inputLabel}>Card details *</Text>
        <View style={styles.inputWrapper}>
          <CreditCard size={18} color="#888" style={{ marginRight: 10 }} />
          <TextInput
            style={styles.textInput}
            placeholder="Card number (e.g. 0012 2138 4500)"
            placeholderTextColor="#888"
            keyboardType="number-pad"
            maxLength={16}
            value={cardNumber}
            onChangeText={setCardNumber}
          />
        </View>

        {/* Expiry and CVV Row */}
        <View style={styles.row}>
          <View style={[styles.column, { marginRight: 12 }]}>
            <Text style={styles.inputLabel}>Expiry Month *</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.textInput}
                placeholder="MM"
                placeholderTextColor="#888"
                keyboardType="number-pad"
                maxLength={2}
                value={month}
                onChangeText={setMonth}
              />
            </View>
          </View>

          <View style={[styles.column, { marginRight: 12 }]}>
            <Text style={styles.inputLabel}>Expiry Year *</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.textInput}
                placeholder="YY"
                placeholderTextColor="#888"
                keyboardType="number-pad"
                maxLength={2}
                value={year}
                onChangeText={setYear}
              />
            </View>
          </View>

          <View style={styles.column}>
            <Text style={styles.inputLabel}>CVV *</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.textInput}
                placeholder="CVV"
                placeholderTextColor="#888"
                keyboardType="number-pad"
                maxLength={3}
                secureTextEntry
                value={cvv}
                onChangeText={setCvv}
              />
              <Lock size={14} color="#888" style={{ marginLeft: 6 }} />
            </View>
          </View>
        </View>

        {/* Cardholder Name Input */}
        <Text style={styles.inputLabel}>Name on card (optional)</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.textInput}
            placeholder="Cardholder Name"
            placeholderTextColor="#888"
            value={cardName}
            onChangeText={setCardName}
          />
        </View>

        {/* Bottom Save Button */}
        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSaveCard}
            activeOpacity={0.8}
          >
            <Text style={styles.saveButtonText}>Save card and proceed</Text>
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
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111",
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  inputLabel: {
    fontSize: 12,
    color: "#666",
    fontWeight: "400",
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F7",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#EEF0F2",
    paddingHorizontal: 14,
    height: 48,
    marginBottom: 20,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: "#111",
    padding: 0,
  },
  row: {
    flexDirection: "row",
    width: "100%",
  },
  column: {
    flex: 1,
  },
  bottomContainer: {
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
  },
  saveButton: {
    backgroundColor: "#000000",
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    height: 50,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "400",
  },
});

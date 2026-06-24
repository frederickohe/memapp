import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { scaleFont } from "@/components/scale";

export default function PayCardScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Initial saved cards
  const [cards, setCards] = useState([
    { id: "c1", bank: "Axis Bank", number: "•••• •••• •••• 8295", type: "VISA" },
    { id: "c2", bank: "HDFC Bank", number: "•••• •••• •••• 6246", type: "VISA" },
  ]);
  const [selectedCard, setSelectedCard] = useState("c1");

  // Dynamically add card if returned from add-card screen
  useEffect(() => {
    if (params.cardNumber) {
      const lastFour = params.cardNumber.slice(-4) || "0000";
      const newCardId = `c_${Date.now()}`;
      const newCard = {
        id: newCardId,
        bank: params.cardName || "New Card",
        number: `•••• •••• •••• ${lastFour}`,
        type: "VISA",
      };
      setCards((prev) => [newCard, ...prev]);
      setSelectedCard(newCardId);
    }
  }, [params.cardNumber]);

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
        <Text style={styles.headerTitle}>Credit & Debit Cards</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        {/* Amount Section */}
        <View style={styles.amountCard}>
          <Text style={styles.amountLabel}>Amount:</Text>
          <Text style={styles.amountValue}>120 $</Text>
        </View>

        {/* Cards Section */}
        <Text style={styles.sectionTitle}>Credit & Debit Cards</Text>

        {cards.map((card) => (
          <TouchableOpacity
            key={card.id}
            style={[
              styles.cardItem,
              selectedCard === card.id ? styles.cardItemSelected : styles.cardItemUnselected,
            ]}
            activeOpacity={0.9}
            onPress={() => setSelectedCard(card.id)}
          >
            <View style={styles.cardInfo}>
              <Text
                style={[
                  styles.bankName,
                  selectedCard === card.id ? styles.textSelected : styles.textUnselected,
                ]}
              >
                {card.bank}
              </Text>
              <Text
                style={[
                  styles.cardNumber,
                  selectedCard === card.id ? styles.textSelectedSecondary : styles.textUnselectedSecondary,
                ]}
              >
                {card.number}
              </Text>
            </View>
            <View
              style={[
                styles.radioOuter,
                selectedCard === card.id ? styles.radioOuterSelected : styles.radioOuterUnselected,
              ]}
            >
              {selectedCard === card.id && <View style={styles.radioInner} />}
            </View>
          </TouchableOpacity>
        ))}

        {/* Add New Link */}
        <TouchableOpacity
          style={styles.addNewRow}
          activeOpacity={0.7}
          onPress={() => router.push("/add-card")}
        >
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
  cardItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 14,
    borderWidth: 1,
  },
  cardItemSelected: {
    backgroundColor: "#000000",
    borderColor: "#000000",
  },
  cardItemUnselected: {
    backgroundColor: "#FFFFFF",
    borderColor: "#F0F0F0",
  },
  cardInfo: {
    flex: 1,
  },
  bankName: {
    fontSize: 14,
    fontWeight: "500",
  },
  cardNumber: {
    fontSize: 12,
    fontWeight: "500",
    marginTop: 4,
  },
  textSelected: {
    color: "#FFFFFF",
  },
  textUnselected: {
    color: "#111",
  },
  textSelectedSecondary: {
    color: "rgba(255, 255, 255, 0.7)",
  },
  textUnselectedSecondary: {
    color: "#888",
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
    borderColor: "#FF3B30", // Red radio button highlight
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

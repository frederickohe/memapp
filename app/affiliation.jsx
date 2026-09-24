import React, { useCallback, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import * as WebBrowser from "expo-web-browser";
import { useAuthStore } from "@/stores/useAuthStore";
import { useDuesSchedule } from "@/hooks/useDuesSchedule";
import { initiatePayment, verifyPayment } from "@/lib/api/payments";

function formatGhs(amount) {
  const value = Number(amount) || 0;
  return `GH₵ ${value.toFixed(2)}`;
}

function statusCopy(status) {
  if (status === "paid") return "Paid";
  if (status === "overdue") return "Overdue";
  if (status === "due") return "Due now";
  if (status === "upcoming") return "Upcoming";
  return "";
}

export default function AffiliationScreen() {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const fetchProfile = useAuthStore((state) => state.fetchProfile);
  const year = new Date().getFullYear();
  const { schedule, isLoading, isRefreshing, error, reload } = useDuesSchedule(year);
  const [payingMonth, setPayingMonth] = useState(null);
  const [monthCount, setMonthCount] = useState(1);

  const handlePayAffiliation = useCallback(async () => {
    if (!schedule?.affiliation_can_pay || payingMonth) return;
    setPayingMonth(0);
    try {
      const initiated = await initiatePayment(
        {
          payment_type: "annual_affiliation",
          provider: "paystack",
          period_year: schedule.year,
        },
        token
      );

      if (!initiated?.authorization_url) {
        throw new Error("Paystack did not return a checkout URL");
      }

      await WebBrowser.openBrowserAsync(initiated.authorization_url);

      const verified = await verifyPayment(initiated.reference, token);
      if (verified?.status === "success") {
        Alert.alert(
          "Payment successful",
          `${schedule.year} affiliation of ${formatGhs(initiated.amount_ghs)} has been recorded.`
        );
        await Promise.all([reload({ refreshing: true }), fetchProfile()]);
      } else if (verified?.status === "failed") {
        Alert.alert("Payment failed", "Paystack could not complete this charge. Please try again.");
      } else {
        Alert.alert(
          "Payment pending",
          "If you completed checkout, your receipt will appear shortly after Paystack confirms the payment."
        );
        await reload({ refreshing: true });
      }
    } catch (err) {
      Alert.alert("Unable to pay", err.message || "Please try again.");
    } finally {
      setPayingMonth(null);
    }
  }, [fetchProfile, payingMonth, reload, schedule, token]);

  const handlePay = useCallback(
    async (item, { monthsCount, payFull } = {}) => {
      if (payingMonth) return;
      if (!payFull && !monthsCount && !item?.can_pay) return;
      setPayingMonth(payFull ? "full" : monthsCount ? "bulk" : item.month);
      try {
        const initiated = await initiatePayment(
          {
            payment_type: "monthly_dues",
            provider: "paystack",
            period_year: item?.year || schedule?.year,
            period_month: monthsCount || payFull ? undefined : item.month,
            months_count: monthsCount,
            pay_full: Boolean(payFull),
          },
          token
        );

        if (!initiated?.authorization_url) {
          throw new Error("Paystack did not return a checkout URL");
        }

        await WebBrowser.openBrowserAsync(initiated.authorization_url);

        const verified = await verifyPayment(initiated.reference, token);
        if (verified?.status === "success") {
          Alert.alert(
            "Payment successful",
            `${initiated.period_label || item?.label || "Membership"} dues of ${formatGhs(initiated.amount_ghs)} have been recorded.`
          );
          await Promise.all([reload({ refreshing: true }), fetchProfile()]);
        } else if (verified?.status === "failed") {
          Alert.alert("Payment failed", "Paystack could not complete this charge. Please try again.");
        } else {
          Alert.alert(
            "Payment pending",
            "If you completed checkout, your receipt will appear shortly after Paystack confirms the payment."
          );
          await reload({ refreshing: true });
        }
      } catch (err) {
        Alert.alert("Unable to pay", err.message || "Please try again.");
      } finally {
        setPayingMonth(null);
      }
    },
    [fetchProfile, payingMonth, reload, schedule, token]
  );

  const handleReceipt = useCallback((item) => {
    if (!item?.receipt_number) return;
    Alert.alert(
      "Receipt",
      `${item.label}\nReceipt ${item.receipt_number}\n${formatGhs(item.amount_ghs)}`
    );
  }, []);

  const months = (schedule?.months || []).filter((item) => item.status !== "not_due");
  const payableMonths = months.filter((item) => item.can_pay);
  const selectedCount = Math.min(Math.max(monthCount, 1), payableMonths.length || 1);
  const selectedMonths = payableMonths.slice(0, selectedCount);
  const selectedAmount = selectedMonths.reduce(
    (sum, item) => sum + (Number(item.amount_ghs) || 0),
    0
  );
  const fullAmount = (Number(schedule?.monthly_amount_ghs) || 0) * 12;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <ArrowLeft size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {schedule?.collects_dues === false ? "Affiliation" : "Membership Dues"}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => reload({ refreshing: true })}
          />
        }
      >
        {schedule?.collects_dues === false ? (
          <View style={styles.summaryCard}>
            <Text style={styles.summaryKicker}>{schedule.year} affiliation</Text>
            <Text style={styles.summaryTitle}>
              {formatGhs(schedule.affiliation_amount_ghs)} / year
            </Text>
            <Text style={styles.summaryHint}>
              Your branch does not collect monthly dues. You only pay the annual affiliation fee.
            </Text>
          </View>
        ) : schedule ? (
          <View style={styles.summaryCard}>
            <Text style={styles.summaryKicker}>{schedule.year} membership</Text>
            <Text style={styles.summaryTitle}>
              {formatGhs(schedule.monthly_amount_ghs)} / month
            </Text>
            <Text style={styles.summaryHint}>
              Dues and affiliation are paid together through Paystack.
            </Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryMeta}>
                {schedule.months_paid} paid · {schedule.months_outstanding} outstanding
              </Text>
              <Text style={styles.summaryMeta}>
                {formatGhs(schedule.amount_outstanding_ghs)} due
              </Text>
            </View>
          </View>
        ) : null}

        {isLoading && !schedule ? (
          <View style={styles.centered}>
            <ActivityIndicator color="#111" />
            <Text style={styles.loadingText}>Loading your monthly bills…</Text>
          </View>
        ) : null}

        {error && !schedule ? (
          <View style={styles.centered}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={() => reload()}>
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {schedule?.collects_dues === false ? (
          <View style={styles.card}>
            <View style={styles.cardRow}>
              <View style={styles.cardImage}>
                <Text style={styles.cardImageText}>AFF</Text>
              </View>
              <View style={styles.cardDetails}>
                <Text style={styles.cardTitle}>Annual affiliation</Text>
                <Text style={styles.cardYear}>{schedule.year}</Text>
              </View>
              <View style={styles.actionContainer}>
                {schedule.affiliation_status === "paid" ? (
                  <View style={styles.paidBadge}>
                    <Text style={styles.paidText}>Paid</Text>
                  </View>
                ) : schedule.affiliation_can_pay ? (
                  <TouchableOpacity
                    style={styles.payNowButton}
                    activeOpacity={0.8}
                    onPress={handlePayAffiliation}
                    disabled={payingMonth != null}
                  >
                    {payingMonth === 0 ? (
                      <ActivityIndicator color="#FFFFFF" size="small" />
                    ) : (
                      <Text style={styles.payNowText}>Pay Now</Text>
                    )}
                  </TouchableOpacity>
                ) : (
                  <Text style={styles.statusHint}>No fee set</Text>
                )}
              </View>
            </View>
            {schedule.affiliation_can_pay ? (
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Affiliation only</Text>
                <Text style={styles.totalAmount}>
                  {formatGhs(schedule.affiliation_amount_ghs)}
                </Text>
              </View>
            ) : null}
          </View>
        ) : null}

        {schedule?.collects_dues !== false && payableMonths.length > 0 ? (
          <View style={styles.card}>
            <Text style={styles.bulkTitle}>Pay several months</Text>
            <Text style={styles.bulkHint}>
              Oldest unpaid months are covered first. The charge is the monthly amount times the months you select.
            </Text>
            <View style={styles.stepperRow}>
              <TouchableOpacity
                style={styles.stepperButton}
                onPress={() => setMonthCount((count) => Math.max(1, count - 1))}
                disabled={selectedCount <= 1 || payingMonth != null}
              >
                <Text style={styles.stepperText}>−</Text>
              </TouchableOpacity>
              <View style={styles.stepperValue}>
                <Text style={styles.stepperCount}>{selectedCount}</Text>
                <Text style={styles.stepperLabel}>
                  {selectedCount === 1 ? "month" : "months"}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.stepperButton}
                onPress={() =>
                  setMonthCount((count) => Math.min(payableMonths.length, count + 1))
                }
                disabled={selectedCount >= payableMonths.length || payingMonth != null}
              >
                <Text style={styles.stepperText}>+</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.bulkRange}>
              {selectedMonths[0]?.label}
              {selectedMonths.length > 1
                ? ` – ${selectedMonths[selectedMonths.length - 1].label}`
                : ""}
            </Text>
            <TouchableOpacity
              style={styles.bulkPayButton}
              activeOpacity={0.8}
              onPress={() => handlePay(selectedMonths[0], { monthsCount: selectedCount })}
              disabled={payingMonth != null}
            >
              {payingMonth === "bulk" ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.payNowText}>
                  Pay {selectedCount} {selectedCount === 1 ? "month" : "months"} · {formatGhs(selectedAmount)}
                </Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.fullPayButton}
              activeOpacity={0.8}
              onPress={() => handlePay(payableMonths[0], { payFull: true })}
              disabled={payingMonth != null}
            >
              {payingMonth === "full" ? (
                <ActivityIndicator color="#111" size="small" />
              ) : (
                <Text style={styles.fullPayText}>
                  Pay full year · 12 months · {formatGhs(fullAmount)}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        ) : null}

        {schedule?.collects_dues !== false && months.map((item) => (
          <View
            key={`${item.year}-${item.month}`}
            style={[styles.card, item.is_current && styles.cardCurrent]}
          >
            <View style={styles.cardRow}>
              <View style={styles.cardImage}>
                <Text style={styles.cardImageText}>
                  {item.label.slice(0, 3).toUpperCase()}
                </Text>
              </View>
              <View style={styles.cardDetails}>
                <Text style={styles.cardTitle}>
                  {item.is_current ? "This month" : "Monthly membership"}
                </Text>
                <Text style={styles.cardYear}>{item.label}</Text>
              </View>

              <View style={styles.actionContainer}>
                {item.status === "paid" ? (
                  <View style={styles.paidRow}>
                    <View style={styles.paidBadge}>
                      <Text style={styles.paidText}>Paid</Text>
                    </View>
                    {item.receipt_number ? (
                      <TouchableOpacity
                        style={styles.receiptButton}
                        activeOpacity={0.7}
                        onPress={() => handleReceipt(item)}
                      >
                        <Text style={styles.receiptText}>Receipt</Text>
                      </TouchableOpacity>
                    ) : null}
                  </View>
                ) : item.can_pay ? (
                  <TouchableOpacity
                    style={[
                      styles.payNowButton,
                      item.status === "upcoming" && styles.payNowButtonMuted,
                    ]}
                    activeOpacity={0.8}
                    onPress={() => handlePay(item)}
                    disabled={payingMonth != null}
                  >
                    {payingMonth === item.month ? (
                      <ActivityIndicator color="#FFFFFF" size="small" />
                    ) : (
                      <Text style={styles.payNowText}>
                        {item.status === "upcoming" ? "Pay ahead" : "Pay Now"}
                      </Text>
                    )}
                  </TouchableOpacity>
                ) : (
                  <Text style={styles.statusHint}>{statusCopy(item.status)}</Text>
                )}
              </View>
            </View>
            {item.status !== "paid" && item.can_pay ? (
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>
                  {statusCopy(item.status)} · dues + affiliation
                </Text>
                <Text style={styles.totalAmount}>{formatGhs(item.amount_ghs)}</Text>
              </View>
            ) : null}
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
  summaryCard: {
    backgroundColor: "#111",
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
  },
  summaryKicker: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 11,
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  summaryTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "600",
    marginTop: 6,
  },
  summaryHint: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 12,
    marginTop: 6,
    lineHeight: 18,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 14,
  },
  summaryMeta: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "500",
  },
  centered: {
    alignItems: "center",
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 10,
    color: "#666",
    fontSize: 13,
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 13,
    textAlign: "center",
  },
  retryButton: {
    marginTop: 12,
    backgroundColor: "#111",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  retryText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "500",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    padding: 16,
    marginBottom: 16,
  },
  cardCurrent: {
    borderColor: "#111",
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
    alignItems: "center",
    justifyContent: "center",
  },
  cardImageText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#111",
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
    minWidth: 84,
    alignItems: "center",
  },
  payNowButtonMuted: {
    backgroundColor: "#111",
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
  statusHint: {
    color: "#888",
    fontSize: 12,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#F5F5F7",
    marginTop: 12,
    paddingTop: 12,
  },
  totalLabel: {
    fontSize: 11,
    color: "#888",
    fontWeight: "400",
  },
  totalAmount: {
    fontSize: 14,
    fontWeight: "400",
    color: "#111",
  },
  bulkTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
  },
  bulkHint: {
    fontSize: 12,
    color: "#666",
    lineHeight: 18,
    marginTop: 6,
  },
  stepperRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },
  stepperButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F5F5F7",
    alignItems: "center",
    justifyContent: "center",
  },
  stepperText: {
    fontSize: 22,
    color: "#111",
    lineHeight: 24,
  },
  stepperValue: {
    minWidth: 96,
    alignItems: "center",
  },
  stepperCount: {
    fontSize: 28,
    fontWeight: "600",
    color: "#111",
  },
  stepperLabel: {
    fontSize: 12,
    color: "#666",
  },
  bulkRange: {
    textAlign: "center",
    color: "#111",
    fontSize: 13,
    marginTop: 8,
    marginBottom: 14,
  },
  bulkPayButton: {
    backgroundColor: "#FF3B30",
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: "center",
  },
  fullPayButton: {
    marginTop: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#111",
    paddingVertical: 12,
    alignItems: "center",
  },
  fullPayText: {
    color: "#111",
    fontSize: 13,
    fontWeight: "600",
  },
});

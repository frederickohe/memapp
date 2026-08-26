import React from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ArrowLeft, CheckCircle2, ClipboardList } from "lucide-react-native";
import { useSurveys } from "@/hooks/useSurveys";

function SurveyCard({ survey, onPress }) {
  return (
    <View style={styles.surveyCard}>
      <View style={styles.surveyHeader}>
        <Text style={styles.surveyTitle} numberOfLines={2}>
          {survey.title}
        </Text>
        <View style={[styles.timeBadge, survey.submitted && styles.doneBadge]}>
          <Text style={[styles.timeBadgeText, survey.submitted && styles.doneBadgeText]}>
            {survey.submitted ? "Done" : `${survey.minutes} min`}
          </Text>
        </View>
      </View>
      {survey.description ? (
        <Text style={styles.surveyDesc} numberOfLines={2}>
          {survey.description}
        </Text>
      ) : null}
      {survey.assigned && !survey.submitted ? (
        <Text style={styles.assignedLabel}>Assigned to you</Text>
      ) : null}
      <TouchableOpacity
        style={[styles.startButton, survey.submitted && styles.startButtonDone]}
        onPress={onPress}
        activeOpacity={0.8}
        disabled={survey.submitted}
      >
        <Text style={[styles.startButtonText, survey.submitted && styles.startButtonDoneText]}>
          {survey.submitted ? "Submitted" : "Start Survey"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default function SurveysScreen() {
  const router = useRouter();
  const { open, completed, assigned, isLoading, isRefreshing, error, refresh } =
    useSurveys();
  const active = assigned.length
    ? open.filter((item) => !item.assigned)
    : open;

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <ArrowLeft size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Surveys & Feedback</Text>
        <View style={{ width: 24 }} />
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color="#111" />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={refresh} />
          }
        >
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          {assigned.length > 0 ? (
            <>
              <Text style={styles.sectionTitle}>Assigned to you</Text>
              {assigned.map((survey) => (
                <SurveyCard
                  key={survey.id}
                  survey={survey}
                  onPress={() => router.push(`/surveys/${survey.id}`)}
                />
              ))}
            </>
          ) : null}

          <Text style={styles.sectionTitle}>Active Surveys</Text>
          {active.length === 0 && assigned.length === 0 ? (
            <View style={styles.emptyCard}>
              <ClipboardList size={28} color="#888" />
              <Text style={styles.emptyTitle}>No open surveys</Text>
              <Text style={styles.emptyText}>
                When admins publish a public form, it will show up here for you to complete.
              </Text>
            </View>
          ) : (
            active.map((survey) => (
              <SurveyCard
                key={survey.id}
                survey={survey}
                onPress={() => router.push(`/surveys/${survey.id}`)}
              />
            ))
          )}

          {completed.length > 0 ? (
            <>
              <Text style={styles.sectionTitle}>Completed</Text>
              {completed.map((survey) => (
                <SurveyCard key={survey.id} survey={survey} onPress={() => {}} />
              ))}
            </>
          ) : null}

          <View style={styles.hintCard}>
            <CheckCircle2 size={18} color="#34C759" />
            <Text style={styles.hintText}>
              Responses are sent to YMCA Ghana. Create and manage surveys from Forms in the admin app.
            </Text>
          </View>
        </ScrollView>
      )}
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
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "400",
    color: "#111",
    marginBottom: 16,
    letterSpacing: 0.2,
  },
  surveyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    padding: 16,
    marginBottom: 16,
  },
  surveyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  surveyTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111",
    flex: 1,
    paddingRight: 10,
    lineHeight: 20,
  },
  timeBadge: {
    backgroundColor: "#FFF2F2",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  timeBadgeText: {
    fontSize: 10,
    fontWeight: "500",
    color: "#FF3B30",
  },
  doneBadge: {
    backgroundColor: "#E8F8EE",
  },
  doneBadgeText: {
    color: "#34C759",
  },
  surveyDesc: {
    fontSize: 13,
    color: "#666",
    lineHeight: 18,
    marginBottom: 12,
  },
  assignedLabel: {
    fontSize: 12,
    color: "#FF7A00",
    fontWeight: "500",
    marginBottom: 12,
  },
  startButton: {
    backgroundColor: "#111",
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
  },
  startButtonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "500",
  },
  startButtonDone: {
    backgroundColor: "#F5F5F7",
  },
  startButtonDoneText: {
    color: "#888",
  },
  emptyCard: {
    borderWidth: 1,
    borderColor: "#F0F0F0",
    borderRadius: 14,
    padding: 24,
    alignItems: "center",
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111",
    marginTop: 10,
  },
  emptyText: {
    fontSize: 13,
    color: "#666",
    textAlign: "center",
    marginTop: 6,
    lineHeight: 18,
  },
  errorText: {
    color: "#FF3B30",
    marginBottom: 16,
  },
  hintCard: {
    flexDirection: "row",
    gap: 10,
    backgroundColor: "#F7F8FC",
    borderRadius: 12,
    padding: 14,
    marginTop: 8,
  },
  hintText: {
    flex: 1,
    fontSize: 12,
    color: "#555",
    lineHeight: 18,
  },
});

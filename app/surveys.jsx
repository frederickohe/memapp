import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { ArrowLeft, Star, MessageSquare, CheckCircle } from "lucide-react-native";
import { scaleFont } from "@/components/scale";

export default function SurveysScreen() {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeSurveys = [
    { id: "s1", title: "Annual Member Satisfaction Survey 2026", time: "3 mins", reward: "YMCA Sticker Pack" },
    { id: "s2", title: "New Fitness Center Equipment Feedback", time: "1 min", reward: "10% Guest Pass Discount" },
  ];

  const handleStartSurvey = (title) => {
    Alert.alert(
      "External Survey",
      `Would you like to start the "${title}" survey? It will take a few minutes.`,
      [
        { text: "Later", style: "cancel" },
        { 
          text: "Start", 
          onPress: () => Alert.alert("Survey Loaded", "Thank you for sharing your feedback with us!") 
        }
      ]
    );
  };

  const handleFeedbackSubmit = () => {
    if (rating === 0) {
      Alert.alert("Rating Required", "Please select a star rating before submitting.");
      return;
    }
    if (!feedbackText.trim()) {
      Alert.alert("Feedback Required", "Please enter your thoughts in the text box.");
      return;
    }

    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setRating(0);
      setFeedbackText("");
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        {/* Header */}
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

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Active Surveys Section */}
          <Text style={styles.sectionTitle}>Active Surveys</Text>
          {activeSurveys.map((survey) => (
            <View key={survey.id} style={styles.surveyCard}>
              <View style={styles.surveyHeader}>
                <Text style={styles.surveyTitle} numberOfLines={2}>{survey.title}</Text>
                <View style={styles.timeBadge}>
                  <Text style={styles.timeBadgeText}>{survey.time}</Text>
                </View>
              </View>
              <Text style={styles.surveyReward}>🎁 Reward: {survey.reward}</Text>
              <TouchableOpacity
                style={styles.startButton}
                onPress={() => handleStartSurvey(survey.title)}
                activeOpacity={0.8}
              >
                <Text style={styles.startButtonText}>Start Survey</Text>
              </TouchableOpacity>
            </View>
          ))}

          {/* Direct Feedback Form Section */}
          <Text style={styles.sectionTitle}>Share Quick Feedback</Text>
          
          {submitted ? (
            <View style={styles.successContainer}>
              <CheckCircle size={48} color="#34C759" style={{ marginBottom: 12 }} />
              <Text style={styles.successTitle}>Thank You!</Text>
              <Text style={styles.successText}>
                Your feedback has been submitted successfully. We read every review to improve your experience.
              </Text>
              <TouchableOpacity
                style={styles.newFeedbackButton}
                onPress={() => setSubmitted(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.newFeedbackButtonText}>Submit Another Response</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.feedbackForm}>
              <Text style={styles.formLabel}>How would you rate your YMCA experience today?</Text>
              
              {/* Star Rating Row */}
              <View style={styles.starsRow}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity
                    key={star}
                    onPress={() => setRating(star)}
                    activeOpacity={0.7}
                    style={styles.starTouch}
                  >
                    <Star
                      size={32}
                      color={star <= rating ? "#FFD60A" : "#D1D1D6"}
                      fill={star <= rating ? "#FFD60A" : "transparent"}
                      strokeWidth={2}
                    />
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.formLabel}>Tell us more about your experience:</Text>
              <TextInput
                style={styles.feedbackInput}
                multiline
                numberOfLines={5}
                placeholder="Write your comments, suggestions, or concerns here..."
                placeholderTextColor="#888"
                value={feedbackText}
                onChangeText={setFeedbackText}
                textAlignVertical="top"
              />

              <TouchableOpacity
                style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
                onPress={handleFeedbackSubmit}
                disabled={isSubmitting}
                activeOpacity={0.8}
              >
                <Text style={styles.submitButtonText}>
                  {isSubmitting ? "Submitting..." : "Submit Feedback"}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
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
    marginBottom: 20,
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
  surveyReward: {
    fontSize: 12,
    color: "#34C759",
    fontWeight: "400",
    marginBottom: 14,
  },
  startButton: {
    backgroundColor: "#F5F5F7",
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
  },
  startButtonText: {
    color: "#111",
    fontSize: 12,
    fontWeight: "400",
  },
  feedbackForm: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    padding: 16,
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 13,
    fontWeight: "400",
    color: "#333",
    marginBottom: 12,
  },
  starsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  starTouch: {
    paddingHorizontal: 6,
  },
  feedbackInput: {
    backgroundColor: "#F5F5F7",
    borderRadius: 12,
    padding: 12,
    fontSize: 13,
    color: "#111",
    minHeight: 100,
    marginBottom: 16,
  },
  submitButton: {
    backgroundColor: "#000000",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  submitButtonDisabled: {
    backgroundColor: "#666",
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "400",
  },
  successContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 18,
    fontWeight: "500",
    color: "#111",
    marginBottom: 8,
  },
  successText: {
    fontSize: 13,
    color: "#666",
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 20,
  },
  newFeedbackButton: {
    backgroundColor: "#F5F5F7",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  newFeedbackButtonText: {
    color: "#111",
    fontSize: 12,
    fontWeight: "400",
  },
});

import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { submitSurvey, useSurvey } from "@/hooks/useSurveys";
import { useAuthStore } from "@/stores/useAuthStore";
import { useUserProfile } from "@/hooks/useUserProfile";
import DynamicFormFields, {
  buildInitialFormValues,
  validateFormValues,
} from "@/components/DynamicFormFields";
import { OnboardingButton } from "@/components/OnboardingFormComponents";

export default function TakeSurveyScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const formId = Array.isArray(params.id) ? params.id[0] : params.id;
  const { survey, isLoading, error } = useSurvey(formId);
  const token = useAuthStore((state) => state.token);
  const profile = useUserProfile();
  const [values, setValues] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const fields = useMemo(() => survey?.fields || [], [survey]);

  useEffect(() => {
    if (survey?.fields) {
      setValues(buildInitialFormValues(survey.fields, profile));
    }
  }, [survey, profile]);

  const updateValue = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const validationError = validateFormValues(fields, values);
    if (validationError) {
      Alert.alert("Incomplete form", validationError);
      return;
    }
    setSubmitting(true);
    try {
      await submitSurvey(formId, values, token);
      router.replace({
        pathname: "/surveys/success",
        params: { title: survey?.title || "survey" },
      });
    } catch (err) {
      Alert.alert("Could not submit", err.message || "Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingWrap}>
        <ActivityIndicator size="large" color="#FF3B30" />
      </View>
    );
  }

  if (error || !survey) {
    return (
      <SafeAreaView style={styles.container}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backOnly}>
          <ArrowLeft size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.errorText}>{error || "Survey not found."}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <ArrowLeft size={24} color="#111" />
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>
            Survey
          </Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>{survey.title}</Text>
          {survey.description ? (
            <Text style={styles.subtitle}>{survey.description}</Text>
          ) : (
            <Text style={styles.subtitle}>
              Complete the form below. Your answers help YMCA Ghana improve programs and services.
            </Text>
          )}

          {fields.length > 0 ? (
            <DynamicFormFields
              fields={fields}
              values={values}
              onChange={updateValue}
            />
          ) : (
            <Text style={styles.subtitle}>This survey has no questions yet.</Text>
          )}
        </ScrollView>

        <View style={styles.footer}>
          <OnboardingButton
            label={submitting ? "Submitting…" : "Submit"}
            onPress={handleSubmit}
            disabled={submitting || fields.length === 0}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  flex: {
    flex: 1,
  },
  loadingWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 4,
  },
  backOnly: {
    padding: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "500",
    color: "#111",
  },
  scroll: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 24,
  },
  errorText: {
    fontSize: 14,
    color: "#FF3B30",
    marginHorizontal: 24,
  },
  footer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    paddingTop: 8,
  },
});

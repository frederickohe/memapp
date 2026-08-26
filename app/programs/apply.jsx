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
import * as WebBrowser from "expo-web-browser";
import { ArrowLeft } from "lucide-react-native";
import { useProgram, applyToProgram } from "@/hooks/usePrograms";
import { getFormById } from "@/lib/api/programs";
import { useAuthStore } from "@/stores/useAuthStore";
import { useUserProfile } from "@/hooks/useUserProfile";
import DynamicFormFields, {
  buildInitialFormValues,
  validateFormValues,
} from "@/components/DynamicFormFields";
import { OnboardingButton } from "@/components/OnboardingFormComponents";

export default function ProgramApplyScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const programId = Array.isArray(params.id) ? params.id[0] : params.id;
  const { program, isLoading, error } = useProgram(programId);
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const profile = useUserProfile();

  const [form, setForm] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState(null);
  const [values, setValues] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const linkedFormId = program?.applyAction?.formId || program?.forms?.[0]?.id;
  const fields = useMemo(() => {
    if (form?.fields?.length) return form.fields;
    return program?.forms?.[0]?.fields || [];
  }, [form, program]);

  useEffect(() => {
    let cancelled = false;

    const loadForm = async () => {
      if (!linkedFormId) return;
      setFormLoading(true);
      setFormError(null);
      try {
        const response = await getFormById(linkedFormId, token);
        if (!cancelled) {
          setForm(response);
          setValues(buildInitialFormValues(response.fields || [], profile));
        }
      } catch (err) {
        if (!cancelled) {
          const fallbackFields = program?.forms?.[0]?.fields || [];
          if (fallbackFields.length) {
            setValues(buildInitialFormValues(fallbackFields, profile));
          } else {
            setFormError(err.message || "Unable to load application form");
          }
        }
      } finally {
        if (!cancelled) setFormLoading(false);
      }
    };

    loadForm();
    return () => {
      cancelled = true;
    };
  }, [linkedFormId, token, profile, program]);

  const updateValue = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!program) return;

    if (program.applyAction?.type === "external_link" && program.applyAction.url) {
      await WebBrowser.openBrowserAsync(program.applyAction.url);
      return;
    }

    const validationError = validateFormValues(fields, values);
    if (validationError) {
      Alert.alert("Incomplete form", validationError);
      return;
    }

    setSubmitting(true);
    try {
      await applyToProgram({
        programId: program.id,
        userId: user?.id,
        formId: linkedFormId,
        formData: values,
        token,
      });
      router.replace({
        pathname: "/programs/apply-success",
        params: { title: program.title },
      });
    } catch (err) {
      Alert.alert("Could not submit", err.message || "Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading || formLoading) {
    return (
      <View style={styles.loadingWrap}>
        <ActivityIndicator size="large" color="#FF3B30" />
      </View>
    );
  }

  if (error || !program) {
    return (
      <SafeAreaView style={styles.container}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backOnly}>
          <ArrowLeft size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.errorText}>{error || "Program not found."}</Text>
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
            Apply
          </Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.programTitle}>{program.title}</Text>
          <Text style={styles.subtitle}>
            {form?.description ||
              "Complete the application form to join this program."}
          </Text>

          {formError ? <Text style={styles.errorText}>{formError}</Text> : null}

          {fields.length > 0 ? (
            <DynamicFormFields
              fields={fields}
              values={values}
              onChange={updateValue}
            />
          ) : (
            <Text style={styles.subtitle}>
              Tap submit to register for this program. No extra details are required.
            </Text>
          )}
        </ScrollView>

        <View style={styles.footer}>
          <OnboardingButton
            label={submitting ? "Submitting…" : program.applyAction?.label || "Submit"}
            onPress={handleSubmit}
            disabled={submitting}
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
  programTitle: {
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
    marginBottom: 16,
  },
  footer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    paddingTop: 8,
  },
});

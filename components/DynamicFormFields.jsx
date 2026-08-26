import { useMemo, useState } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  ConsentRow,
  FormField,
} from "@/components/OnboardingFormComponents";

function emptyValue(field) {
  if (field.field_type === "checkbox" && Array.isArray(field.options) && field.options.length) {
    return [];
  }
  if (field.field_type === "checkbox") return false;
  return "";
}

function guessPrefill(field, profile) {
  const key = `${field.name} ${field.label}`.toLowerCase();
  if (!profile) return emptyValue(field);
  if (key.includes("email")) return profile.email !== "—" ? profile.email : "";
  if (key.includes("phone") || key.includes("whatsapp")) {
    return profile.phone !== "—" ? profile.phone : "";
  }
  if (key.includes("full name") || key.includes("fullname") || key === "name name") {
    return profile.name !== "Member" ? profile.name : "";
  }
  if (key.includes("gender")) return profile.gender !== "—" ? profile.gender : "";
  if (key.includes("branch")) return profile.branch !== "—" ? profile.branch : "";
  return emptyValue(field);
}

export function buildInitialFormValues(fields = [], profile) {
  const values = {};
  fields.forEach((field) => {
    values[field.name] = guessPrefill(field, profile);
  });
  return values;
}

export function validateFormValues(fields = [], values = {}) {
  const missing = fields.filter((field) => {
    if (!field.required) return false;
    const value = values[field.name];
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === "boolean") return value !== true;
    return !String(value ?? "").trim();
  });
  if (!missing.length) return null;
  return `Please complete: ${missing.map((field) => field.label || field.name).join(", ")}`;
}

function DateField({ field, value, onChange }) {
  const [open, setOpen] = useState(false);
  const parsed = value ? new Date(value) : new Date();
  const current = Number.isNaN(parsed.getTime()) ? new Date() : parsed;
  const display = value || field.placeholder || "Select date";

  return (
    <View style={styles.dateWrap}>
      <Text style={styles.groupLabel}>{field.label}</Text>
      <TouchableOpacity
        style={styles.dateButton}
        onPress={() => setOpen(true)}
        activeOpacity={0.8}
      >
        <Text style={[styles.dateValue, !value && styles.datePlaceholder]}>
          {display}
        </Text>
      </TouchableOpacity>
      <View style={styles.dateDivider} />
      {open ? (
        <DateTimePicker
          value={current}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(event, nextDate) => {
            if (Platform.OS === "android") setOpen(false);
            if (event.type === "dismissed") {
              setOpen(false);
              return;
            }
            if (nextDate) {
              onChange(nextDate.toISOString().slice(0, 10));
            }
          }}
        />
      ) : null}
      {Platform.OS === "ios" && open ? (
        <TouchableOpacity onPress={() => setOpen(false)} style={styles.doneBtn}>
          <Text style={styles.doneText}>Done</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

function CheckboxGroup({ field, value, onChange }) {
  const selected = Array.isArray(value) ? value : [];

  const toggle = (option) => {
    if (selected.includes(option)) {
      onChange(selected.filter((item) => item !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  return (
    <View style={styles.group}>
      <Text style={styles.groupLabel}>{field.label}</Text>
      {(field.options || []).map((option) => (
        <ConsentRow
          key={option}
          label={option}
          checked={selected.includes(option)}
          onToggle={() => toggle(option)}
        />
      ))}
    </View>
  );
}

export default function DynamicFormFields({ fields = [], values, onChange }) {
  const ordered = useMemo(
    () =>
      [...fields].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    [fields]
  );

  return (
    <View>
      {ordered.map((field) => {
        const value = values[field.name];
        const label = field.required ? `${field.label} *` : field.label;

        if (field.field_type === "textarea") {
          return (
            <FormField
              key={field.name}
              label={label}
              value={value || ""}
              onChangeText={(text) => onChange(field.name, text)}
              placeholder={field.placeholder || ""}
              multiline
            />
          );
        }

        if (field.field_type === "select" || field.field_type === "radio") {
          return (
            <FormField
              key={field.name}
              label={label}
              value={value || ""}
              placeholder={field.placeholder || "Select"}
              isDropdown
              options={field.options || []}
              onSelect={(option) => onChange(field.name, option)}
            />
          );
        }

        if (field.field_type === "checkbox") {
          if (field.options?.length) {
            return (
              <CheckboxGroup
                key={field.name}
                field={{ ...field, label }}
                value={value}
                onChange={(next) => onChange(field.name, next)}
              />
            );
          }
          return (
            <ConsentRow
              key={field.name}
              label={label}
              checked={Boolean(value)}
              onToggle={() => onChange(field.name, !value)}
            />
          );
        }

        if (field.field_type === "date") {
          return (
            <DateField
              key={field.name}
              field={{ ...field, label }}
              value={value || ""}
              onChange={(next) => onChange(field.name, next)}
            />
          );
        }

        return (
          <FormField
            key={field.name}
            label={label}
            value={value || ""}
            onChangeText={(text) => onChange(field.name, text)}
            placeholder={field.placeholder || ""}
            keyboardType={
              field.field_type === "email"
                ? "email-address"
                : field.field_type === "number"
                  ? "number-pad"
                  : "default"
            }
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  group: {
    marginBottom: 12,
  },
  groupLabel: {
    fontSize: 11,
    color: "#888",
    marginBottom: 8,
    fontWeight: "500",
  },
  dateWrap: {
    marginBottom: 12,
  },
  dateButton: {
    paddingVertical: 8,
  },
  dateValue: {
    fontSize: 14,
    color: "#111",
  },
  datePlaceholder: {
    color: "#bbb",
  },
  dateDivider: {
    height: 1,
    backgroundColor: "#e8e8e8",
    marginTop: 2,
    marginBottom: 4,
  },
  doneBtn: {
    alignSelf: "flex-end",
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  doneText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111",
  },
});

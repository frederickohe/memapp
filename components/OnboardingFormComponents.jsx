import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

/**
 * A single form row with label + text input or dropdown indicator.
 */
export function FormField({
  label,
  value,
  onChangeText,
  placeholder = "",
  isDropdown = false,
  options = [],
  onSelect,
  hasError = false,
  keyboardType = "default",
  secureTextEntry = false,
  multiline = false,
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View style={styles.fieldRow}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputWrapper}>
        {isDropdown ? (
          <TouchableOpacity
            style={styles.dropdownRow}
            onPress={() => setIsOpen(!isOpen)}
            activeOpacity={0.7}
          >
            <Text style={[styles.input, !value && styles.placeholder]}>
              {value || placeholder}
            </Text>
            <Text style={styles.dropdownArrow}>{isOpen ? "▲" : "▼"}</Text>
          </TouchableOpacity>
        ) : (
          <TextInput
            style={[
              styles.input,
              multiline && styles.multilineInput,
              hasError && styles.inputError,
            ]}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor="#bbb"
            keyboardType={keyboardType}
            secureTextEntry={secureTextEntry}
            multiline={multiline}
            numberOfLines={multiline ? 3 : 1}
          />
        )}
        {hasError && <View style={styles.errorDot} />}
      </View>

      {/* Custom Inline Dropdown List */}
      {isDropdown && isOpen && options.length > 0 && (
        <View style={styles.optionsContainer}>
          {options.map((option) => (
            <TouchableOpacity
              key={option}
              style={styles.optionRow}
              activeOpacity={0.7}
              onPress={() => {
                onSelect?.(option);
                setIsOpen(false);
              }}
            >
              <Text
                style={[
                  styles.optionText,
                  value === option && styles.optionTextSelected,
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View style={styles.divider} />
    </View>
  );
}

/**
 * A checkbox row for consent items.
 */
export function ConsentRow({ label, link, checked, onToggle }) {
  return (
    <View style={styles.consentRow}>
      <View style={styles.consentText}>
        <Text style={styles.consentLabel}>{label} </Text>
        {link && <Text style={styles.consentLink}>{link}</Text>}
      </View>
      <TouchableOpacity
        style={[styles.checkbox, checked && styles.checkboxChecked]}
        onPress={onToggle}
      >
        {checked && <Text style={styles.checkmark}>✓</Text>}
      </TouchableOpacity>
    </View>
  );
}

/**
 * Bottom "Next" / "Submit" button used across all onboarding screens.
 */
export function OnboardingButton({ label = "Next", onPress, disabled = false }) {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.buttonDisabled]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.buttonText}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fieldRow: {
    marginBottom: 2,
  },
  label: {
    fontSize: 11,
    color: "#888",
    marginBottom: 2,
    fontWeight: "500",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: "#111",
    paddingVertical: 8,
  },
  multilineInput: {
    minHeight: 60,
    textAlignVertical: "top",
  },
  inputError: {
    color: "#e53935",
  },
  placeholder: {
    color: "#bbb",
  },
  dropdownRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  dropdownArrow: {
    fontSize: 10,
    color: "#888",
    marginLeft: 6,
  },
  errorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#e53935",
    marginLeft: 8,
  },
  divider: {
    height: 1,
    backgroundColor: "#e8e8e8",
    marginTop: 2,
    marginBottom: 12,
  },
  // Custom dropdown menu styling
  optionsContainer: {
    backgroundColor: "#F8F9FA",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E5E7",
    marginTop: 6,
    marginBottom: 8,
    overflow: "hidden",
  },
  optionRow: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E7",
  },
  optionText: {
    fontSize: 13,
    color: "#555",
    fontWeight: "400",
  },
  optionTextSelected: {
    color: "#000",
    fontWeight: "500",
  },
  // Consent row
  consentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  consentText: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    paddingRight: 12,
  },
  consentLabel: {
    fontSize: 13,
    color: "#333",
  },
  consentLink: {
    fontSize: 13,
    color: "#555",
    textDecorationLine: "underline",
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  checkboxChecked: {
    backgroundColor: "#000",
    borderColor: "#000",
  },
  checkmark: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
  },
  // Button
  button: {
    backgroundColor: "#000",
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "400",
  },
});

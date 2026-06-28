import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import { Check, ChevronDown } from "lucide-react-native";
import Reanimated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Smooth expand / collapse config for the dropdown menu.
const DROPDOWN_ANIM = {
  duration: 220,
  create: {
    type: LayoutAnimation.Types.easeInEaseOut,
    property: LayoutAnimation.Properties.opacity,
  },
  update: { type: LayoutAnimation.Types.easeInEaseOut },
  delete: {
    type: LayoutAnimation.Types.easeInEaseOut,
    property: LayoutAnimation.Properties.opacity,
  },
};

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
  const [isFocused, setIsFocused] = useState(false);

  // Animated chevron rotation.
  const chevronRotation = useSharedValue(0);
  useEffect(() => {
    chevronRotation.value = withTiming(isOpen ? 180 : 0, { duration: 220 });
  }, [isOpen]);
  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${chevronRotation.value}deg` }],
  }));

  const toggleDropdown = () => {
    LayoutAnimation.configureNext(DROPDOWN_ANIM);
    setIsOpen((open) => !open);
  };

  const selectOption = (option) => {
    LayoutAnimation.configureNext(DROPDOWN_ANIM);
    onSelect?.(option);
    setIsOpen(false);
  };

  const isFilled = !!(value && String(value).trim().length > 0);
  // Center the text/cursor while typing, and keep it centered once filled.
  const centerText = isFocused || isFilled;
  // Show the green "filled" indicator once the user is done (field has a value
  // and is no longer focused) and there is no error.
  const showFilledIndicator = isFilled && !isFocused && !hasError;

  return (
    <View style={styles.fieldRow}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputWrapper}>
        {isDropdown ? (
          <TouchableOpacity
            style={styles.dropdownRow}
            onPress={toggleDropdown}
            activeOpacity={0.7}
          >
            <Text
              style={[styles.dropdownValue, !value && styles.placeholder]}
              numberOfLines={1}
            >
              {value || placeholder}
            </Text>
            <View style={styles.dropdownRight}>
              {isFilled && (
                <View style={styles.filledIndicatorSmall}>
                  <Check size={11} color="#fff" strokeWidth={3} />
                </View>
              )}
              <Reanimated.View style={[styles.chevronWrap, chevronStyle]}>
                <ChevronDown
                  size={18}
                  color={isOpen ? "#111" : "#9a9a9a"}
                  strokeWidth={2}
                />
              </Reanimated.View>
            </View>
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
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            textAlign={centerText ? "center" : "left"}
            placeholder={placeholder}
            placeholderTextColor="#bbb"
            keyboardType={keyboardType}
            secureTextEntry={secureTextEntry}
            multiline={multiline}
            numberOfLines={multiline ? 3 : 1}
          />
        )}
        {!isDropdown && hasError ? (
          <View style={styles.errorDot} />
        ) : !isDropdown && showFilledIndicator ? (
          <View style={styles.filledIndicator}>
            <Check size={12} color="#fff" strokeWidth={3} />
          </View>
        ) : null}
      </View>

      {/* Custom Inline Dropdown List */}
      {isDropdown && isOpen && options.length > 0 && (
        <View style={styles.optionsContainer}>
          {options.map((option, index) => {
            const selected = value === option;
            const isLast = index === options.length - 1;
            return (
              <TouchableOpacity
                key={option}
                style={[
                  styles.optionRow,
                  isLast && styles.optionRowLast,
                  selected && styles.optionRowSelected,
                ]}
                activeOpacity={0.7}
                onPress={() => selectOption(option)}
              >
                <Text
                  style={[
                    styles.optionText,
                    selected && styles.optionTextSelected,
                  ]}
                >
                  {option}
                </Text>
                {selected && (
                  <Check size={16} color="#22C55E" strokeWidth={3} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      <View style={[styles.divider, showFilledIndicator && styles.dividerFilled]} />
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
    justifyContent: "space-between",
    paddingVertical: 9,
  },
  dropdownValue: {
    flex: 1,
    fontSize: 14,
    color: "#111",
  },
  dropdownRight: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
  },
  chevronWrap: {
    marginLeft: 8,
  },
  filledIndicatorSmall: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#22C55E",
    justifyContent: "center",
    alignItems: "center",
  },
  errorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#e53935",
    marginLeft: 8,
  },
  filledIndicator: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#22C55E",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  divider: {
    height: 1,
    backgroundColor: "#e8e8e8",
    marginTop: 2,
    marginBottom: 12,
  },
  dividerFilled: {
    backgroundColor: "#22C55E",
  },
  // Custom dropdown menu styling
  optionsContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ECECEF",
    marginTop: 8,
    marginBottom: 10,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 13,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F1F3",
  },
  optionRowLast: {
    borderBottomWidth: 0,
  },
  optionRowSelected: {
    backgroundColor: "#F6FBF7",
  },
  optionText: {
    flex: 1,
    fontSize: 14,
    color: "#555",
    fontWeight: "400",
  },
  optionTextSelected: {
    color: "#111",
    fontWeight: "700",
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

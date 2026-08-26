import { createElement, useMemo, useState } from "react";
import {
  Image,
  LayoutAnimation,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { SvgXml } from "react-native-svg";
import {
  ICON_CALENDAR,
  ICON_DROPDOWN,
  RADIO_EMPTY,
} from "@/components/signupIcons";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const MIN_DOB = new Date(1920, 0, 1);
const MAX_DOB = new Date();

function parseDob(value) {
  if (!value) return null;

  const slash = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (slash) {
    const date = new Date(Number(slash[3]), Number(slash[2]) - 1, Number(slash[1]));
    return Number.isNaN(date.getTime()) ? null : date;
  }

  const iso = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (iso) {
    const date = new Date(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3]));
    return Number.isNaN(date.getTime()) ? null : date;
  }

  return null;
}

function formatDob(date) {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}/${date.getFullYear()}`;
}

function toIsoDate(date) {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  return `${date.getFullYear()}-${mm}-${dd}`;
}

function defaultDob() {
  const date = new Date();
  date.setFullYear(date.getFullYear() - 18);
  return date;
}

function RadioMark({ filled, onDark }) {
  if (!filled) {
    return (
      <View style={styles.radioBox}>
        <SvgXml xml={RADIO_EMPTY} width={24} height={24} />
      </View>
    );
  }

  return (
    <View style={[styles.radioFilledOuter, onDark && styles.radioFilledOnDark]}>
      <View style={styles.radioFilledInner} />
    </View>
  );
}

function WebDateInput({ value, min, max, onChange }) {
  return createElement("input", {
    type: "date",
    value,
    min,
    max,
    onChange: (event) => onChange(event.target.value),
    style: {
      width: "100%",
      fontSize: 16,
      padding: 12,
      borderRadius: 12,
      border: "1px solid #D4D8E0",
      background: "#FFFFFF",
      color: "#000000",
    },
  });
}

export function SignupFormCard({
  label,
  value,
  onChangeText,
  placeholder = "",
  filled,
  showCalendar,
  showDropdown,
  options,
  onSelect,
  secureTextEntry,
  keyboardType = "default",
  autoCapitalize = "none",
  selected,
  portrait,
  onPress,
}) {
  const [open, setOpen] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [draftDate, setDraftDate] = useState(() => parseDob(value) ?? defaultDob());
  const isFilled = filled ?? Boolean(value);
  const isDark = Boolean(selected);
  const isTappable = Boolean(onPress || options?.length || showCalendar);

  const isoBounds = useMemo(
    () => ({
      min: toIsoDate(MIN_DOB),
      max: toIsoDate(MAX_DOB),
    }),
    []
  );

  const openPicker = () => {
    setDraftDate(parseDob(value) ?? defaultDob());
    setPickerOpen(true);
  };

  const closePicker = () => setPickerOpen(false);

  const commitDate = (date) => {
    onChangeText?.(formatDob(date));
    setPickerOpen(false);
  };

  const handlePress = () => {
    if (onPress) {
      onPress();
      return;
    }
    if (showCalendar) {
      openPicker();
      return;
    }
    if (options?.length) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setOpen((current) => !current);
    }
  };

  const handleNativeChange = (event, nextDate) => {
    if (Platform.OS === "android") {
      if (event.type === "set" && nextDate) {
        commitDate(nextDate);
        return;
      }
      closePicker();
      return;
    }

    if (nextDate) {
      setDraftDate(nextDate);
    }
  };

  const body = (
    <View
      style={[
        styles.card,
        isDark && styles.cardSelected,
        portrait && styles.cardPortrait,
      ]}
    >
      <Text
        style={[styles.label, isDark && styles.labelOnDark]}
        numberOfLines={1}
      >
        {label}
      </Text>
      {showCalendar ? (
        <View style={styles.valueRow}>
          <View style={styles.calendarIcon}>
            <SvgXml xml={ICON_CALENDAR} width={18} height={18} />
          </View>
          <Text
            style={[
              styles.valueText,
              !value && styles.placeholder,
              isDark && styles.valueOnDark,
            ]}
            numberOfLines={1}
          >
            {value || placeholder}
          </Text>
        </View>
      ) : options?.length ? (
        <View style={styles.valueRow}>
          {value ? (
            <Text
              style={[styles.valueText, isDark && styles.valueOnDark]}
              numberOfLines={1}
            >
              {value}
            </Text>
          ) : (
            <View style={styles.dropdownIcon}>
              <SvgXml xml={ICON_DROPDOWN} width={18} height={18} />
            </View>
          )}
        </View>
      ) : onChangeText ? (
        <View style={styles.valueRow}>
          {showDropdown && !value ? (
            <View style={styles.dropdownIcon}>
              <SvgXml xml={ICON_DROPDOWN} width={18} height={18} />
            </View>
          ) : null}
          <TextInput
            style={[styles.valueInput, isDark && styles.valueOnDark]}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor="#B1B2B4"
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            includeFontPadding={false}
            textAlignVertical="center"
            underlineColorAndroid="transparent"
          />
        </View>
      ) : (
        <Text
          style={[styles.valueText, isDark && styles.valueOnDark]}
          numberOfLines={1}
        >
          {value}
        </Text>
      )}
      <RadioMark filled={isFilled || isDark} onDark={isDark} />
      {portrait ? (
        <Image source={portrait} style={styles.portrait} resizeMode="cover" />
      ) : null}
    </View>
  );

  return (
    <View style={styles.wrap}>
      {isTappable ? (
        <TouchableOpacity onPress={handlePress} activeOpacity={0.85}>
          {body}
        </TouchableOpacity>
      ) : (
        body
      )}
      {open && options?.length ? (
        <View style={styles.options}>
          {options.map((option) => (
            <TouchableOpacity
              key={option}
              style={styles.optionRow}
              onPress={() => {
                onSelect?.(option);
                LayoutAnimation.configureNext(
                  LayoutAnimation.Presets.easeInEaseOut
                );
                setOpen(false);
              }}
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : null}

      {pickerOpen && Platform.OS === "android" ? (
        <DateTimePicker
          value={draftDate}
          mode="date"
          display="default"
          maximumDate={MAX_DOB}
          minimumDate={MIN_DOB}
          onChange={handleNativeChange}
        />
      ) : null}

      <Modal
        visible={pickerOpen && Platform.OS !== "android"}
        transparent
        animationType="fade"
        onRequestClose={closePicker}
      >
        <Pressable style={styles.pickerOverlay} onPress={closePicker}>
          <Pressable style={styles.pickerSheet} onPress={() => {}}>
            <Text style={styles.pickerTitle}>Date of Birth</Text>
            {Platform.OS === "web" ? (
              <WebDateInput
                value={toIsoDate(draftDate)}
                min={isoBounds.min}
                max={isoBounds.max}
                onChange={(next) => {
                  const parsed = parseDob(next);
                  if (parsed) setDraftDate(parsed);
                }}
              />
            ) : (
              <DateTimePicker
                value={draftDate}
                mode="date"
                display="spinner"
                themeVariant="light"
                maximumDate={MAX_DOB}
                minimumDate={MIN_DOB}
                onChange={handleNativeChange}
                style={styles.iosPicker}
              />
            )}
            <TouchableOpacity
              style={styles.pickerDone}
              onPress={() => commitDate(draftDate)}
              activeOpacity={0.85}
            >
              <Text style={styles.pickerDoneLabel}>Done</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: "100%",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    minHeight: 104,
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cardSelected: {
    backgroundColor: "#000000",
  },
  cardPortrait: {
    paddingRight: 28,
    overflow: "hidden",
  },
  label: {
    width: 118,
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 20,
    color: "#000000",
    flexShrink: 0,
  },
  labelOnDark: {
    color: "#B1B2B4",
  },
  valueRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    minWidth: 0,
  },
  valueText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 20,
    color: "#000000",
    minWidth: 0,
  },
  valueInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    color: "#000000",
    paddingTop: 0,
    paddingBottom: Platform.OS === "android" ? 2 : 0,
    paddingHorizontal: 0,
    margin: 0,
    minWidth: 0,
    height: 24,
  },
  placeholder: {
    color: "#B1B2B4",
  },
  valueOnDark: {
    color: "#FFFFFF",
  },
  calendarIcon: {
    width: 18,
    height: 18,
  },
  dropdownIcon: {
    width: 18,
    height: 18,
    transform: [{ scaleY: -1 }],
  },
  radioBox: {
    width: 24,
    height: 24,
    zIndex: 2,
  },
  radioFilledOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#BBF246",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  radioFilledOnDark: {
    borderColor: "#BBF246",
  },
  radioFilledInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#BBF246",
  },
  portrait: {
    position: "absolute",
    right: 48,
    top: 0,
    width: 90,
    height: 104,
    zIndex: 1,
  },
  options: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginTop: 8,
    overflow: "hidden",
  },
  optionRow: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#EEE",
  },
  optionText: {
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 20,
    color: "#000",
  },
  pickerOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
  },
  pickerSheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 28,
    gap: 12,
  },
  pickerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000000",
    textAlign: "center",
  },
  iosPicker: {
    height: 180,
  },
  pickerDone: {
    backgroundColor: "#000000",
    borderRadius: 999,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  pickerDoneLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});

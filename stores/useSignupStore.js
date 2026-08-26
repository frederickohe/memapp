import { create } from "zustand";

const INITIAL_FORM = {
  username: "",
  firstName: "",
  lastName: "",
  fullName: "",
  nationality: "",
  dateOfBirth: "",
  gender: "",
  facebook: "",
  instagram: "",
  linkedin: "",
  phone: "",
  email: "",
  address: "",
  membershipType: "",
  currentBranch: "",
  numberOfBonds: "",
  membershipId: "",
  skills: "",
  goJointer: "",
  articularWellbeing: "",
  educationId: "",
  termsAccepted: false,
  privacyAccepted: false,
  photoAccepted: false,
  notifAccepted: false,
  password: "",
  confirmPassword: "",
};

export const useSignupStore = create((set, get) => ({
  ...INITIAL_FORM,

  setField: (key, value) =>
    set((state) => {
      const next = { [key]: value };
      if (key === "firstName" || key === "lastName") {
        const firstName = key === "firstName" ? value : state.firstName;
        const lastName = key === "lastName" ? value : state.lastName;
        next.fullName = `${firstName} ${lastName}`.trim();
      }
      if (key === "username") {
        next.email = value;
      }
      return next;
    }),

  toggle: (key) => set((state) => ({ [key]: !state[key] })),

  toFormPayload: () => {
    const state = get();
    return { ...state };
  },

  reset: () => set(INITIAL_FORM),
}));

const tintColorLight = '#2f95dc';
const tintColorDark = '#fff';

const Colors = {
  light: {
    text: '#000',
    background: '#fff',
    tint: tintColorLight,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#fff',
    background: '#000',
    tint: tintColorDark,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorDark,
  },

  trip: {
    primary: '#2B7A78',
    secondary: '#19647E',
    accent: '#EF476F',
    background: '#FEFCF3',
    surface: '#FFFFFF',
    text: '#262626',
    muted: '#6B7280',
    border: '#E5E7EB',
    error: '#EF476F',
    success: '#2B7A78',
  },

  admin: {
    // 👑 Admin mode colors — darker and gold-accented
    primary: "#C19A6B",       // main accent (gold-brown)
    secondary: "#FFD700",     // highlight gold
    background: "#121212",    // deep dark background
    surface: "#1E1E1E",       // slightly lighter for cards/surfaces
    text: "#FFFFFF",          // white for readability
    error: "#EF476F",         // same accent red
  },
};

export const userTheme = {
  roundness: 12,
  colors: {
    primary: Colors.trip.primary,
    secondary: Colors.trip.secondary,
    background: Colors.trip.background,
    surface: Colors.trip.surface,
    text: Colors.trip.text,
    error: Colors.trip.error,
  },
};

export const adminTheme = {
  roundness: 12,
  colors: {
    primary: Colors.admin.primary,
    secondary: Colors.admin.secondary,
    background: Colors.admin.background,
    surface: Colors.admin.surface,
    text: Colors.admin.text,
    error: Colors.admin.error,
  },
};

export default Colors;

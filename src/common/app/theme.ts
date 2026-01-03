import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  shape: {
    borderRadius: 12, // 👈 global radius (px)
  },

  palette: {
    mode: "light",

    primary: {
      main: "#ef783e",
      light: "#ff9b6a",
      dark: "#c65f2f",
      contrastText: "#ffffff",
    },

    secondary: {
      main: "#0A736C",
      light: "#3c9a94",
      dark: "#054f4a",
      contrastText: "#ffffff",
    },

    background: {
      default: "#f9fafb",
      paper: "#ffffff",
    },

    text: {
      primary: "#1f2937",
      secondary: "#4b5563",
      disabled: "#9ca3af",
    },

    divider: "#e5e7eb",

    error: {
      main: "#dc2626",
      light: "#f87171",
      dark: "#991b1b",
      contrastText: "#ffffff",
    },

    warning: {
      main: "#f59e0b",
      light: "#fcd34d",
      dark: "#b45309",
      contrastText: "#000000",
    },

    info: {
      main: "#2563eb",
      light: "#60a5fa",
      dark: "#1e40af",
      contrastText: "#ffffff",
    },

    success: {
      main: "#16a34a",
      light: "#4ade80",
      dark: "#166534",
      contrastText: "#ffffff",
    },
  },

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: "none",
          fontWeight: 600,
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },

    MuiTextField: {
      defaultProps: {
        variant: "outlined",
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

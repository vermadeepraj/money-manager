import { heroui } from "@heroui/react";

export default heroui({
    defaultTheme: "dark",
    defaultExtendTheme: "dark",
    themes: {
        dark: {
            colors: {
                background: "#09090B",      // zinc-950
                foreground: "#FAFAFA",      // zinc-50
                primary: {
                    50: "#eef2ff",
                    100: "#e0e7ff",
                    200: "#c7d2fe",
                    300: "#a5b4fc",
                    400: "#818cf8",
                    500: "#6366f1",          // indigo-500 accent
                    600: "#4f46e5",
                    700: "#4338ca",
                    800: "#3730a3",
                    900: "#312e81",
                    DEFAULT: "#6366f1",
                    foreground: "#ffffff",
                },
                content1: "#1a1a1e",         // slightly lighter than bg for glass
                content2: "#27272A",         // zinc-800
                content3: "#3f3f46",         // zinc-700
                content4: "#52525b",         // zinc-600
                default: {
                    50: "#fafafa",
                    100: "#f4f4f5",
                    200: "#e4e4e7",
                    300: "#d4d4d8",
                    400: "#a1a1aa",
                    500: "#71717a",
                    600: "#52525b",
                    700: "#3f3f46",
                    800: "#27272A",
                    900: "#18181B",
                    DEFAULT: "#27272A",
                    foreground: "#fafafa",
                },
                divider: "rgba(255, 255, 255, 0.1)",
                focus: "#6366f1",            // indigo-500
                // Semantic colors
                success: {
                    DEFAULT: "#3B82F6",      // blue-500 for income
                    foreground: "#ffffff",
                },
                danger: {
                    DEFAULT: "#F97316",      // orange-500 for expense
                    foreground: "#ffffff",
                },
            },
        },
        light: {
            colors: {
                background: "#FAFAFA",       // zinc-50
                foreground: "#18181B",       // zinc-900
                primary: {
                    50: "#eef2ff",
                    100: "#e0e7ff",
                    200: "#c7d2fe",
                    300: "#a5b4fc",
                    400: "#818cf8",
                    500: "#6366f1",          // indigo-500 accent
                    600: "#4f46e5",
                    700: "#4338ca",
                    800: "#3730a3",
                    900: "#312e81",
                    DEFAULT: "#6366f1",
                    foreground: "#ffffff",
                },
                content1: "#FFFFFF",         // white for glass base
                content2: "#f8f8f9",         // very light gray
                content3: "#f4f4f5",         // zinc-100
                content4: "#e4e4e7",         // zinc-200
                default: {
                    50: "#18181b",
                    100: "#27272a",
                    200: "#3f3f46",
                    300: "#52525b",
                    400: "#71717a",
                    500: "#a1a1aa",
                    600: "#d4d4d8",
                    700: "#e4e4e7",
                    800: "#f4f4f5",
                    900: "#fafafa",
                    DEFAULT: "#e4e4e7",
                    foreground: "#18181b",
                },
                divider: "rgba(0, 0, 0, 0.08)",
                focus: "#6366f1",            // indigo-500
                // Semantic colors
                success: {
                    DEFAULT: "#2563EB",      // blue-600 for income (darker for light mode)
                    foreground: "#ffffff",
                },
                danger: {
                    DEFAULT: "#EA580C",      // orange-600 for expense (darker for light mode)
                    foreground: "#ffffff",
                },
            },
        },
    },
});

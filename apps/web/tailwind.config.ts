import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "../../packages/ui/**/*.{js,ts,jsx,tsx}"
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    DEFAULT: "#F5A623", // Golden Orange from reference
                    dark: "#D08B1B",
                    foreground: "#FFFFFF",
                },
                dark: {
                    DEFAULT: "#1A1A1A", // Dark card background
                    surface: "#252525", // Lighter dark surface
                },
                app: {
                    bg: "#F2F2F7", // iOS system gray background
                }
            },
            fontFamily: {
                sans: ["var(--font-outfit)", "sans-serif"],
            },
            borderRadius: {
                '3xl': '1.5rem',
                '4xl': '2rem', // Super rounded for modal-like cards
            },
        },
    },
    plugins: [],
};
export default config;

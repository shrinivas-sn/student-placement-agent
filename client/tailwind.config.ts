import type { Config } from "tailwindcss";

export default {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            borderRadius: {
                lg: ".5625rem", /* 9px */
                md: ".375rem", /* 6px */
                sm: ".1875rem", /* 3px */
            },
            colors: {
                // Flat / base colors (regular buttons)
                background: "hsl(var(--background) / <alpha-value>)",
                foreground: "hsl(var(--foreground) / <alpha-value>)",
                border: "hsl(var(--border) / <alpha-value>)",
                input: "hsl(var(--input) / <alpha-value>)",
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
} satisfies Config;

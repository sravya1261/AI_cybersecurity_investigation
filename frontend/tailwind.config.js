/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                dark: {
                    900: '#0f172a',  // App background
                    800: '#1e293b',  // Card background
                    700: '#334155',  // Hover states, borders
                    600: '#475569',  // Muted text
                },
                brand: {
                    500: '#3b82f6',  // Primary accent
                    400: '#60a5fa',  // Light accent
                },
                severity: {
                    critical: '#ef4444',
                    high: '#f97316',
                    medium: '#eab308',
                    low: '#22c55e'
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            }
        },
    },
    plugins: [],
}

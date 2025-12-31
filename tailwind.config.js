/** @type {import('tailwindcss').Config} */
export default {
    darkMode: "class",
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                "primary": "#13eca4",
                "primary-dark": "#0eb57e",
                "background-light": "#ffffff",
                "background-dark": "#0f172a",
                "surface-light": "#f8fafc",
                "surface-dark": "#1e293b",
                "text-main": "#111816",
                "text-sub": "#61897c",
            },
            fontFamily: {
                "display": ["Lexend", "sans-serif"],
                "body": ["Noto Sans", "sans-serif"]
            },
            borderRadius: {
                "lg": "1rem",
                "xl": "1.5rem",
                "2xl": "2rem",
            },
            boxShadow: {
                'soft': '0 10px 40px -10px rgba(0,0,0,0.05)',
                'card': '0 4px 20px -2px rgba(0,0,0,0.03)',
                'float': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            }
        }
    },
    plugins: [],
}

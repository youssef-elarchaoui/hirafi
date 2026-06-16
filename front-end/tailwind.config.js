/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: { // 👈 كولشي خاصو يكون داخل extend هنا
            screens: {
                'xs': '375px',
                'sm': '480px',
                'md': '640px',
                'tablet': '768px',
                'lg': '1024px',
                'desktop': '1280px',
                'xl': '1440px',
            },
            colors: {
                primary: {
                    DEFAULT: '#3D5A3E',
                    dark: '#2D452E',
                    light: '#E8EDE6',
                },
                accent: '#C47D4E',
                bg: {
                    DEFAULT: '#FAF8F5',
                    dark: '#1A1208',
                },
                text: {
                    DEFAULT: '#1A1208',
                    secondary: '#5C5244',
                },
                border: {
                    DEFAULT: '#E6E0D6',
                    dark: '#2D2A24',
                },
                error: '#B84A3A',
                success: '#3D5A3E',
                warning: '#D49A3A',
            },
            fontFamily: {
                heading: ['Manuale', 'Cairo', 'serif'],
                body: ['Manrope', 'Tajawal', 'sans-serif'],
                arabic: ['Cairo', 'Tajawal', 'sans-serif'],
            },
            fontSize: {
                'display': ['clamp(2rem, 5vw, 3rem)', { lineHeight: '1.15' }],
                'h1': ['clamp(1.5rem, 4vw, 2rem)', { lineHeight: '1.2' }],
                'h2': ['clamp(1.25rem, 3vw, 1.5rem)', { lineHeight: '1.25' }],
                'h3': ['clamp(1.125rem, 2.5vw, 1.25rem)', { lineHeight: '1.3' }],
                'h4': ['1rem', { lineHeight: '1.4' }],
                'body': ['0.875rem', { lineHeight: '1.5' }],
                'caption': ['0.75rem', { lineHeight: '1.4' }],
            },
            spacing: {
                '1': '0.25rem',
                '2': '0.5rem',
                '3': '0.75rem',
                '4': '1rem',
                '6': '1.5rem',
                '8': '2rem',
                '12': '3rem',
                '16': '4rem',
                '24': '6rem',
            },
            borderWidth: {
                '3': '3px',
            },
            maxWidth: {
                'container': '1280px',
            },
            borderRadius: {
                'btn': '4px',
                'card': '4px',
            },
        },
    },
    plugins: [],
}
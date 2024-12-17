function withOpacity(variableName) {
  return ({ opacityValue }) => {
    if (opacityValue !== undefined) {
      return `rgba(var(${variableName}), ${opacityValue})`;
    } else {
      return `rgb(var(${variableName}))`;
    }
  };
}

{% set primary_color = theme.global_colors.primary.color %}
{% set secondary_color = theme.global_colors.secondary.color %}

let primarycolor = "{{ primary_color }}";
let secondarycolor = "{{ secondary_color }}";

tailwind.config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/layouts/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class", // or 'media' or 'class'
  theme: {
    screens: {
      xs: "480px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1440px",
      "3xl": "1780px",
      "4xl": "2160px",
    },
    extend: {
      backgroundImage: {
        "custom-gradient":
          `linear-gradient(194deg, ${moduleStylesOptions.detailsPageStyles.bannerColors.color2 || "#fc5b36"} 0%,  ${moduleStylesOptions.detailsPageStyles.bannerColors.color1 || "#2d3e50"} 72% )`,
        "custom-bg":
          "url('https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
      },
      keyframes: {
        pulseEffect: {
          '0%': { boxShadow: '0 0 0 0 rgba(0, 0, 0, 0.5)' },
          '70%': { boxShadow: '0 0 0 10px rgba(0, 0, 0, 0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(0, 0, 0, 0)' },
        },
        pulseEffectDark: {
          '0%': { boxShadow: '0 0 0 0 rgba(255, 255, 255, 0.5)' },
          '70%': { boxShadow: '0 0 0 10px rgba(255, 255, 255, 0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(255, 255, 255, 0)' },
        },
      },
      animation: {
        pulseEffect: 'pulseEffect 2s infinite',
        pulseEffectDark: 'pulseEffectDark 2s infinite',
      },
      colors: {
        cleanWhite: "#FFFFFF",
        white: "#fdfdfd",
        graySecondary: "#F2F2F2",
        richRed: "#FF0000",
        lightblue: "#005fad",
        defaultPrimary: "var(--primary-color)",
        rsbackground: `${moduleStylesOptions.rightTables.backgroundColor || "#2d3e5014"}`,
        rstextcolor: `${moduleStylesOptions.rightTables.textColor || "#2d3e50"}`,
        rscardbackhround: `${moduleStylesOptions.rightTables.cardBackgroundColor || "#2d3e5030"}`,
        primary: "var(--primary-color)",
        secondary: "var(--secondary-color)",
        flatGray: "#F6F6F6", // Flat grey
        midGray: "#DFDFF2", // Mid grey
        darkerGray: "#1C1C1F",
        sidelayoutColor: `${moduleStylesOptions.sidebarStyles.backgroundColor || "#2d3e50"}`,
        sidelayoutTextColor: `${moduleStylesOptions.sidebarStyles.textColor || "#ffffff"}`,
        detailsBannerTextColor: `${moduleStylesOptions.detailsPageStyles.textColor || "#ffffff"}`,
        activeState: `${moduleStylesOptions.sidebarStyles.textColor || "#ffffff"}20`, // Darker grey
        brand: {
          DEFAULT: "#0289A4",
          dark: "#0091AE",
        },

        light: {
          base: "#646464",
          100: "#f9f9f9",
          200: "#f2f2f2",
          300: "#ededed",
          400: "#e6e6e6",
          500: "#dadada",
          600: "#d2d2d2",
          800: "#bcbcbc",
          900: "#a8a8a8",
        },
        dark: {
          DEFAULT: "#000000",
          base: "#a5a5a5",
          100: "#181818",
          200: "#212121",
          250: "#252525",
          300: "#2a2a2a",
          350: "#2b2b2b",
          400: "#323232",
          450: "#2e2e2e",
          500: "#3e3e3e",
          600: "#4a4a4a",
          700: "#6e6e6e",
          800: "#808080",
          850: "#989898",
          900: "#999999",
          950: "#2b2b2b",
        },
        warning: "#e66767",
        wishlist_price: "#ffffff1a",
        "border-50": withOpacity("--color-border-50"),
        "border-100": withOpacity("--color-border-100"),
        "border-200": withOpacity("--color-border-200"),
        "border-base": withOpacity("--color-border-base"),
      },
      boxShadow: {
        card: "0px 0px 6px rgba(79, 95, 120, 0.1)",
        dropdown: "0px 10px 32px rgba(46, 57, 72, 0.2)",
        "bottom-nav": "0 -2px 3px rgba(0, 0, 0, 0.08)",
      },
      fontSize: {
        "10px": ".625rem",
        "13px": "13px",
        "15px": "15px",
        h1: "var(--h1)",
        h2: "var(--h2)",
        h3: "var(--h3)",
        h4: "var(--h4)",
        h5: "var(--h5)",
        h6: "var(--h6)",
      },
      fontFamily: {
        body: ["'Inter', sans-serif"],
      },
    },
  },
  // plugins: [require("@tailwindcss/typography"), require("@tailwindcss/forms")],
};

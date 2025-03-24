import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

export default <Partial<Config>>{
    theme: {
        extend: {
            fontFamily: {
                sans: ["Atkinson Hyperlegible", ...defaultTheme.fontFamily.sans],
                mono: ["Monaco", "Menlo", "Consolas", "Courier New", "monospace"],
            },
            colors: {
                // Galaxy primary
                "bay-of-many": {
                    DEFAULT: "#25537B",
                    50: "#FDFDFE",
                    100: "#EDF4FA",
                    200: "#CDE0F0",
                    300: "#AECCE7",
                    400: "#8FB9DD",
                    500: "#6FA5D4",
                    600: "#5091CA",
                    700: "#387DBA",
                    800: "#2E689A",
                    900: "#25537B",
                    950: "#1F4465",
                },
                // Galaxy-dark
                "ebony-clay": {
                    DEFAULT: "#2C3143",
                    50: "#DFE2EA",
                    100: "#D3D6E2",
                    200: "#BBC0D2",
                    300: "#A2A9C2",
                    400: "#8992B2",
                    500: "#717BA2",
                    600: "#5D678D",
                    700: "#4C5574",
                    800: "#3C435C",
                    900: "#2C3143", // default
                    950: "#212532",
                },
                // Galaxy bright highlight
                gold: {
                    DEFAULT: "#ffd700",
                    "50": "#ffffe7",
                    "100": "#feffc1",
                    "200": "#fffd86",
                    "300": "#fff441",
                    "400": "#ffe60d",
                    "500": "#ffd700",
                    "600": "#d19e00",
                    "700": "#a67102",
                    "800": "#89580a",
                    "900": "#74480f",
                    "950": "#442604",
                },
                // Galaxy grey, secondary color
                chicago: {
                    DEFAULT: "#58585a",
                    "50": "#f5f5f6", // background light
                    "100": "#e6e6e7",
                    "200": "#d0d0d1",
                    "300": "#afafb1",
                    "400": "#878789",
                    "500": "#6c6c6e",
                    "600": "#58585a",
                    "700": "#4f4e50",
                    "800": "#454446",
                    "900": "#3c3c3d",
                    "950": "#262626",
                },
                // Galaxy gold-ish color in logos
                "hokey-pokey": {
                    DEFAULT: "#D0BD2A",
                    50: "#F2ECBF",
                    100: "#EFE7AE",
                    200: "#E8DD8D",
                    300: "#E1D36B",
                    400: "#DACA49",
                    500: "#D0BD2A",
                    600: "#A19321",
                    700: "#736817",
                    800: "#443E0E",
                    900: "#151304",
                    950: "#000000",
                },
            },
        },
    },
};

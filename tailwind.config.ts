import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Team Topologies color scheme
        teamColors: {
          streamAligned: "#3B82F6",
          enabling: "#10B981",
          complicatedSubsystem: "#8B5CF6",
          platform: "#F59E0B",
        },
      },
    },
  },
  plugins: [],
};

export default config;

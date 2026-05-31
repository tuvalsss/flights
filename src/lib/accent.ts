export const accentGradient: Record<string, string> = {
  pitch: "from-pitch-500 to-pitch-700",
  royal: "from-royal-500 to-royal-700",
  gold: "from-gold-400 to-sunset-600",
  sunset: "from-sunset-400 to-sunset-600",
};

export function gradientFor(accent: string): string {
  return accentGradient[accent] ?? accentGradient.pitch;
}

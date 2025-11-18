import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/useColorScheme";

export function useTheme() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = Colors[colorScheme ?? "dark"];

  return {
    colors,
    isDark,
  };
}

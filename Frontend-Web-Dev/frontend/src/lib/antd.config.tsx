"use client";
import { ConfigProvider, theme as themeAntd } from "antd";
import { Theme } from "@/components/ThemeContext";
import { useTheme } from "@/components/ThemeContext";

export default function AntdConfigProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme } = useTheme();
  return (
    <ConfigProvider
      theme={{
        algorithm:
          theme === Theme.DARK_MODE
            ? themeAntd.darkAlgorithm
            : themeAntd.defaultAlgorithm,
        // token: {
        //   ...(theme === Theme.DARK_MODE && {
        //     colorText: theme === Theme.DARK_MODE ? "#d1d5db" : undefined,
        //     colorTextSecondary:
        //       theme === Theme.DARK_MODE ? "#9ca3af" : undefined,
        //     colorTextTertiary:
        //       theme === Theme.DARK_MODE ? "#6b7280" : undefined,
        //     colorTextQuaternary:
        //       theme === Theme.DARK_MODE ? "#4b5563" : undefined,
        //     colorBorder: theme === Theme.DARK_MODE ? "#374151" : undefined,
        //     colorBorderSecondary:
        //       theme === Theme.DARK_MODE ? "#4b5563" : undefined,
        //     colorFill: theme === Theme.DARK_MODE ? "#1f2937" : undefined,
        //     colorFillSecondary:
        //       theme === Theme.DARK_MODE ? "#374151" : undefined,
        //     colorFillTertiary:
        //       theme === Theme.DARK_MODE ? "#4b5563" : undefined,
        //     colorFillQuaternary:
        //       theme === Theme.DARK_MODE ? "#6b7280" : undefined,
        //     colorBgLayout: theme === Theme.DARK_MODE ? "#111827" : undefined,
        //     colorBgContainer: theme === Theme.DARK_MODE ? "#1f2937" : undefined,
        //     colorBgElevated: theme === Theme.DARK_MODE ? "#374151" : undefined,
        //     colorBgSpotlight: theme === Theme.DARK_MODE ? "#111827" : undefined,
        //     colorBgBlur: theme === Theme.DARK_MODE ? "#1f2937" : undefined,
        //     colorBgSolid: theme === Theme.DARK_MODE ? "#374151" : undefined,
        //     colorBgSolidActive:
        //       theme === Theme.DARK_MODE ? "#4b5563" : undefined,
        //     colorBgSolidHover:
        //       theme === Theme.DARK_MODE ? "#6b7280" : undefined,
        //     colorPrimary: theme === Theme.DARK_MODE ? "#2563eb" : undefined,
        //     colorPrimaryBg: theme === Theme.DARK_MODE ? "#1e40af" : undefined,
        //     colorPrimaryBgHover:
        //       theme === Theme.DARK_MODE ? "#1d4ed8" : undefined,
        //     colorPrimaryBorder:
        //       theme === Theme.DARK_MODE ? "#2563eb" : undefined,
        //     colorPrimaryBorderHover:
        //       theme === Theme.DARK_MODE ? "#1d4ed8" : undefined,
        //     colorPrimaryHover:
        //       theme === Theme.DARK_MODE ? "#3b82f6" : undefined,
        //     colorPrimaryActive:
        //       theme === Theme.DARK_MODE ? "#1e40af" : undefined,
        //     colorPrimaryTextHover:
        //       theme === Theme.DARK_MODE ? "#60a5fa" : undefined,
        //     colorPrimaryText: theme === Theme.DARK_MODE ? "#93c5fd" : undefined,
        //     colorPrimaryTextActive:
        //       theme === Theme.DARK_MODE ? "#2563eb" : undefined,
        //     colorSuccessBg: theme === Theme.DARK_MODE ? "#14532d" : undefined,
        //     colorSuccessBgHover:
        //       theme === Theme.DARK_MODE ? "#166534" : undefined,
        //     colorSuccessBorder:
        //       theme === Theme.DARK_MODE ? "#22c55e" : undefined,
        //     colorSuccessBorderHover:
        //       theme === Theme.DARK_MODE ? "#16a34a" : undefined,
        //     colorSuccessHover:
        //       theme === Theme.DARK_MODE ? "#22d3ee" : undefined,
        //     colorSuccess: theme === Theme.DARK_MODE ? "#22c55e" : undefined,
        //     colorSuccessActive:
        //       theme === Theme.DARK_MODE ? "#16a34a" : undefined,
        //     colorSuccessTextHover:
        //       theme === Theme.DARK_MODE ? "#bbf7d0" : undefined,
        //     colorSuccessTextActive:
        //       theme === Theme.DARK_MODE ? "#22c55e" : undefined,
        //     colorWarningBg: theme === Theme.DARK_MODE ? "#78350f" : undefined,
        //     colorWarningBgHover:
        //       theme === Theme.DARK_MODE ? "#92400e" : undefined,
        //     colorWarningBorder:
        //       theme === Theme.DARK_MODE ? "#f59e42" : undefined,
        //     colorWarningBorderHover:
        //       theme === Theme.DARK_MODE ? "#fbbf24" : undefined,
        //     colorWarningHover:
        //       theme === Theme.DARK_MODE ? "#fde68a" : undefined,
        //     colorWarning: theme === Theme.DARK_MODE ? "#f59e42" : undefined,
        //     colorWarningActive:
        //       theme === Theme.DARK_MODE ? "#fbbf24" : undefined,
        //     colorWarningTextHover:
        //       theme === Theme.DARK_MODE ? "#fde68a" : undefined,
        //     colorWarningText: theme === Theme.DARK_MODE ? "#fbbf24" : undefined,
        //     colorWarningTextActive:
        //       theme === Theme.DARK_MODE ? "#f59e42" : undefined,
        //     colorInfoBg: theme === Theme.DARK_MODE ? "#1e293b" : undefined,
        //     colorInfoBgHover: theme === Theme.DARK_MODE ? "#334155" : undefined,
        //     colorInfoBorder: theme === Theme.DARK_MODE ? "#38bdf8" : undefined,
        //     colorInfoBorderHover:
        //       theme === Theme.DARK_MODE ? "#0ea5e9" : undefined,
        //     colorInfoHover: theme === Theme.DARK_MODE ? "#38bdf8" : undefined,
        //     colorInfo: theme === Theme.DARK_MODE ? "#0ea5e9" : undefined,
        //     colorInfoActive: theme === Theme.DARK_MODE ? "#0369a1" : undefined,
        //     colorInfoTextHover:
        //       theme === Theme.DARK_MODE ? "#bae6fd" : undefined,
        //     colorInfoText: theme === Theme.DARK_MODE ? "#7dd3fc" : undefined,
        //     colorInfoTextActive:
        //       theme === Theme.DARK_MODE ? "#0ea5e9" : undefined,
        //     colorErrorBg: theme === Theme.DARK_MODE ? "#7f1d1d" : undefined,
        //     colorErrorBgHover:
        //       theme === Theme.DARK_MODE ? "#991b1b" : undefined,
        //     colorErrorBgFilledHover:
        //       theme === Theme.DARK_MODE ? "#ef4444" : undefined,
        //     colorErrorBgActive:
        //       theme === Theme.DARK_MODE ? "#b91c1c" : undefined,
        //     colorErrorBorder: theme === Theme.DARK_MODE ? "#ef4444" : undefined,
        //     colorErrorBorderHover:
        //       theme === Theme.DARK_MODE ? "#dc2626" : undefined,
        //     colorErrorHover: theme === Theme.DARK_MODE ? "#f87171" : undefined,
        //     colorError: theme === Theme.DARK_MODE ? "#ef4444" : undefined,
        //     colorErrorActive: theme === Theme.DARK_MODE ? "#b91c1c" : undefined,
        //     colorErrorTextHover:
        //       theme === Theme.DARK_MODE ? "#fecaca" : undefined,
        //     colorErrorText: theme === Theme.DARK_MODE ? "#fca5a5" : undefined,
        //     colorErrorTextActive:
        //       theme === Theme.DARK_MODE ? "#ef4444" : undefined,
        //     colorLink: theme === Theme.DARK_MODE ? "#60a5fa" : undefined,
        //     colorLinkHover: theme === Theme.DARK_MODE ? "#93c5fd" : undefined,
        //     colorLinkActive: theme === Theme.DARK_MODE ? "#2563eb" : undefined,
        //     colorWhite: theme === Theme.DARK_MODE ? "#fff" : undefined,
        //     colorBgMask:
        //       theme === Theme.DARK_MODE ? "rgba(17,24,39,0.6)" : undefined,
        //     colorFillContentHover:
        //       theme === Theme.DARK_MODE ? "#374151" : undefined,
        //     colorFillAlter: theme === Theme.DARK_MODE ? "#111827" : undefined,
        //     colorFillContent: theme === Theme.DARK_MODE ? "#1f2937" : undefined,
        //     colorBgContainerDisabled:
        //       theme === Theme.DARK_MODE ? "#374151" : undefined,
        //     colorBgTextHover: theme === Theme.DARK_MODE ? "#374151" : undefined,
        //     colorBgTextActive:
        //       theme === Theme.DARK_MODE ? "#4b5563" : undefined,
        //     colorBorderBg: theme === Theme.DARK_MODE ? "#1f2937" : undefined,
        //     colorSplit: theme === Theme.DARK_MODE ? "#374151" : undefined,
        //     colorTextPlaceholder:
        //       theme === Theme.DARK_MODE ? "#6b7280" : undefined,
        //     colorTextDisabled:
        //       theme === Theme.DARK_MODE ? "#6b7280" : undefined,
        //     colorTextHeading: theme === Theme.DARK_MODE ? "#d1d5db" : undefined,
        //     colorTextLabel: theme === Theme.DARK_MODE ? "#9ca3af" : undefined,
        //     colorTextDescription:
        //       theme === Theme.DARK_MODE ? "#6b7280" : undefined,
        //     colorTextLightSolid: theme === Theme.DARK_MODE ? "#fff" : undefined,
        //     colorIcon: theme === Theme.DARK_MODE ? "#9ca3af" : undefined,
        //     colorIconHover: theme === Theme.DARK_MODE ? "#d1d5db" : undefined,
        //     colorHighlight: theme === Theme.DARK_MODE ? "#2563eb" : undefined,
        //     controlOutline: theme === Theme.DARK_MODE ? "#2563eb" : undefined,
        //     colorWarningOutline:
        //       theme === Theme.DARK_MODE ? "#fbbf24" : undefined,
        //     colorErrorOutline:
        //       theme === Theme.DARK_MODE ? "#ef4444" : undefined,
        //   }),
        // },
        components: {
          //     DatePicker: {},
          //     Select: {
          //     },
          //   Form: {
          //   },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}

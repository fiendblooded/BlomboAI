import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      background: string;
      cardBackground: string;
      text: string;
      textSecondary: string;
      textMuted: string;
      border: string;
      borderFocus: string;
      primary: string;
      primaryText: string;
      secondary: string;
      secondaryText: string;
      secondaryBorder: string;
      danger: string;
      success: string;
      error: string;
      errorBackground: string;
      successBackground: string;
      gradientOverlay: string;
      shadow: string;
      shadowHover: string;
    };
  }
}

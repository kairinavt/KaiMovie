import 'package:flutter/material.dart';

class AppTheme {
  static const Color backgroundColor = Color(0xFF0E0F13);
  static const Color surfaceColor = Color(0xFF15171C);
  static const Color cardColor = Color(0xFF1E2028);
  static const Color primaryColor = Color(0xFFE50914); // Accent Red
  static const Color secondaryColor = Color(0xFFFF9900);
  static const Color textColor = Color(0xFFEEEEEE);
  static const Color subtextColor = Color(0xFFA0A5B5);

  static ThemeData get darkTheme {
    return ThemeData.dark().copyWith(
      scaffoldBackgroundColor: backgroundColor,
      primaryColor: primaryColor,
      colorScheme: const ColorScheme.dark(
        primary: primaryColor,
        secondary: secondaryColor,
        surface: surfaceColor,
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: surfaceColor,
        elevation: 0,
        centerTitle: true,
      ),
      cardTheme: const CardThemeData(
        color: cardColor,
        elevation: 4,
        margin: EdgeInsets.all(8),
      ),
    );
  }
}

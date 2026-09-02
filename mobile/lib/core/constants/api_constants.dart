class ApiConstants {
  static const String baseUrl = String.fromEnvironment(
    'API_BASE_URL',
    defaultValue: 'http://10.0.2.2:5000/api/v1',
  );

  static const String moviesEndpoint = '$baseUrl/movies';
  static const String authEndpoint = '$baseUrl/auth';
  static const String favoritesEndpoint = '$baseUrl/favorites';
  static const String historyEndpoint = '$baseUrl/history';
  static const String ratingsEndpoint = '$baseUrl/ratings';
  static const String commentsEndpoint = '$baseUrl/comments';
  static const String versionEndpoint = '$baseUrl/app/version';
}

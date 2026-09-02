import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/main.dart';

void main() {
  testWidgets('KaiMovieApp smoke test', (WidgetTester tester) async {
    await tester.pumpWidget(const KaiMovieApp());
    expect(find.text('KaiMovie'), findsOneWidget);
  });
}

import 'dart:io';

import 'package:app/app_config.dart';
import 'package:app/main_common.dart';

import 'package:app/blocs/blocs.dart';
import 'package:app/screens/on_boarding/splash_screen.dart';

import 'package:app/services/hive_service.dart';
import 'package:app/services/native_api.dart';
import 'package:app/services/notification_service.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_crashlytics/firebase_crashlytics.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:sentry_flutter/sentry_flutter.dart';

import 'blocs/feedback/feedback_bloc.dart';
import 'blocs/insights/insights_bloc.dart';
import 'blocs/map/map_bloc.dart';
import 'blocs/nearby_location/nearby_location_bloc.dart';
import 'blocs/search/search_bloc.dart';
import 'constants/config.dart';
import 'firebase_options.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );

  await Future.wait([
    HiveService.initialize(),
    SystemProperties.setDefault(),
    NotificationService.listenToNotifications(),
    dotenv.load(fileName: Config.environmentFile),
    // initializeBackgroundServices()
  ]);
  HttpOverrides.global = AppHttpOverrides();

  var configuredApp = const AppConfig(
    appTitle: 'AirQo',
    environment: Environment.prod,
    child: AirQoApp(),
  );

  if (kReleaseMode) {
    FlutterError.onError = FirebaseCrashlytics.instance.recordFlutterFatalError;
    await SentryFlutter.init(
      (options) {
        options
          ..dsn = Config.sentryDsn
          ..enableOutOfMemoryTracking = true
          ..tracesSampleRate = 1.0;
      },
      appRunner: () => runApp(configuredApp),
    );
  } else {
    runApp(configuredApp);
  }
}

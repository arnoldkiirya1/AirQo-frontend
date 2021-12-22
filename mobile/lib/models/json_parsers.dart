import 'package:app/models/measurement_value.dart';
import 'package:flutter/foundation.dart';

import 'measurement.dart';

bool boolFromJson(dynamic json) {
  return '$json' == 'true' ? true : false;
}

String boolToJson(bool boolValue) {
  return boolValue ? 'true' : 'false';
}

MeasurementValue measurementValueFromJson(dynamic json) {
  if (json == null) {
    return MeasurementValue(value: -0.1, calibratedValue: -0.1);
  }
  return MeasurementValue.fromJson(json);
}

Measurement parseMeasurement(dynamic jsonBody) {
  var measurements = parseMeasurements(jsonBody);
  return measurements.first;
}

List<Measurement> parseMeasurements(dynamic jsonBody) {
  var measurements = <Measurement>[];

  var jsonArray = jsonBody['measurements'];
  var offSet = DateTime.now().timeZoneOffset.inHours;
  for (var jsonElement in jsonArray) {
    try {
      var measurement = Measurement.fromJson(jsonElement);
      var value = measurement.getPm2_5Value();
      if (value != -0.1 && value >= 0.00 && value <= 500.40) {
        var formattedDate =
            DateTime.parse(measurement.time).add(Duration(hours: offSet));
        measurement.time = formattedDate.toString();
        measurements.add(measurement);
      }
    } catch (exception, stackTrace) {
      debugPrint('$exception\n$stackTrace');
    }
  }
  measurements.sort((siteA, siteB) => siteA.site
      .getName()
      .toLowerCase()
      .compareTo(siteB.site.getName().toLowerCase()));

  return measurements;
}

String siteIdFromJson(dynamic _) {
  return 'siteId';
}

String siteIdToJson(String _) {
  return 'site_id';
}

DateTime timeFromJson(dynamic json) {
  return DateTime.parse('$json');
}

String timeToJson(DateTime dateTime) {
  return dateTime.toString();
}

import 'package:app/models/models.dart';
import 'package:app/services/app_service.dart';
import 'package:app/utils/utils.dart';
import 'package:equatable/equatable.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

part 'insights_event.dart';
part 'insights_state.dart';

class InsightsBloc extends Bloc<InsightsEvent, InsightsState> {
  InsightsBloc() : super(const InsightsState()) {
    on<InitializeInsightsPage>(_onInitializeInsightsPage);
    on<SwitchInsight>(_onSwitchInsight);
    on<ClearInsight>(_onClearInsight);
  }

  void _onSwitchInsight(SwitchInsight event, Emitter<InsightsState> emit) {
    return emit(state.copyWith(
      selectedInsight: event.insight,
    ));
  }

  void _onClearInsight(ClearInsight event, Emitter<InsightsState> emit) {
    return emit(const InsightsState());
  }

  Future<void> _onInitializeInsightsPage(
    InitializeInsightsPage event,
    Emitter<InsightsState> emit,
  ) async {
    emit(const InsightsState());

    Set<Insight> insights = {};
    insights.add(Insight.fromAirQualityReading(event.airQualityReading));

    List<Forecast> forecastData = await AirQoDatabase()
        .getForecast(event.airQualityReading.referenceSite);
    for (Forecast forecast in forecastData) {
      insights.add(Insight.fromAirQualityReading(event.airQualityReading
          .copyWith(pm2_5: forecast.pm2_5, dateTime: forecast.time)));
    }

    while (insights.length <= 6) {
      DateTime nextDay = insights.last.dateTime.add(const Duration(days: 1));
      insights.add(Insight.initializeEmpty(event.airQualityReading, nextDay));
    }

    setInsights(emit, insights, event.airQualityReading);

    forecastData = await AppService.fetchInsightsData(
      event.airQualityReading.referenceSite,
    );

    if (forecastData.isEmpty) {
      return;
    }

    for (Forecast forecast in forecastData) {
      insights
          .removeWhere((element) => element.dateTime.day == forecast.time.day);
      insights.add(Insight.fromAirQualityReading(event.airQualityReading
          .copyWith(pm2_5: forecast.pm2_5, dateTime: forecast.time)));
    }

    setInsights(emit, insights, event.airQualityReading);
  }

  void setInsights(
    Emitter<InsightsState> emit,
    Set<Insight> insights,
    AirQualityReading airQualityReading,
  ) {
    emit(
      state.copyWith(
        selectedInsight: insights.firstWhere(
          (element) => element.dateTime.day == airQualityReading.dateTime.day,
        ),
        insights: insights.toList().sortByDateTime().take(7).toList(),
      ),
    );
  }
}

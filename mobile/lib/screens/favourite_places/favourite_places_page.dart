import 'package:app/blocs/blocs.dart';
import 'package:app/constants/config.dart';
import 'package:app/models/models.dart';
import 'package:app/screens/analytics/analytics_widgets.dart';
import 'package:app/services/services.dart';
import 'package:app/themes/theme.dart';
import 'package:app/widgets/widgets.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:hive_flutter/hive_flutter.dart';

import 'favourite_places_widgets.dart';

class FavouritePlacesPage extends StatelessWidget {
  const FavouritePlacesPage({super.key});

  @override
  Widget build(BuildContext context) {
    final appColors = Theme.of(context).extension<AppColors>()!;

    return Scaffold(
      appBar: const AppTopBar('Favorites'),
      body: AppSafeArea(
        widget: BlocBuilder<AccountBloc, AccountState>(
            buildWhen: (previous, current) {
          return previous.favouritePlaces != current.favouritePlaces;
        }, builder: (context, state) {
          if (state.favouritePlaces.isEmpty) {
            context.read<AccountBloc>().add(RefreshFavouritePlaces());
          }

          return Column(
            children: [
              Visibility(
                visible: state.favouritePlaces.isEmpty,
                child: Container(), // TODO replace with error page
              ),
              Visibility(
                visible: state.favouritePlaces.isNotEmpty,
                child: AppRefreshIndicator(
                  sliverChildDelegate: SliverChildBuilderDelegate(
                    (context, index) {
                      final airQualityReading = Hive.box<AirQualityReading>(
                              HiveBox.airQualityReadings)
                          .get(state.favouritePlaces[index].referenceSite);
                      final favouritePlace = state.favouritePlaces[index];

                      if (airQualityReading == null) {
                        return EmptyFavouritePlace(
                          airQualityReading:
                              AirQualityReading.fromFavouritePlace(
                                  favouritePlace),
                        );
                      }

                      return Padding(
                        padding: EdgeInsets.fromLTRB(
                          16,
                          Config.refreshIndicatorPadding(index),
                          16,
                          0,
                        ),
                        child: MiniAnalyticsCard(
                          airQualityReading
                              .populateFavouritePlace(favouritePlace),
                          animateOnClick: false,
                        ),
                      );
                    },
                    childCount: state.favouritePlaces.length,
                  ),
                  onRefresh: () async {
                    await _refresh(context);
                  },
                ),
              ),
            ],
          );
        }),
      ),
    );
  }

  Future<void> _refresh(BuildContext context) async {
    context.read<AccountBloc>().add(RefreshFavouritePlaces());
  }
}

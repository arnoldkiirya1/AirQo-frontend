import 'package:app/blocs/blocs.dart';
import 'package:app/models/models.dart';
import 'package:app/services/services.dart';
import 'package:app/themes/theme.dart';
import 'package:app/widgets/widgets.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../auth/auth_verification.dart';
import '../feedback/feedback_page.dart';
import 'about_page.dart';
import 'settings_page_widgets.dart';

class SettingsPage extends StatefulWidget {
  const SettingsPage({
    super.key,
  });

  @override
  State<SettingsPage> createState() => _SettingsPageState();
}

class _SettingsPageState extends State<SettingsPage> {
  late BuildContext _loadingContext;

  @override
  void initState() {
    super.initState();
    _loadingContext = context;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const AppTopBar('Settings'),
      body: AppSafeArea(
          verticalPadding: 8.0,
          horizontalPadding: 16.0,
          widget: BlocBuilder<AccountBloc, AccountState>(
              buildWhen: (previous, current) {
            return previous.guestUser != current.guestUser;
          }, builder: (context, state) {
            final profile = state.profile;

            if (profile == null) {
              Profile.getProfile(); // TODO reload profile
              return Container(); // TODO replace with error page
            }

            return Column(
              mainAxisSize: MainAxisSize.min,
              children: <Widget>[
                Expanded(
                  child: ListView(
                    children: [
                      const SizedBox(
                        height: 31,
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(vertical: 10),
                        decoration: const BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.all(
                            Radius.circular(8.0),
                          ),
                        ),
                        child: Column(
                          children: [
                            ListTile(
                              title: Text(
                                'Location',
                                overflow: TextOverflow.ellipsis,
                                style: Theme.of(context).textTheme.bodyText1,
                              ),
                              trailing: CupertinoSwitch(
                                activeColor: CustomColors.appColorBlue,
                                onChanged: (bool value) {
                                  switch (value) {
                                    case true:
                                      LocationService.allowLocationAccess();
                                      break;
                                    case false:
                                      LocationService.revokePermission();
                                      break;
                                  }
                                },
                                value: profile.preferences.location,
                              ),
                            ),
                            Divider(
                              color: CustomColors.appBodyColor,
                            ),
                            ListTile(
                              title: Text(
                                'Notification',
                                overflow: TextOverflow.ellipsis,
                                style: Theme.of(context).textTheme.bodyText1,
                              ),
                              trailing: CupertinoSwitch(
                                activeColor: CustomColors.appColorBlue,
                                onChanged: (bool value) {
                                  switch (value) {
                                    case true:
                                      NotificationService.allowNotifications();
                                      break;
                                    case false:
                                      NotificationService.revokePermission();
                                      break;
                                  }
                                },
                                value: profile.preferences.notifications,
                              ),
                            ),
                            Divider(
                              color: CustomColors.appBodyColor,
                            ),
                            GestureDetector(
                              onTap: () async {
                                await Navigator.push(
                                  context,
                                  MaterialPageRoute(
                                    builder: (context) {
                                      return const FeedbackPage();
                                    },
                                  ),
                                );
                              },
                              child: const SettingsCard(text: 'Send feedback'),
                            ),
                            Divider(
                              color: CustomColors.appBodyColor,
                            ),
                            GestureDetector(
                              onTap: () async {
                                await RateService.rateApp();
                              },
                              child: const SettingsCard(
                                text: 'Rate the AirQo App',
                              ),
                            ),
                            Divider(
                              color: CustomColors.appBodyColor,
                            ),
                            GestureDetector(
                              onTap: () async {
                                await Navigator.push(
                                  context,
                                  MaterialPageRoute(
                                    builder: (context) {
                                      return const AboutAirQo();
                                    },
                                  ),
                                );
                              },
                              child: const SettingsCard(text: 'About'),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
                Visibility(
                  visible: !state.guestUser,
                  child: DeleteAccountButton(
                    deleteAccount: _deleteAccount,
                  ),
                ),
                MultiBlocListener(
                  listeners: [
                    BlocListener<AccountBloc, AccountState>(
                      listener: (context, state) {
                        loadingScreen(_loadingContext);
                      },
                      listenWhen: (previous, current) {
                        return current.blocStatus == BlocStatus.processing;
                      },
                    ),
                    BlocListener<AccountBloc, AccountState>(
                      listener: (context, state) {
                        Navigator.pop(_loadingContext);
                      },
                      listenWhen: (previous, current) {
                        return previous.blocStatus == BlocStatus.processing;
                      },
                    ),
                    BlocListener<AccountBloc, AccountState>(
                      listener: (context, state) {
                        showSnackBar(context, state.blocError.message);
                      },
                      listenWhen: (previous, current) {
                        return current.blocStatus == BlocStatus.error &&
                            current.blocError != AuthenticationError.none;
                      },
                    ),
                    BlocListener<AccountBloc, AccountState>(
                      listener: (context, state) {
                        Navigator.push(
                          context,
                          MaterialPageRoute(builder: (context) {
                            return const AuthVerificationWidget();
                          }),
                        );
                      },
                      listenWhen: (previous, current) {
                        return current.blocStatus ==
                            BlocStatus.accountDeletionCheckSuccess;
                      },
                    ),
                  ],
                  child: Container(),
                ),
              ],
            );
          })),
    );
  }

  void _deleteAccount() {
    context.read<AccountBloc>().add(DeleteAccount(context: context));
  }
}

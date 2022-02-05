import 'package:app/auth/signup_screen.dart';
import 'package:app/constants/config.dart';
import 'package:app/services/app_service.dart';
import 'package:app/utils/dialogs.dart';
import 'package:app/widgets/buttons.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';

class WelcomeScreen extends StatefulWidget {
  const WelcomeScreen({Key? key}) : super(key: key);

  @override
  WelcomeScreenState createState() => WelcomeScreenState();
}

class WelcomeScreenState extends State<WelcomeScreen> {
  DateTime? _exitTime;
  late AppService _appService;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        body: WillPopScope(
      onWillPop: onWillPop,
      child: Padding(
        padding: const EdgeInsets.fromLTRB(24, 56, 24.0, 96),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          const Text(
            'Welcome to',
            style: TextStyle(
                fontWeight: FontWeight.bold, fontSize: 32, color: Colors.black),
          ),
          Text(
            'AirQo',
            style: TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 32,
                color: Config.appColorBlue),
          ),
          const SizedBox(
            height: 21,
          ),
          welcomeSection(
              'Save your favorite places',
              'Keep track of air quality in locations that matter to you',
              'assets/icon/onboarding_fav.svg'),
          const SizedBox(
            height: 24,
          ),
          welcomeSection(
              'New experiences for You',
              'Access analytics and content curated just for you',
              'assets/icon/onboarding_hash_tag.svg'),
          const SizedBox(
            height: 24,
          ),
          welcomeSection(
              'Know your air on the go',
              'An easy way to plan your outdoor activities to minimise'
                  ' excessive exposure to bad air quality ',
              'assets/icon/onboarding_profile_icon.svg'),
          const Spacer(),
          GestureDetector(
            onTap: () {
              Navigator.pushAndRemoveUntil(context,
                  MaterialPageRoute(builder: (context) {
                return const SignupScreen(false);
              }), (r) => false);
            },
            child: nextButton('Let’s go', Config.appColorBlue),
          ),
        ]),
      ),
    ));
  }

  @override
  void initState() {
    _appService = AppService(context);
    updateOnBoardingPage();
    super.initState();
  }

  Future<bool> onWillPop() {
    var now = DateTime.now();

    if (_exitTime == null ||
        now.difference(_exitTime!) > const Duration(seconds: 2)) {
      _exitTime = now;

      showSnackBar(context, 'Tap again to exit !');
      return Future.value(false);
    }
    return Future.value(true);
  }

  void updateOnBoardingPage() async {
    await _appService.preferencesHelper.updateOnBoardingPage('welcome');
  }

  Widget welcomeSection(
    String header,
    String body,
    String svg,
  ) {
    return ListTile(
        contentPadding: const EdgeInsets.only(left: 0.0, right: 20),
        horizontalTitleGap: 16,
        leading: SizedBox(
          height: 40,
          width: 40,
          child: SvgPicture.asset(
            svg,
          ),
        ),
        title: Text(
          header,
          style: const TextStyle(
              fontWeight: FontWeight.bold, fontSize: 16, color: Colors.black),
        ),
        subtitle: Padding(
          padding: const EdgeInsets.only(top: 4.0),
          child: Text(
            body,
            style:
                TextStyle(fontSize: 14, color: Colors.black.withOpacity(0.5)),
          ),
        ));
  }
}

import 'dart:math' as math;
import 'package:flutter/material.dart';

void main() => runApp(const AlgorithmosApp());

class AppColors {
  static const ink = Color(0xFF06101F);
  static const navy = Color(0xFF091A33);
  static const blue = Color(0xFF216BFF);
  static const electric = Color(0xFF75A7FF);
  static const mist = Color(0xFFB9D0FF);
  static const white = Color(0xFFF5F8FF);
  static const muted = Color(0xFF9AA8BD);
}

class AlgorithmosApp extends StatelessWidget {
  const AlgorithmosApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Алгоритмос — Digital engineering',
      theme: ThemeData(
        useMaterial3: true,
        brightness: Brightness.dark,
        scaffoldBackgroundColor: AppColors.ink,
        fontFamily: 'Arial',
      ),
      home: const OrbitLandingPage(),
    );
  }
}

class OrbitLandingPage extends StatefulWidget {
  const OrbitLandingPage({super.key});

  @override
  State<OrbitLandingPage> createState() => _OrbitLandingPageState();
}

class _OrbitLandingPageState extends State<OrbitLandingPage>
    with TickerProviderStateMixin {
  late final AnimationController _orbitController;
  late final AnimationController _introController;
  bool _menuOpen = false;

  @override
  void initState() {
    super.initState();
    _orbitController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 16),
    )..repeat();
    _introController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 900),
    )..forward();
  }

  @override
  void dispose() {
    _orbitController.dispose();
    _introController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final reduceMotion = MediaQuery.of(context).disableAnimations;
    final width = MediaQuery.sizeOf(context).width;
    final compact = width < 760;
    final tablet = width < 1050;

    if (reduceMotion && _orbitController.isAnimating) _orbitController.stop();
    if (!reduceMotion && !_orbitController.isAnimating) _orbitController.repeat();

    return Scaffold(
      body: Stack(
        children: [
          const Positioned.fill(child: _Atmosphere()),
          SafeArea(
            child: Column(
              children: [
                _Header(
                  compact: compact,
                  menuOpen: _menuOpen,
                  onMenu: () => setState(() => _menuOpen = !_menuOpen),
                ),
                if (compact && _menuOpen) const _MobileMenu(),
                Expanded(
                  child: SingleChildScrollView(
                    child: Padding(
                      padding: EdgeInsets.fromLTRB(
                        compact ? 24 : 48,
                        compact ? 32 : 56,
                        compact ? 24 : 48,
                        30,
                      ),
                      child: ConstrainedBox(
                        constraints: const BoxConstraints(maxWidth: 1440),
                        child: Column(
                          children: [
                            _Hero(
                              compact: compact,
                              tablet: tablet,
                              orbit: reduceMotion
                                  ? const AlwaysStoppedAnimation<double>(0)
                                  : _orbitController,
                              intro: _introController,
                            ),
                            const SizedBox(height: 54),
                            const _Stats(),
                          ],
                        ),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _Atmosphere extends StatelessWidget {
  const _Atmosphere();

  @override
  Widget build(BuildContext context) {
    return DecoratedBox(
      decoration: const BoxDecoration(
        gradient: RadialGradient(
          center: Alignment(0.72, -0.22),
          radius: 1.2,
          colors: [Color(0xFF123B84), AppColors.navy, AppColors.ink],
          stops: [0, .38, 1],
        ),
      ),
      child: CustomPaint(painter: _GrainPainter()),
    );
  }
}

class _Header extends StatelessWidget {
  const _Header({
    required this.compact,
    required this.menuOpen,
    required this.onMenu,
  });

  final bool compact;
  final bool menuOpen;
  final VoidCallback onMenu;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.symmetric(horizontal: compact ? 24 : 48, vertical: 20),
      child: ConstrainedBox(
        constraints: const BoxConstraints(maxWidth: 1440),
        child: Row(
          children: [
            const _Brand(),
            const Spacer(),
            if (!compact) ...[
              const _NavLink('Услуги'),
              const _NavLink('Кейсы'),
              const _NavLink('Подход'),
              const _NavLink('О нас'),
              const SizedBox(width: 30),
              const _HeaderButton(),
            ] else
              IconButton(
                onPressed: onMenu,
                tooltip: menuOpen ? 'Закрыть меню' : 'Открыть меню',
                icon: Icon(menuOpen ? Icons.close_rounded : Icons.menu_rounded),
              ),
          ],
        ),
      ),
    );
  }
}

class _Brand extends StatelessWidget {
  const _Brand();

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Container(
          width: 30,
          height: 30,
          decoration: BoxDecoration(
            color: AppColors.blue,
            borderRadius: BorderRadius.circular(9),
            boxShadow: const [BoxShadow(color: Color(0x88216BFF), blurRadius: 18)],
          ),
          child: const Icon(Icons.all_inclusive_rounded, size: 22, color: Colors.white),
        ),
        const SizedBox(width: 10),
        const Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('АЛГОРИТМОС', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 15, letterSpacing: 1.5)),
            SizedBox(height: 2),
            Text('DIGITAL ENGINEERING', style: TextStyle(color: AppColors.muted, fontSize: 7.5, letterSpacing: 1.1)),
          ],
        ),
      ],
    );
  }
}

class _NavLink extends StatelessWidget {
  const _NavLink(this.label);
  final String label;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 14),
      child: TextButton(
        onPressed: () {},
        style: TextButton.styleFrom(foregroundColor: AppColors.mist),
        child: Text(label, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w500)),
      ),
    );
  }
}

class _HeaderButton extends StatelessWidget {
  const _HeaderButton();

  @override
  Widget build(BuildContext context) => FilledButton(
        onPressed: () {},
        style: FilledButton.styleFrom(
          backgroundColor: const Color(0x1AFFFFFF),
          foregroundColor: AppColors.white,
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(10),
            side: const BorderSide(color: Color(0x335FA1FF)),
          ),
        ),
        child: const Text('Обсудить проект'),
      );
}

class _MobileMenu extends StatelessWidget {
  const _MobileMenu();

  @override
  Widget build(BuildContext context) => Container(
        margin: const EdgeInsets.fromLTRB(24, 0, 24, 8),
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: const Color(0xEE0A1930),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: const Color(0x335FA1FF)),
        ),
        child: const Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            _MobileLink('Услуги'), _MobileLink('Кейсы'), _MobileLink('Подход'), _MobileLink('О нас'), _HeaderButton(),
          ],
        ),
      );
}

class _MobileLink extends StatelessWidget {
  const _MobileLink(this.label);
  final String label;
  @override
  Widget build(BuildContext context) => TextButton(
        onPressed: () {},
        style: TextButton.styleFrom(alignment: Alignment.centerLeft, foregroundColor: AppColors.white),
        child: Text(label),
      );
}

class _Hero extends StatelessWidget {
  const _Hero({required this.compact, required this.tablet, required this.orbit, required this.intro});
  final bool compact;
  final bool tablet;
  final Animation<double> orbit;
  final Animation<double> intro;

  @override
  Widget build(BuildContext context) {
    final copy = FadeTransition(
      opacity: CurvedAnimation(parent: intro, curve: Curves.easeOut),
      child: SlideTransition(
        position: Tween<Offset>(begin: const Offset(0, .08), end: Offset.zero)
            .animate(CurvedAnimation(parent: intro, curve: Curves.easeOutCubic)),
        child: const _HeroCopy(),
      ),
    );
    final art = AspectRatio(
      aspectRatio: compact ? 1.08 : 1.15,
      child: _OrbitArtwork(animation: orbit),
    );

    return LayoutBuilder(
      builder: (context, constraints) {
        if (tablet) return Column(children: [copy, const SizedBox(height: 28), art]);
        return SizedBox(
          height: math.min(610.0, constraints.maxWidth * .46),
          child: Row(children: [Expanded(flex: 10, child: copy), const SizedBox(width: 18), Expanded(flex: 11, child: art)]),
        );
      },
    );
  }
}

class _HeroCopy extends StatelessWidget {
  const _HeroCopy();

  @override
  Widget build(BuildContext context) {
    return Align(
      alignment: Alignment.centerLeft,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 7),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(30),
              color: const Color(0x1A75A7FF),
              border: Border.all(color: const Color(0x335FA1FF)),
            ),
            child: const Text('РАЗРАБОТКА ПОД КЛЮЧ', style: TextStyle(color: AppColors.electric, fontSize: 11, letterSpacing: 1.4, fontWeight: FontWeight.w700)),
          ),
          const SizedBox(height: 28),
          const Text('Сложные цифровые\nсистемы', style: TextStyle(fontSize: 56, height: .99, fontWeight: FontWeight.w800, letterSpacing: -2.6)),
          const Text('без компромиссов.', style: TextStyle(color: AppColors.electric, fontSize: 56, height: .99, fontWeight: FontWeight.w800, letterSpacing: -2.6)),
          const SizedBox(height: 25),
          const ConstrainedBox(
            constraints: BoxConstraints(maxWidth: 490),
            child: Text('Берем в работу продукт целиком: от стратегии и UX до архитектуры, разработки и роста после запуска.', style: TextStyle(color: AppColors.muted, height: 1.55, fontSize: 17)),
          ),
          const SizedBox(height: 32),
          Wrap(spacing: 14, runSpacing: 14, children: [_PrimaryButton(), _SecondaryButton()]),
        ],
      ),
    );
  }
}

class _PrimaryButton extends StatefulWidget {
  const _PrimaryButton();
  @override
  State<_PrimaryButton> createState() => _PrimaryButtonState();
}

class _PrimaryButtonState extends State<_PrimaryButton> {
  bool hover = false;
  @override
  Widget build(BuildContext context) => MouseRegion(
        onEnter: (_) => setState(() => hover = true),
        onExit: (_) => setState(() => hover = false),
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 180),
          transform: Matrix4.translationValues(hover ? 0 : 0, hover ? -3 : 0, 0),
          decoration: BoxDecoration(
            color: AppColors.blue,
            borderRadius: BorderRadius.circular(11),
            boxShadow: hover ? const [BoxShadow(color: Color(0xAA216BFF), blurRadius: 24, offset: Offset(0, 8))] : null,
          ),
          child: TextButton.icon(
            onPressed: () {},
            icon: const Icon(Icons.arrow_forward_rounded, color: Colors.white, size: 18),
            label: const Text('Запустить проект'),
            style: TextButton.styleFrom(foregroundColor: Colors.white, padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 17)),
          ),
        ),
      );
}

class _SecondaryButton extends StatelessWidget {
  const _SecondaryButton();
  @override
  Widget build(BuildContext context) => OutlinedButton(
        onPressed: () {},
        style: OutlinedButton.styleFrom(foregroundColor: AppColors.white, side: const BorderSide(color: Color(0x6675A7FF)), padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 17), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(11))),
        child: const Text('Наши кейсы'),
      );
}

class _OrbitArtwork extends StatelessWidget {
  const _OrbitArtwork({required this.animation});
  final Animation<double> animation;

  @override
  Widget build(BuildContext context) => AnimatedBuilder(
        animation: animation,
        builder: (context, _) => CustomPaint(
          painter: _OrbitPainter(animation.value),
          child: const SizedBox.expand(),
        ),
      );
}

class _OrbitPainter extends CustomPainter {
  _OrbitPainter(this.t);
  final double t;

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width * .52, size.height * .52);
    final r = math.min(size.width, size.height) * .305;
    final pulse = 1 + math.sin(t * math.pi * 2) * .025;
    canvas.save();
    canvas.translate(center.dx, center.dy);
    canvas.scale(pulse);

    final glow = Paint()..color = const Color(0x55216BFF)..maskFilter = const MaskFilter.blur(BlurStyle.normal, 46);
    canvas.drawOval(Rect.fromCenter(center: Offset.zero, width: r * 2.75, height: r * 1.45), glow);

    _drawRing(canvas, r, -0.36 + t * math.pi * 2, const [Color(0xFF0E378F), Color(0xFF3F8DFF), Color(0xFFB8DBFF)], 1.0);
    _drawRing(canvas, r * .78, math.pi * .48 - t * math.pi * 2, const [Color(0xFF07162D), Color(0xFF1466F3), Color(0xFF94C6FF)], .72);
    _drawCore(canvas, r);
    _drawParticles(canvas, r);
    canvas.restore();
  }

  void _drawRing(Canvas canvas, double r, double turn, List<Color> colors, double squish) {
    canvas.save();
    canvas.rotate(turn);
    canvas.scale(1, squish);
    final outer = Rect.fromCenter(center: Offset.zero, width: r * 2.8, height: r * 1.04);
    final shader = SweepGradient(colors: colors, stops: const [0, .62, 1], transform: GradientRotation(turn * .35)).createShader(outer);
    final paint = Paint()
      ..shader = shader
      ..style = PaintingStyle.stroke
      ..strokeWidth = r * .19
      ..strokeCap = StrokeCap.round;
    canvas.drawOval(outer, paint);
    final highlight = Paint()..color = const Color(0x66D5ECFF)..style = PaintingStyle.stroke..strokeWidth = r * .018;
    canvas.drawArc(outer.inflate(-r * .1), -2.55, 1.3, false, highlight);
    canvas.restore();
  }

  void _drawCore(Canvas canvas, double r) {
    final core = Rect.fromCircle(center: Offset.zero, radius: r * .55);
    final paint = Paint()..shader = const RadialGradient(colors: [Color(0xFFF2F7FF), Color(0xFF79A9ED), Color(0xFF132B59)], stops: [0, .23, 1], center: Alignment(-.32, -.42)).createShader(core);
    canvas.drawCircle(Offset.zero, r * .55, paint);
    final stroke = Paint()..color = const Color(0x99D9EBFF)..style = PaintingStyle.stroke..strokeWidth = 1;
    canvas.drawCircle(Offset.zero, r * .55, stroke);
    canvas.drawCircle(Offset(-r * .18, -r * .18), r * .1, Paint()..color = const Color(0x88FFFFFF));
  }

  void _drawParticles(Canvas canvas, double r) {
    final p = Paint();
    for (var i = 0; i < 16; i++) {
      final a = (i * .72) + t * math.pi * 2 * (i.isEven ? 1 : -.7);
      final distance = r * (1.15 + (i % 4) * .21);
      final point = Offset(math.cos(a) * distance, math.sin(a) * distance * .56);
      final radius = 1.4 + (i % 3) * .8;
      p.color = i % 4 == 0 ? AppColors.electric : const Color(0x99D8E9FF);
      canvas.drawCircle(point, radius, p);
    }
  }

  @override
  bool shouldRepaint(covariant _OrbitPainter oldDelegate) => oldDelegate.t != t;
}

class _Stats extends StatelessWidget {
  const _Stats();

  @override
  Widget build(BuildContext context) => Container(
        width: double.infinity,
        padding: const EdgeInsets.symmetric(vertical: 24),
        decoration: const BoxDecoration(border: Border(top: BorderSide(color: Color(0x335B83C6)), bottom: BorderSide(color: Color(0x335B83C6)))),
        child: Wrap(
          alignment: WrapAlignment.spaceBetween,
          spacing: 34,
          runSpacing: 18,
          children: const [
            _Stat('12+', 'лет в digital-разработке'),
            _Stat('70', 'продуктов в продакшене'),
            _Stat('5.0', 'средняя оценка партнеров'),
          ],
        ),
      );
}

class _Stat extends StatelessWidget {
  const _Stat(this.value, this.caption);
  final String value;
  final String caption;
  @override
  Widget build(BuildContext context) => Row(mainAxisSize: MainAxisSize.min, children: [
        Text(value, style: const TextStyle(fontSize: 30, fontWeight: FontWeight.w800, color: AppColors.electric)),
        const SizedBox(width: 10),
        Text(caption, style: const TextStyle(color: AppColors.muted, fontSize: 13)),
      ]);
}

class _GrainPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final random = math.Random(17);
    final paint = Paint();
    for (var i = 0; i < 800; i++) {
      paint.color = Color.fromARGB(random.nextInt(11), 190, 215, 255);
      canvas.drawCircle(Offset(random.nextDouble() * size.width, random.nextDouble() * size.height), .55, paint);
    }
  }
  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}


You are a senior product designer and frontend engineer building the official product website for an AI/ML-powered Intelligent Dead Reckoning (IDR) mobile navigation system.

Do NOT build a generic SaaS landing page.

The website must feel like a serious deep-tech / aerospace / navigation product: technically sophisticated, minimal, precise, trustworthy, futuristic, and highly polished.

Use the following websites only as DESIGN INSPIRATION:
1. https://www.raycast.com/
2. https://www.notion.com/

Study their design principles:
- strong typography hierarchy
- premium minimalism
- generous whitespace
- high-quality product storytelling
- focused CTAs
- smooth but restrained animations
- clean navigation
- sophisticated dark/light visual treatment
- product-centric hero sections
- visual storytelling instead of excessive text
- polished micro-interactions
- clear section transitions

DO NOT copy their branding, text, logos, illustrations, layouts, or visual identity.
Create an original visual identity specifically for Intelligent Dead Reckoning.

==================================================
1. PRODUCT CONTEXT
==================================================

Product name:

INTELLIGENT DEAD RECKONING
IDR

Tagline:

"Seamless navigation when GNSS fails."

Core idea:

Transform a standalone Android smartphone into an intelligent dead-reckoning navigation system using:

- smartphone accelerometer
- gyroscope
- GNSS/GPS
- inertial navigation
- sensor fusion
- AI/ML-based vehicle motion estimation
- vibration filtering
- map matching
- kinematic constraints
- automatic vehicle alignment
- seamless GNSS outage detection
- seamless transition between GNSS + INS and dead reckoning
- local edge inference

The mobile application is the PRIMARY PRODUCT.

The website is a companion platform for:
- product explanation
- system architecture
- technology explanation
- live monitoring
- navigation session analytics
- performance metrics
- device/session status
- demonstrations
- APK installation

Do not make the website look like the main navigation application.
The actual navigation experience belongs to the Android mobile app.

==================================================
2. CORE PROBLEM
==================================================

Modern navigation systems depend heavily on GNSS.

GNSS can degrade or disappear in:

- underground tunnels
- underpasses
- multi-level parking structures
- dense forests
- urban canyons
- areas surrounded by tall buildings
- environments with structural signal blockage

When GNSS disappears, conventional navigation can lose position continuity.

Our IDR system should maintain navigation continuity by transitioning from:

GNSS AIDED INS

to:

INERTIAL / DEAD RECKONING

and then seamlessly returning to:

GNSS + INS

when GNSS becomes available again.

The system must work using only smartphone sensors and must not require connection to the vehicle's internal computer or external speedometer.

AI/ML is used to estimate vehicle speed and motion characteristics from noisy smartphone sensor signals.

==================================================
3. PRIMARY WEBSITE OBJECTIVE
==================================================

The website has four major objectives:

1. Explain the problem clearly.
2. Demonstrate how IDR solves it.
3. Show technical credibility through architecture and live metrics.
4. Allow users to install the Android mobile application.

The website should immediately communicate:

"GNSS disappeared.
Navigation did not."

That should become the central emotional/technical message.

==================================================
4. VISUAL DIRECTION
==================================================

Design language:

- premium deep-tech
- aerospace inspired
- navigation technology
- engineering precision
- minimal
- futuristic but not gimmicky
- highly legible
- technically credible
- sophisticated
- calm
- confident

Avoid:

- generic startup gradients
- excessive glassmorphism
- excessive neon
- cyberpunk aesthetics
- gaming UI
- excessive rounded cards
- meaningless decorative blobs
- stock photos
- generic AI brain graphics
- generic "future technology" illustrations

The design should feel closer to:

"advanced navigation laboratory + premium software product"

rather than:

"crypto startup + generic AI SaaS".

==================================================
5. COLOR SYSTEM
==================================================

Primary visual mode should be DARK.

Suggested visual direction:

- near-black / charcoal background
- off-white typography
- subtle gray borders
- restrained blue / cyan navigation accent
- occasional signal-green for healthy GNSS state
- amber/red only for warnings or GNSS outage states

Do not use many colors.

Color should communicate system state.

Example:

GNSS AVAILABLE
→ subtle green indicator

GNSS DEGRADED
→ amber indicator

GNSS LOST
→ red/orange indicator

DEAD RECKONING ACTIVE
→ blue/cyan indicator

Avoid making every component colorful.

==================================================
6. TYPOGRAPHY
==================================================

Use a modern professional sans-serif.

Typography should have:

- extremely strong hero heading
- tight heading line-height
- clean body text
- small technical labels
- monospaced font for telemetry / sensor values / coordinates / timestamps where appropriate

Create a clear hierarchy:

Display
H1
H2
H3
Body
Technical label
Metric
Telemetry

The hero heading should be large and confident.

==================================================
7. NAVIGATION BAR
==================================================

Create a minimal sticky navigation bar.

Left:

IDR logo / wordmark

Center/right:

Product
Technology
How It Works
Monitoring
About

Right CTA:

Get the App

Desktop navigation should remain minimal.

On mobile:

- IDR logo
- hamburger/menu
- Get App CTA if space allows

Navbar should become slightly more opaque / elevated while scrolling.

==================================================
8. HERO SECTION
==================================================

This is the most important section.

Use a premium, minimal hero.

Headline:

"Navigation that keeps moving."

Supporting statement:

"Intelligent Dead Reckoning maintains seamless vehicle positioning when GNSS disappears — using only the sensors already inside your smartphone."

Primary CTA:

"Get the Android App"

Secondary CTA:

"Explore the Technology"

Do not fill the hero with paragraphs.

==================================================
9. HERO PRODUCT VISUALIZATION
==================================================

The hero should visually communicate the actual IDR system.

Create a sophisticated animated navigation visualization.

Example concept:

A dark map-like environment with:

- vehicle marker
- road network
- GNSS trajectory
- dead-reckoning trajectory
- subtle sensor signal visualization
- positioning confidence
- GNSS state

Show a transition:

GNSS AVAILABLE
        ↓
GNSS SIGNAL DEGRADING
        ↓
GNSS LOST
        ↓
DEAD RECKONING ACTIVE
        ↓
GNSS RESTORED
        ↓
GNSS + INS FUSION

The vehicle should continue moving throughout the outage.

The animation should visually prove the product's central capability.

Do NOT make this look like Google Maps.

Create an abstract technical navigation visualization.

==================================================
10. HERO LIVE TELEMETRY
==================================================

Integrate subtle telemetry around the visualization.

Example:

GNSS
LOCKED

POSITION ERROR
2.4 m

DR MODE
ACTIVE

SPEED
48.6 km/h

IMU
200 Hz

CONFIDENCE
96.8%

These should look like real engineering telemetry.

Use monospace typography.

Animate values subtly.

Do not overdo animation.

==================================================
11. "THE PROBLEM" SECTION
==================================================

Section heading:

"When GNSS disappears, conventional navigation breaks."

Show environmental scenarios:

Tunnel
Urban Canyon
Parking Structure
Dense Forest

Use elegant visual illustrations rather than stock photography.

Each environment should show:

GNSS signal
↓
Blocked
↓
Navigation uncertainty

Then introduce:

"IDR keeps estimating."

==================================================
12. "HOW IDR WORKS" SECTION
==================================================

Create a large technical flow diagram.

The architecture should be visually represented as:

SMARTPHONE SENSORS
        ↓
Sensor Preprocessing
        ↓
Vehicle Alignment
        ↓
AI Speed & Motion Estimation
        ↓
IMU / INS
        ↓
GNSS + INS Fusion
        ↓
Map Matching
        ↓
Kinematic Constraints
        ↓
Position Estimate

The section should feel like an engineering system architecture diagram.

Use animated data flow.

When the user scrolls, the pipeline should progressively illuminate.

==================================================
13. SENSOR INPUT SECTION
==================================================

Show the smartphone as the sensing platform.

Inputs:

Accelerometer
Gyroscope
GNSS
Magnetometer where appropriate
Device orientation

Explain:

"No external vehicle hardware required."

Emphasize:

"Your smartphone becomes the navigation sensor."

Use a clean smartphone visualization.

==================================================
14. AI/ML ENGINE SECTION
==================================================

Create a dedicated section explaining the intelligence layer.

Heading:

"From noisy motion to usable vehicle dynamics."

Show:

Raw accelerometer
        ↓
Noise / vibration
        ↓
Signal processing
        ↓
ML inference
        ↓
Vehicle speed
        ↓
Acceleration profile

Highlight:

- road vibration filtering
- pothole detection
- engine vibration rejection
- motion classification
- speed estimation
- acceleration estimation

Show raw vs filtered sensor signals visually.

This should look like real signal-processing telemetry.

==================================================
15. GNSS OUTAGE TRANSITION SECTION
==================================================

This should be one of the strongest sections.

Create an interactive/animated timeline:

00:00
GNSS AVAILABLE

00:01
Signal degrading

00:02
GNSS LOST

00:03
DEAD RECKONING ACTIVE

00:10
DR CONTINUES

00:20
GNSS RESTORED

00:21
GNSS + INS RE-FUSED

Visually demonstrate that navigation does not jump or stop.

Show a continuous vehicle trajectory.

==================================================
16. MAP MATCHING SECTION
==================================================

Explain that raw inertial estimation can drift.

Then show:

Raw DR trajectory
vs
Map-constrained trajectory

Demonstrate:

- road constraints
- heading constraints
- lane/road geometry
- kinematic constraints
- trajectory correction

Use a technical map visualization.

==================================================
17. PERFORMANCE SECTION
==================================================

Create a high-quality metrics section.

Potential metrics:

Position Error
Velocity Error
Heading Error
Drift Rate
GNSS Recovery Time
GNSS Outage Duration
Inference Latency
Sensor Sampling Rate
Battery Consumption
Model Confidence

Example UI:

POSITION ERROR
2.4 m

DRIFT RATE
0.8%

INFERENCE
4.2 ms

IMU
200 Hz

GNSS RECOVERY
120 ms

Do NOT imply these example numbers are measured real-world results unless the backend actually provides them.

If values are mock data, label them clearly as:

DEMO DATA

==================================================
18. LIVE MONITORING
==================================================

Create a monitoring dashboard section.

This is the main website application area.

Show:

Active Devices
Navigation Sessions
GNSS Availability
DR Sessions
Average Position Error
Average Drift
Battery Impact
ML Confidence

Example:

ACTIVE DEVICES
24

GNSS OUTAGES
7

DR SESSIONS
18

AVG POSITION ERROR
2.8 m

Use professional observability-style design.

The visual language can take inspiration from engineering monitoring systems such as Grafana/Datadog, but remain visually consistent with the IDR brand.

==================================================
19. LIVE NAVIGATION SESSION
==================================================

Create a session monitoring UI.

Example:

SESSION
IDR-2026-00142

DEVICE
Android Device

STATUS
DEAD RECKONING ACTIVE

SPEED
52.3 km/h

HEADING
124.8°

POSITION ERROR
2.7 m

GNSS
LOST

DR CONFIDENCE
97.2%

Show a trajectory chart.

Show GNSS state transitions.

Show sensor/ML status.

==================================================
20. INSTALLATION EXPERIENCE — CRITICAL
==================================================

The website uses ONE frontend.

Do not create separate websites for desktop and mobile.

The website must detect the device and render the correct installation experience.

Architecture:

Landing Page
      ↓
detectDevice()
      ↓
┌───────────────┬────────────────┐
│               │                │
Mobile        Desktop
│               │
↓               ↓
<MobileInstall />   <DesktopInstall />

==================================================
21. MOBILE INSTALL EXPERIENCE
==================================================

If the user opens the website on an Android phone:

Show:

"Get IDR on your phone."

Primary CTA:

"Download APK"

Secondary information:

Android application
Latest version
APK size
Version number

The button should directly initiate APK download.

Do NOT show QR code on mobile.

Do NOT show "send to phone" on mobile.

If the user is on iPhone/iPad:

Do NOT show an APK download button as the primary action.

Show:

"IDR is currently available for Android."

==================================================
22. DESKTOP INSTALL EXPERIENCE
==================================================

If the user opens the website on a laptop/desktop:

Do NOT immediately show a direct APK download as the primary CTA.

Instead show:

"Install IDR on your Android phone."

Primary CTA:

"Install on my phone"

Then display:

QR CODE

Supporting text:

"Scan this code with your Android phone."

Optional:

"Send installation link"

If the user is authenticated with Google, create a secure short-lived installation session.

Architecture:

Desktop
    ↓
Google authentication (if required)
    ↓
Create installation session
    ↓
Generate secure token
    ↓
QR Code / installation link
    ↓
Android phone
    ↓
Installation page
    ↓
Download APK
    ↓
Android package installer
    ↓
User confirms installation

IMPORTANT:

The website must NOT attempt to silently install an APK on the phone.

Android's package installation confirmation remains under Android's control.

==================================================
23. DEVICE DETECTION
==================================================

Implement device detection separately from responsive styling.

Responsive CSS determines layout.

JavaScript determines installation behavior.

Create:

detectDevice()

Possible output:

"android-mobile"
"ios-mobile"
"tablet"
"desktop"

Installation behavior:

android-mobile
→ MobileInstall

ios-mobile
→ UnsupportedMobileInstall

tablet
→ appropriate mobile/tablet experience

desktop
→ DesktopInstall

Do not use only viewport width for this logic.

Use browser/device capabilities and user-agent information as appropriate.

Keep device detection isolated in a reusable utility.

==================================================
24. INSTALLATION COMPONENT ARCHITECTURE
==================================================

Create:

InstallSection

inside:

InstallSection:

detectDevice()

if Android mobile:
    render <MobileInstall />

if iOS:
    render <UnsupportedMobileInstall />

if desktop:
    render <DesktopInstall />

Do not duplicate the entire landing page.

Only the installation component should change.

==================================================
25. MOBILE-FIRST PRODUCT POSITIONING
==================================================

The website must repeatedly reinforce:

"The mobile application is the actual navigation engine."

The website is:

- product website
- monitoring console
- analytics interface
- documentation
- installation gateway

The website is NOT the primary navigation engine.

==================================================
26. FINAL CTA
==================================================

Near the bottom:

"Keep moving when GNSS can't."

Supporting text:

"Turn your Android smartphone into an intelligent dead-reckoning navigation system."

CTA behavior must follow device detection.

Desktop:

"Install on my phone"

Mobile Android:

"Download APK"

==================================================
27. FOOTER
==================================================

Footer should include:

IDR

Intelligent Dead Reckoning

Product
Technology
Monitoring
Documentation
Download

GitHub if available

Contact

Version

Copyright

Keep it minimal.

==================================================
28. MOTION DESIGN
==================================================

Use motion intentionally.

Preferred:

- scroll-triggered system architecture animation
- subtle trajectory animation
- GNSS signal pulses
- sensor data flowing through pipeline
- smooth metric number transitions
- map vehicle movement
- navbar transition
- hover states
- subtle section reveals

Avoid:

- excessive parallax
- bouncing elements
- constant floating animations
- distracting effects
- excessive 3D

Motion should communicate system behavior.

==================================================
29. RESPONSIVE DESIGN
==================================================

The website must be fully responsive.

Desktop:

- wide hero
- navigation visualization
- architecture diagrams
- monitoring dashboard
- multi-column layouts

Tablet:

- compressed layout
- adaptive diagrams

Mobile:

- single-column
- large touch targets
- simplified diagrams
- horizontally scrollable technical charts where necessary
- mobile installation CTA
- no desktop-only interaction

Do not simply shrink desktop UI.

Design mobile layouts intentionally.

==================================================
30. ACCESSIBILITY
==================================================

Implement:

- semantic HTML
- keyboard navigation
- visible focus states
- sufficient contrast
- reduced-motion support
- accessible buttons
- accessible form controls
- meaningful aria labels
- readable typography
- touch targets at least approximately 44px

Do not use animation as the only way to communicate system state.

==================================================
31. TECHNICAL IMPLEMENTATION
==================================================

Build this as a production-quality frontend.

Preferred stack:

React / Next.js
TypeScript
Tailwind CSS
Framer Motion or equivalent animation library
Recharts / lightweight visualization library where appropriate

Keep components modular.

Suggested structure:

components/
    Navbar
    Hero
    NavigationVisualization
    ProblemSection
    ArchitectureFlow
    SensorEngine
    MLSection
    GNSSTransition
    MapMatching
    PerformanceMetrics
    MonitoringDashboard
    NavigationSession
    InstallSection
        DesktopInstall
        MobileInstall
        UnsupportedMobileInstall
    FinalCTA
    Footer

lib/
    deviceDetection
    installation
    telemetry

Do not hardcode installation logic directly into the hero.

==================================================
32. DATA ARCHITECTURE
==================================================

The UI should be ready to connect to a backend later.

Create interfaces/types for:

Device
NavigationSession
Telemetry
Position
SensorState
GNSSState
PerformanceMetrics
InstallationSession

Example:

NavigationSession:

id
deviceId
status
speed
heading
position
positionError
gnssStatus
drConfidence
battery
timestamp

Use mock/demo data initially.

Clearly separate:

UI
Mock data
API layer

Do not tightly couple components to fake data.

==================================================
33. IMPORTANT DATA HONESTY
==================================================

Do not present fabricated performance metrics as validated scientific results.

If using placeholder metrics, visually label them:

DEMO
SIMULATION
SAMPLE DATA

Real measured values should eventually come from the IDR backend.

==================================================
34. VISUAL SYSTEM
==================================================

Create a consistent design system:

Spacing scale
Typography scale
Border radius
Shadows
Cards
Buttons
Badges
Telemetry labels
Status indicators
Charts
Tooltips
Navigation

Cards should not dominate every section.

Use large open layouts and composition.

==================================================
35. BUTTON DESIGN
==================================================

Primary:

Get the Android App

Desktop:

Install on my phone

Mobile Android:

Download APK

Secondary:

Explore Technology

Tertiary:

View Monitoring

Buttons should feel premium and restrained.

==================================================
36. WHAT THE USER SHOULD FEEL
==================================================

After 10 seconds:

"This is a serious navigation technology."

After 30 seconds:

"I understand why GNSS outages are a problem."

After 60 seconds:

"I understand how IDR solves it."

After exploring:

"I can see actual system telemetry and performance."

At the bottom:

"I can install the Android application."

==================================================
37. FINAL DESIGN PRINCIPLE
==================================================

The website should tell one continuous story:

GNSS FAILS
      ↓
NAVIGATION BECOMES UNCERTAIN
      ↓
SMARTPHONE SENSORS CONTINUE OBSERVING MOTION
      ↓
AI ESTIMATES VEHICLE DYNAMICS
      ↓
INS CONTINUES POSITION ESTIMATION
      ↓
MAP MATCHING CONSTRAINS DRIFT
      ↓
GNSS RETURNS
      ↓
GNSS + INS RE-FUSION
      ↓
SEAMLESS NAVIGATION

Make this story visually obvious.

The website should feel like a real product that could be deployed in:

- logistics
- emergency response
- ride-hailing
- autonomous/assisted navigation
- transportation
- aerospace/navigation research

rather than a student project.

==================================================
38. FINAL REQUIREMENT
==================================================

Before implementation:

1. Establish the complete visual system.
2. Establish reusable components.
3. Establish responsive breakpoints.
4. Establish device detection.
5. Establish installation states.
6. Establish the navigation visualization.
7. Establish the monitoring dashboard.
8. Establish mock telemetry types.
9. Establish animation principles.

Then implement the complete website.

Do NOT create random additional sections simply to make the page longer.

Every section must support one of these goals:

Explain.
Demonstrate.
Prove.
Monitor.
Install.

The final result must be visually polished, technically credible, responsive, and production-oriented.
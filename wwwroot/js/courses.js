/*
 * Course catalogue.
 *
 * To add a new course, append an object to COURSES following the same shape:
 *   id, title, fleet, description, passMark (0-100), examQuestionCount,
 *   modules: [{ id, title, minutes, body (HTML), images[], audio, quiz[] }],
 *   examExtra: [extra questions used only in the final exam]
 *
 * A quiz question is { q, options: [..], answer: <index of correct option>, why }.
 * Images and audio are loaded from wwwroot/images and wwwroot/audio; any that
 * are missing are simply hidden.
 */
window.COURSES = [
  {
    id: "uprt",
    title: "Upset Prevention & Recovery Training",
    short: "UPRT",
    fleet: "All Fleet (B737-800)",
    description:
      "Competency-based UPRT following ICAO Doc 10011. Covers the causes, recognition, prevention and recovery of airplane upsets to reduce Loss of Control In-flight (LOC-I).",
    passMark: 80,
    examQuestionCount: 15,
    modules: [
      {
        id: "introduction",
        title: "Introduction to UPRT",
        minutes: 10,
        body: `
          <p>Upset Prevention and Recovery Training (UPRT) aims to reduce <strong>Loss of Control In-flight (LOC-I)</strong>, historically one of the leading causes of fatal accidents in commercial aviation.</p>
          <p>An <strong>airplane upset</strong> is an airplane in flight unintentionally exceeding the parameters normally experienced in line operations or training. Generally accepted values are:</p>
          <ul>
            <li>Pitch attitude greater than <strong>25° nose up</strong></li>
            <li>Pitch attitude greater than <strong>10° nose down</strong></li>
            <li>Bank angle greater than <strong>45°</strong></li>
            <li>Within the above parameters, but flying at airspeeds inappropriate for the conditions</li>
          </ul>
          <h3>Training objectives</h3>
          <ul>
            <li>Understand why upsets happen and how they develop</li>
            <li>Recognise a developing upset early</li>
            <li>Prevent escalation into a full upset</li>
            <li>Apply the correct recovery technique when prevention fails</li>
          </ul>`,
        images: ["upset-overview.jpg"],
        audio: "intro.mp3",
        quiz: [
          {
            q: "Which accident category does UPRT primarily aim to reduce?",
            options: ["Runway excursions", "Loss of Control In-flight (LOC-I)", "Controlled Flight Into Terrain (CFIT)", "Mid-air collisions"],
            answer: 1,
            why: "UPRT targets LOC-I, one of the leading causes of fatal commercial accidents."
          },
          {
            q: "Which of these conditions defines an airplane upset?",
            options: ["Pitch 15° nose up", "Bank angle 30°", "Pitch more than 10° nose down", "Any autopilot disconnect"],
            answer: 2,
            why: "An upset is pitch > 25° nose up, pitch > 10° nose down, bank > 45°, or inappropriate airspeed within those limits."
          },
          {
            q: "Which ICAO document provides the UPRT training framework?",
            options: ["ICAO Doc 10011", "ICAO Annex 14", "ICAO Doc 4444", "ICAO Annex 17"],
            answer: 0,
            why: "ICAO Doc 10011 is the Manual on Aeroplane Upset Prevention and Recovery Training."
          }
        ]
      },
      {
        id: "certification",
        title: "Aircraft Certification & Flight Envelope",
        minutes: 10,
        body: `
          <p>Aircraft are certified with a defined operational envelope. Key speed limits include:</p>
          <ul>
            <li><strong>V<sub>MO</sub> / M<sub>MO</sub></strong> – maximum operating speed / Mach number, which must not be deliberately exceeded in any regime of flight.</li>
            <li><strong>V<sub>DF</sub> / M<sub>DF</sub></strong> – demonstrated flight diving speed / Mach, the highest speed actually flown during certification.</li>
            <li><strong>V<sub>D</sub> / M<sub>D</sub></strong> – design diving speed used for structural design.</li>
          </ul>
          <p>OEM flight testing demonstrates that the airplane can be recovered from conditions <em>within</em> the certified envelope. Outside it, aircraft behaviour has not been tested and may be unpredictable &mdash; which is why exceeding these limits can turn a minor deviation into an upset.</p>`,
        images: ["flight-envelope.jpg"],
        audio: "certification.mp3",
        quiz: [
          {
            q: "What does V<sub>MO</sub>/M<sub>MO</sub> represent?",
            options: ["Minimum control speed", "Maximum operating speed/Mach that must not be deliberately exceeded", "Design diving speed", "Maneuvering speed"],
            answer: 1,
            why: "VMO/MMO is the maximum operating limit speed for all regimes of flight."
          },
          {
            q: "Why is flight outside the certified envelope dangerous?",
            options: ["It is illegal but aerodynamically identical", "Aircraft behaviour there has not been demonstrated and may be unpredictable", "Fuel burn increases", "The autopilot will always disconnect"],
            answer: 1,
            why: "Certification only demonstrates recoverable, predictable handling inside the envelope."
          },
          {
            q: "V<sub>DF</sub>/M<sub>DF</sub> is:",
            options: ["The demonstrated flight diving speed", "The flap extension limit", "The stall speed in landing configuration", "The maximum tyre speed"],
            answer: 0,
            why: "VDF/MDF is the highest speed demonstrated in flight test."
          }
        ]
      },
      {
        id: "aerodynamics",
        title: "Aerodynamics & Energy Management",
        minutes: 15,
        body: `
          <p>Lift is a function of <strong>air density, airspeed (squared), wing area and the coefficient of lift</strong>, which depends mainly on angle of attack (AoA):</p>
          <p class="formula">L = ½ ρ V² S C<sub>L</sub></p>
          <p>High-lift devices such as <strong>slats and flaps</strong> increase C<sub>L</sub> and the critical angle of attack, allowing flight at lower speeds.</p>
          <h3>Energy states</h3>
          <ul>
            <li><strong>Kinetic energy</strong> – airspeed</li>
            <li><strong>Potential energy</strong> – altitude</li>
            <li><strong>Chemical energy</strong> – fuel converted to thrust by the engines</li>
          </ul>
          <p>During a recovery, pilots can trade one energy state for another (e.g. exchange altitude for airspeed). Good energy management keeps options open.</p>`,
        images: ["lift-diagram.jpg", "slats-flaps.jpg", "energy-trade.jpg"],
        audio: "aerodynamics.mp3",
        quiz: [
          {
            q: "If airspeed doubles at constant AoA and density, lift becomes:",
            options: ["Twice as large", "Four times as large", "Half as large", "Unchanged"],
            answer: 1,
            why: "Lift is proportional to V², so doubling speed quadruples lift."
          },
          {
            q: "Which is NOT one of the three energy states used in energy management?",
            options: ["Kinetic", "Potential", "Chemical", "Magnetic"],
            answer: 3,
            why: "The three energy states are kinetic (speed), potential (altitude) and chemical (fuel/thrust)."
          },
          {
            q: "Extending slats and flaps:",
            options: ["Decreases the coefficient of lift", "Increases the coefficient of lift", "Has no aerodynamic effect", "Only reduces drag"],
            answer: 1,
            why: "High-lift devices increase CL, allowing lower flight speeds."
          }
        ]
      },
      {
        id: "stall",
        title: "Stall Recognition & Recovery",
        minutes: 15,
        body: `
          <p>A stall occurs when the wing exceeds its <strong>critical angle of attack</strong>. This can happen at <strong>any airspeed, any attitude and any power setting</strong>.</p>
          <h3>Warning signs</h3>
          <ul>
            <li>Stick shaker activation</li>
            <li>Aerodynamic buffet</li>
            <li>Loss of pitch authority or uncommanded roll</li>
            <li>Inability to arrest a descent</li>
          </ul>
          <h3>Recovery priority</h3>
          <p><strong>Reduce the angle of attack</strong> &mdash; apply nose-down pitch control until stall warning and buffet stop. Then roll wings level, adjust thrust as needed and return to the desired flight path. Follow the aircraft-specific FCTM/QRH procedure.</p>`,
        images: ["stall-recognition.jpg"],
        audio: "stall.mp3",
        quiz: [
          {
            q: "A stall occurs when:",
            options: ["Airspeed drops below a fixed value", "The critical angle of attack is exceeded", "The nose is above the horizon", "Thrust is at idle"],
            answer: 1,
            why: "Stall is an AoA phenomenon and can happen at any airspeed or attitude."
          },
          {
            q: "What is the first priority in stall recovery?",
            options: ["Apply maximum thrust", "Roll wings level", "Reduce the angle of attack", "Extend flaps"],
            answer: 2,
            why: "Reducing AoA (nose-down pitch) is always the first priority."
          },
          {
            q: "Which is a typical stall warning cue on a transport aircraft?",
            options: ["Stick shaker", "Cabin altitude horn", "Gear warning horn", "Overspeed clacker"],
            answer: 0,
            why: "The stick shaker warns of an approaching stall."
          }
        ]
      },
      {
        id: "stability",
        title: "Stability, Sideslip & Load Factor",
        minutes: 15,
        body: `
          <p><strong>Sideslip</strong> angle affects lateral stability: through dihedral effect, sideslip produces a rolling moment. Large rudder inputs can generate significant sideslip and a strong roll response.</p>
          <h3>Load factor</h3>
          <p>In a level, coordinated turn the load factor is <span class="formula">n = 1 / cos(bank)</span>.</p>
          <table class="data">
            <thead><tr><th>Bank</th><th>Load factor</th><th>Stall speed increase</th></tr></thead>
            <tbody>
              <tr><td>30°</td><td>1.15 g</td><td>≈ 7%</td></tr>
              <tr><td>45°</td><td>1.41 g</td><td>≈ 19%</td></tr>
              <tr><td>60°</td><td>2.0 g</td><td>≈ 41%</td></tr>
            </tbody>
          </table>
          <p>Stall speed increases with the square root of the load factor. Pilots must understand G-forces and their effect on control, and avoid excessive load factor during recovery.</p>`,
        images: ["sideslip.jpg", "load-factor.jpg", "load-factor2.jpg"],
        audio: "stability.mp3",
        quiz: [
          {
            q: "What is the load factor in a level 60° bank turn?",
            options: ["1.15 g", "1.41 g", "2.0 g", "3.0 g"],
            answer: 2,
            why: "n = 1/cos(60°) = 2.0 g."
          },
          {
            q: "As load factor increases, stall speed:",
            options: ["Decreases", "Increases with the square root of load factor", "Stays the same", "Increases linearly with bank angle"],
            answer: 1,
            why: "Vs increases with √n, e.g. ≈41% at 2 g."
          },
          {
            q: "Sideslip mainly influences:",
            options: ["Lateral (roll) stability through dihedral effect", "Engine fuel flow", "Cabin pressurisation", "Longitudinal trim only"],
            answer: 0,
            why: "Sideslip produces a rolling moment via dihedral effect."
          }
        ]
      },
      {
        id: "performance",
        title: "Performance, L/D MAX & Coffin Corner",
        minutes: 15,
        body: `
          <p><strong>L/D MAX</strong> is the speed at which the ratio of lift to drag is highest &mdash; the minimum-drag speed.</p>
          <ul>
            <li><strong>Above L/D MAX</strong> (front side of the drag curve) speed is stable: a speed loss reduces drag and the aircraft tends to recover.</li>
            <li><strong>Below L/D MAX</strong> (back side of the drag curve) speed is unstable: a speed loss increases drag, causing further speed decay unless thrust is added.</li>
          </ul>
          <h3>Coffin corner</h3>
          <p>At high altitude the low-speed buffet and high-speed (Mach) buffet margins converge, leaving a narrow speed band. Small speed or load-factor changes can then produce buffet or stall.</p>
          <h3>Drift-down</h3>
          <p>Following an engine failure at altitude, the aircraft must descend (drift down) at an appropriate speed to an altitude where it can be maintained with the remaining thrust.</p>`,
        images: ["drag-curve.jpg", "drag-curve2.jpg", "drag-curve3.jpg", "drag-curve4.jpg", "coffin-corner.jpg", "coffin-corner2.jpg"],
        audio: "performance.mp3",
        quiz: [
          {
            q: "Flying below L/D MAX (back side of the drag curve) means:",
            options: ["Speed is self-correcting", "A speed loss increases drag, causing further speed decay", "Drag is at its minimum", "The aircraft cannot stall"],
            answer: 1,
            why: "On the back side of the drag curve speed is unstable."
          },
          {
            q: "'Coffin corner' describes:",
            options: ["Convergence of low-speed and high-speed buffet margins at high altitude", "A tight approach turn", "Maximum landing weight", "The CG limit envelope"],
            answer: 0,
            why: "At high altitude the buffet margins narrow until they meet."
          },
          {
            q: "L/D MAX corresponds to:",
            options: ["Maximum drag", "Minimum drag", "VMO", "Maximum thrust"],
            answer: 1,
            why: "L/D MAX is the speed of minimum total drag."
          }
        ]
      },
      {
        id: "weight-balance",
        title: "Weight & Balance",
        minutes: 10,
        body: `
          <p>Aircraft handling characteristics are directly affected by <strong>centre of gravity (CG)</strong> position.</p>
          <table class="data">
            <thead><tr><th></th><th>Forward CG</th><th>Aft CG</th></tr></thead>
            <tbody>
              <tr><td>Longitudinal stability</td><td>Increased</td><td>Reduced</td></tr>
              <tr><td>Manoeuvrability</td><td>Reduced</td><td>Increased</td></tr>
              <tr><td>Stall speed</td><td>Higher</td><td>Lower</td></tr>
              <tr><td>Control forces</td><td>Heavier</td><td>Lighter</td></tr>
            </tbody>
          </table>
          <p>Operating outside the weight and balance envelope can lead to unpredictable behaviour, especially during upset recovery at high altitude where margins are already small.</p>`,
        images: ["weight-balance.jpg", "maxspeed.jpg"],
        audio: "weight-balance.mp3",
        quiz: [
          {
            q: "A forward CG generally results in:",
            options: ["Less stability and lighter controls", "More stability and reduced manoeuvrability", "Lower stall speed", "No change in handling"],
            answer: 1,
            why: "Forward CG increases stability but reduces manoeuvrability and raises stall speed."
          },
          {
            q: "An aft CG generally results in:",
            options: ["Increased longitudinal stability", "Heavier control forces", "Reduced stability and lighter control forces", "Higher stall speed"],
            answer: 2,
            why: "Aft CG reduces stability and lightens control forces."
          },
          {
            q: "Why is the W&B envelope particularly important for upset recovery at altitude?",
            options: ["It sets cabin temperature", "Handling may become unpredictable when margins are already small", "It only matters on the ground", "It determines the radio frequency"],
            answer: 1,
            why: "Outside the envelope, handling is unpredictable when there is little margin."
          }
        ]
      },
      {
        id: "human-factors",
        title: "Human Factors: Startle & Resilience",
        minutes: 15,
        body: `
          <p>Human factors play a decisive role in upset recovery. The <strong>startle effect</strong>, cognitive overload and delayed reaction can impair decision-making.</p>
          <ul>
            <li><strong>Startle</strong> – an uncontrollable, automatic reflex to a sudden, intense stimulus.</li>
            <li><strong>Surprise</strong> – a cognitive response when events differ from expectations.</li>
          </ul>
          <p><strong>Resilience</strong> is the ability to recover from unexpected events. It includes:</p>
          <ul>
            <li>Self-control</li>
            <li>Adaptability</li>
            <li>Optimism</li>
            <li>Self-sufficiency</li>
            <li>Persistence</li>
          </ul>
          <p>Pilots must train to recognise these responses, manage them, and use good CRM and active monitoring to regain situational awareness.</p>`,
        images: ["startle-curve.jpg", "resilience.jpg", "componentofresilience.jpg", "pointtoremember.jpg"],
        audio: "human-factors.mp3",
        quiz: [
          {
            q: "The startle effect is best described as:",
            options: ["A deliberate decision process", "An automatic reflex to a sudden, intense stimulus", "A long-term fatigue state", "A type of turbulence"],
            answer: 1,
            why: "Startle is an involuntary physiological reflex."
          },
          {
            q: "Which is a component of resilience?",
            options: ["Complacency", "Adaptability", "Fixation", "Overconfidence"],
            answer: 1,
            why: "Resilience includes self-control, adaptability, optimism, self-sufficiency and persistence."
          },
          {
            q: "Surprise differs from startle because surprise:",
            options: ["Is a cognitive response to unexpected events", "Is always physical", "Never affects performance", "Only happens on the ground"],
            answer: 0,
            why: "Surprise is cognitive — a mismatch between expectation and reality."
          }
        ]
      },
      {
        id: "causes",
        title: "Causes of Airplane Upsets",
        minutes: 15,
        body: `
          <p>Airplane upsets are rare but serious events. They can be triggered by three main categories:</p>
          <ul>
            <li><strong>Environmentally induced:</strong> turbulence, windshear, microbursts, icing and wake turbulence can cause sudden attitude changes or control loss.</li>
            <li><strong>System induced:</strong> automation anomalies, flight control malfunctions or sensor errors may lead to unexpected aircraft behaviour.</li>
            <li><strong>Pilot induced:</strong> incorrect inputs, distraction or misinterpretation of flight data can escalate into an upset.</li>
          </ul>
          <h3>Prevention</h3>
          <p>Active monitoring of flight path and energy state, good automation management and early recognition stop most developing upsets before they become full upsets.</p>`,
        images: ["pilot-error.jpg", "enviremntal.jpg", "icing.jpg", "wake-turbulence.jpg", "systeminduced.jpg", "pilotinduced.jpg", "pilotinduced2.jpg", "pilotinduced3.jpg", "activemonitoring.jpg", "prevention.jpg", "prevention2.jpg", "recognition.jpg"],
        audio: "causes.mp3",
        quiz: [
          {
            q: "Wake turbulence is an example of which upset category?",
            options: ["Environmentally induced", "System induced", "Pilot induced", "Maintenance induced"],
            answer: 0,
            why: "Wake turbulence is an external, environmental cause."
          },
          {
            q: "An erroneous airspeed sensor leading to unexpected behaviour is:",
            options: ["Environmentally induced", "System induced", "Pilot induced", "Not an upset cause"],
            answer: 1,
            why: "Sensor and automation anomalies are system-induced causes."
          },
          {
            q: "What is the most effective defence against developing upsets?",
            options: ["Active monitoring and early recognition", "Flying faster at all times", "Leaving automation engaged regardless", "Reducing crew communication"],
            answer: 0,
            why: "Active monitoring and early recognition stop most upsets before they develop."
          }
        ]
      },
      {
        id: "recovery",
        title: "Recovery Techniques",
        minutes: 20,
        body: `
          <p>Recovery involves <strong>reducing angle of attack, levelling the wings and managing thrust</strong>. Techniques vary by upset type. Always follow the aircraft FCTM.</p>
          <h3>Nose-high, wings-level</h3>
          <ol>
            <li>Recognise and confirm the situation; disconnect autopilot and autothrottle.</li>
            <li>Apply nose-down pitch control (up to full nose-down elevator) and nose-down trim as needed.</li>
            <li>If necessary, reduce thrust and/or roll to a bank angle (not exceeding about 60°) to help bring the nose down.</li>
            <li>Approaching the horizon, roll wings level and recover to slightly nose-low, then adjust thrust.</li>
          </ol>
          <h3>Nose-low, high bank</h3>
          <ol>
            <li>Recognise and confirm; disconnect autopilot and autothrottle.</li>
            <li>Recover from stall if required (unload &mdash; reduce AoA).</li>
            <li>Roll in the shortest direction to wings level.</li>
            <li>Recover to level flight with nose-up pitch, adjusting thrust and drag as required.</li>
          </ol>
          <h3>Summary</h3>
          <ul>
            <li>✔ Understand causes of upset</li>
            <li>✔ Recognise early warning signs</li>
            <li>✔ Apply correct recovery techniques</li>
            <li>✔ Practise in simulator scenarios</li>
          </ul>`,
        images: ["upset-recovery.jpg"],
        audio: "recovery.mp3",
        quiz: [
          {
            q: "In a nose-low, high-bank upset, what should be done before rolling wings level?",
            options: ["Pull back hard on the column", "Recover from the stall (unload) if required", "Extend the speed brakes fully", "Engage the autopilot"],
            answer: 1,
            why: "Unloading reduces AoA and restores roll authority before rolling wings level."
          },
          {
            q: "In a nose-high, wings-level upset, bank may be used to help lower the nose, but should not exceed about:",
            options: ["15°", "30°", "60°", "90°"],
            answer: 2,
            why: "Banking (≈60° max) uses the lift vector to help bring the nose down."
          },
          {
            q: "In a nose-low, high-bank upset, roll toward wings level:",
            options: ["In the shortest direction", "Always to the left", "Through inverted", "Only after reaching VMO"],
            answer: 0,
            why: "Roll in the shortest direction to wings level."
          }
        ]
      }
    ],
    examExtra: [
      {
        q: "When the autopilot and autothrottle are engaged during an upset, the recommended first action is to:",
        options: ["Leave them engaged to help", "Disconnect them and fly manually", "Re-engage the autopilot in a different mode", "Call ATC first"],
        answer: 1,
        why: "Automation may be the cause or may oppose the recovery; disconnect and fly manually."
      },
      {
        q: "Approximately how much does stall speed increase at 2 g?",
        options: ["≈ 10%", "≈ 25%", "≈ 41%", "≈ 100%"],
        answer: 2,
        why: "Vs increases by √2 ≈ 1.41."
      },
      {
        q: "Trading altitude for airspeed is an exchange between:",
        options: ["Chemical and kinetic energy", "Potential and kinetic energy", "Kinetic and chemical energy", "Thermal and potential energy"],
        answer: 1,
        why: "Altitude is potential energy; airspeed is kinetic energy."
      }
    ]
  }
];

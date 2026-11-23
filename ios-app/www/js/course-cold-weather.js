// Cold Weather Operations course, taken from github.com/chinouneredouane/cold-weather-ops
// (lessons/, data/questions.json and AUDIO_SCRIPTS_AND_STATUS.txt).
// Add or edit quiz questions in quiz.questions: { q, options: [...], answer: <index of correct option> }.
window.DAL_COURSES = window.DAL_COURSES || [];
window.DAL_COURSES.push({
  "id": "cold-weather",
  "title": "Cold Weather Operations",
  "short": "Cold Weather Ops",
  "subtitle": "30-lesson course for safe winter operations",
  "icon": "❄️",
  "accent": "#1b8fb8",
  "lessonLabel": "Lesson",
  "quiz": {
    "count": 20,
    "passPct": 80,
    "questions": [
      {
        "q": "What does the 'clean aircraft' concept require before takeoff?",
        "options": [
          "No contamination on any critical surface",
          "Minimal frost allowed",
          "Only leading edge must be clean",
          "Tailplane may have snow"
        ],
        "answer": 0
      },
      {
        "q": "Winter operations safety concept: select the best practice.",
        "options": [
          "Follow AFM/FCOM and SOPs",
          "Ignore HOT tables",
          "Disable anti‑ice always",
          "Taxi fast on ice"
        ],
        "answer": 0
      }
    ]
  },
  "lessons": [
    {
      "id": "lesson01",
      "number": "01",
      "title": "Course Overview & Objectives",
      "icon": "🎯",
      "minutes": 5,
      "body": "<p>Purpose: practical, operationally focused winter ops.</p>\n<ul><li>Target audience: flight &amp; ground personnel for domestic operations.</li><li>Outcomes: identify hazards, apply SOPs, coordinate safely.</li><li>Format: 30 short lessons + quiz + closing video.</li></ul>\n<h3>Narration</h3>\n<p>Welcome to Domestic Airlines&#x27; Cold Weather Operations training. In this lesson, you’ll learn the goals of the course, who it is for, and what you will be able to do at the end. Our objective is simple: give you practical tools to operate safely and efficiently in winter conditions.</p>\n<p>By the end of the course you will be able to identify contamination and icing hazards, apply the Clean Aircraft Concept, coordinate de‑icing and anti‑icing procedures, and make sound decisions using company SOPs, the AFM and performance guidance. We will also prepare you for effective communication with de‑ice crews, ramp teams and ATC under time pressure. The course has thirty short lessons, a final quiz that draws twenty questions from a bank of fifty, and a closing video.</p>\n<p>Please review each lesson and use the on‑page audio when helpful. When you’re ready, continue to lesson two. This training is produced by Domestic Airlines.</p>",
      "images": [
        {
          "src": "media/cold-weather/images/lesson01.jpg",
          "alt": "Course Overview & Objectives"
        }
      ],
      "audio": "media/cold-weather/audio/lesson01.mp3"
    },
    {
      "id": "lesson02",
      "number": "02",
      "title": "Cold Weather Meteorology Basics",
      "icon": "🌦️",
      "minutes": 5,
      "body": "<p>Key operational practices for this topic.</p>\n<ul><li>Always use AFM/FCOM and company SOPs.</li><li>Apply HOT/EAT and contamination checks as needed.</li><li>Coordinate with de‑icing crew and ATC.</li></ul>\n<h3>Narration</h3>\n<p>In winter, small changes in temperature, moisture and wind can create big operational differences. We’ll focus on the weather patterns that matter most for safety and schedule reliability. Key ideas: supercooled liquid water, temperature inversions that trap cold air near the surface, and the differences between dry snow, wet snow, sleet and freezing rain.</p>\n<p>Frontal systems and terrain effects can rapidly change precipitation type and intensity. Operationally, read the METAR and TAF closely, monitor radar and satellite loops, and compare reported runway condition codes with pilot reports. Always use company tools and brief the team when conditions are trending worse.</p>\n<p>In the next lessons we’ll connect this meteorology to aircraft icing mechanisms, holdover times and pre‑takeoff checks. This lesson is part of the Domestic Airlines winter operations program.</p>",
      "images": [
        {
          "src": "media/cold-weather/images/lesson02.jpg",
          "alt": "Cold Weather Meteorology Basics"
        }
      ],
      "audio": "media/cold-weather/audio/lesson02.mp3"
    },
    {
      "id": "lesson03",
      "number": "03",
      "title": "Frost, Ice & Snow — Types and Hazards",
      "icon": "❄️",
      "minutes": 3,
      "body": "<p>Key operational practices for this topic.</p>\n<ul><li>Always use AFM/FCOM and company SOPs.</li><li>Apply HOT/EAT and contamination checks as needed.</li><li>Coordinate with de‑icing crew and ATC.</li></ul>",
      "images": [
        {
          "src": "media/cold-weather/images/lesson03.jpg",
          "alt": "Frost, Ice & Snow — Types and Hazards"
        }
      ],
      "audio": "media/cold-weather/audio/lesson03.mp3"
    },
    {
      "id": "lesson04",
      "number": "04",
      "title": "Aircraft Icing Mechanisms (In‑flight vs. Ground)",
      "icon": "🧊",
      "minutes": 3,
      "body": "<p>Key operational practices for this topic.</p>\n<ul><li>Always use AFM/FCOM and company SOPs.</li><li>Apply HOT/EAT and contamination checks as needed.</li><li>Coordinate with de‑icing crew and ATC.</li></ul>",
      "images": [
        {
          "src": "media/cold-weather/images/lesson04.jpg",
          "alt": "Aircraft Icing Mechanisms (In‑flight vs. Ground)"
        }
      ],
      "audio": "media/cold-weather/audio/lesson04.mp3"
    },
    {
      "id": "lesson05",
      "number": "05",
      "title": "Clean Aircraft Concept — Wing & Critical Surface Contamination",
      "icon": "✨",
      "minutes": 3,
      "body": "<p>Key operational practices for this topic.</p>\n<ul><li>Always use AFM/FCOM and company SOPs.</li><li>Apply HOT/EAT and contamination checks as needed.</li><li>Coordinate with de‑icing crew and ATC.</li></ul>",
      "images": [
        {
          "src": "media/cold-weather/images/lesson05.jpg",
          "alt": "Clean Aircraft Concept — Wing & Critical Surface Contamination"
        }
      ],
      "audio": "media/cold-weather/audio/lesson05.mp3"
    },
    {
      "id": "lesson06",
      "number": "06",
      "title": "De/Anti‑icing Principles & Safety",
      "icon": "🚿",
      "minutes": 3,
      "body": "<p>Key operational practices for this topic.</p>\n<ul><li>Always use AFM/FCOM and company SOPs.</li><li>Apply HOT/EAT and contamination checks as needed.</li><li>Coordinate with de‑icing crew and ATC.</li></ul>",
      "images": [
        {
          "src": "media/cold-weather/images/lesson06.jpg",
          "alt": "De/Anti‑icing Principles & Safety"
        }
      ],
      "audio": "media/cold-weather/audio/lesson06.mp3"
    },
    {
      "id": "lesson07",
      "number": "07",
      "title": "De/Anti‑icing Fluids: Type I, II, III, IV",
      "icon": "🧪",
      "minutes": 3,
      "body": "<p>Key operational practices for this topic.</p>\n<ul><li>Always use AFM/FCOM and company SOPs.</li><li>Apply HOT/EAT and contamination checks as needed.</li><li>Coordinate with de‑icing crew and ATC.</li></ul>",
      "images": [
        {
          "src": "media/cold-weather/images/lesson07.jpg",
          "alt": "De/Anti‑icing Fluids: Type I, II, III, IV"
        }
      ],
      "audio": "media/cold-weather/audio/lesson07.mp3"
    },
    {
      "id": "lesson08",
      "number": "08",
      "title": "Holdover Times (HOT) & Estimated Anti‑ice Time (EAT)",
      "icon": "⏱️",
      "minutes": 3,
      "body": "<p>Key operational practices for this topic.</p>\n<ul><li>Always use AFM/FCOM and company SOPs.</li><li>Apply HOT/EAT and contamination checks as needed.</li><li>Coordinate with de‑icing crew and ATC.</li></ul>",
      "images": [
        {
          "src": "media/cold-weather/images/lesson08.jpg",
          "alt": "Holdover Times (HOT) & Estimated Anti‑ice Time (EAT)"
        }
      ],
      "audio": "media/cold-weather/audio/lesson08.mp3"
    },
    {
      "id": "lesson09",
      "number": "09",
      "title": "Ramp Procedures for De‑/Anti‑icing",
      "icon": "🛬",
      "minutes": 3,
      "body": "<p>Key operational practices for this topic.</p>\n<ul><li>Always use AFM/FCOM and company SOPs.</li><li>Apply HOT/EAT and contamination checks as needed.</li><li>Coordinate with de‑icing crew and ATC.</li></ul>",
      "images": [
        {
          "src": "media/cold-weather/images/lesson09.jpg",
          "alt": "Ramp Procedures for De‑/Anti‑icing"
        }
      ],
      "audio": "media/cold-weather/audio/lesson09.mp3"
    },
    {
      "id": "lesson10",
      "number": "10",
      "title": "Gate vs. Remote De‑icing Pads",
      "icon": "📍",
      "minutes": 3,
      "body": "<p>Key operational practices for this topic.</p>\n<ul><li>Always use AFM/FCOM and company SOPs.</li><li>Apply HOT/EAT and contamination checks as needed.</li><li>Coordinate with de‑icing crew and ATC.</li></ul>",
      "images": [
        {
          "src": "media/cold-weather/images/lesson10.jpg",
          "alt": "Gate vs. Remote De‑icing Pads"
        }
      ],
      "audio": "media/cold-weather/audio/lesson10.mp3"
    },
    {
      "id": "lesson11",
      "number": "11",
      "title": "Application Techniques: Nozzles, Flow & Coverage",
      "icon": "💦",
      "minutes": 3,
      "body": "<p>Key operational practices for this topic.</p>\n<ul><li>Always use AFM/FCOM and company SOPs.</li><li>Apply HOT/EAT and contamination checks as needed.</li><li>Coordinate with de‑icing crew and ATC.</li></ul>",
      "images": [
        {
          "src": "media/cold-weather/images/lesson11.jpg",
          "alt": "Application Techniques: Nozzles, Flow & Coverage"
        }
      ],
      "audio": "media/cold-weather/audio/lesson11.mp3"
    },
    {
      "id": "lesson12",
      "number": "12",
      "title": "Protecting Sensors, Ports & Critical Areas",
      "icon": "🛡️",
      "minutes": 3,
      "body": "<p>Key operational practices for this topic.</p>\n<ul><li>Always use AFM/FCOM and company SOPs.</li><li>Apply HOT/EAT and contamination checks as needed.</li><li>Coordinate with de‑icing crew and ATC.</li></ul>",
      "images": [
        {
          "src": "media/cold-weather/images/lesson12.jpg",
          "alt": "Protecting Sensors, Ports & Critical Areas"
        }
      ],
      "audio": "media/cold-weather/audio/lesson12.mp3"
    },
    {
      "id": "lesson13",
      "number": "13",
      "title": "Pre‑Takeoff Contamination Check (PTCC)",
      "icon": "🔍",
      "minutes": 3,
      "body": "<p>Key operational practices for this topic.</p>\n<ul><li>Always use AFM/FCOM and company SOPs.</li><li>Apply HOT/EAT and contamination checks as needed.</li><li>Coordinate with de‑icing crew and ATC.</li></ul>",
      "images": [
        {
          "src": "media/cold-weather/images/lesson13.jpg",
          "alt": "Pre‑Takeoff Contamination Check (PTCC)"
        }
      ],
      "audio": "media/cold-weather/audio/lesson13.mp3"
    },
    {
      "id": "lesson14",
      "number": "14",
      "title": "Performance Effects & Takeoff Considerations",
      "icon": "📊",
      "minutes": 3,
      "body": "<p>Key operational practices for this topic.</p>\n<ul><li>Always use AFM/FCOM and company SOPs.</li><li>Apply HOT/EAT and contamination checks as needed.</li><li>Coordinate with de‑icing crew and ATC.</li></ul>",
      "images": [
        {
          "src": "media/cold-weather/images/lesson14.jpg",
          "alt": "Performance Effects & Takeoff Considerations"
        }
      ],
      "audio": "media/cold-weather/audio/lesson14.mp3"
    },
    {
      "id": "lesson15",
      "number": "15",
      "title": "Braking Action & Runway Condition Codes (TALPA/RCAM)",
      "icon": "🛑",
      "minutes": 3,
      "body": "<p>Key operational practices for this topic.</p>\n<ul><li>Always use AFM/FCOM and company SOPs.</li><li>Apply HOT/EAT and contamination checks as needed.</li><li>Coordinate with de‑icing crew and ATC.</li></ul>",
      "images": [
        {
          "src": "media/cold-weather/images/lesson15.jpg",
          "alt": "Braking Action & Runway Condition Codes (TALPA/RCAM)"
        }
      ],
      "audio": "media/cold-weather/audio/lesson15.mp3"
    },
    {
      "id": "lesson16",
      "number": "16",
      "title": "Slush/Snow/Standing Water — Rejected/Continued Takeoff",
      "icon": "🌨️",
      "minutes": 3,
      "body": "<p>Key operational practices for this topic.</p>\n<ul><li>Always use AFM/FCOM and company SOPs.</li><li>Apply HOT/EAT and contamination checks as needed.</li><li>Coordinate with de‑icing crew and ATC.</li></ul>",
      "images": [
        {
          "src": "media/cold-weather/images/lesson16.jpg",
          "alt": "Slush/Snow/Standing Water — Rejected/Continued Takeoff"
        }
      ],
      "audio": "media/cold-weather/audio/lesson16.mp3"
    },
    {
      "id": "lesson17",
      "number": "17",
      "title": "Cold Starts: Engine & APU Warm‑up",
      "icon": "🔥",
      "minutes": 3,
      "body": "<p>Key operational practices for this topic.</p>\n<ul><li>Always use AFM/FCOM and company SOPs.</li><li>Apply HOT/EAT and contamination checks as needed.</li><li>Coordinate with de‑icing crew and ATC.</li></ul>",
      "images": [
        {
          "src": "media/cold-weather/images/lesson17.jpg",
          "alt": "Cold Starts: Engine & APU Warm‑up"
        }
      ],
      "audio": "media/cold-weather/audio/lesson17.mp3"
    },
    {
      "id": "lesson18",
      "number": "18",
      "title": "Pneumatic, Hydraulic & Electrical Systems in Cold",
      "icon": "⚙️",
      "minutes": 3,
      "body": "<p>Key operational practices for this topic.</p>\n<ul><li>Always use AFM/FCOM and company SOPs.</li><li>Apply HOT/EAT and contamination checks as needed.</li><li>Coordinate with de‑icing crew and ATC.</li></ul>",
      "images": [
        {
          "src": "media/cold-weather/images/lesson18.jpg",
          "alt": "Pneumatic, Hydraulic & Electrical Systems in Cold"
        }
      ],
      "audio": "media/cold-weather/audio/lesson18.mp3"
    },
    {
      "id": "lesson19",
      "number": "19",
      "title": "Fuel Management & Low‑Temp Operations",
      "icon": "⛽",
      "minutes": 3,
      "body": "<p>Key operational practices for this topic.</p>\n<ul><li>Always use AFM/FCOM and company SOPs.</li><li>Apply HOT/EAT and contamination checks as needed.</li><li>Coordinate with de‑icing crew and ATC.</li></ul>",
      "images": [
        {
          "src": "media/cold-weather/images/lesson19.jpg",
          "alt": "Fuel Management & Low‑Temp Operations"
        }
      ],
      "audio": "media/cold-weather/audio/lesson19.mp3"
    },
    {
      "id": "lesson20",
      "number": "20",
      "title": "Flight Controls, Stiffness & Icing Awareness",
      "icon": "🕹️",
      "minutes": 3,
      "body": "<p>Key operational practices for this topic.</p>\n<ul><li>Always use AFM/FCOM and company SOPs.</li><li>Apply HOT/EAT and contamination checks as needed.</li><li>Coordinate with de‑icing crew and ATC.</li></ul>",
      "images": [
        {
          "src": "media/cold-weather/images/lesson20.jpg",
          "alt": "Flight Controls, Stiffness & Icing Awareness"
        }
      ],
      "audio": "media/cold-weather/audio/lesson20.mp3"
    },
    {
      "id": "lesson21",
      "number": "21",
      "title": "Cold‑Weather Checklists & SOPs",
      "icon": "📋",
      "minutes": 3,
      "body": "<p>Key operational practices for this topic.</p>\n<ul><li>Always use AFM/FCOM and company SOPs.</li><li>Apply HOT/EAT and contamination checks as needed.</li><li>Coordinate with de‑icing crew and ATC.</li></ul>",
      "images": [
        {
          "src": "media/cold-weather/images/lesson21.jpg",
          "alt": "Cold‑Weather Checklists & SOPs"
        }
      ],
      "audio": "media/cold-weather/audio/lesson21.mp3"
    },
    {
      "id": "lesson22",
      "number": "22",
      "title": "MEL/CDL, Dispatch & Release in Winter Ops",
      "icon": "📑",
      "minutes": 3,
      "body": "<p>Key operational practices for this topic.</p>\n<ul><li>Always use AFM/FCOM and company SOPs.</li><li>Apply HOT/EAT and contamination checks as needed.</li><li>Coordinate with de‑icing crew and ATC.</li></ul>",
      "images": [
        {
          "src": "media/cold-weather/images/lesson22.jpg",
          "alt": "MEL/CDL, Dispatch & Release in Winter Ops"
        }
      ],
      "audio": "media/cold-weather/audio/lesson22.mp3"
    },
    {
      "id": "lesson23",
      "number": "23",
      "title": "Ground Ops, GSE & Ramp Safety",
      "icon": "🚜",
      "minutes": 3,
      "body": "<p>Key operational practices for this topic.</p>\n<ul><li>Always use AFM/FCOM and company SOPs.</li><li>Apply HOT/EAT and contamination checks as needed.</li><li>Coordinate with de‑icing crew and ATC.</li></ul>",
      "images": [
        {
          "src": "media/cold-weather/images/lesson23.jpg",
          "alt": "Ground Ops, GSE & Ramp Safety"
        }
      ],
      "audio": "media/cold-weather/audio/lesson23.mp3"
    },
    {
      "id": "lesson24",
      "number": "24",
      "title": "CRM & Communication in Winter Ops",
      "icon": "🗣️",
      "minutes": 3,
      "body": "<p>Key operational practices for this topic.</p>\n<ul><li>Always use AFM/FCOM and company SOPs.</li><li>Apply HOT/EAT and contamination checks as needed.</li><li>Coordinate with de‑icing crew and ATC.</li></ul>",
      "images": [
        {
          "src": "media/cold-weather/images/lesson24.jpg",
          "alt": "CRM & Communication in Winter Ops"
        }
      ],
      "audio": "media/cold-weather/audio/lesson24.mp3"
    },
    {
      "id": "lesson25",
      "number": "25",
      "title": "Abnormals & Emergencies: Ice Ingestion, Stalls, Slide Deployment",
      "icon": "🚨",
      "minutes": 3,
      "body": "<p>Key operational practices for this topic.</p>\n<ul><li>Always use AFM/FCOM and company SOPs.</li><li>Apply HOT/EAT and contamination checks as needed.</li><li>Coordinate with de‑icing crew and ATC.</li></ul>",
      "images": [
        {
          "src": "media/cold-weather/images/lesson25.jpg",
          "alt": "Abnormals & Emergencies: Ice Ingestion, Stalls, Slide Deployment"
        }
      ],
      "audio": "media/cold-weather/audio/lesson25.mp3"
    },
    {
      "id": "lesson26",
      "number": "26",
      "title": "Alternate Airports & En‑route Cold‑Weather Considerations",
      "icon": "🗺️",
      "minutes": 3,
      "body": "<p>Key operational practices for this topic.</p>\n<ul><li>Always use AFM/FCOM and company SOPs.</li><li>Apply HOT/EAT and contamination checks as needed.</li><li>Coordinate with de‑icing crew and ATC.</li></ul>",
      "images": [
        {
          "src": "media/cold-weather/images/lesson26.jpg",
          "alt": "Alternate Airports & En‑route Cold‑Weather Considerations"
        }
      ],
      "audio": "media/cold-weather/audio/lesson26.mp3"
    },
    {
      "id": "lesson27",
      "number": "27",
      "title": "Cabin & Passenger Safety in Cold Conditions",
      "icon": "🧥",
      "minutes": 3,
      "body": "<p>Key operational practices for this topic.</p>\n<ul><li>Always use AFM/FCOM and company SOPs.</li><li>Apply HOT/EAT and contamination checks as needed.</li><li>Coordinate with de‑icing crew and ATC.</li></ul>",
      "images": [
        {
          "src": "media/cold-weather/images/lesson27.jpg",
          "alt": "Cabin & Passenger Safety in Cold Conditions"
        }
      ],
      "audio": "media/cold-weather/audio/lesson27.mp3"
    },
    {
      "id": "lesson28",
      "number": "28",
      "title": "Safety Management System (SMS) & Reporting",
      "icon": "📝",
      "minutes": 3,
      "body": "<p>Key operational practices for this topic.</p>\n<ul><li>Always use AFM/FCOM and company SOPs.</li><li>Apply HOT/EAT and contamination checks as needed.</li><li>Coordinate with de‑icing crew and ATC.</li></ul>",
      "images": [
        {
          "src": "media/cold-weather/images/lesson28.jpg",
          "alt": "Safety Management System (SMS) & Reporting"
        }
      ],
      "audio": "media/cold-weather/audio/lesson28.mp3"
    },
    {
      "id": "lesson29",
      "number": "29",
      "title": "Regulations & Company Policy Overview",
      "icon": "⚖️",
      "minutes": 3,
      "body": "<p>Key operational practices for this topic.</p>\n<ul><li>Always use AFM/FCOM and company SOPs.</li><li>Apply HOT/EAT and contamination checks as needed.</li><li>Coordinate with de‑icing crew and ATC.</li></ul>",
      "images": [
        {
          "src": "media/cold-weather/images/lesson29.jpg",
          "alt": "Regulations & Company Policy Overview"
        }
      ],
      "audio": "media/cold-weather/audio/lesson29.mp3"
    },
    {
      "id": "lesson30",
      "number": "30",
      "title": "Course Review & Next Steps",
      "icon": "🏁",
      "minutes": 3,
      "body": "<p>Key operational practices for this topic.</p>\n<ul><li>Always use AFM/FCOM and company SOPs.</li><li>Apply HOT/EAT and contamination checks as needed.</li><li>Coordinate with de‑icing crew and ATC.</li></ul>",
      "images": [
        {
          "src": "media/cold-weather/images/lesson30.jpg",
          "alt": "Course Review & Next Steps"
        }
      ],
      "audio": "media/cold-weather/audio/lesson30.mp3"
    }
  ]
});

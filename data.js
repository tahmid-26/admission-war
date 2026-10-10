// EDIT THIS FILE to change exam dates, daily blocks, or chapters. Your progress is stored separately (browser + exported backup), so editing this never erases progress.
// Chapter format: [name, startStatus, note]. startStatus: 0 = HSC-level only, 1 = attended but needs practice, 2 = done and practiced.
window.DATA = {
  sub: { P: "Physics", C: "Chemistry", M: "Math" },
  exams: [
    ["DU Science (KA)", "2026-12-12"], ["MIST", "2026-12-19"], ["JnU A", "2027-01-01"],
    ["KUET", "2027-01-08"], ["RUET", "2027-01-14"], ["BUET", "2027-01-16"],
    ["BUTEX", "2027-01-29"], ["GST (tentative)", "2027-03-19"]
  ],
  targets: [["2026-10-22", 50], ["2026-11-14", 65], ["2026-12-11", 75], ["2027-01-08", 80]],
  // ---- Settings ----
  googleClientId: "69704196789-e0teg7cp6pki11vq4jpfqq8r270nlbis.apps.googleusercontent.com",          // paste your Google OAuth client ID here to enable Drive sync (see README)
  phoneLimit: 40,              // daily social-media limit in minutes
  paceExams: ["DU Science (KA)", "BUET"],
  // ---- Default routine (you can edit it inside the app: More > Routine) ----
  // [start, end, label, subject, must-do on hard days, steps]
  // subject: M/P/C = chapter picker for that subject, R = class recording, B = practice (any chapter), E = error log, N = nap (25-min timer), Z = sleep, "" = none
  // steps are separated by ";". Add [L] Learned, [P] Practiced, [R] Revised or [W] class watched to a step to update Chapters (the app asks first).
  blocks: [
    ["05:10","05:45","Wake, Fajr, water, 10-min walk. No phone for 60 min","",1,"Fajr; Water and walk; No phone"],
    ["05:45","07:45","Math","M",1,"Learn concept [L]; Solve examples; Timed practice [P]; Log errors [R]"],
    ["07:45","08:00","Breakfast","",0,""],
    ["08:00","08:25","Power nap 1 (25 min)","N",0,"Nap done"],
    ["08:25","08:45","Freshen up (screen-free)","",0,""],
    ["08:45","10:45","Physics","P",1,"Learn concept [L]; Solve examples; Timed practice [P]; Log errors [R]"],
    ["11:00","11:45","Chemistry (physical / inorganic)","C",1,"Learn concept [L]; Solve examples; Timed practice [P]; Log errors [R]"],
    ["11:45","13:30","Dhuhr and lunch (no nap)","",0,""],
    ["13:30","14:15","Organic chemistry","C",0,"Learn concept [L]; Solve examples; Timed practice [P]; Log errors [R]"],
    ["14:15","15:00","Error log and mixed timed practice","E",0,"Review error log; Re-attempt wrong questions; Timed mixed set"],
    ["15:00","15:30","Asr, walk, social window 1 (20 min)","",0,""],
    ["15:30","15:55","Power nap 2 (25 min)","N",0,"Nap done"],
    ["16:00","","Watch last night's ACS recording (pray Maghrib when it comes)","R",0,"Watch recording [W]; Pause and solve examples; Write down doubts"],
    ["18:15","19:15","Practice questions on that class","B",0,"Practice questions [P]; Log gaps in Backlog"],
    ["19:15","20:15","Isha, dinner, social window 2 (20 min)","",0,""],
    ["20:15","21:15","Flashcards and backlog catch-up","B",0,"Flashcards; Backlog catch-up"],
    ["21:15","22:30","Timed MCQ set or weak-chapter practice (optional)","E",0,"Timed MCQ set; Review mistakes"],
    ["22:30","23:10","Wind down, plan tomorrow on paper, phone out of the room","",1,"Plan tomorrow; Phone out of room"],
    ["23:10","","Sleep (6 h, wake 5:10)","Z",1,"In bed on time"]
  ],
  // ACS class totals per chapter, taken from your schedule (approximate; editable in the Chapters tab)
  classes: {"P:Newtonian Mechanics":3,"P:Work, Power & Energy":2,"P:Gravitation":2,"P:Material Structural Property":2,"P:Periodic Motion":3,"P:Waves":2,"P:Ideal Gas & Gas Kinematics":2,"P:Thermodynamics":2,"P:Static Electricity":2,"P:Current Electricity":2,"P:Magnetic Effects of Current":2,"P:Electromagnetic Induction":1,"P:Geometrical Optics":2,"P:Physical Optics":1,"P:Modern Physics":1,"P:Atomic Model & Nuclear":1,"P:Semiconductor & Electronics":1,
    "C:Lab Safety":1,"C:Quantitative Chemistry":3,"C:Qualitative Chemistry":4,"C:Periodic Property & Bonding":5,"C:Electrochemistry":3,"C:Environmental Chemistry":2,"C:Economic Chemistry":1,"C:Functional Chemistry":1,"C:Organic Chemistry":9,
    "M:Complex Numbers":2,"M:Polynomials":2,"M:Binomial Expansion":2,"M:Conics":3,"M:Vector":1,"M:Trigonometric Ratios":1,"M:Associated Angles":1,"M:Inverse Trig & Equations":1,"M:Permutation & Combination":2,"M:Functions & Graphs":1,"M:Real Numbers & Inequality":1,"M:Linear Programming":1,"M:Statics":2,"M:Motion of Particles":2,"M:Dispersion & Probability":1,"M:Differentiation":3,"M:Integration":2,"M:Matrix & Determinant":1},
  // ---- Your offline exams (Udvash exam batch, Step 2 routine). Add more in the app: More > Exams ----
  examTime: "10:15",                  // default start time of your offline exams (set your real batch time in More > Exams)
  examMin: { D: 60, W: 150, M: 240 }, // minutes including commute: Daily, Weekly, Monthly
  // [id, date, name, type (D daily / W weekly / M monthly), chapters covered]
  myExams: [
    ["C-08","2026-10-12","Daily exam C-08 (Organic)","D",["C:Organic Chemistry"]],
    ["M-08","2026-10-14","Daily exam M-08 (LP, Probability)","D",["M:Linear Programming","M:Dispersion & Probability"]],
    ["W-08","2026-10-15","Weekly exam 08 (P8+C8+M8)","W",["P:Static Electricity","P:Atomic Model & Nuclear","C:Organic Chemistry","M:Linear Programming","M:Dispersion & Probability"]],
    ["P-09","2026-10-16","Daily exam P-09 (Current electricity, Astronomy)","D",["P:Current Electricity","P:Astronomy"]],
    ["C-09","2026-10-19","Daily exam C-09 (Organic)","D",["C:Organic Chemistry"]],
    ["MON-02","2026-10-22","Monthly exam 02 (PCM lectures 05-08, written 600)","M",["P:Gravitation","P:Material Structural Property","P:Periodic Motion","P:Waves","P:Thermodynamics","P:Ideal Gas & Gas Kinematics","P:Static Electricity","P:Atomic Model & Nuclear","C:Periodic Property & Bonding","C:Electrochemistry","C:Functional Chemistry","C:Environmental Chemistry","C:Economic Chemistry","C:Organic Chemistry","M:Matrix & Determinant","M:Polynomials","M:Functions & Graphs","M:Binomial Expansion","M:Permutation & Combination","M:Linear Programming","M:Dispersion & Probability"]],
    ["M-09","2026-10-23","Daily exam M-09 (Trigonometry)","D",["M:Trigonometric Ratios","M:Associated Angles","M:Inverse Trig & Equations"]],
    ["W-09","2026-10-25","Weekly exam 09 (P9+C9+M9)","W",["P:Current Electricity","P:Astronomy","C:Organic Chemistry","M:Trigonometric Ratios","M:Associated Angles","M:Inverse Trig & Equations"]],
    ["C-10","2026-10-26","Daily exam C-10 (Organic)","D",["C:Organic Chemistry"]]
  ],
  ch: {
    P: [["Physical World & Measurement",0],["Vector",2],["Dynamics",2],["Newtonian Mechanics",1,"revisit, not fully done in HSC"],["Work, Power & Energy",0],["Gravitation",0],["Material Structural Property",0],["Periodic Motion",0],["Waves",1],["Ideal Gas & Gas Kinematics",0],["Thermodynamics",0],["Static Electricity",0],["Current Electricity",0],["Magnetic Effects of Current",0],["Electromagnetic Induction",0],["Geometrical Optics",0],["Physical Optics",0],["Modern Physics",0],["Atomic Model & Nuclear",0],["Semiconductor & Electronics",0],["Astronomy",0]],
    C: [["Lab Safety",0],["Qualitative Chemistry",0],["Periodic Property & Bonding",0],["Chemical Change",0,"ACS class done, recheck"],["Functional Chemistry",0],["Environmental Chemistry",0],["Organic Chemistry",0,"weak area, daily 45 min"],["Quantitative Chemistry",2],["Electrochemistry",1],["Economic Chemistry",0]],
    M: [["Matrix & Determinant",0],["Vector",0],["Straight Line",2],["Circle",2],["Permutation & Combination",1],["Trigonometric Ratios",0],["Associated Angles",0],["Functions & Graphs",0],["Differentiation",0],["Integration",0,"not fully done in HSC"],["Real Numbers & Inequality",0],["Linear Programming",0],["Complex Numbers",2],["Polynomials",0],["Binomial Expansion",0],["Conics",0],["Inverse Trig & Equations",0],["Statics",0],["Motion of Particles",0],["Dispersion & Probability",0]]
  }
};

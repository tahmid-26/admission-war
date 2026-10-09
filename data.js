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
  // [time, label, subject (M/P/C pick a chapter; B,L,E,"" none), minimum-day flag]
  blocks: [
    ["05:45", "Wake, Fajr, water, 10-min walk. No phone for 60 min", "", 1],
    ["06:15-08:15", "Math: 25% learn, 75% questions", "M", 1],
    ["09:00-11:00", "Physics", "P", 1],
    ["11:15-12:45", "Chemistry (physical / inorganic)", "C", 1],
    ["12:45-14:30", "Dhuhr, lunch, nap 20 min max", "", 0],
    ["14:30-15:15", "Organic chemistry", "C", 0],
    ["15:15-16:00", "Error log + mixed timed practice", "E", 0],
    ["16:00-17:30", "Asr, walk / exercise, social window 1 (20 min)", "", 0],
    ["17:30-19:30", "Maghrib, then backlog from missed live classes", "B", 0],
    ["19:30-21:00", "Isha, dinner, social window 2 (20 min)", "", 0],
    ["21:00-22:30", "ACS live class (add anything you miss to Backlog)", "L", 0],
    ["22:45", "Plan tomorrow on paper, phone out of room, sleep", "", 1]
  ],
  ch: {
    P: [["Physical World & Measurement",0],["Vector",2],["Dynamics",2],["Newtonian Mechanics",1,"revisit, not fully done in HSC"],["Work, Power & Energy",0],["Gravitation",0],["Material Structural Property",0],["Periodic Motion",0],["Waves",1],["Ideal Gas & Gas Kinematics",0],["Thermodynamics",0],["Static Electricity",0],["Current Electricity",0],["Magnetic Effects of Current",0],["Electromagnetic Induction",0],["Geometrical Optics",0],["Physical Optics",0],["Modern Physics",0],["Atomic Model & Nuclear",0],["Semiconductor & Electronics",0],["Astronomy",0]],
    C: [["Lab Safety",0],["Qualitative Chemistry",0],["Periodic Property & Bonding",0],["Chemical Change",0,"ACS class done, recheck"],["Functional Chemistry",0],["Environmental Chemistry",0],["Organic Chemistry",0,"weak area, daily 45 min"],["Quantitative Chemistry",2],["Electrochemistry",1],["Economic Chemistry",0]],
    M: [["Matrix & Determinant",0],["Vector",0],["Straight Line",2],["Circle",2],["Permutation & Combination",1],["Trigonometric Ratios",0],["Associated Angles",0],["Functions & Graphs",0],["Differentiation",0],["Integration",0,"not fully done in HSC"],["Real Numbers & Inequality",0],["Linear Programming",0],["Complex Numbers",2],["Polynomials",0],["Binomial Expansion",0],["Conics",0],["Inverse Trig & Equations",0],["Statics",0],["Motion of Particles",0],["Dispersion & Probability",0]]
  }
};

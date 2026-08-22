// Confirmed flight itineraries. Factual travel data only — no speculative
// airport logistics or transportation instructions beyond what's booked.
export const FLIGHT_ITINERARIES = [
  {
    id: "main-squad",
    label: "MAIN SQUAD",
    route: "MDW ⇄ MCO",
    travelers: [
      "Brandon Lee Kopp",
      "Melissa Lynne Kopp",
      "Ava Nicole Norris",
      "Marissa Marie Kopp",
      "Levi Thomas Chafton",
    ],
    confirmation: "ACBSPQ",
    outbound: {
      date: "Monday, October 19, 2026",
      flight: "Southwest WN 2919",
      from: { code: "MDW", city: "Chicago Midway", time: "5:00 AM" },
      to: { code: "MCO", city: "Orlando", time: "8:30 AM" },
      duration: "2h 30m",
    },
    returnFlight: {
      date: "Friday, October 23, 2026",
      flight: "Southwest WN 1670",
      from: { code: "MCO", city: "Orlando", time: "6:30 PM" },
      to: { code: "MDW", city: "Chicago Midway", time: "8:20 PM" },
      duration: "2h 50m",
    },
  },
  {
    id: "justin",
    label: "JUSTIN",
    route: "AUS ⇄ MCO",
    travelers: ["Justin Alexander Kopp"],
    confirmation: "ACH6YI",
    outbound: {
      date: "Monday, October 19, 2026",
      flight: "Southwest WN 0366",
      from: { code: "AUS", city: "Austin", time: "5:05 AM" },
      to: { code: "MCO", city: "Orlando", time: "8:40 AM" },
      duration: "2h 35m",
      seat: "17F — Standard",
    },
    returnFlight: {
      date: "Friday, October 23, 2026",
      flight: "Southwest WN 2675",
      from: { code: "MCO", city: "Orlando", time: "5:25 PM" },
      to: { code: "AUS", city: "Austin", time: "7:15 PM" },
      duration: "2h 50m",
      seat: "17F — Standard",
    },
  },
];

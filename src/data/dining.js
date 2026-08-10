// Restaurant roster, categorized. `topPickEligible` gates which category can
// receive a person's one Top Dinner Pick — only sit-down restaurants, per spec.

const CITYWALK_RESTAURANTS = [
  { slug: "antojitos", name: "Antojitos Authentic Mexican Food", note: "CityWalk · Full-service, tableside guac, live music" },
  { slug: "bigfire", name: "Bigfire", note: "CityWalk · Full-service, open-fire steaks, tableside s'mores" },
  { slug: "bobmarley", name: "Bob Marley – A Tribute to Freedom", note: "CityWalk · Full-service, Caribbean, live reggae" },
  { slug: "bubbagump", name: "Bubba Gump Shrimp Co.", note: "CityWalk · Full-service, seafood" },
  { slug: "cowfish", name: "The Cowfish Sushi Burger Bar", note: "CityWalk · Full-service, sushi + burgers" },
  { slug: "hardrock", name: "Hard Rock Cafe", note: "CityWalk · Full-service, American" },
  { slug: "margaritaville", name: "Jimmy Buffett's Margaritaville", note: "CityWalk · Full-service, Caribbean/Tex-Mex" },
  { slug: "nbcgrill", name: "NBC Sports Grill & Brew", note: "CityWalk · Full-service, pub fare" },
  { slug: "patobriens", name: "Pat O'Brien's", note: "CityWalk · Full-service, Cajun/Creole, dueling pianos" },
  { slug: "toothsome", name: "The Toothsome Chocolate Emporium", note: "CityWalk · Full-service, steampunk, huge milkshakes" },
  { slug: "vivo", name: "VIVO Italian Kitchen", note: "CityWalk · Full-service, Italian" },
];

const QUICK_MEAL = [
  { slug: "breadbox", name: "Bread Box Handcrafted Sandwiches", note: "CityWalk · Quick-service, sandwiches" },
  { slug: "burgerking", name: "Burger King Whopper Bar", note: "CityWalk · Quick-service, burgers" },
  { slug: "hotdoghalloffame", name: "Hot Dog Hall of Fame", note: "CityWalk · Quick-service, hot dogs" },
  { slug: "moes", name: "Moe's Southwest Grill", note: "CityWalk · Quick-service, burritos, quesadillas" },
  { slug: "pandaexpress", name: "Panda Express", note: "CityWalk · Quick-service, Asian" },
  { slug: "redoven", name: "Red Oven Pizza Bakery", note: "CityWalk · Quick-service, pizza" },
  { slug: "starbucks", name: "Starbucks", note: "CityWalk · Quick-service, coffee" },
];

const DESSERT_SNACK = [
  { slug: "coldstone", name: "Cold Stone Creamery", note: "CityWalk · Dessert" },
  { slug: "menchies", name: "Menchie's Frozen Yogurt", note: "CityWalk · Dessert" },
  { slug: "voodoodoughnut", name: "Voodoo Doughnut", note: "CityWalk · Dessert" },
];

function withIds(list, prefix) {
  return list.map((r) => ({ id: `din-${prefix}-${r.slug}`, name: r.name, note: r.note }));
}

export const DINING_SITDOWN = withIds(CITYWALK_RESTAURANTS, "sit").map((d) => ({ ...d, topPickEligible: true }));
export const DINING_QUICK = withIds(QUICK_MEAL, "quick").map((d) => ({ ...d, topPickEligible: false }));
export const DINING_DESSERT = withIds(DESSERT_SNACK, "dessert").map((d) => ({ ...d, topPickEligible: false }));

export const ALL_DINING = [...DINING_SITDOWN, ...DINING_QUICK, ...DINING_DESSERT];

// Ava's Birthday Dinner and the HHN meal strategy are DECISIONS, not restaurant
// votes — they're handled by their own UI (birthdayPick.js concept + the HHN
// zone's singleChoiceGroup in parks.js), not folded into ALL_DINING.

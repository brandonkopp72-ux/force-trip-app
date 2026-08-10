// Trip content lives here, separate from UI/logic, so attractions, closures,
// and HHN details can be updated later without touching components.
// `votable: false` marks informational-only items that don't count toward
// completion tracking (closed during our trip, coming soon, retired, etc.)

export const PARKS = [
  {
    id: "hs",
    park: "Hollywood Studios",
    missionLog: "First boots on Batuu soil, Rebels — welcome to the galaxy.",
    accent: "#7a2b2b",
    accentSoft: "#f2e6e6",
    arrivalNote:
      "Arrival day — land ~8:30 AM, Uber to Dockside Inn & Suites to drop bags (room if ready, bell storage if not), then Uber straight to Hollywood Studios. Uber back to the hotel in the evening for dinner and check-in.",
    learnMoreUrl: "https://disneyworld.disney.go.com/destinations/hollywood-studios/",
    learnMoreLabel: "Disney's Hollywood Studios — official page",
    lands: [
      {
        name: "Sunset Boulevard",
        items: [
          { id: "hs-tot", name: "Tower of Terror", tag: "Thrill", votable: true },
          { id: "hs-rockcoaster", name: "Rock 'n' Roller Coaster Starring The Muppets", tag: "Coaster", votable: true },
          { id: "hs-beautybeast", name: "Beauty and the Beast — Live on Stage", tag: "Show, 25 min", votable: true },
          { id: "hs-fantasmic", name: "Fantasmic!", tag: "Nighttime show — check showtime", votable: true },
        ],
      },
      {
        name: "Star Wars: Galaxy's Edge",
        items: [
          { id: "hs-rise", name: "Rise of the Resistance", tag: "Ride — book early", votable: true },
          { id: "hs-falcon", name: "Millennium Falcon: Smugglers Run", tag: "Ride", votable: true },
        ],
        singleChoiceGroups: [
          {
            id: "sw-buildyourown",
            label: "Build-your-own — pick one per person",
            note: "Both need a reservation, but at these prices most families pick one, not both.",
            options: [
              { id: "hs-droiddepot", name: "Droid Depot — build a droid", price: "~$130" },
              { id: "hs-savisworkshop", name: "Savi's Workshop — build a lightsaber", price: "~$275" },
            ],
          },
        ],
      },
      {
        name: "Toy Story Land",
        items: [
          { id: "hs-slinky", name: "Slinky Dog Dash", tag: "Coaster", votable: true },
          { id: "hs-alien", name: "Alien Swirling Saucers", tag: "Family ride", votable: true },
          { id: "hs-toystorymania", name: "Toy Story Mania", tag: "Interactive", votable: true },
        ],
      },
      {
        name: "Echo Lake",
        items: [
          { id: "hs-startours", name: "Star Tours", tag: "Ride", votable: true },
          { id: "hs-indianajones", name: "Indiana Jones Epic Stunt Spectacular", tag: "Show", votable: true },
        ],
      },
      {
        name: "Animation Courtyard",
        items: [
          { id: "hs-runaway", name: "Mickey & Minnie's Runaway Railway", tag: "Ride", votable: true },
          { id: "hs-frozensingalong", name: "Frozen Sing-Along Celebration", tag: "Show, A/C break", votable: true },
          { id: "hs-littlemermaid", name: "The Little Mermaid — A Musical Adventure", tag: "Show", votable: true },
          { id: "hs-villains", name: "Disney Villains: Unfairly Ever After", tag: "Show", votable: true },
        ],
      },
    ],
  },
  {
    id: "ioa",
    park: "Islands of Adventure",
    missionLog: "Coordinates locked for the Islands — dinosaurs, wizards, and web-slingers ahead.",
    accent: "#2f5d42",
    accentSoft: "#e7efe6",
    learnMoreUrl: "https://www.universalorlando.com/web/en/us/theme-parks/islands-of-adventure",
    learnMoreLabel: "Islands of Adventure — official page",
    lands: [
      {
        name: "Marvel Super Hero Island",
        items: [
          { id: "ioa-spiderman", name: "The Amazing Adventures of Spider-Man", tag: "Ride", votable: true },
          { id: "ioa-hulk", name: "The Incredible Hulk Coaster", tag: "Coaster", votable: true },
          { id: "ioa-doomfearfall", name: "Doctor Doom's Fearfall", tag: "Thrill", votable: true },
        ],
      },
      {
        name: "Toon Lagoon",
        items: [
          { id: "ioa-bilgerat", name: "Popeye & Bluto's Bilge-Rat Barges", tag: "Water ride", votable: true },
          { id: "ioa-ripsaw", name: "Dudley Do-Right's Ripsaw Falls", tag: "Water ride", votable: true },
        ],
      },
      {
        name: "Skull Island",
        items: [{ id: "ioa-kong", name: "Reign of Kong", tag: "Ride", votable: true }],
      },
      {
        name: "Jurassic Park",
        items: [
          { id: "ioa-velocicoaster", name: "Jurassic World VelociCoaster", tag: "Coaster", votable: true },
          {
            id: "ioa-riveradventure",
            name: "Jurassic Park River Adventure",
            tag: "Closed for refurb through Nov 19, 2026",
            votable: false,
          },
          { id: "ioa-campjurassic", name: "Camp Jurassic (explore)", tag: "Play", votable: true },
          { id: "ioa-pteranodon", name: "Pteranodon Flyers", tag: "Kids only, one adult per child", votable: true },
        ],
      },
      {
        name: "Wizarding World — Hogsmeade",
        items: [
          { id: "ioa-forbiddenjourney", name: "Harry Potter and the Forbidden Journey", tag: "Ride", votable: true },
          { id: "ioa-hagrids", name: "Hagrid's Magical Creatures Motorbike Adventure", tag: "Coaster", votable: true },
          { id: "ioa-hippogriff", name: "Flight of the Hippogriff", tag: "Family coaster", votable: true },
          { id: "ioa-ollivanders", name: "Ollivanders Wand Shop Experience", tag: "Interactive show", votable: true },
        ],
      },
      {
        name: "Seuss Landing",
        items: [
          { id: "ioa-catinthehat", name: "The Cat in the Hat", tag: "Family ride", votable: true },
          { id: "ioa-trolley", name: "High in the Sky Seuss Trolley Train", tag: "Family ride", votable: true },
        ],
      },
    ],
  },
  {
    id: "epic",
    park: "Epic Universe",
    missionLog: "Uncharted territory — nobody in this crew has scouted Epic before. Full send.",
    accent: "#5b3a86",
    accentSoft: "#eee7f5",
    learnMoreUrl: "https://www.universalorlando.com/web/en/us/theme-parks/epic-universe",
    learnMoreLabel: "Epic Universe — official page",
    lands: [
      {
        name: "Super Nintendo World",
        items: [
          { id: "epic-mariokart", name: "Mario Kart: Bowser's Challenge", tag: "Ride", votable: true },
          { id: "epic-minecart", name: "Mine-Cart Madness", tag: "Coaster", votable: true },
          { id: "epic-yoshi", name: "Yoshi's Adventure", tag: "Family ride", votable: true },
        ],
      },
      {
        name: "How to Train Your Dragon — Isle of Berk",
        items: [
          { id: "epic-dragonrally", name: "Dragon Racer's Rally", tag: "Coaster", votable: true },
          { id: "epic-wingliders", name: "Hiccup's Wing Gliders", tag: "Coaster", votable: true },
          { id: "epic-fyredrill", name: "Fyre Drill", tag: "Interactive boat ride", votable: true },
        ],
      },
      {
        name: "Celestial Park",
        items: [
          { id: "epic-stardust", name: "Stardust Racers", tag: "Dueling coaster", votable: true },
          { id: "epic-carousel", name: "Constellation Carousel", tag: "Best after dark", votable: true },
          { id: "epic-astronomica", name: "Astronomica", tag: "Splash play area", votable: true },
        ],
      },
      {
        name: "The Wizarding World — Ministry of Magic",
        items: [
          {
            id: "epic-ministry",
            name: "Harry Potter and the Battle at the Ministry",
            tag: "Ride — longest waits",
            votable: true,
          },
        ],
      },
      {
        name: "Dark Universe",
        items: [
          { id: "epic-werewolf", name: "Curse of the Werewolf", tag: "Coaster", votable: true },
          {
            id: "epic-monstersunchained",
            name: "Monsters Unchained: Frankenstein's Experiment",
            tag: "Dark ride",
            votable: true,
          },
        ],
      },
    ],
  },
  {
    id: "usf",
    park: "Universal Studios Florida",
    missionLog: "Final approach — and happy birthday to our own rebel commander, Ava.",
    accent: "#1f4e79",
    accentSoft: "#e5edf5",
    specialNote:
      "Ava's birthday daytime zone. Regular hours end mid-afternoon — head back to Dockside for a break before Halloween Horror Nights takes over this same park tonight (see the HHN zone).",
    learnMoreUrl: "https://www.universalorlando.com/web/en/us/theme-parks/universal-studios-florida",
    learnMoreLabel: "Universal Studios Florida — official page",
    lands: [
      {
        name: "Hollywood (entrance)",
        items: [
          { id: "usf-bourne", name: "The Bourne Stuntacular", tag: "Live stunt show, A/C", votable: true },
          { id: "usf-et", name: "E.T. Adventure", tag: "Family ride", votable: true },
        ],
      },
      {
        name: "Minion Land",
        items: [
          { id: "usf-minionmayhem", name: "Despicable Me Minion Mayhem", tag: "Family ride", votable: true },
          { id: "usf-villaincon", name: "Villain-Con Minion Blast", tag: "Interactive", votable: true },
        ],
      },
      {
        name: "Production Central",
        items: [
          { id: "usf-transformers", name: "Transformers: The Ride 3D", tag: "Ride", votable: true },
          {
            id: "usf-hollywooddrift-note",
            name: "Fast & Furious: Hollywood Drift",
            tag: "Under construction — coming 2027",
            votable: false,
          },
        ],
      },
      {
        name: "New York",
        items: [
          { id: "usf-mummy", name: "Revenge of the Mummy", tag: "Coaster/thrill", votable: true },
          { id: "usf-fallon", name: "Race Through New York with Jimmy Fallon", tag: "Simulator", votable: true },
        ],
      },
      {
        name: "World Expo",
        items: [{ id: "usf-meninblack", name: "MEN IN BLACK Alien Attack", tag: "Ride", votable: true }],
      },
      {
        name: "Springfield",
        items: [
          { id: "usf-simpsons", name: "The Simpsons Ride", tag: "Simulator", votable: true },
          { id: "usf-kangkodos", name: "Kang & Kodos' Twirl 'n' Hurl", tag: "Family ride", votable: true },
        ],
      },
      {
        name: "DreamWorks Land",
        items: [
          { id: "usf-trollercoaster", name: "Trolls Trollercoaster", tag: "Family coaster", votable: true },
          { id: "usf-shrekswamp", name: "Shrek's Swamp for Little Ogres", tag: "Play area", votable: true },
          { id: "usf-pokungfu", name: "Po's Kung Fu Training Camp", tag: "Interactive play", votable: true },
        ],
      },
      {
        name: "Wizarding World — Diagon Alley",
        items: [
          { id: "usf-gringotts", name: "Harry Potter and the Escape from Gringotts", tag: "Ride", votable: true },
          { id: "usf-hogwartsexpress", name: "Hogwarts Express (to Hogsmeade)", tag: "Transport ride", votable: true },
        ],
      },
    ],
  },
  {
    id: "hhn",
    park: "Halloween Horror Nights",
    missionLog: "The fog rolls in. Jack and Oddfellow are waiting — this one's not for the faint of heart.",
    accent: "#4a1414",
    accentSoft: "#f0e2e2",
    specialNote:
      "Scream Early access begins at 2:00 PM; the event itself runs from 6:30 PM past midnight. Not recommended for kids under 13.",
    learnMoreUrl: "https://orlando.halloweenhorrornights.com",
    learnMoreLabel: "Halloween Horror Nights — official site",
    isHHN: true,
    lands: [
      {
        name: "Meal Strategy",
        singleChoiceGroups: [
          {
            id: "hhn-mealstrategy",
            label: "Before Horror Nights — pick one per person",
            note: "This is a planning decision, not a restaurant vote — see the Rations tab for actual dinner picks.",
            options: [
              { id: "hhn-meal-sitdown", name: "Full sit-down dinner before gates", price: "" },
              { id: "hhn-meal-quickbite", name: "Quick bite before gates", price: "" },
              { id: "hhn-meal-snackonly", name: "Skip dinner, snack during the event", price: "" },
            ],
          },
        ],
      },
      {
        name: "Haunted Houses",
        items: [
          { id: "hhn-jackoddfellow", name: "Jack & Oddfellow: Chaos & Control", tag: "Icon house", votable: true },
          { id: "hhn-sinners", name: "Sinners", tag: "Based on the film", votable: true },
          { id: "hhn-strangerthings", name: "Stranger Things 5", tag: "Based on the series", votable: true },
          {
            id: "hhn-bloodengutz",
            name: "H.R. Bloodengutz Presents: A Halloween Fright-Tacular!",
            tag: "Returning original",
            votable: true,
          },
          { id: "hhn-madlands", name: "Madlands: Caged Cannibals", tag: "Original", votable: true },
          { id: "hhn-cybergoria", name: "Cybergoria", tag: "Original, sci-fi", votable: true },
          { id: "hhn-invasion", name: "Invasion: Alien Abduction", tag: "Original", votable: true },
          { id: "hhn-hellraiser", name: "Hellraiser", tag: "First-ever HHN Hellraiser house", votable: true },
          { id: "hhn-evildead", name: "Evil Dead Burn", tag: "Based on the film", votable: true },
          { id: "hhn-ozzy", name: "Ozzy Osbourne: Prince of Darkness", tag: "Based on his solo career", votable: true },
        ],
      },
      {
        name: "Live Shows",
        items: [
          { id: "hhn-bloodnoir", name: "Nightmare Fuel: Blood Noir", tag: "Stunt spectacular", votable: true },
          {
            id: "hhn-strangerthingsshow",
            name: "Stranger Things: Return to Hawkins",
            tag: "New lagoon show",
            votable: true,
          },
        ],
      },
      {
        name: "Scare Zones",
        items: [
          {
            id: "hhn-carnival",
            name: "Infernal Carnival of Nightmares",
            tag: "Encountered naturally while walking",
            votable: false,
          },
          { id: "hhn-sideshow", name: "Sideshow of Decay", tag: "Encountered naturally while walking", votable: false },
          {
            id: "hhn-downtownclown",
            name: "Downtown Clown Town",
            tag: "Killer Klowns + Art the Clown",
            votable: false,
          },
          { id: "hhn-fortnitemares", name: "Fortnitemares: Freaky Fields", tag: "Encountered naturally", votable: false },
        ],
      },
    ],
  },
  {
    id: "friday",
    park: "Friday Morning — Departure",
    missionLog: "Last transmission before we ship out — spend it however you want.",
    accent: "#8a6d1f",
    accentSoft: "#f3ecd8",
    arrivalNote:
      "Flight is ~5:00 PM — call an Uber to MCO by 2:00 PM (airport by 3:00). That leaves a partial morning — pick the plan below before Friday so everyone's on the same page.",
    learnMoreUrl: "https://www.orlandoairports.net",
    learnMoreLabel: "Orlando International Airport (MCO) — official site",
    isDeparture: true,
    lands: [
      {
        name: "Partial-morning plan",
        singleChoiceGroups: [
          {
            id: "friday-plan",
            label: "Friday morning — pick one",
            note: "We have the Park Hopper, so both parks are on the table if we move fast.",
            options: [
              { id: "fri-none", name: "No park — pack & relax at Dockside", price: "" },
              { id: "fri-usf", name: "Universal Studios Florida — quick hits", price: "" },
              { id: "fri-ioa", name: "Islands of Adventure — quick hits", price: "" },
              { id: "fri-both", name: "Both parks — park hopper sprint", price: "" },
            ],
          },
        ],
      },
    ],
  },
];

/** Flattens every votable ride/show item across all parks (excludes single-choice decisions). */
export function getAllVotableRideItems() {
  const items = [];
  PARKS.forEach((park) => {
    park.lands.forEach((land) => {
      (land.items || []).forEach((item) => {
        if (item.votable) {
          items.push({ ...item, parkId: park.id, parkName: park.park, landName: land.name });
        }
      });
    });
  });
  return items;
}

/** Every informational-only (non-votable) item, for display without polluting completion stats. */
export function getInformationalItems() {
  const items = [];
  PARKS.forEach((park) => {
    park.lands.forEach((land) => {
      (land.items || []).forEach((item) => {
        if (item.votable === false) {
          items.push({ ...item, parkId: park.id, parkName: park.park, landName: land.name });
        }
      });
    });
  });
  return items;
}

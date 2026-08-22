// Trip content lives here, separate from UI/logic, so attractions, closures,
// and HHN details can be updated later without touching components.
// `votable: false` marks informational-only items that don't count toward
// completion tracking (closed during our trip, coming soon, retired, etc.)
//
// `summary` = a short, plain-language description in our own words (not
// copied from any official source) so someone can learn what a ride actually
// is without leaving the app.
// `stats` = practical planning details where we have them confirmed
// (height requirement, indoor/outdoor, Express Pass/Lightning Lane
// eligibility, locker requirement). Fields are omitted where not verified
// rather than guessed.

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
          {
            id: "hs-tot",
            name: "Tower of Terror",
            tag: "Thrill",
            votable: true,
            summary:
              "A free-fall drop ride set inside a haunted 1930s Hollywood hotel elevator. The drop sequence is randomized, so the ride pattern changes from visit to visit.",
            stats: { height: "40\"", indoor: true },
          },
          {
            id: "hs-rockcoaster",
            name: "Rock 'n' Roller Coaster Starring The Muppets",
            tag: "Coaster",
            votable: true,
            summary:
              "An indoor launch coaster that accelerates from a standstill to 60 mph in under three seconds. Reopens in its new Muppets theme in time for our trip, replacing the old Aerosmith version.",
            stats: { height: "48\"", indoor: true },
          },
          {
            id: "hs-beautybeast",
            name: "Beauty and the Beast — Live on Stage",
            tag: "Show, 25 min",
            votable: true,
            summary:
              "A 25-minute Broadway-style stage musical retelling the film's story with full costumes, choreography, and live singing. Good indoor break from the heat.",
            stats: { height: "Any height", indoor: true },
          },
          {
            id: "hs-fantasmic",
            name: "Fantasmic!",
            tag: "Nighttime show — check showtime",
            votable: true,
            summary:
              "Disney's nighttime fireworks-and-water spectacular, following Mickey as he battles a lineup of classic Disney villains. Popular show — arrive early for good seating.",
            stats: { height: "Any height", indoor: false },
          },
        ],
      },
      {
        name: "Star Wars: Galaxy's Edge",
        items: [
          {
            id: "hs-rise",
            name: "Rise of the Resistance",
            tag: "Ride — book early",
            votable: true,
            summary:
              "A multi-part trackless dark ride that drops you into the middle of a battle between the Resistance and the First Order. The park's marquee attraction, with the longest waits in the park most days.",
            stats: { height: "40\"", indoor: true },
          },
          {
            id: "hs-falcon",
            name: "Millennium Falcon: Smugglers Run",
            tag: "Ride",
            votable: true,
            summary:
              "A motion-simulator ride where your group actually pilots the Falcon on a smuggling run. Seats are assigned roles — pilot, gunner, or engineer — so where you sit changes what you do.",
            stats: { height: "38\"", indoor: true },
          },
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
          {
            id: "hs-slinky",
            name: "Slinky Dog Dash",
            tag: "Coaster",
            votable: true,
            summary:
              "An outdoor family coaster built to look like a giant toy dog on a track. Milder than the park's bigger thrill rides, and approachable for most ages.",
            stats: { height: "38\"", indoor: false },
          },
          {
            id: "hs-alien",
            name: "Alien Swirling Saucers",
            tag: "Family ride",
            votable: true,
            summary:
              "A gentle spinning ride themed around a claw-machine carnival game from Toy Story. A good option for younger kids or anyone wanting something calmer.",
            stats: { height: "32\"", indoor: false },
          },
          {
            id: "hs-toystorymania",
            name: "Toy Story Mania",
            tag: "Interactive",
            votable: true,
            summary:
              "An interactive 4D shooting-gallery ride where riders compete for points across several toy-themed carnival games. Fun for all ages and worth riding more than once.",
            stats: { height: "Any height", indoor: true },
          },
        ],
      },
      {
        name: "Echo Lake",
        items: [
          {
            id: "hs-startours",
            name: "Star Tours",
            tag: "Ride",
            votable: true,
            summary:
              "A motion-simulator ride that sends you on a randomized 'flight' through the Star Wars galaxy — the scene lineup changes, so repeat rides can look different.",
            stats: { height: "40\"", indoor: true },
          },
          {
            id: "hs-indianajones",
            name: "Indiana Jones Epic Stunt Spectacular",
            tag: "Show",
            votable: true,
            summary:
              "A live outdoor stunt show recreating scenes from the Indiana Jones films, with real fire, falls, and fight choreography. Seating is amphitheater-style and fills up before showtime.",
            stats: { height: "Any height", indoor: false },
          },
        ],
      },
      {
        name: "Animation Courtyard",
        items: [
          {
            id: "hs-runaway",
            name: "Mickey & Minnie's Runaway Railway",
            tag: "Ride",
            votable: true,
            summary:
              "A trackless dark ride that uses a 2D/3D visual trick to make it feel like you've been pulled into a Mickey Mouse cartoon. Family-friendly with no big drops or sudden speed.",
            stats: { height: "Any height", indoor: true },
          },
          {
            id: "hs-frozensingalong",
            name: "Frozen Sing-Along Celebration",
            tag: "Show, A/C break",
            votable: true,
            summary:
              "An indoor, air-conditioned sing-along retelling Frozen's story through clips and a live host. An easy, low-key way to cool off mid-day.",
            stats: { height: "Any height", indoor: true },
          },
          {
            id: "hs-littlemermaid",
            name: "The Little Mermaid — A Musical Adventure",
            tag: "Show",
            votable: true,
            summary:
              "A shorter musical stage show that uses puppetry and film clips to tell Ariel's story. Family-friendly and indoors.",
            stats: { height: "Any height", indoor: true },
          },
          {
            id: "hs-villains",
            name: "Disney Villains: Unfairly Ever After",
            tag: "Show",
            votable: true,
            summary:
              "A stage show where classic Disney villains take over with music and comedy. One of the park's newer additions.",
            stats: { height: "Any height", indoor: true },
          },
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
          {
            id: "ioa-spiderman",
            name: "The Amazing Adventures of Spider-Man",
            tag: "Ride",
            votable: true,
            summary:
              "A 3D dark ride that combines physical motion with animated projection as you 'swing' through New York fighting supervillains alongside Spider-Man. A long-running fan favorite.",
            stats: { height: "40\"", indoor: true, expressPass: true, locker: false },
          },
          {
            id: "ioa-hulk",
            name: "The Incredible Hulk Coaster",
            tag: "Coaster",
            votable: true,
            summary:
              "A launch coaster that shoots you from a standstill to 40 mph in about two seconds, then sends you through a full inversion. One of the park's biggest thrills, with a metal detector at the entrance.",
            stats: { height: "54\"", indoor: false, expressPass: true, locker: true },
          },
          {
            id: "ioa-doomfearfall",
            name: "Doctor Doom's Fearfall",
            tag: "Thrill",
            votable: true,
            summary:
              "A tower ride that launches riders upward before free-falling back down — shorter but more intense than a typical drop tower.",
            stats: { height: "52\"", indoor: false, expressPass: true, locker: false },
          },
        ],
      },
      {
        name: "Toon Lagoon",
        items: [
          {
            id: "ioa-bilgerat",
            name: "Popeye & Bluto's Bilge-Rat Barges",
            tag: "Water ride",
            votable: true,
            summary:
              "A round-raft ride through rapids themed around the classic Popeye cartoons. You will get genuinely soaked, so plan accordingly.",
            stats: { height: "42\"", indoor: false, expressPass: true, locker: true },
          },
          {
            id: "ioa-ripsaw",
            name: "Dudley Do-Right's Ripsaw Falls",
            tag: "Water ride",
            votable: true,
            summary:
              "A flume-style water coaster that combines twisting turns with a big splashdown drop. Also guarantees a soaking.",
            stats: { height: "44\"", indoor: false, expressPass: true, locker: true },
          },
        ],
      },
      {
        name: "Skull Island",
        items: [
          {
            id: "ioa-kong",
            name: "Reign of Kong",
            tag: "Ride",
            votable: true,
            summary:
              "An expedition-style ride — part truck ride, part 3D projection — that puts riders face-to-face with a massive King Kong. Combines practical effects with digital scenes; more intense than the height minimum suggests.",
            stats: { height: "36\"", indoor: true, expressPass: true, locker: false },
          },
        ],
      },
      {
        name: "Jurassic Park",
        items: [
          {
            id: "ioa-velocicoaster",
            name: "Jurassic World VelociCoaster",
            tag: "Coaster",
            votable: true,
            summary:
              "A high-speed launch coaster with multiple inversions and a close pass with a T-Rex animatronic. Regularly ranked among the most intense coasters in Orlando, with a metal detector at the entrance.",
            stats: { height: "51\"", indoor: false, expressPass: true, locker: true },
          },
          {
            id: "ioa-riveradventure",
            name: "Jurassic Park River Adventure",
            tag: "Closed for refurb through Nov 19, 2026",
            votable: false,
          },
          {
            id: "ioa-campjurassic",
            name: "Camp Jurassic (explore)",
            tag: "Play",
            votable: true,
            summary:
              "A sprawling, multi-level outdoor play area with caves, climbing nets, and water elements themed to Jurassic Park. Great for letting kids burn off energy.",
            stats: { height: "No height requirement", indoor: false },
          },
          {
            id: "ioa-pteranodon",
            name: "Pteranodon Flyers",
            tag: "Kids only, one adult per child",
            votable: true,
            summary:
              "A slow-moving family flyer limited to children (with one accompanying adult per vehicle). Low intensity, aimed squarely at younger riders.",
            stats: { height: "36\"–56\" (kids), no adult-only riding", indoor: false, expressPass: false, locker: false },
          },
        ],
      },
      {
        name: "Wizarding World — Hogsmeade",
        items: [
          {
            id: "ioa-forbiddenjourney",
            name: "Harry Potter and the Forbidden Journey",
            tag: "Ride",
            votable: true,
            summary:
              "A motion-simulator dark ride that combines a robotic arm system with projection screens for a broomstick-style tour of Hogwarts. The iconic centerpiece of Hogsmeade.",
            stats: { height: "48\"", indoor: true, expressPass: true, locker: true },
          },
          {
            id: "ioa-hagrids",
            name: "Hagrid's Magical Creatures Motorbike Adventure",
            tag: "Coaster",
            votable: true,
            summary:
              "A story-driven launch coaster with unpredictable speed changes as you ride Hagrid's motorbike through the Forbidden Forest. Consistently rated one of the best-themed coasters anywhere — no Express Pass access, and the single-rider line always seats you in the sidecar.",
            stats: { height: "48\"", indoor: false, expressPass: false, locker: true },
          },
          {
            id: "ioa-hippogriff",
            name: "Flight of the Hippogriff",
            tag: "Family coaster",
            votable: true,
            summary:
              "A gentle family coaster that lets younger or thrill-averse riders still experience a Harry Potter-themed coaster. Short and mild.",
            stats: { height: "36\"", indoor: false, expressPass: true, locker: false },
          },
          {
            id: "ioa-ollivanders",
            name: "Ollivanders Wand Shop Experience",
            tag: "Interactive show",
            votable: true,
            summary:
              "A small-group interactive show where one guest is 'chosen' by a wand in a recreation of the famous wand shop. Also available at Diagon Alley in Universal Studios Florida.",
            stats: { height: "No height requirement", indoor: true },
          },
        ],
      },
      {
        name: "Seuss Landing",
        items: [
          {
            id: "ioa-catinthehat",
            name: "The Cat in the Hat",
            tag: "Family ride",
            votable: true,
            summary:
              "A spinning dark ride based on the Dr. Seuss book, using whimsical sets and characters. Family-friendly with mild spinning motion.",
            stats: { height: "36\"", indoor: true, expressPass: true, locker: false },
          },
          {
            id: "ioa-trolley",
            name: "High in the Sky Seuss Trolley Train",
            tag: "Family ride",
            votable: true,
            summary:
              "An elevated trolley train offering views over Seuss Landing, with two different ride tracks telling different Seuss stories. Very mild, good for all ages.",
            stats: { height: "36\"", indoor: false, expressPass: true, locker: false },
          },
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
          {
            id: "epic-mariokart",
            name: "Mario Kart: Bowser's Challenge",
            tag: "Ride",
            votable: true,
            summary:
              "A motion-simulator racing ride using AR-style headsets that overlay racing graphics onto real physical sets. Highly themed and one of Epic's marquee attractions.",
            stats: { height: "40\"", indoor: true, expressPass: true, locker: false },
          },
          {
            id: "epic-minecart",
            name: "Mine-Cart Madness",
            tag: "Coaster",
            votable: true,
            summary:
              "A family launch coaster themed around Donkey Kong, with mine-cart vehicles and quick bursts of speed through the Golden Temple. More intense than a typical kids' coaster but still approachable.",
            stats: { height: "40\"", indoor: false, expressPass: true, locker: false },
          },
          {
            id: "epic-yoshi",
            name: "Yoshi's Adventure",
            tag: "Family ride",
            votable: true,
            summary:
              "A gentle ride aimed at younger riders, weaving through the Mushroom Kingdom while searching for hidden eggs. Low-intensity family option.",
            stats: { height: "34\"", indoor: false, expressPass: true, locker: false },
          },
        ],
      },
      {
        name: "How to Train Your Dragon — Isle of Berk",
        items: [
          {
            id: "epic-dragonrally",
            name: "Dragon Racer's Rally",
            tag: "Coaster",
            votable: true,
            summary:
              "A launch coaster themed around dragon-racing, with aerobatic maneuvers and high-speed barrel rolls. Moderate thrill level for the land.",
            stats: { height: "48\"", indoor: false, expressPass: false, locker: true },
          },
          {
            id: "epic-wingliders",
            name: "Hiccup's Wing Gliders",
            tag: "Coaster",
            votable: true,
            summary:
              "A suspended launch coaster simulating flight alongside dragons, encountering Hiccup and Toothless along the way. One of the more thrilling rides in Isle of Berk.",
            stats: { height: "40\"", indoor: false, expressPass: true, locker: true },
          },
          {
            id: "epic-fyredrill",
            name: "Fyre Drill",
            tag: "Interactive boat ride",
            votable: true,
            summary:
              "An interactive water-based ride where riders use water cannons in a boat 'battle' against other riders. Family-friendly with light-to-moderate water effects.",
            stats: { height: "Any height (under 48\" accompanied)", indoor: false, expressPass: true, locker: true },
          },
        ],
      },
      {
        name: "Celestial Park",
        items: [
          {
            id: "epic-stardust",
            name: "Stardust Racers",
            tag: "Dueling coaster",
            votable: true,
            summary:
              "A dueling launch coaster with two tracks racing side by side, reaching speeds up to 62 mph and heights over 130 feet. One of Epic Universe's headline thrill rides, with a metal detector at the entrance.",
            stats: { height: "48\"", indoor: false, expressPass: true, locker: true },
          },
          {
            id: "epic-carousel",
            name: "Constellation Carousel",
            tag: "Best after dark",
            votable: true,
            summary:
              "An elaborately designed carousel where each carriage turns and lifts riders while cosmic music and lighting play. Good for all ages, and best experienced after dark when it's lit up.",
            stats: { height: "Any height", indoor: true },
          },
          {
            id: "epic-astronomica",
            name: "Astronomica",
            tag: "Splash play area",
            votable: true,
            summary:
              "An interactive water play area with dancing fountains in Celestial Park. No ride vehicle — just open play, good for cooling off.",
            stats: { height: "No height requirement", indoor: false },
          },
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
            summary:
              "A large-scale motion-simulator dark ride set inside the Ministry of Magic, following a trial that goes badly wrong. Currently drawing some of the longest waits in the park.",
            stats: { height: "40\"", indoor: true, expressPass: true, locker: false },
          },
        ],
      },
      {
        name: "Dark Universe",
        items: [
          {
            id: "epic-werewolf",
            name: "Curse of the Werewolf",
            tag: "Coaster",
            votable: true,
            summary:
              "A launch coaster themed around classic Universal horror monsters, with an aggressive, unpredictable ride style as you weave through a forest chased by werewolves. One of Dark Universe's headline thrills — no lockers, so be mindful of loose items.",
            stats: { height: "40\"", indoor: false, expressPass: true, locker: false },
          },
          {
            id: "epic-monstersunchained",
            name: "Monsters Unchained: Frankenstein's Experiment",
            tag: "Dark ride",
            votable: true,
            summary:
              "A dark ride following Dr. Frankenstein's experiments going wrong as classic monsters — Dracula, the Wolf Man, the Mummy — break loose. Combines practical sets with motion-simulator effects.",
            stats: { height: "48\"", indoor: true, expressPass: true, locker: true },
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
          {
            id: "usf-bourne",
            name: "The Bourne Stuntacular",
            tag: "Live stunt show, A/C",
            votable: true,
            summary:
              "A live stunt show blending real performers with large video screens to recreate Bourne-style chase and fight sequences. Indoors and air-conditioned.",
            stats: { height: "Any height", indoor: true, expressPass: true },
          },
          {
            id: "usf-et",
            name: "E.T. Adventure",
            tag: "Family ride",
            votable: true,
            summary:
              "A classic suspended bike-style dark ride following E.T.'s journey home. Gentle and nostalgic — it's been running since the park opened in 1990.",
            stats: { height: "34\"", indoor: true, expressPass: true, locker: false },
          },
        ],
      },
      {
        name: "Minion Land",
        items: [
          {
            id: "usf-minionmayhem",
            name: "Despicable Me Minion Mayhem",
            tag: "Family ride",
            votable: true,
            summary:
              "A 3D motion-simulator ride putting riders through Gru's home as a Minion-in-training. Family-friendly with mild movement.",
            stats: { height: "40\"", indoor: true, expressPass: true, locker: false },
          },
          {
            id: "usf-villaincon",
            name: "Villain-Con Minion Blast",
            tag: "Interactive",
            votable: true,
            summary:
              "An interactive shooting-gallery ride, similar in spirit to Toy Story Mania, set at a villain convention full of Minions. Competitive and replayable.",
            stats: { height: "No height requirement", indoor: true, expressPass: true, locker: false },
          },
        ],
      },
      {
        name: "Production Central",
        items: [
          {
            id: "usf-transformers",
            name: "Transformers: The Ride 3D",
            tag: "Ride",
            votable: true,
            summary:
              "A large-scale 3D motion-simulator ride putting you in the middle of a battle between the Autobots and Decepticons over the AllSpark. Intense visuals and movement.",
            stats: { height: "40\"", indoor: true, expressPass: true, locker: false },
          },
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
          {
            id: "usf-mummy",
            name: "Revenge of the Mummy",
            tag: "Coaster/thrill",
            votable: true,
            summary:
              "An indoor launch coaster combining fire effects, sudden drops, and a backward launch through Egyptian tomb sets while fleeing the Mummy. One of the park's most intense rides.",
            stats: { height: "48\"", indoor: true, expressPass: true, locker: true },
          },
          {
            id: "usf-fallon",
            name: "Race Through New York with Jimmy Fallon",
            tag: "Simulator",
            votable: true,
            summary:
              "A motion-simulator 'race' through New York City hosted by Jimmy Fallon, in a flying-theater format. Family-friendly, more visual thrill than physical.",
            stats: { height: "40\"", indoor: true, expressPass: true, locker: false },
          },
        ],
      },
      {
        name: "World Expo",
        items: [
          {
            id: "usf-meninblack",
            name: "MEN IN BLACK Alien Attack",
            tag: "Ride",
            votable: true,
            summary:
              "An interactive shooting-gallery dark ride where your score affects how your car spins at the end. Competitive and replayable.",
            stats: { height: "42\"", indoor: true, expressPass: true, locker: true },
          },
        ],
      },
      {
        name: "Springfield",
        items: [
          {
            id: "usf-simpsons",
            name: "The Simpsons Ride",
            tag: "Simulator",
            votable: true,
            summary:
              "A motion-simulator ride spoofing theme parks themselves, set inside a wild Krustyland chase with the Simpsons family. Comedic and family-friendly.",
            stats: { height: "40\"", indoor: true, expressPass: true, locker: false },
          },
          {
            id: "usf-kangkodos",
            name: "Kang & Kodos' Twirl 'n' Hurl",
            tag: "Family ride",
            votable: true,
            summary:
              "A simple spinning ride themed around the Simpsons' alien characters. Mild, good for younger kids.",
            stats: { height: "No height requirement", indoor: false, expressPass: true, locker: false },
          },
        ],
      },
      {
        name: "DreamWorks Land",
        items: [
          {
            id: "usf-trollercoaster",
            name: "Trolls Trollercoaster",
            tag: "Family coaster",
            votable: true,
            summary:
              "A family coaster in the DreamWorks Land, themed around the Trolls movies and a spooky-spider escape. Gentle enough for most ages.",
            stats: { height: "36\"", indoor: false, expressPass: true, locker: false },
          },
          {
            id: "usf-shrekswamp",
            name: "Shrek's Swamp for Little Ogres",
            tag: "Play area",
            votable: true,
            summary:
              "A playground-style play area themed to Shrek, aimed at younger kids, with climbing, sliding, and water play. No ride vehicle.",
            stats: { height: "No height requirement", indoor: false },
          },
          {
            id: "usf-pokungfu",
            name: "Po's Kung Fu Training Camp",
            tag: "Interactive play",
            votable: true,
            summary:
              "An interactive play area themed around Kung Fu Panda, with gongs, water effects, and spinning noodle bowls. Good for burning energy between rides.",
            stats: { height: "No height requirement", indoor: false },
          },
        ],
      },
      {
        name: "Wizarding World — Diagon Alley",
        items: [
          {
            id: "usf-gringotts",
            name: "Harry Potter and the Escape from Gringotts",
            tag: "Ride",
            votable: true,
            summary:
              "A motion-simulator/coaster hybrid set inside the Gringotts vaults, including a chase sequence with Bellatrix and Voldemort. One of the most elaborate rides at either Universal park.",
            stats: { height: "42\"", indoor: true, expressPass: true, locker: true },
          },
          {
            id: "usf-hogwartsexpress",
            name: "Hogwarts Express (to Hogsmeade)",
            tag: "Transport ride",
            votable: true,
            summary:
              "A themed train 'commute' between Diagon Alley and Hogsmeade, with window scenery that changes depending on which direction you're traveling. Requires park-to-park admission, which we have.",
            stats: { height: "No height requirement", indoor: false, expressPass: true, locker: false },
          },
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
        name: "Haunted Houses",
        items: [
          {
            id: "hhn-jackoddfellow",
            name: "Jack & Oddfellow: Chaos & Control",
            tag: "Icon house",
            votable: true,
            summary: "This year's icon house, telling the origin story of HHN 35's two hosts, Jack and Oddfellow.",
          },
          {
            id: "hhn-sinners",
            name: "Sinners",
            tag: "Based on the film",
            votable: true,
            summary: "A house adaptation of the 2025 vampire film, set inside its Club Juke.",
          },
          {
            id: "hhn-strangerthings",
            name: "Stranger Things 5",
            tag: "Based on the series",
            votable: true,
            summary: "A house covering the final battle for Hawkins, including a trip into the Upside Down.",
          },
          {
            id: "hhn-bloodengutz",
            name: "H.R. Bloodengutz Presents: A Halloween Fright-Tacular!",
            tag: "Returning original",
            votable: true,
            summary: "A returning original house built around HHN's own cult horror-host character.",
          },
          {
            id: "hhn-madlands",
            name: "Madlands: Caged Cannibals",
            tag: "Original",
            votable: true,
            summary: "An original house set in an abandoned zoo that's become a hunting ground.",
          },
          {
            id: "hhn-cybergoria",
            name: "Cybergoria",
            tag: "Original, sci-fi",
            votable: true,
            summary: "An original sci-fi house built around an AI-gone-wrong dystopia.",
          },
          {
            id: "hhn-invasion",
            name: "Invasion: Alien Abduction",
            tag: "Original",
            votable: true,
            summary: "An original house centered on an alien abduction at a homestead.",
          },
          {
            id: "hhn-hellraiser",
            name: "Hellraiser",
            tag: "First-ever HHN Hellraiser house",
            votable: true,
            summary: "HHN's first-ever Hellraiser house, with Doug Bradley returning to voice Pinhead.",
          },
          {
            id: "hhn-evildead",
            name: "Evil Dead Burn",
            tag: "Based on the film",
            votable: true,
            summary: "A house based on the newest Evil Dead film.",
          },
          {
            id: "hhn-ozzy",
            name: "Ozzy Osbourne: Prince of Darkness",
            tag: "Based on his solo career",
            votable: true,
            summary: "A house themed around Ozzy Osbourne's solo career.",
          },
        ],
      },
      {
        name: "Live Shows",
        items: [
          {
            id: "hhn-bloodnoir",
            name: "Nightmare Fuel: Blood Noir",
            tag: "Stunt spectacular",
            votable: true,
            summary: "A stunt-driven live show performed during the event.",
          },
          {
            id: "hhn-strangerthingsshow",
            name: "Stranger Things: Return to Hawkins",
            tag: "New lagoon show",
            votable: true,
            summary: "A new nighttime lagoon show tied to the Stranger Things house.",
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

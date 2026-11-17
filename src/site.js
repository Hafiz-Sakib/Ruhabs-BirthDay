// ALL the text of the website is here. Edit freely, save, and the page updates by itself.
export const site = {
  name: "Ruhab",
  birthday: "2026-12-15",              // YYYY-MM-DD, the countdown aims at midnight (Bangladesh time) of this day
  birthDate: "2025-12-15",             // used for "days of love" in the recap
  badge: "15 December 2026",
  heroLine: "Ruhab is turning ONE!",   // the word ONE gets the colourful gradient
  tagline: "One year of smiles, giggles and first times. Come, celebrate with us!",
  countdownTitle: "Counting down to the big day",
  countdownDone: "Today is the day! Happy 1st Birthday, Ruhab!",

  journeyTitle: "His first year, so far",
  journeyNote: "A little look back at the moments we will never forget.",

  recapTitle: "Ruhab, by the numbers",
  orbitTitle: "Our little star",
  orbitNote: "Hover to pause, tap a photo to see it big.",
  tableTitle: "The photo table",
  tableNote: "Drag the photos around and make your own pile ✋",
  balloonTitle: "Pop a balloon, read a wish",
  balloonNote: "Tap a balloon. Every one hides a little wish for Ruhab.",
  cakeTitle: "Make a wish, Ruhab!",
  cakeNote: "Tap the flame to blow out the candle.",
  momentsTitle: "More little moments",

  mamaTitle: "Your Mama Sakib Loves You",
  mamaNote: "From the first tiny toes to the video-call giggles, every day with you is a gift.",

  wishes: [
    "May your smile always light up the room.",
    "Grow up healthy, happy and kind.",
    "Always safe, always happy, always loved.",
    "Many, many more birthdays with us!",
    "Mama Sakib is always just one video call away.",
    "Run fast, fall softly, laugh loudly.",
  ],

  partyTitle: "Join the celebration",
  partyNote: "Ruhab's 1st Birthday Party",
  time: "",       // e.g. "6:00 PM", leave "" to hide
  venue: "",      // e.g. "Our home, Chattogram", leave "" to hide
  calendarTitle: "Ruhab's 1st Birthday",

  footerTitle: "Happy 1st Birthday, Ruhab!",
  footerNote: "Thank you for filling our lives with so much joy.",
  madeBy: "Made with love by Mama Sakib, Abbu Tanim & Ammu Mishu",
};

// The story: chapters shown in order. `photos` are the ids from src/photos.js. Change titles/notes freely.
export const chapters = [
  { title: "Hello, world", note: "Tiny toes, a big yawn and the sweetest first look.", photos: ["newborn-awake", "newborn-foot", "newborn-yawn", "newborn-sleep", "newborn-cry"] },
  { title: "Meeting the family", note: "Cuddles, curious cousins and so many hands to hold him.", photos: ["first-hold", "cousins", "sleepy-boats"] },
  { title: "Eid and first smiles", note: "His very first Eidi, and a smile that lit up the room.", photos: ["eid-salami", "mama-hug", "smile-pink"] },
  { title: "All dressed up", note: "Smart outfits, painted walls and the biggest eyes in the room.", photos: ["n-green-mama", "n-sherwani", "n-garden-family", "n-garden-couple", "n-mural-mama", "n-mural-papa"] },
  { title: "Tummy time and flowers", note: "Lifting his head, reaching out and wearing a flower like a prince.", photos: ["n-tummy-yellow", "n-tummy-vest", "n-flower-ear", "n-flower-wide", "n-outdoor-blue", "n-sleep"] },
  { title: "Sitting, crawling, giggling", note: "Wherever there is a chair to crawl under, he is already there.", photos: ["n-chain", "n-crawl", "n-yellow-lap", "n-grandpa", "n-family-floor"] },
  { title: "Little traveller", note: "Standing tall, looking out of train windows and exploring.", photos: ["red-curtain-mama", "red-curtain-stand", "train-window", "bus-smile", "train-family"] },
  { title: "Almost one", note: "A messy berry face, rooftop evenings and giggles over late-night video calls.", photos: ["berry-face", "n-garden-blue", "n-selfie", "call-smile", "call-laugh"] },
];

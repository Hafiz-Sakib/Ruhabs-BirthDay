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

  // ---- new sections ----
  flipPrefix: "Ruhab is our little",
  flipWords: ["tiger", "giggler", "crawler", "star", "mango lover", "cuddle bug"],

  firstsTitle: "A year of firsts",
  firstsNote: "Scroll down and watch the line fill up, one milestone at a time.",

  thenNowTitle: "Then and now",
  thenNowNote: "Drag the handle. Look how much he has grown!",
  thenLabel: "Day one",
  nowLabel: "Almost one",

  favTitle: "Ruhab's favourite things",
  favNote: "Mangoes, soft toys, hiding games and anything that rolls.",

  reelTitle: "Ruhab's story reel",
  reelNote: "Tap through his little moments, just like stories.",

  panelTitle: "Open the moments",
  panelNote: "Hover a photo (or tap it) and it opens wide.",

  blessingsTitle: "Blessings for Ruhab",
  blessingsNote: "Little notes from the people who love him most.",

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
  { title: "Hello, world", note: "Tiny toes, a big yawn and the sweetest first look.", photos: ["born-hold", "born-orange", "born-kantha", "born-orange-close", "newborn-awake", "newborn-blue", "newborn-blue-yawn", "newborn-red", "born-yellow-hood", "newborn-yawn", "newborn-sleep", "born-shoulder", "born-sleep-black", "newborn-cry"] },
  { title: "Tiny fingers, tiny toes", note: "A grip that melts every heart and toes small enough to hold in one palm.", photos: ["newborn-finger", "newborn-toes", "newborn-fist"] },
  { title: "Meeting the family", note: "Cuddles, curious cousins and so many hands to hold him.", photos: ["first-hold", "cousins", "born-cousins", "born-selfie", "sleepy-boats"] },
  { title: "The first haircut", note: "A little bit of hair on a banana leaf and a brand new look.", photos: ["haircut-leaf", "haircut-bald"] },
  { title: "Eid and first smiles", note: "His very first Eidi, and a smile that lit up the room.", photos: ["eid-salami", "mama-hug", "smile-pink", "n-shop-mama"] },
  { title: "All dressed up", note: "Smart outfits, painted walls and the biggest eyes in the room.", photos: ["n-green-mama", "n-sherwani", "n-garden-family", "n-garden-couple", "n-mural-mama", "n-mural-papa", "n-wedding-nap"] },
  { title: "Tummy time and flowers", note: "Lifting his head, reaching out and wearing a flower like a prince.", photos: ["n-tummy-yellow", "n-tummy-mat", "n-tummy-vest", "n-nap-flowers", "n-flower-ear", "n-flower-wide", "n-outdoor-blue", "n-sleep"] },
  { title: "Sitting, crawling, giggling", note: "Wherever there is a chair to crawl under, he is already there.", photos: ["n-chain", "n-chain-toy", "n-crawl", "n-peek-chair", "n-yellow-lap", "n-grandpa", "n-family-floor"] },
  { title: "Mischief and mangoes", note: "Peek-a-boo under the net, plush toys, onion baskets and his very first mango.", photos: ["play-highchair", "play-net", "play-onion", "play-plush", "play-tummy-floor", "play-two-little"] },
  { title: "Little traveller", note: "Standing tall, looking out of train windows and exploring.", photos: ["red-curtain-mama", "red-curtain-stand", "train-window", "bus-smile", "train-family"] },
  { title: "Almost one", note: "A messy berry face, rooftop evenings and giggles over late-night video calls.", photos: ["berry-face", "n-garden-blue", "n-selfie", "call-smile", "call-laugh"] },
];

// Timeline "firsts". `photo` = id from src/photos.js. Change words freely.
export const milestones = [
  { when: "Day one", emoji: "👶", title: "Hello, little Ruhab", note: "Wrapped in orange, a head full of dark hair and the sweetest sleepy face.", photo: "born-orange", pos: "50% 45%" },
  { when: "First hours", emoji: "🤱", title: "First cuddles", note: "Held close in the hospital corridor while the whole family waited to say hello.", photo: "born-hold", pos: "50% 55%" },
  { when: "Early days", emoji: "👀", title: "Big eyes, big curiosity", note: "Wide awake in his yellow hood, already looking at the whole world.", photo: "born-yellow-hood", pos: "50% 45%" },
  { when: "Eid", emoji: "🌙", title: "First Eid and first Eidi", note: "Dressed up and showered with love, and his very first Eid salami.", photo: "eid-salami" },
  { when: "Growing strong", emoji: "💪", title: "Tummy time champion", note: "Head up, hands out, and a look that says: just watch me.", photo: "play-tummy-floor", pos: "50% 40%" },
  { when: "First bites", emoji: "🥭", title: "His first taste of mango", note: "A happy mess, a mango slice in each hand and no plans to share.", photo: "play-highchair" },
  { when: "On the move", emoji: "🚂", title: "Little traveller", note: "Train windows, bus rides and new places everywhere he goes.", photo: "train-window" },
  { when: "Almost one", emoji: "🎂", title: "Nearly one year old!", note: "A messy berry face and a giggle that fills the house.", photo: "berry-face" },
];

export const favourites = [
  { emoji: "🥭", title: "Mango time", note: "Sticky fingers, happiest boy.", photo: "play-highchair", pos: "50% 30%" },
  { emoji: "🐼", title: "Plush friends", note: "Pandas and lions, all for hugging.", photo: "play-plush", pos: "70% 40%" },
  { emoji: "🫣", title: "Peek-a-boo", note: "Where did Ruhab go?", photo: "play-net", pos: "60% 40%" },
  { emoji: "🧅", title: "Kitchen explorer", note: "Onions, garlic, big smile.", photo: "play-onion", pos: "50% 45%" },
  { emoji: "🐛", title: "Floor is his stage", note: "Crawling any day now.", photo: "play-tummy-floor", pos: "50% 40%" },
  { emoji: "🤗", title: "Cuddles", note: "The best place in the world is a lap.", photo: "play-two-little", pos: "50% 35%" },
  { emoji: "😂", title: "Belly laughs", note: "Nothing beats a giggle in Grandpa's arms.", photo: "n-grandpa", pos: "50% 35%" },
];

// Story reel (tap through). `photo` = id from src/photos.js
export const reel = [
  { photo: "born-orange", title: "Day one", note: "Wrapped in orange, fast asleep." },
  { photo: "newborn-awake", title: "Wide awake", note: "Looking at the world for the first time." },
  { photo: "eid-salami", title: "First Eid", note: "His very first Eidi.", },
  { photo: "play-highchair", title: "Mango time", note: "A slice in each hand." },
  { photo: "play-net", title: "Peek-a-boo", note: "Where did Ruhab go?" },
  { photo: "berry-face", title: "Messy and happy", note: "Almost one, and full of giggles." },
];

// Panel gallery (hover to open)
export const panels = [
  { emoji: "👶", photo: "born-yellow-hood", title: "Hello, world", note: "Big eyes from the very first days." },
  { emoji: "🌺", photo: "n-flower-ear", title: "Little prince", note: "A flower behind the ear." },
  { emoji: "💪", photo: "n-tummy-yellow", title: "Tummy time", note: "Head up, hands out." },
  { emoji: "🐛", photo: "n-crawl", title: "Crawling", note: "Under the chair, as always." },
  { emoji: "🐼", photo: "play-plush", title: "Plush friends", note: "So many soft toys to touch." },
  { emoji: "🚂", photo: "train-window", title: "On the go", note: "Giggling at the train window." },
];

// Blessing notes: change the words, names, roles. `color` = avatar and ring colour.
export const blessings = [
  { name: "Mama Sakib", role: "Your Mama", color: "#8b5cf6", text: "From the first tiny toes to today, you make every day brighter. Stay as curious as you are now." },
  { name: "Abbu Tanim", role: "Your Abbu", color: "#0ea5e9", text: "Grow up healthy, brave and kind. Abbu will always be right behind you." },
  { name: "Ammu Mishu", role: "Your Ammu", color: "#ec4899", text: "You are our whole world. Keep smiling like that and the world will smile back." },
  { name: "Whole family", role: "Everyone who loves you", color: "#f59e0b", text: "Happy first birthday, Ruhab. May your life be full of mangoes, laughter and love." },
];

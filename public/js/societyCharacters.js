// ===================================================================
// GOKUL KUNJ CO-OP HOUSING SOCIETY - ASSET-READY CHARACTER REGISTRY
// Original Indian sitcom-inspired distinctive character profiles,
// personality traits, dialogue trees, and procedural/GLTF asset pipeline.
// ===================================================================

class SocietyCharacterRegistry {
  constructor() {
    this.characters = new Map();
    this.loadedModels = new Map(); // id -> THREE.Group (if external GLTF available)
    this.initRegistry();
  }

  initRegistry() {
    const list = [
      // 1. JATIN PATEL (Businessman / Friendly Leader - Jethabhai style)
      {
        id: 'jatin_patel',
        displayName: 'Jatin Patel (Businessman)',
        role: 'business_owner',
        homeWp: 'home_patel',
        preferredLoc: 'courtyard_center',
        colors: {
          main: 0x0284c7, // Vibrant royal blue embroidered kurta
          accent: 0xf59e0b, // Saffron-gold border
          turban: 0x0284c7,
          bottom: 0xf8fafc, // White churidar
          skin: 0xd49b73
        },
        hasTurban: false,
        accessory: 'mithai_box',
        voiceTone: 'cheerful',
        dialogues: {
          greeting: 'Kem Chho! Shubh Deepawali! Gokul Kunj society mein aapka hardik swagat hai!',
          aboutDiwali: 'Diwali par Gada Electronics bandh hai aur hum sab society mein mithai aur anar fodne mein vyast hain!',
          aboutSociety: 'Hamari Gokul Kunj society sirf ek colony nahi, ek bada parivar hai! Bhide ji chahe kitna bhi chillaayein!',
          taskNotice: 'Aaj raat ko community hall mein grand sweet distribution aur aarti hai, zarur aana!'
        }
      },

      // 2. DAYA BEN (Traditional Homemaker / Garba Queen)
      {
        id: 'daya_ben',
        displayName: 'Daya Ben (Homemaker)',
        role: 'mother',
        homeWp: 'home_patel',
        preferredLoc: 'patel_entrance',
        colors: {
          main: 0xe11d48, // Crimson Bandhani saree
          accent: 0xfacc15, // Golden zari pallu
          turban: 0xbe123c,
          bottom: 0x9f1239,
          skin: 0xd49b73
        },
        hasTurban: false,
        accessory: 'aarti_thali',
        voiceTone: 'high_pitch_happy',
        dialogues: {
          greeting: 'Arey Jai Jinendra! Happy Diwali! Maa Ambe aap par kripa barsayein!',
          aboutDiwali: 'Maine ghar pe taaza besan ke laddoo aur fafda banaya hai! Sabke liye bhejti hoon!',
          aboutSociety: 'Aapne hamara rangoli dekha? Tapu aur Sonu ne milkar bohot sundar peacock banaya hai!',
          taskNotice: 'Sham ko mandir mein aarti ke baad garba zaroor hoga, tayyar rehna!'
        }
      },

      // 3. AATMARAM TUKARAM BHIDE (Disciplined Society Secretary)
      {
        id: 'aatmaram_bhide',
        displayName: 'Aatmaram T. Bhide (Secretary)',
        role: 'society_secretary',
        homeWp: 'home_bhide',
        preferredLoc: 'noticeboard',
        colors: {
          main: 0x059669, // Emerald Green kurta
          accent: 0xd97706, // Classic Nehru jacket
          turban: 0x047857,
          bottom: 0xf8fafc, // Crisp white pyjama
          skin: 0xd49b73
        },
        hasTurban: false,
        hasSpectacles: true,
        accessory: 'clipboard',
        voiceTone: 'authoritative_friendly',
        dialogues: {
          greeting: 'Namaskar! Main Aatmaram Tukaram Bhide, is Gokul Kunj society ka ekmeva secretary!',
          aboutDiwali: 'Diwali manaiye, par anushasan aur suraksha ka dhyan rakhiye! Society compound saaf rehna chahiye.',
          aboutSociety: 'Main pichhle pandrah saal se secretary hoon! Har saal hamari Diwali sabse anushasit hoti hai.',
          taskNotice: 'Noticeboard par karyakram likh diya hai. 6 baje Aarti aur 8:30 baje fireworks pad par cracker show!'
        }
      },

      // 4. MADHAVI BHIDE (Homemaker & Businesswoman)
      {
        id: 'madhavi_bhide',
        displayName: 'Madhavi Tai (Businesswoman)',
        role: 'mother',
        homeWp: 'home_bhide',
        preferredLoc: 'bhide_entrance',
        colors: {
          main: 0x7c3aed, // Royal Purple Maharashtrian saree
          accent: 0xfbbf24, // Gold borders
          turban: 0x6d28d9,
          bottom: 0x5b21b6,
          skin: 0xd49b73
        },
        hasTurban: false,
        accessory: 'snack_basket',
        voiceTone: 'warm_motherly',
        dialogues: {
          greeting: 'Shubh Deepawali ji! Kahiye, sab kushal mangal?',
          aboutDiwali: 'Hamari handmade chakli aur aachar ke orders Diwali pe bohot zyada rehte hain!',
          aboutSociety: 'Bhide ji thode strict hain par dil ke bohot saaf hain. Society ka har kaam samay par karte hain.',
          taskNotice: 'Ghar par aana, fresh karanji aur chakli ready hai sabke liye!'
        }
      },

      // 5. TAARAK WRITER (Wise Friend & Columnist)
      {
        id: 'taarak_writer',
        displayName: 'Taarak (Writer & Thinker)',
        role: 'writer',
        homeWp: 'home_mehta',
        preferredLoc: 'courtyard_bench',
        colors: {
          main: 0x2563eb, // Sophisticated Navy Blue Kurta
          accent: 0x38bdf8,
          turban: 0x1d4ed8,
          bottom: 0xf8fafc,
          skin: 0xd49b73
        },
        hasTurban: false,
        accessory: 'notebook',
        voiceTone: 'intellectual_warm',
        dialogues: {
          greeting: 'Namaste! Deepon ka yeh tyohar aapke jeevan ko nayi aashaon se roshan kare!',
          aboutDiwali: 'Diwali sirf roshni ka nahi, balki dil ke andheron ko door karne ka tyohar hai.',
          aboutSociety: 'Hum sab alag alag pranton se hain, par yahan aakar sab ek parivar ban jaate hain.',
          taskNotice: 'Aaj raat ko main ek nayi Diwali kavita sunane wala hoon community hall mein!'
        }
      },

      // 6. ANJALI RESIDENT (Diet & Health Enthusiast)
      {
        id: 'anjali_resident',
        displayName: 'Anjali (Wellness Expert)',
        role: 'mother',
        homeWp: 'home_mehta',
        preferredLoc: 'garden_walkway',
        colors: {
          main: 0x10b981, // Fresh Mint Green Salwar Suit
          accent: 0xf43f5e,
          turban: 0x059669,
          bottom: 0xf8fafc,
          skin: 0xd49b73
        },
        hasTurban: false,
        accessory: 'herbal_tea',
        voiceTone: 'gentle_care',
        dialogues: {
          greeting: 'Happy Diwali! Par haan, zyada meetha khane se pehle green salad zaroor khana!',
          aboutDiwali: 'Maine is baar sugar-free dates aur nuts ke laddoos banaye hain Taarak ke liye!',
          aboutSociety: 'Diwali walk aur morning yoga ke bina din shuru nahi hota mera!',
          taskNotice: 'Thoda sweets enjoy kijiye, par sath mein morning walk mat bhooliye!'
        }
      },

      // 7. ROSHAN SINGH SODHI (Joyful Punjabi Resident)
      {
        id: 'roshan_sodhi',
        displayName: 'Roshan Singh Sodhi (Joyful Resident)',
        role: 'boisterous_friend',
        homeWp: 'home_sodhi',
        preferredLoc: 'fireworks_pad',
        colors: {
          main: 0xea580c, // Bright Orange Waistcoat
          accent: 0xfde047, // Golden kurta
          turban: 0xf97316, // Bright Saffron Turban
          bottom: 0xf8fafc,
          skin: 0xd49b73
        },
        hasTurban: true,
        accessory: 'phuljhadi',
        voiceTone: 'energetic_loud',
        dialogues: {
          greeting: 'Oye balle balle! Happy Diwali ji! Chak de phattey!',
          aboutDiwali: 'Diwali aayi hai bhai! Shaam ko ek se ek dhamakedaar rockets aur anar phodenge!',
          aboutSociety: 'Party-sharty aur bhangra bina Diwali kaisi? Gokul Kunj ch full entertainment hoyega!',
          taskNotice: 'Fireworks pad tayyar hai! 8 baje sabhi log aa jaana full celebration hoga!'
        }
      },

      // 8. DR. HANSRAJ (Beloved Physician & Food Lover)
      {
        id: 'dr_hathi',
        displayName: 'Dr. Hansraj (Physician)',
        role: 'doctor',
        homeWp: 'home_hathi',
        preferredLoc: 'bazaar_stall',
        colors: {
          main: 0x0d9488, // Teal Kurta
          accent: 0xfbbf24,
          turban: 0x0f766e,
          bottom: 0xf8fafc,
          skin: 0xd49b73
        },
        hasTurban: false,
        accessory: 'sweet_plate',
        voiceTone: 'jolly_deep',
        dialogues: {
          greeting: 'Sahi baat hai! Happy Diwali to all of you!',
          aboutDiwali: 'Diwali saal mein ek baar aati hai, gulab jamun aur kaju katli se parhez bilkul nahi karna chahiye!',
          aboutSociety: 'Sabhi parivar ek se badhkar ek pakwan laaye hain! Main to sab chakhunga!',
          taskNotice: 'Sehat ka dhyan rakho, par tyohar par khushiyan baantna sabse badi dawai hai!'
        }
      },

      // 9. SUBRAMANIAM IYER (Scientist Neighbor)
      {
        id: 'subramaniam_iyer',
        displayName: 'Subramaniam Iyer (Scientist)',
        role: 'scientist',
        homeWp: 'home_iyer',
        preferredLoc: 'temple_courtyard',
        colors: {
          main: 0xfef9c3, // Silk Angavastram & Veshti
          accent: 0xb45309, // Golden Zari border
          turban: 0x78350f,
          bottom: 0xf8fafc,
          skin: 0xc88f68
        },
        hasTurban: false,
        accessory: 'telescope',
        voiceTone: 'academic_polite',
        dialogues: {
          greeting: 'Vanakkam! Deepavali Nalvazhthukkal! May knowledge illuminate every mind.',
          aboutDiwali: 'Astronomically, Amavasya is the darkest night of the month, which is why millions of lamps create such high illumination.',
          aboutSociety: 'Babita and I spent the morning preparing our traditional South Indian floral Kolam.',
          taskNotice: 'Join the sacred temple lamp lighting at 6:00 PM for the community blessings.'
        }
      },

      // 10. BABITA JI (Modern Resident)
      {
        id: 'babita_ji',
        displayName: 'Babita (Resident)',
        role: 'mother',
        homeWp: 'home_iyer',
        preferredLoc: 'garden_walkway',
        colors: {
          main: 0xec4899, // Fuchsia Designer Saree
          accent: 0x38bdf8,
          turban: 0xdb2777,
          bottom: 0xbe185d,
          skin: 0xe2a882
        },
        hasTurban: false,
        accessory: 'kandil',
        voiceTone: 'graceful',
        dialogues: {
          greeting: 'Happy Diwali everyone! The society looks so beautiful with all the fairy lights!',
          aboutDiwali: 'I love lighting floating paper lanterns in the courtyard sky.',
          aboutSociety: 'Everyone is in such high festive spirits. Look at the children playing!',
          taskNotice: 'Don\'t miss the sky lantern release tonight over the temple sky.'
        }
      },

      // 11. POPAT PATRAKAR (Enthusiastic Reporter)
      {
        id: 'popat_patrakar',
        displayName: 'Popatlal (Reporter)',
        role: 'reporter',
        homeWp: 'home_popat',
        preferredLoc: 'courtyard_center',
        colors: {
          main: 0xfacc15, // Golden Yellow Kurta
          accent: 0xb91c1c,
          turban: 0xd97706,
          bottom: 0xf8fafc,
          skin: 0xd49b73
        },
        hasTurban: false,
        accessory: 'umbrella',
        voiceTone: 'eager_excited',
        dialogues: {
          greeting: 'Shubh Deepawali! Main Popatlal, Toofan Express ka varishth patrakar!',
          aboutDiwali: 'Is saal main Gokul Kunj ki shandar Diwali par front-page exclusive story kar raha hoon!',
          aboutSociety: 'Hamari society jaisa unity aur pyaar poore shahar mein kahin dekhne ko nahi milta!',
          taskNotice: 'Camera ready hai! Maha Aarti aur Fireworks ki photos seedha newspaper mein aayengi!'
        }
      },

      // 12. ABDUL KAKA (Beloved Shopkeeper)
      {
        id: 'abdul_kaka',
        displayName: 'Abdul Kaka (All-in-One Store)',
        role: 'shopkeeper',
        homeWp: 'entrance_cabin',
        preferredLoc: 'bazaar_stall',
        colors: {
          main: 0x047857, // Forest Green Kurta
          accent: 0xfbbf24,
          turban: 0x065f46,
          bottom: 0xf8fafc,
          skin: 0xc88f68
        },
        hasTurban: false,
        accessory: 'soda_bottle',
        voiceTone: 'affectionate_warm',
        dialogues: {
          greeting: 'Eid ho ya Diwali, Gokul Kunj parivar hamesha ek sath manata hai! Shubh Deepawali!',
          aboutDiwali: 'Maine sabhi residents ke liye special pista-sharbat aur diyas ka intazam kiya hai.',
          aboutSociety: 'Sabhi bhai-behen yahan mere apne parivar jaise hain. 20 saal se yeh dukan chala raha hoon.',
          taskNotice: 'Kisi ko extra diyas ya batteriyan chahiye hon to dukan par aa jaana!'
        }
      },

      // 13. TAPU (Leader of Tappu Sena)
      {
        id: 'tapu_kid',
        displayName: 'Tipendra / Tapu (Child)',
        role: 'child_boy',
        homeWp: 'home_patel',
        preferredLoc: 'fireworks_pad',
        colors: {
          main: 0xf97316, // Orange festive kurta
          accent: 0xfde047,
          turban: 0xea580c,
          bottom: 0xf8fafc,
          skin: 0xdd9a6b
        },
        hasTurban: false,
        accessory: 'phuljhadi',
        voiceTone: 'playful',
        dialogues: {
          greeting: 'Happy Diwali uncle! Tappu Sena is fully ready for the festival!',
          aboutDiwali: 'Humne courtyard mein sabse badi flower rangoli banayi hai!',
          aboutSociety: 'Bhide uncle ne kaha tha crackers pad par hi chalana, hum discipline maintain kar rahe hain!',
          taskNotice: 'Chalo phuljhadi jalate hain fireworks pad par!'
        }
      },

      // 14. SONU (Tappu Sena Member)
      {
        id: 'sonu_kid',
        displayName: 'Sonu (Child)',
        role: 'child_girl',
        homeWp: 'home_bhide',
        preferredLoc: 'courtyard_center',
        colors: {
          main: 0xec4899, // Pink Lehenga
          accent: 0xf59e0b,
          turban: 0xdb2777,
          bottom: 0x7c3aed,
          skin: 0xdd9a6b
        },
        hasTurban: false,
        accessory: 'sparkler',
        voiceTone: 'sweet_playful',
        dialogues: {
          greeting: 'Happy Diwali! Wish you lots of happiness and sweets!',
          aboutDiwali: 'Aapne mummy ki banayi karanji khayi? Bohot tasty hai!',
          aboutSociety: 'Hum sab bachhe milkar sham ko sky lanterns udayenge!',
          taskNotice: 'Community Hall mein drawing competition bhi hai, aakar dekhna!'
        }
      },

      // 15. PANDITJI (Temple Priest)
      {
        id: 'panditji',
        displayName: 'Pandit Satyanarayan (Priest)',
        role: 'priest',
        homeWp: 'temple_altar',
        preferredLoc: 'temple_altar',
        colors: {
          main: 0xf97316, // Saffron Dhoti & Shawl
          accent: 0xfde047,
          turban: 0xb45309,
          bottom: 0xfacc15,
          skin: 0xc88f68
        },
        hasTurban: false,
        accessory: 'brass_bell',
        voiceTone: 'devotional_calm',
        dialogues: {
          greeting: 'शुभ दीपावली! ॐ महालक्ष्म्यै च विद्महे विष्णुपत्न्यै च धीमहि तन्नो लक्ष्मीः प्रचोदयात्॥',
          aboutDiwali: 'Maha Lakshmi ki kripa se sabhi ke jeevan mein shanti, arogya aur samriddhi ka vaas ho.',
          aboutSociety: 'Yeh mandir poore Gokul Kunj ki aashirwad sthali hai.',
          taskNotice: 'Mandir mein aarti shuru ho rahi hai, aakar prasad grahan karein.'
        }
      }
    ];

    list.forEach(c => this.characters.set(c.id, c));
  }

  getCharacter(id) {
    return this.characters.get(id);
  }

  getAllCharacters() {
    return Array.from(this.characters.values());
  }

  // Hook for external GLTF/GLB models if placed in /assets/models/characters/[id].glb
  async loadModelForCharacter(id, gltfLoader) {
    if (!gltfLoader) return null;
    try {
      const url = `assets/models/characters/${id}.glb`;
      const gltf = await new Promise((resolve, reject) => {
        gltfLoader.load(url, resolve, undefined, reject);
      });
      if (gltf && gltf.scene) {
        this.loadedModels.set(id, gltf.scene);
        return gltf.scene;
      }
    } catch (e) {
      // Graceful fallback to procedural character mesh
      return null;
    }
  }
}

window.SocietyCharacterRegistry = SocietyCharacterRegistry;

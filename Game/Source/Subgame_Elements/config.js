
starting_level = 1;

let zombies = [
  "zombie_01","zombie_02","zombie_03","zombie_04","zombie_05",
  "zombie_06","zombie_07","zombie_08","zombie_09","zombie_10",
  "zombie_11","zombie_12","zombie_13","zombie_14","zombie_15",
  "zombie_16","zombie_17"
  ];

let boy_zombies = [
  "zombie_01","zombie_02","zombie_03","zombie_04","zombie_05",
  "zombie_06","zombie_07","zombie_08","zombie_09","zombie_10",
  "zombie_11",
]

let girl_zombies = [
  "zombie_12","zombie_13","zombie_14",
  "zombie_15","zombie_16","zombie_17"
]

// 1160 to 1280 across a 350 vertical range

let speeds = [
  0.3, 0.5,
  0.35, 0.55,
  0.4, 0.6,
  0.45, 0.65,
  0.5, 0.7, 0.9
  ]

let math_speeds = [
  0.3, 0.4,
  0.33, 0.45,
  0.4, 0.5,
  0.42, 0.53,
  0.48, 0.58, 0.67
  ]

let waves = [
  5, 7,
  9, 11,
  13, 15,
  17, 19,
  21, 23, 75
  ]

let hp = [
  8, 8,
  7, 7,
  6, 6,
  5, 5,
  4, 4, 4
]

let zombie_delays = [
  2500,2300,
  2100,1900,
  1700,1500,
  1300,1100,
  900,700,200
  ]

let music_for = [
  "Level1","Level1",
  "Level2","Level2",
  "Level3","Level3",
  "Level4","Level4",
  "Level5","Level5","Level5"
]

let weapons = [
  "hammer","hammer",
  "cricket_bat","cricket_bat",
  "baseball_bat","baseball_bat",
  "sword","sword",
  "hammer","hammer",
  "frying_pan"
]

let word_lists = {};

word_lists[0] = letter_array;
word_lists[1] = letter_array;
word_lists[2] = [
  "ab","am","an","as","at","ax",
  "by","do","go","ha","he","hi",
  "id","if","in","is","it","ma",
  "me","my","no","of","oh","on",
  "or","ow","ox","pa","pi","so",
  "ta","to","up","us","we","yo",
]
word_lists[3] = word_lists[2];
word_lists[4] = [
  "act","aid","air","and","any","ape","apt","arm","art",
  "ash","ask","ate","bad","bag","bat","bay","bed","bib",
  "big","bin","box","boy","bug","can","cap","car","cat",
  "cow","cry","cup","cut","dad","dig","dog","dot","dry",
  "ear","eat","elf","elk","elm","end","eye","fly","fox",
  "ham","has","hat","hen","hey","hot","hum","ice","jam",
  "jar","man","map","mat","mix","mom","mud","mug","mum",
  "nap","net","not","now","oaf","oak","oar","oat","oil",
  "old","one","owl","pan","pat","paw","pet","pie","pig",
  "pin","pop","pup","rug","run","sad","sat","say","shy",
  "sit","six","sky","son","spy","sun","ten","the","tie",
  "top","toy","try","wag","was","wet","who","why","win",
  "wow","yak","yay","yes","you",
]
word_lists[5] = word_lists[4];
word_lists[6] = [
  "base","head","face","flat","post","iron","port","core","lead","line","node",
  "case","flag","mean","salt","worm","chip","host","mode","note","bias","type",
  "form","acid","file","fish","load","pipe","slip","bear","heat","plug","seal",
  "time","wave","code","flux","gene","hand","iris","lift","ring","stem","tail",
  "arch","bank","open","skin","tick","body","data","echo","risk","cast","drag",
  "gold","horn","mole","beam","deck","draw","drop","edge","gain","gate","hold",
  "soap","band","gram","java","link","mark","nose","sign","term","tone","atom",
  "cord","flow","land","lens","pole","spot","star","test","void","leaf","lock",
  "mint","path","rail","wash","yard","zone","axis","byte","jack","long","turn",
  "beta","chop","disc","dust","grid","rock","icon","play","rank","spin","beat",
  "bind","disk","down","game","neck","push","race","rake","span","trap","word",
  "work","back","bail","cage","mold","peak","rule","unit","apex","bolt","bone",
  "bore","drum","fire","hole","nail","rack","card","cone","corn","duty","gift",
  "size","volt","ward","zero","clay","dump","fine","firm","hair","love","page",
  "rain","rent","sage","sand","silk","step","warp","area","blue","cash","cold",
  "duck","fair","grip","mime","rush","scan","side","spam","stop","tack","take",
  "tape","wire","yoke","clip","cure","drip","fast","foil","frog","goal","hawk",
  "list","pile","plan","raid","rose","tank","trim","bile","bump","camp","club",
  "fact","fold","font","home","jump","king","lamp","mind","ping","rest","sink",
  "snap","swap","tide","tube","bird","bite","boat","copy","hail","halo","heir",
  "life","mask","mast","mile","palm","spit","whip","bead","cave","coal","cost",
  "crop","cube","dome","epic","gear","gray","high","kilo","lean","lion","mail",
  "milk","mist","oath","pair","safe","seat","shoe","slug","snow","belt","chap",
  "dash","heap","pack","pick","plot","ship","trip","walk","wing","year","ante",
  "cart","coil","crab","fade","flex","goat","hack","hard","harp","hour","levy",
  "lime","meat","mine","mule","name","part","read","rich","solo","stud","text",
  "wake","wear","yoga","bath","coin","dish","dock","farm","fret","herb","kick",
  "lake","lamb","pace","plum","rope","soil","team","thin","wolf","bend","boil",
  "carp","coat","curb","dart","foam","fork","gait","hide","lane","make","nick",
  "peat","pint","prop","rice","rise","save","show","sort","stay","vest","wind",
  "bark","barn","calf","cane","claw","deal","felt","glue","grit","half","inch",
  "join","kite","live","main","more","neat","news","nice","plus","pony","punt",
  "road","sack","sale","slam","soft","wasp","yarn","beak","bean","bulb","chin",
  "clam","crib","duke","germ","help","idea","lawn","leak","mesh","nest","over",
  "ramp","ruby","rust","sail","self","tent","baby","east","four","hare","jade",
  "lard","male","malt","next","pale","park","pear","peck","pike","pine","pink",
  "rash","swan","wife","bent","bold","bulk","cape","care","clap","dark","dent",
  "dial","dose","flap","flop","helm","left","lute","move","pond","ride","slap",
  "surf","tale","tang","tear","tire","true","wage","bowl","comb","dime","find",
  "hope","hose","lynx","mead","melt","muse","opus","oval","quit","some","tint",
  "warm","wild","wipe","aloe","away","boar","cake","dawn","dice","dive"
]
word_lists[7] = word_lists[6];
word_lists[8] = [
  "pitch","point","virus","range","block","power","noise","agent","field","crown",
  "scale","index","light","stock","acute","yield","frame","cover","grain","order",
  "draft","break","check","delta","round","cycle","stack","state","water","flash",
  "phase","focus","model","value","color","split","alpha","board","fault","paper",
  "chain","clean","clear","crash","grade","group","house","laser","proxy","track",
  "audit","cable","meter","money","right","score","short","spike","wedge","basis",
  "blast","crest","pulse","table","trust","angel","clone","drive","fiber","image",
  "joule","trace","court","float","plate","solid","apron","blade","canon","event",
  "flare","force","micro","pixel","smoke","style","trade","drift","eagle","flush",
  "locus","mouse","ozone","reach","shock","sound","stage","sugar","atlas","cache",
  "chase","claim","ghost","modem","mouth","niche","patch","pound","share","snake",
  "swing","valve","chord","fever","gauge","scope","alias","basic","chalk","flora",
  "genus","lemon","price","sharp","space","title","truth","bench","black","blank",
  "blind","close","count","depth","earth","flame","heart","horse","level","metal",
  "panel","paste","prime","taste","twist","brace","brain","brick","clock","hedge",
  "logic","orbit","pearl","plane","punch","cloud","paint","pilot","plant","rider",
  "stone","surge","voice","brush","chaos","entry","fence","front","magic","olive",
  "pivot","ridge","shear","sight","tiger","union","angle","beach","bread","cause",
  "chair","fruit","graph","guard","match","motor","nerve","party","resin","river",
  "shift","slide","smart","stick","trend","amber","burst","chart","delay","frost",
  "hives","limit","local","panic","place","print","prism","radar","shake","slope",
  "tenor","throw","vault","alien","camel","click","drain","honey","music","nexus",
  "radio","raise","rough","spine","spore","steam","stern","swift","token","train",
  "trunk","watch","coast","flute","frank","fresh","glaze","graft","heavy","input",
  "labor","organ","robot","sense","slate","storm","straw","tight","tonic","toxic",
  "toxin","whale","anvil","award","basin","beard","blend","catch","cedar","cobra",
  "crime","crypt","digit","fetch","genre","march","notch","saint","shape","stalk",
  "stand","start","store","thumb","total","truck","valid","vapor","white","witch",
  "alert","axiom","brief","curve","dance","fauna","helix","hinge","ivory","juice",
  "label","magma","marsh","mount","navel","ocean","peace","pupil","query","ratio",
  "shore","sting","super","sweat","sword","tract","trail","write","barge","cameo",
  "cleat","coach","cough","crust","elbow","femur","grand","humor","ideal","inert",
  "lapse","onion","plain","relay","slice","slump","stake","stamp","steal","tense",
  "tower","tribe","unity","waist","wheat","batch","bonus","brine","brown","charm",
  "churn","coral","dream","extra","facet","first","flake","fluid","grace","grant",
  "grief","guide","henry","irony","pedal","poise","quart","route","torch","triad",
  "brake","build","chief","comet","enter","glare","glory","large","moral","night",
  "quick","scene","shade","sling","spear","swamp","trait","venue","acorn","blaze",
  "bunch","cargo","chips","couch","crisp","honor","karma","liter","month"
]
word_lists[9] = word_lists[8];
word_lists[10] = word_lists[9];







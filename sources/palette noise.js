var autoPalette = true;
var secondsPerPalette = 10;
var paletteIndex = 0;

export function toggleAutoPalette(v) {
  autoPalette = v;
}

export function inputNumberSecondsPerPalette(v) {
  secondsPerPalette = v;
}

export function sliderPalette(v) {
  paletteIndex = floor(v * (palettes.length-1))
  setPalette(palettes[paletteIndex]);
}

export function showNumberPalette() {
  return paletteIndex;
}

var autoMode = true;
var secondsPerMode = 3;
var modeIndex = 0;

export function toggleAutoMode(v) {
  autoMode = v;
}

export function inputNumberSecondsPerMode(v) {
  secondsPerMode = v;
}

export function sliderMode(v) {
  modeIndex = floor(v * 3)
  modeFn = modes[modeIndex];
}

export function showNumberMode() {
  return modeIndex;
}

modes = [
    (x, y, z) => (perlin(x, y, z, 0) + 1) / 2,
    (x, y, z) => perlinRidge(x, y, z, 2, .5, 1.1, 3),
    (x, y, z) => (perlinFbm(x, y, z, 2, .5, 3) + 1) / 2,
    (x, y, z) => perlinTurbulence(x, y, z, 2, .5, 3),
]
var modeFn;

var wrap = 2;
setPerlinWrap(wrap, wrap, wrap); 

export function beforeRender(delta) {
  // per-frame animation timers
  t1 = time(.1);
  noiseTime = time(7) * 256;
  
  if (autoPalette) {
    paletteIndex = time(secondsPerPalette) * palettes.length;
    setPalette(palettes[paletteIndex]);
  }
  
  if (autoMode) {
    modeIndex = time(secondsPerMode) * 4;
    modeFn = modes[modeIndex];
  }
}

export function render2D(index, x, y) {
  radius = hypot(x - .5, y - .5) * 2 - noiseTime / 2;
  radians = atan2(y - .5, x - .5);
  angle = radians / PI / 2 - noiseTime;
  
  v = modeFn(angle * wrap, radius * wrap, wrap);
  v = min(v, 1);
  paint(v, v * v);
}

// From ColorWavesWithPalettes by Mark Kriegsman: https://gist.github.com/kriegsman/8281905786e8b2632aeb

// Gradient palette "ib_jul01_gp", originally from
// http://soliton.vm.bytemark.co.uk/pub/cpt-city/ing/xmas/tn/ib_jul01.png.index.html
// converted for FastLED with gammas (2.6, 2.2, 2.5)
var ib_jul01 = [
  0.0, 0.761, 0.004, 0.004,
  0.369, 0.004, 0.114, 0.071,
  0.518, 0.224, 0.514, 0.11,
  1.0, 0.443, 0.004, 0.004,
];

// Gradient palette "es_vintage_57_gp", originally from
// http://soliton.vm.bytemark.co.uk/pub/cpt-city/es/vintage/tn/es_vintage_57.png.index.html
// converted for FastLED with gammas (2.6, 2.2, 2.5)
var es_vintage_57 = [
  0.0, 0.008, 0.004, 0.004,
  0.208, 0.071, 0.004, 0.0,
  0.408, 0.271, 0.114, 0.004,
  0.6, 0.655, 0.529, 0.039,
  1.0, 0.18, 0.22, 0.016,
];

// Gradient palette "es_vintage_01_gp", originally from
// http://soliton.vm.bytemark.co.uk/pub/cpt-city/es/vintage/tn/es_vintage_01.png.index.html
// converted for FastLED with gammas (2.6, 2.2, 2.5)
var es_vintage_01 = [
  0.0, 0.016, 0.004, 0.004,
  0.2, 0.063, 0.0, 0.004,
  0.298, 0.38, 0.408, 0.012,
  0.396, 1.0, 0.514, 0.075,
  0.498, 0.263, 0.035, 0.016,
  0.6, 0.063, 0.0, 0.004,
  0.898, 0.016, 0.004, 0.004,
  1.0, 0.016, 0.004, 0.004,
];

// Gradient palette "es_rivendell_15_gp", originally from
// http://soliton.vm.bytemark.co.uk/pub/cpt-city/es/rivendell/tn/es_rivendell_15.png.index.html
// converted for FastLED with gammas (2.6, 2.2, 2.5)
var es_rivendell_15 = [
  0.0, 0.004, 0.055, 0.02,
  0.396, 0.063, 0.141, 0.055,
  0.647, 0.22, 0.267, 0.118,
  0.949, 0.588, 0.612, 0.388,
  1.0, 0.588, 0.612, 0.388,
];

// Gradient palette "rgi_15_gp", originally from
// http://soliton.vm.bytemark.co.uk/pub/cpt-city/ds/rgi/tn/rgi_15.png.index.html
// converted for FastLED with gammas (2.6, 2.2, 2.5)
var rgi_15 = [
  0.0, 0.016, 0.004, 0.122,
  0.122, 0.216, 0.004, 0.063,
  0.247, 0.773, 0.012, 0.027,
  0.373, 0.231, 0.008, 0.067,
  0.498, 0.024, 0.008, 0.133,
  0.624, 0.153, 0.024, 0.129,
  0.749, 0.439, 0.051, 0.125,
  0.875, 0.22, 0.035, 0.137,
  1.0, 0.086, 0.024, 0.149,
];

// Gradient palette "retro2_16_gp", originally from
// http://soliton.vm.bytemark.co.uk/pub/cpt-city/ma/retro2/tn/retro2_16.png.index.html
// converted for FastLED with gammas (2.6, 2.2, 2.5)
var retro2_16 = [
  0.0, 0.737, 0.529, 0.004,
  1.0, 0.18, 0.027, 0.004,
];

// Gradient palette "Analogous_1_gp", originally from
// http://soliton.vm.bytemark.co.uk/pub/cpt-city/nd/red/tn/Analogous_1.png.index.html
// converted for FastLED with gammas (2.6, 2.2, 2.5)
var Analogous_1 = [
  0.0, 0.012, 0.0, 1.0,
  0.247, 0.09, 0.0, 1.0,
  0.498, 0.263, 0.0, 1.0,
  0.749, 0.557, 0.0, 0.176,
  1.0, 1.0, 0.0, 0.0,
];

// Gradient palette "es_pinksplash_08_gp", originally from
// http://soliton.vm.bytemark.co.uk/pub/cpt-city/es/pink_splash/tn/es_pinksplash_08.png.index.html
// converted for FastLED with gammas (2.6, 2.2, 2.5)
var es_pinksplash_08 = [
  0.0, 0.494, 0.043, 1.0,
  0.498, 0.773, 0.004, 0.086,
  0.686, 0.824, 0.616, 0.675,
  0.867, 0.616, 0.012, 0.439,
  1.0, 0.616, 0.012, 0.439,
];

// Gradient palette "es_pinksplash_07_gp", originally from
// http://soliton.vm.bytemark.co.uk/pub/cpt-city/es/pink_splash/tn/es_pinksplash_07.png.index.html
// converted for FastLED with gammas (2.6, 2.2, 2.5)
var es_pinksplash_07 = [
  0.0, 0.898, 0.004, 0.004,
  0.239, 0.949, 0.016, 0.247,
  0.396, 1.0, 0.047, 1.0,
  0.498, 0.976, 0.318, 0.988,
  0.6, 1.0, 0.043, 0.922,
  0.757, 0.957, 0.02, 0.267,
  1.0, 0.91, 0.004, 0.02,
];

// Gradient palette "Coral_reef_gp", originally from
// http://soliton.vm.bytemark.co.uk/pub/cpt-city/nd/other/tn/Coral_reef.png.index.html
// converted for FastLED with gammas (2.6, 2.2, 2.5)
var Coral_reef = [
  0.0, 0.157, 0.78, 0.773,
  0.196, 0.039, 0.596, 0.608,
  0.376, 0.004, 0.435, 0.471,
  0.376, 0.169, 0.498, 0.635,
  0.545, 0.039, 0.286, 0.435,
  1.0, 0.004, 0.133, 0.278,
];

// Gradient palette "es_ocean_breeze_068_gp", originally from
// http://soliton.vm.bytemark.co.uk/pub/cpt-city/es/ocean_breeze/tn/es_ocean_breeze_068.png.index.html
// converted for FastLED with gammas (2.6, 2.2, 2.5)
var es_ocean_breeze_068 = [
  0.0, 0.392, 0.612, 0.6,
  0.2, 0.004, 0.388, 0.537,
  0.396, 0.004, 0.267, 0.329,
  0.408, 0.137, 0.557, 0.659,
  0.698, 0.0, 0.247, 0.459,
  1.0, 0.004, 0.039, 0.039,
];

// Gradient palette "es_ocean_breeze_036_gp", originally from
// http://soliton.vm.bytemark.co.uk/pub/cpt-city/es/ocean_breeze/tn/es_ocean_breeze_036.png.index.html
// converted for FastLED with gammas (2.6, 2.2, 2.5)
var es_ocean_breeze_036 = [
  0.0, 0.004, 0.024, 0.027,
  0.349, 0.004, 0.388, 0.435,
  0.6, 0.565, 0.82, 1.0,
  1.0, 0.0, 0.286, 0.322,
];

// Gradient palette "departure_gp", originally from
// http://soliton.vm.bytemark.co.uk/pub/cpt-city/mjf/tn/departure.png.index.html
// converted for FastLED with gammas (2.6, 2.2, 2.5)
var departure = [
  0.0, 0.031, 0.012, 0.0,
  0.165, 0.09, 0.027, 0.0,
  0.247, 0.294, 0.149, 0.024,
  0.329, 0.663, 0.388, 0.149,
  0.416, 0.835, 0.663, 0.467,
  0.455, 1.0, 1.0, 1.0,
  0.541, 0.529, 1.0, 0.541,
  0.58, 0.086, 1.0, 0.094,
  0.667, 0.0, 1.0, 0.0,
  0.749, 0.0, 0.533, 0.0,
  0.831, 0.0, 0.216, 0.0,
  1.0, 0.0, 0.216, 0.0,
];

// Gradient palette "es_landscape_64_gp", originally from
// http://soliton.vm.bytemark.co.uk/pub/cpt-city/es/landscape/tn/es_landscape_64.png.index.html
// converted for FastLED with gammas (2.6, 2.2, 2.5)
var es_landscape_64 = [
  0.0, 0.0, 0.0, 0.0,
  0.145, 0.008, 0.098, 0.004,
  0.298, 0.059, 0.451, 0.02,
  0.498, 0.31, 0.835, 0.004,
  0.502, 0.494, 0.827, 0.184,
  0.51, 0.737, 0.82, 0.969,
  0.6, 0.565, 0.714, 0.804,
  0.8, 0.231, 0.459, 0.98,
  1.0, 0.004, 0.145, 0.753,
];

// Gradient palette "es_landscape_33_gp", originally from
// http://soliton.vm.bytemark.co.uk/pub/cpt-city/es/landscape/tn/es_landscape_33.png.index.html
// converted for FastLED with gammas (2.6, 2.2, 2.5)
var es_landscape_33 = [
  0.0, 0.004, 0.02, 0.0,
  0.075, 0.125, 0.09, 0.004,
  0.149, 0.631, 0.216, 0.004,
  0.247, 0.898, 0.565, 0.004,
  0.259, 0.153, 0.557, 0.29,
  1.0, 0.004, 0.016, 0.004,
];

// Gradient palette "rainbowsherbet_gp", originally from
// http://soliton.vm.bytemark.co.uk/pub/cpt-city/ma/icecream/tn/rainbowsherbet.png.index.html
// converted for FastLED with gammas (2.6, 2.2, 2.5)
var rainbowsherbet = [
  0.0, 1.0, 0.129, 0.016,
  0.169, 1.0, 0.267, 0.098,
  0.337, 1.0, 0.027, 0.098,
  0.498, 1.0, 0.322, 0.404,
  0.667, 1.0, 1.0, 0.949,
  0.82, 0.165, 1.0, 0.086,
  1.0, 0.341, 1.0, 0.255,
];

// Gradient palette "gr65_hult_gp", originally from
// http://soliton.vm.bytemark.co.uk/pub/cpt-city/hult/tn/gr65_hult.png.index.html
// converted for FastLED with gammas (2.6, 2.2, 2.5)
var gr65_hult = [
  0.0, 0.969, 0.69, 0.969,
  0.188, 1.0, 0.533, 1.0,
  0.349, 0.863, 0.114, 0.886,
  0.627, 0.027, 0.322, 0.698,
  0.847, 0.004, 0.486, 0.427,
  1.0, 0.004, 0.486, 0.427,
];

// Gradient palette "gr64_hult_gp", originally from
// http://soliton.vm.bytemark.co.uk/pub/cpt-city/hult/tn/gr64_hult.png.index.html
// converted for FastLED with gammas (2.6, 2.2, 2.5)
var gr64_hult = [
  0.0, 0.004, 0.486, 0.427,
  0.259, 0.004, 0.365, 0.31,
  0.408, 0.204, 0.255, 0.004,
  0.51, 0.451, 0.498, 0.004,
  0.588, 0.204, 0.255, 0.004,
  0.788, 0.004, 0.337, 0.282,
  0.937, 0.0, 0.216, 0.176,
  1.0, 0.0, 0.216, 0.176,
];

// Gradient palette "GMT_drywet_gp", originally from
// http://soliton.vm.bytemark.co.uk/pub/cpt-city/gmt/tn/GMT_drywet.png.index.html
// converted for FastLED with gammas (2.6, 2.2, 2.5)
var GMT_drywet = [
  0.0, 0.184, 0.118, 0.008,
  0.165, 0.835, 0.576, 0.094,
  0.329, 0.404, 0.859, 0.204,
  0.498, 0.012, 0.859, 0.812,
  0.667, 0.004, 0.188, 0.839,
  0.831, 0.004, 0.004, 0.435,
  1.0, 0.004, 0.027, 0.129,
];

// Gradient palette "ib15_gp", originally from
// http://soliton.vm.bytemark.co.uk/pub/cpt-city/ing/general/tn/ib15.png.index.html
// converted for FastLED with gammas (2.6, 2.2, 2.5)
var ib15 = [
  0.0, 0.443, 0.357, 0.576,
  0.282, 0.616, 0.345, 0.306,
  0.349, 0.816, 0.333, 0.129,
  0.42, 1.0, 0.114, 0.043,
  0.553, 0.537, 0.122, 0.153,
  1.0, 0.231, 0.129, 0.349,
];

// Gradient palette "Fuschia_7_gp", originally from
// http://soliton.vm.bytemark.co.uk/pub/cpt-city/ds/fuschia/tn/Fuschia-7.png.index.html
// converted for FastLED with gammas (2.6, 2.2, 2.5)
var Fuschia_7 = [
  0.0, 0.169, 0.012, 0.6,
  0.247, 0.392, 0.016, 0.404,
  0.498, 0.737, 0.02, 0.259,
  0.749, 0.631, 0.043, 0.451,
  1.0, 0.529, 0.078, 0.714,
];

// Gradient palette "es_emerald_dragon_08_gp", originally from
// http://soliton.vm.bytemark.co.uk/pub/cpt-city/es/emerald_dragon/tn/es_emerald_dragon_08.png.index.html
// converted for FastLED with gammas (2.6, 2.2, 2.5)
var es_emerald_dragon_08 = [
  0.0, 0.38, 1.0, 0.004,
  0.396, 0.184, 0.522, 0.004,
  0.698, 0.051, 0.169, 0.004,
  1.0, 0.008, 0.039, 0.004,
];

// Gradient palette "lava_gp", originally from
// http://soliton.vm.bytemark.co.uk/pub/cpt-city/neota/elem/tn/lava.png.index.html
// converted for FastLED with gammas (2.6, 2.2, 2.5)
var lava = [
  0.0, 0.0, 0.0, 0.0,
  0.18, 0.071, 0.0, 0.0,
  0.376, 0.443, 0.0, 0.0,
  0.424, 0.557, 0.012, 0.004,
  0.467, 0.686, 0.067, 0.004,
  0.573, 0.835, 0.173, 0.008,
  0.682, 1.0, 0.322, 0.016,
  0.737, 1.0, 0.451, 0.016,
  0.792, 1.0, 0.612, 0.016,
  0.855, 1.0, 0.796, 0.016,
  0.918, 1.0, 1.0, 0.016,
  0.957, 1.0, 1.0, 0.278,
  1.0, 1.0, 1.0, 1.0,
];

// Gradient palette "fire_gp", originally from
// http://soliton.vm.bytemark.co.uk/pub/cpt-city/neota/elem/tn/fire.png.index.html
// converted for FastLED with gammas (2.6, 2.2, 2.5)
var fire = [
  0.0, 0.004, 0.004, 0.0,
  0.298, 0.125, 0.02, 0.0,
  0.573, 0.753, 0.094, 0.0,
  0.773, 0.863, 0.412, 0.02,
  0.941, 0.988, 1.0, 0.122,
  0.98, 0.988, 1.0, 0.435,
  1.0, 1.0, 1.0, 1.0,
];

// Gradient palette "Colorfull_gp", originally from
// http://soliton.vm.bytemark.co.uk/pub/cpt-city/nd/atmospheric/tn/Colorfull.png.index.html
// converted for FastLED with gammas (2.6, 2.2, 2.5)
var Colorfull = [
  0.0, 0.039, 0.333, 0.02,
  0.098, 0.114, 0.427, 0.071,
  0.235, 0.231, 0.541, 0.165,
  0.365, 0.325, 0.388, 0.204,
  0.416, 0.431, 0.259, 0.251,
  0.427, 0.482, 0.192, 0.255,
  0.443, 0.545, 0.137, 0.259,
  0.455, 0.753, 0.459, 0.384,
  0.486, 1.0, 1.0, 0.537,
  0.659, 0.392, 0.706, 0.608,
  1.0, 0.086, 0.475, 0.682,
];

// Gradient palette "Magenta_Evening_gp", originally from
// http://soliton.vm.bytemark.co.uk/pub/cpt-city/nd/atmospheric/tn/Magenta_Evening.png.index.html
// converted for FastLED with gammas (2.6, 2.2, 2.5)
var Magenta_Evening = [
  0.0, 0.278, 0.106, 0.153,
  0.122, 0.51, 0.043, 0.2,
  0.247, 0.835, 0.008, 0.251,
  0.275, 0.91, 0.004, 0.259,
  0.298, 0.988, 0.004, 0.271,
  0.424, 0.482, 0.008, 0.2,
  1.0, 0.18, 0.035, 0.137,
];

// Gradient palette "Pink_Purple_gp", originally from
// http://soliton.vm.bytemark.co.uk/pub/cpt-city/nd/atmospheric/tn/Pink_Purple.png.index.html
// converted for FastLED with gammas (2.6, 2.2, 2.5)
var Pink_Purple = [
  0.0, 0.075, 0.008, 0.153,
  0.098, 0.102, 0.016, 0.176,
  0.2, 0.129, 0.024, 0.204,
  0.298, 0.267, 0.243, 0.49,
  0.4, 0.463, 0.733, 0.941,
  0.427, 0.639, 0.843, 0.969,
  0.447, 0.851, 0.957, 1.0,
  0.478, 0.624, 0.584, 0.867,
  0.584, 0.443, 0.306, 0.737,
  0.718, 0.502, 0.224, 0.608,
  1.0, 0.573, 0.157, 0.482,
];

// Gradient palette "Sunset_Real_gp", originally from
// http://soliton.vm.bytemark.co.uk/pub/cpt-city/nd/atmospheric/tn/Sunset_Real.png.index.html
// converted for FastLED with gammas (2.6, 2.2, 2.5)
var Sunset_Real = [
  0.0, 0.471, 0.0, 0.0,
  0.086, 0.702, 0.086, 0.0,
  0.2, 1.0, 0.408, 0.0,
  0.333, 0.655, 0.086, 0.071,
  0.529, 0.392, 0.0, 0.404,
  0.776, 0.063, 0.0, 0.51,
  1.0, 0.0, 0.0, 0.627,
];

// Gradient palette "es_autumn_19_gp", originally from
// http://soliton.vm.bytemark.co.uk/pub/cpt-city/es/autumn/tn/es_autumn_19.png.index.html
// converted for FastLED with gammas (2.6, 2.2, 2.5)
var es_autumn_19 = [
  0.0, 0.102, 0.004, 0.004,
  0.2, 0.263, 0.016, 0.004,
  0.329, 0.463, 0.055, 0.004,
  0.408, 0.537, 0.596, 0.204,
  0.439, 0.443, 0.255, 0.004,
  0.478, 0.522, 0.584, 0.231,
  0.486, 0.537, 0.596, 0.204,
  0.529, 0.443, 0.255, 0.004,
  0.557, 0.545, 0.604, 0.18,
  0.639, 0.443, 0.051, 0.004,
  0.8, 0.216, 0.012, 0.004,
  0.976, 0.067, 0.004, 0.004,
  1.0, 0.067, 0.004, 0.004,
];

// Gradient palette "BlacK_Blue_Magenta_White_gp", originally from
// http://soliton.vm.bytemark.co.uk/pub/cpt-city/nd/basic/tn/BlacK_Blue_Magenta_White.png.index.html
// converted for FastLED with gammas (2.6, 2.2, 2.5)
var BlacK_Blue_Magenta_White = [
  0.0, 0.0, 0.0, 0.0,
  0.165, 0.0, 0.0, 0.176,
  0.329, 0.0, 0.0, 1.0,
  0.498, 0.165, 0.0, 1.0,
  0.667, 1.0, 0.0, 1.0,
  0.831, 1.0, 0.216, 1.0,
  1.0, 1.0, 1.0, 1.0,
];

// Gradient palette "BlacK_Magenta_Red_gp", originally from
// http://soliton.vm.bytemark.co.uk/pub/cpt-city/nd/basic/tn/BlacK_Magenta_Red.png.index.html
// converted for FastLED with gammas (2.6, 2.2, 2.5)
var BlacK_Magenta_Red = [
  0.0, 0.0, 0.0, 0.0,
  0.247, 0.165, 0.0, 0.176,
  0.498, 1.0, 0.0, 1.0,
  0.749, 1.0, 0.0, 0.176,
  1.0, 1.0, 0.0, 0.0,
];

// Gradient palette "BlacK_Red_Magenta_Yellow_gp", originally from
// http://soliton.vm.bytemark.co.uk/pub/cpt-city/nd/basic/tn/BlacK_Red_Magenta_Yellow.png.index.html
// converted for FastLED with gammas (2.6, 2.2, 2.5)
var BlacK_Red_Magenta_Yellow = [
  0.0, 0.0, 0.0, 0.0,
  0.165, 0.165, 0.0, 0.0,
  0.329, 1.0, 0.0, 0.0,
  0.498, 1.0, 0.0, 0.176,
  0.667, 1.0, 0.0, 1.0,
  0.831, 1.0, 0.216, 0.176,
  1.0, 1.0, 1.0, 0.0,
];

// Gradient palette "Blue_Cyan_Yellow_gp", originally from
// http://soliton.vm.bytemark.co.uk/pub/cpt-city/nd/basic/tn/Blue_Cyan_Yellow.png.index.html
// converted for FastLED with gammas (2.6, 2.2, 2.5)
var Blue_Cyan_Yellow = [
  0.0, 0.0, 0.0, 1.0,
  0.247, 0.0, 0.216, 1.0,
  0.498, 0.0, 1.0, 1.0,
  0.749, 0.165, 1.0, 0.176,
  1.0, 1.0, 1.0, 0.0,
];

// Single array of defined cpt-city color palettes.
// This will let us programmatically choose one based on
// a number, rather than having to activate each explicitly
// by name every time.
//
// This list of color palettes acts as a "playlist"; you can
// add or delete, or re-arrange as you wish.
// Count of how many cpt-city gradients are defined:
var palettes = [
  ib_jul01,
  es_vintage_57,
  es_vintage_01,
  es_rivendell_15,
  rgi_15,
  retro2_16,
  Analogous_1,
  es_pinksplash_08,
  es_pinksplash_07,
  Coral_reef,
  es_ocean_breeze_068,
  es_ocean_breeze_036,
  departure,
  es_landscape_64,
  es_landscape_33,
  rainbowsherbet,
  gr65_hult,
  gr64_hult,
  GMT_drywet,
  ib15,
  Fuschia_7,
  es_emerald_dragon_08,
  lava,
  fire,
  Colorfull,
  Magenta_Evening,
  Pink_Purple,
  Sunset_Real,
  es_autumn_19,
  BlacK_Blue_Magenta_White,
  BlacK_Magenta_Red,
  BlacK_Red_Magenta_Yellow,
  Blue_Cyan_Yellow,
];

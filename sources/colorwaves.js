// Color Waves pattern
// based on ColorWavesWithPalettes by Mark Kriegsman: https://gist.github.com/kriegsman/8281905786e8b2632aeb
// modified by Ben Hencke and Jason Coon to run on Pixelblaze

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

export function beforeRender(delta) {
  if (autoPalette) {
    paletteIndex = time(secondsPerPalette) * palettes.length;
    setPalette(palettes[paletteIndex]);
  }
  
  colorwaves(delta, 1)
}

export function render(index) {
  h = ledarray[index*3]
  v = ledarray[index*3+2]
  paint(h, v * v);
}

//       beatsin8( BPM, uint8_t low, uint8_t high) returns an 8-bit value that
//                    rises and falls in a sine wave, 'BPM' times per minute,
//                    between the values of 'low' and 'high'.
function beatsin8(bpm, low, high) {
  return wave(time(0.91552734375/bpm)) * (high - low) + low
}

function beatsin88(bpm, low, high) {
  return beatsin8(bpm>>8, low, high);
}


var sPseudotime = 0; //was uint16_t modified to be a value between 0 and 1
// var sLastMillis = 0; //uint16_t
var sHue16 = 0; //was uint16_t seems to work fine as-is
var ledarray = array(pixelCount*3);

function colorwaves(deltams, useFibonacciOrder) {
  // var sat8 = beatsin88( 87, 220, 250); //uint8_t
  // var brightdepth = beatsin88( 341, 96, 224); //uint8_t
  var brightdepth = beatsin88(171, 96, 224); //uint8_t
  // var brightnessthetainc16 = beatsin88( 203, (25 * 256), (40 * 256)); //uint16_t
  var brightnessthetainc16 = beatsin88( 102, (25 * 256), (40 * 256)); //uint16_t
  // var msmultiplier = beatsin88(147, 23, 60); //uint8_t
  var msmultiplier = beatsin88(74, 23, 60); //uint8_t

  var hue16 = sHue16;//gHue * 256; //uint16_t
  // var hueinc16 = beatsin88(113, 300, 1500); //uint16_t
  // var hueinc16 = beatsin88(57, 1, 128); //uint16_t
  var hueinc16 = beatsin88(57, 1, 128*3); //varies a bit more

  // var ms = millis(); //uint16_t
  // var deltams = ms - sLastMillis ; //uint16_t
  // sLastMillis  = ms;
  sPseudotime += (deltams * msmultiplier) >>16;
  // sHue16 += deltams * beatsin88( 400, 5, 9);
  sHue16 += deltams * beatsin88( 200, 5, 9);
  var brightnesstheta16 = sPseudotime; //uint16_t

  for ( var i = 0 ; i < pixelCount; i++) { //uint16_t
    hue16 += hueinc16;
    var hue8 = triangle(hue16 >>16) * 128

    brightnesstheta16  += brightnessthetainc16>>16;
    brightnesstheta16 = mod(brightnesstheta16 + (brightnessthetainc16>>16), 1)
    var b16 = wave( brightnesstheta16); //uint16_t

    //var bri16 = (uint32_t)((uint32_t)b16 * (uint32_t)b16) / 65536; //uint16_t
    var bri16 = b16 * b16
    //var bri8 = (uint32_t)(((uint32_t)bri16) * brightdepth) / 65536; //uint8_t
    var bri8 = bri16 * (brightdepth>>8)
    bri8 += (1 - (brightdepth>>8));

    var index = hue8; //uint8_t
    //index = triwave8( index);
    index = index/256 * 240;

    // CRGB newcolor = ColorFromPalette( palette, index, bri8);

    var pixelnumber = useFibonacciOrder ? fibonacciToPhysical[i] : i; //uint16_t

    // nblend( ledarray[pixelnumber], newcolor, 8);
    //TODO palletes, blending in RGB. For now use the 3 byte pixel for hue and value
    ledarray[pixelnumber*3] = hue8 / 128;
    ledarray[pixelnumber*3 + 2] = bri8;
  }
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

var fibonacciToPhysical = [ 0, 331, 121, 451, 241, 60, 362, 180, 482, 300, 91, 421, 211, 30, 332, 150, 452, 270, 61, 391, 181, 511, 301, 120, 422, 240, 31, 361, 151, 481, 271, 90, 392, 210, 1, 330, 122, 450, 242, 59, 363, 179, 483, 299, 92, 420, 212, 29, 333, 149, 453, 269, 62, 390, 182, 510, 302, 119, 423, 239, 32, 360, 152, 480, 272, 89, 393, 209, 2, 329, 123, 449, 243, 58, 364, 178, 484, 298, 93, 419, 213, 28, 334, 148, 454, 268, 63, 389, 183, 509, 303, 118, 424, 238, 33, 359, 153, 479, 273, 88, 394, 208, 3, 328, 124, 448, 244, 57, 365, 177, 485, 297, 94, 418, 214, 27, 335, 147, 455, 267, 64, 388, 184, 508, 304, 117, 425, 237, 34, 358, 154, 478, 274, 87, 395, 207, 4, 327, 125, 447, 245, 56, 366, 176, 486, 296, 95, 417, 215, 26, 336, 146, 456, 266, 65, 387, 185, 507, 305, 116, 426, 236, 35, 357, 155, 477, 275, 86, 396, 206, 5, 326, 126, 446, 246, 55, 367, 175, 487, 295, 96, 416, 216, 25, 337, 145, 457, 265, 66, 386, 186, 506, 306, 115, 427, 235, 36, 356, 156, 476, 276, 85, 397, 205, 6, 325, 127, 445, 247, 54, 368, 174, 488, 294, 97, 415, 217, 24, 338, 144, 458, 264, 67, 385, 187, 505, 307, 114, 428, 234, 37, 355, 157, 475, 277, 84, 398, 204, 7, 324, 128, 444, 248, 53, 369, 173, 489, 293, 98, 414, 218, 23, 339, 143, 459, 263, 68, 384, 188, 504, 308, 113, 429, 233, 38, 354, 158, 474, 278, 83, 399, 203, 8, 323, 129, 443, 249, 52, 370, 172, 490, 292, 99, 413, 219, 22, 340, 142, 460, 262, 69, 383, 189, 503, 309, 112, 430, 232, 39, 353, 159, 473, 279, 82, 400, 202, 9, 322, 130, 442, 250, 51, 371, 171, 491, 291, 100, 412, 220, 21, 341, 141, 461, 261, 70, 382, 190, 502, 310, 111, 431, 231, 40, 352, 160, 472, 280, 81, 401, 201, 10, 321, 131, 441, 251, 50, 372, 170, 492, 290, 101, 411, 221, 20, 342, 140, 462, 260, 71, 381, 191, 501, 311, 110, 432, 230, 41, 351, 161, 471, 281, 80, 402, 200, 11, 320, 132, 440, 252, 49, 373, 169, 493, 289, 102, 410, 222, 19, 343, 139, 463, 259, 72, 380, 192, 500, 312, 109, 433, 229, 42, 350, 162, 470, 282, 79, 403, 199, 12, 319, 133, 439, 253, 48, 374, 168, 494, 288, 103, 409, 223, 18, 344, 138, 464, 258, 73, 379, 193, 499, 313, 108, 434, 228, 43, 349, 163, 469, 283, 78, 404, 198, 13, 318, 134, 438, 254, 47, 375, 167, 495, 287, 104, 408, 224, 17, 345, 137, 465, 257, 74, 378, 194, 498, 314, 107, 435, 227, 44, 348, 164, 468, 284, 77, 405, 197, 14, 317, 135, 437, 255, 46, 376, 166, 496, 286, 105, 407, 225, 16, 346, 136, 466, 256, 75, 377, 195, 497, 315, 106, 436, 226, 45, 347, 165, 467, 285, 76, 406, 196, 15, 316 ]

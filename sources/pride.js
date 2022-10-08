// Pride pattern
// based on Pride2015 by Mark Kriegsman: https://gist.github.com/kriegsman/964de772d64c502760e5
// modified by Ben Hencke and Jason Coon to run on Pixelblaze

var fibonacciToPhysical = [ 0, 331, 121, 451, 241, 60, 362, 180, 482, 300, 91, 421, 211, 30, 332, 150, 452, 270, 61, 391, 181, 511, 301, 120, 422, 240, 31, 361, 151, 481, 271, 90, 392, 210, 1, 330, 122, 450, 242, 59, 363, 179, 483, 299, 92, 420, 212, 29, 333, 149, 453, 269, 62, 390, 182, 510, 302, 119, 423, 239, 32, 360, 152, 480, 272, 89, 393, 209, 2, 329, 123, 449, 243, 58, 364, 178, 484, 298, 93, 419, 213, 28, 334, 148, 454, 268, 63, 389, 183, 509, 303, 118, 424, 238, 33, 359, 153, 479, 273, 88, 394, 208, 3, 328, 124, 448, 244, 57, 365, 177, 485, 297, 94, 418, 214, 27, 335, 147, 455, 267, 64, 388, 184, 508, 304, 117, 425, 237, 34, 358, 154, 478, 274, 87, 395, 207, 4, 327, 125, 447, 245, 56, 366, 176, 486, 296, 95, 417, 215, 26, 336, 146, 456, 266, 65, 387, 185, 507, 305, 116, 426, 236, 35, 357, 155, 477, 275, 86, 396, 206, 5, 326, 126, 446, 246, 55, 367, 175, 487, 295, 96, 416, 216, 25, 337, 145, 457, 265, 66, 386, 186, 506, 306, 115, 427, 235, 36, 356, 156, 476, 276, 85, 397, 205, 6, 325, 127, 445, 247, 54, 368, 174, 488, 294, 97, 415, 217, 24, 338, 144, 458, 264, 67, 385, 187, 505, 307, 114, 428, 234, 37, 355, 157, 475, 277, 84, 398, 204, 7, 324, 128, 444, 248, 53, 369, 173, 489, 293, 98, 414, 218, 23, 339, 143, 459, 263, 68, 384, 188, 504, 308, 113, 429, 233, 38, 354, 158, 474, 278, 83, 399, 203, 8, 323, 129, 443, 249, 52, 370, 172, 490, 292, 99, 413, 219, 22, 340, 142, 460, 262, 69, 383, 189, 503, 309, 112, 430, 232, 39, 353, 159, 473, 279, 82, 400, 202, 9, 322, 130, 442, 250, 51, 371, 171, 491, 291, 100, 412, 220, 21, 341, 141, 461, 261, 70, 382, 190, 502, 310, 111, 431, 231, 40, 352, 160, 472, 280, 81, 401, 201, 10, 321, 131, 441, 251, 50, 372, 170, 492, 290, 101, 411, 221, 20, 342, 140, 462, 260, 71, 381, 191, 501, 311, 110, 432, 230, 41, 351, 161, 471, 281, 80, 402, 200, 11, 320, 132, 440, 252, 49, 373, 169, 493, 289, 102, 410, 222, 19, 343, 139, 463, 259, 72, 380, 192, 500, 312, 109, 433, 229, 42, 350, 162, 470, 282, 79, 403, 199, 12, 319, 133, 439, 253, 48, 374, 168, 494, 288, 103, 409, 223, 18, 344, 138, 464, 258, 73, 379, 193, 499, 313, 108, 434, 228, 43, 349, 163, 469, 283, 78, 404, 198, 13, 318, 134, 438, 254, 47, 375, 167, 495, 287, 104, 408, 224, 17, 345, 137, 465, 257, 74, 378, 194, 498, 314, 107, 435, 227, 44, 348, 164, 468, 284, 77, 405, 197, 14, 317, 135, 437, 255, 46, 376, 166, 496, 286, 105, 407, 225, 16, 346, 136, 466, 256, 75, 377, 195, 497, 315, 106, 436, 226, 45, 347, 165, 467, 285, 76, 406, 196, 15, 316 ]

// beatsin8( BPM, uint8_t low, uint8_t high) returns an 8-bit value that
// rises and falls in a sine wave, 'BPM' times per minute,
// between the values of 'low' and 'high'.
function beatsin8(bpm, low, high) {
  return wave(time(0.91552734375/bpm)) * (high - low) + low
}

function beatsin88(bpm, low, high) {
  return beatsin8(bpm>>8, low, high);
}

var sPseudotime = 0; //was uint16_t modified to be a value between 0 and 1
// var sLastMillis = 0; //uint16_t
export var sHue16 = 0; //was uint16_t seems to work fine as-is
export var ledarray = array(pixelCount*3);

function pride(deltams, useFibonacciOrder) {
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
    var hue8 = hue16 / 256; //uint8_t
    //this is doing a triangle
    var h16_128 = hue16 >> 7; //uint16_t
    if ( h16_128 & 0x100) {
      hue8 = 255 - (h16_128 >> 1);
    } else {
      hue8 = h16_128 >> 1;
    }

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

export function beforeRender(delta) {
  pride(delta, 1)
}

export function render(index) {
  v = ledarray[index*3+2]
  hsv(ledarray[index*3], 1, v*v)
}
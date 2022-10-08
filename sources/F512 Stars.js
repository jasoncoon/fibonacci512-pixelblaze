// Fibonacci Stars pattern by Jason Coon
// For Fibonacci512: https://evilgeniuslabs.org/f512
// modified by Ben Hencke to run on Pixelblaze

var starCount = 8;
var starMagicNumbers = [8, 13, 21, 34, 55] // any number from the Fibonacci sequence: 1, 2, 3, 5, 8, 13, 21, 34, 55, 89

var fibonacciToPhysical = [ 0, 331, 121, 451, 241, 60, 362, 180, 482, 300, 91, 421, 211, 30, 332, 150, 452, 270, 61, 391, 181, 511, 301, 120, 422, 240, 31, 361, 151, 481, 271, 90, 392, 210, 1, 330, 122, 450, 242, 59, 363, 179, 483, 299, 92, 420, 212, 29, 333, 149, 453, 269, 62, 390, 182, 510, 302, 119, 423, 239, 32, 360, 152, 480, 272, 89, 393, 209, 2, 329, 123, 449, 243, 58, 364, 178, 484, 298, 93, 419, 213, 28, 334, 148, 454, 268, 63, 389, 183, 509, 303, 118, 424, 238, 33, 359, 153, 479, 273, 88, 394, 208, 3, 328, 124, 448, 244, 57, 365, 177, 485, 297, 94, 418, 214, 27, 335, 147, 455, 267, 64, 388, 184, 508, 304, 117, 425, 237, 34, 358, 154, 478, 274, 87, 395, 207, 4, 327, 125, 447, 245, 56, 366, 176, 486, 296, 95, 417, 215, 26, 336, 146, 456, 266, 65, 387, 185, 507, 305, 116, 426, 236, 35, 357, 155, 477, 275, 86, 396, 206, 5, 326, 126, 446, 246, 55, 367, 175, 487, 295, 96, 416, 216, 25, 337, 145, 457, 265, 66, 386, 186, 506, 306, 115, 427, 235, 36, 356, 156, 476, 276, 85, 397, 205, 6, 325, 127, 445, 247, 54, 368, 174, 488, 294, 97, 415, 217, 24, 338, 144, 458, 264, 67, 385, 187, 505, 307, 114, 428, 234, 37, 355, 157, 475, 277, 84, 398, 204, 7, 324, 128, 444, 248, 53, 369, 173, 489, 293, 98, 414, 218, 23, 339, 143, 459, 263, 68, 384, 188, 504, 308, 113, 429, 233, 38, 354, 158, 474, 278, 83, 399, 203, 8, 323, 129, 443, 249, 52, 370, 172, 490, 292, 99, 413, 219, 22, 340, 142, 460, 262, 69, 383, 189, 503, 309, 112, 430, 232, 39, 353, 159, 473, 279, 82, 400, 202, 9, 322, 130, 442, 250, 51, 371, 171, 491, 291, 100, 412, 220, 21, 341, 141, 461, 261, 70, 382, 190, 502, 310, 111, 431, 231, 40, 352, 160, 472, 280, 81, 401, 201, 10, 321, 131, 441, 251, 50, 372, 170, 492, 290, 101, 411, 221, 20, 342, 140, 462, 260, 71, 381, 191, 501, 311, 110, 432, 230, 41, 351, 161, 471, 281, 80, 402, 200, 11, 320, 132, 440, 252, 49, 373, 169, 493, 289, 102, 410, 222, 19, 343, 139, 463, 259, 72, 380, 192, 500, 312, 109, 433, 229, 42, 350, 162, 470, 282, 79, 403, 199, 12, 319, 133, 439, 253, 48, 374, 168, 494, 288, 103, 409, 223, 18, 344, 138, 464, 258, 73, 379, 193, 499, 313, 108, 434, 228, 43, 349, 163, 469, 283, 78, 404, 198, 13, 318, 134, 438, 254, 47, 375, 167, 495, 287, 104, 408, 224, 17, 345, 137, 465, 257, 74, 378, 194, 498, 314, 107, 435, 227, 44, 348, 164, 468, 284, 77, 405, 197, 14, 317, 135, 437, 255, 46, 376, 166, 496, 286, 105, 407, 225, 16, 346, 136, 466, 256, 75, 377, 195, 497, 315, 106, 436, 226, 45, 347, 165, 467, 285, 76, 406, 196, 15, 316 ]
var stars = array(starCount)
var moveTimer
var gHue = 0
var leds = array(pixelCount)
var hues = array(pixelCount)
var fade = 0.995
var moveTimerTarget = 90

export function sliderSpeed(v) {
  v = 1-v
  moveTimerTarget = 10 + (v*v)*190
}

export function sliderFade(v) {
  fade = (1-(v*v)) * .0999 + .9
}


//setup initial stars state
stars.mutate(() => {
  var offset = starMagicNumbers[random(starMagicNumbers.length)]
  return [
    randomInt(offset),
    offset
    ]
})


export function beforeRender(delta) {
  gHue = (gHue + delta/40) % 256
  
  //only move the stars every so often
  moveTimer += delta
  if (moveTimer > moveTimerTarget) {
    moveTimer -= moveTimerTarget
    updateFibonacciStars()
  }
  
  //fade to black
  leds.mutate(v => v * fade)
  
  drawFibonacciStars()
}

export function render2D(index, x, y) {
  v = leds[index]
  h = hues[index]/ 256
  hsv(h, 1.75 - v, pow(v, 2))
}


function randomInt(n) {
  return floor(random(n))
}


function updateFibonacciStars() {
  stars.forEach((star) => {
    // move the stars
    star[0] += star[1]
    
    //reset any stars out of bounds
    if (star[0] >= pixelCount) {
      star[1] = starMagicNumbers[random(starMagicNumbers.length)]
      star[0] = randomInt(star[1])
    }
  })
}

function drawFibonacciStars() {
  stars.forEach((star) => {
    var index = fibonacciToPhysical[star[0]];
    // draw the star
    leds[index] = 1
    hues[index] = star[0] + gHue
  });
}

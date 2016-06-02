function smartcolor(color) {
    var init_type = determineType(color);
    switch (init_type) {
        case 'hex':
            this.hex = color;
            this.rgb = hexToRgb(this.hex);
            this.hsl = this.rgb.toHSL();
            this.hsv = this.hsl.toHSV();
            break;
        case 'rgb':
            var numberPattern = /\d+/g;
            var search = color.match(numberPattern)
            this.rgb = new RGB(search[0], search[1], search[2]);
            this.hsl = this.rgb.toHSL();
            this.hex = this.rgb.toHex();
            this.hsv = this.hsl.toHSV();
            break;
        case 'hsl':
            var numberPattern = /\d+/g;
            var search = color.match(numberPattern)
            this.hsl = new HSL(search[0], search[1], search[2]);
            this.rgb = this.hsl.toRGB();
            this.hex = this.rgb.toHex();
            this.hsv = this.hsl.toHSV();
            break;
        case 'hsv':
            var numberPattern = /\d+/g;
            var search = color.match(numberPattern)
            this.hsv = new HSV(search[0], search[1], search[2]);
            this.hsl = this.hsv.toHSL();
            this.rgb = this.hsl.toRGB();
            this.hex = this.rgb.toHex();
            break;
        case 'invalid':
            this.hsl = 'invalid';
            this.rgb = 'ivalid';
            this.hex = 'invalid';
            this.hsv = 'invalid';
    }
    if (init_type != "invalid") {
        this.analogous = function() {
            var ana = analogousFromHSL(this.hsl.H, this.hsl.S, this.hsl.L)
            ana.unshift(this);
            return ana;
        }
        this.triad = function() {
            var triad = triadFromHSL(this.hsl.H, this.hsl.S, this.hsl.L)
            triad.unshift(this);
            return triad;
        }
        this.shades = function() {
            var shades = shadesFromHSL(this.hsl.H, this.hsl.S, this.hsl.L)
            shades.unshift(this);
            return shades;
        }
        this.monochromatic = function() {
            var mono = monochromaticFromHSV(this.hsv.H, this.hsv.S, this.hsv.V)
            mono.unshift(this);
            return mono;
        }
        this.complementary = function() {
            var comp = complementaryFromHSV(this.hsv.H, this.hsv.S, this.hsv.V)
            comp.unshift(this);
            return comp;
        }
        this.splitcomplement = function() {
            var split = splitcomplementFromHSV(this.hsv.H, this.hsv.S, this.hsv.V)
            split.unshift(this);
            return split;
        }
    }

}

function RGB(r, g, b) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.toHSL = function() {
        var hsl = rgbToHsl(this.r, this.g, this.b);
        return hsl;
    }
    this.toHex = function() {
        var hex = rgbToHex(r, g, b);
        return hex;
    }
    this.string = function() {
        var string = "rgb(" + this.r + "," + this.g + "," + this.b + ")";
        return string;
    }
}

function HSL(H, S, L) {
    this.H = H;
    this.S = S;
    this.L = L;
    this.toHSV = function() {
        var hsv = hslToHsv(this.H, this.S, this.L);
        return hsv;
    }
    this.toRGB = function() {
        var rgb = hslToRgb(this.H, this.S, this.L);
        return rgb;
    }
    this.string = function() {
        var string = "hsl(" + this.H + "," + this.S + "%," + this.L + "%)";
        return string;
    }
}

function HSV(H, S, V) {
    this.H = H;
    this.S = S;
    this.V = V;
    this.toHSL = function() {
        var hsl = hsvToHsl(this.H, this.S, this.V);
        return hsl;
    }
    this.monochromatic = function() {
        var mono = monochromaticFromHSV(this.H, this.S, this.V);
        return mono;
    }
    this.complementary = function() {
        var mono = complementaryFromHSV(this.H, this.S, this.V);
        return mono;
    }
}


function determineType(color) {
    if (color.indexOf('hsl') > -1) return 'hsl';
    else if (color.indexOf('rgb') > -1) return 'rgb';
    else if (color.indexOf('#') > -1) return 'hex';
    else if (color.indexOf('hsv') > -1) return 'hsv';
    else return 'invalid';
}

// CONVERSION FUNCTIONS //

function cutHex(h) {
    return (h.charAt(0) == "#") ? h.substring(1, 7) : h
};

function hexToRgb(hex) {
    var r = parseInt((cutHex(hex)).substring(0, 2), 16);
    var g = parseInt((cutHex(hex)).substring(2, 4), 16);
    var b = parseInt((cutHex(hex)).substring(4, 6), 16);
    var rgb = new RGB(r, g, b)
    return rgb;
}

function rgbToHsl(r, g, b) {
    r = (r / 255); //RGB from 0 to 255
    g = (g / 255);
    b = (b / 255);
    var H, S, L;

    var min = Math.min(r, g, b); //Min. value of RGB
    var max = Math.max(r, g, b); //Max. value of RGB
    var delta = max - min; //Delta RGB value

    L = (max + min) / 2;

    if (delta == 0) {
        H = 0 //HSL results from 0 to 1
        S = 0
    } else {
        if (L < 0.5) {
            S = delta / (max + min)
        } else {
            S = delta / (2 - max - min)
        }

        var d = g - b;
        var x = 0
        if (g == max) {
            d = b - r;
            x = 2;
        }
        if (b == max) {
            d = r - g;
            x = 4;
        }

        H = x + (d / delta);
        H = Math.round((H * 60));
        S = Math.round((S * 100));
        L = Math.round((L * 100));

    }
    var hsl = new HSL(H, S, L)
    return hsl;
}

function rgbToHex(r, g, b) {
    var bin = r << 16 | g << 8 | b;
    return (function(h) {
        return new Array(7 - h.length).join("0") + h
    })(bin.toString(16).toUpperCase())
}

function hslToHsv(H, S, L) {
    L = L / 100;
    S = S / 100;
    var t = S * (L < 0.5 ? L : 1 - L);
    var V = (L + t);
    S = Math.round((L > 0 ? 2 * t / V : S) * 100);
    V = Math.round(V * 100);
    var hsv = new HSV(H, S, V);
    return hsv;
}

function hsvToHsl(H, S, V) {
    V /= 100;
    S /= 100;
    var L = ((2 - S) * V) / 2;
    var s = S * V;
    if (L <= 1) {
        s /= V;
    } else {
        s /= 2 - V
    }
    L *= 100;
    S *= 100;
    var hsl = new HSL(H, S, L);
    return hsl;
}

function hslToRgb(h, s, l) {
    var r, g, b;

    h /= 360;
    s /= 100;
    l /= 100;
    if (s == 0) {
        r = g = b = l; // achromatic
    } else {
        function hue2rgb(p, q, t) {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    r = Math.round(r * 255);
    g = Math.round(g * 255);
    b = Math.round(b * 255);
    var rgb = new RGB(r, g, b)
    return rgb;
}

// CONVERSION FUNCTIONS //

function getColorFromHSL(H, S, L) {
    var string = "hsl(" + H + "," + S + "," + L + ")";
    var color = new smartcolor(string);
    return color;
}

function analogousFromHSL(H, S, L) {
    var a = (H + 10) % 360;
    var b = (H + 30) % 360;
    var c = (H + 45) % 360;
    var d = (H - 10) % 360;
    var e = (H - 30) % 360;
    var f = (H - 45) % 360;
    var array = [a, b, c, d, e, f];
    var results = [];
    for (var i = 0; i < array.length; i++) {
        results.push(getColorFromHSL(array[i], S, L));
    }
    return results;
}

function triadFromHSL(H, S, L) {
    var a = (H - 120) % 360;
    var b = (H + 120) % 360;
    var array = [a, b];
    var results = [];
    for (var i = 0; i < array.length; i++) {
        results.push(getColorFromHSL(array[i], S, L));
    }
    return results;
}

function shadesFromHSL(H, S, L) {
    var a = (L + 10) % 100;
    var b = (L + 20) % 100;
    var c = (L - 10) % 100;
    var d = (L - 20) % 100;
    var array = [a, b, c, d];
    var results = [];
    for (var i = 0; i < array.length; i++) {
        results.push(getColorFromHSL(H, S, array[i]));
    }
    return results;
}

function monochromaticFromHSV(H, S, V) {
    var a = (V + 10) % 100;
    var b = (V + 20) % 100;
    var c = (V - 10) % 100;
    var d = (V - 20) % 100;

    var array = [a, b, c, d];
    var results = [];
    for (var i = 0; i < array.length; i++) {
        var hsv = new HSV(H, S, array[i]);
        var hsl = hsv.toHSL();
        results.push(getColorFromHSL(hsl.H, hsl.S, hsl.L));
    }
    return results;
}

function complementaryFromHSV(H, S, V) {
    var a = (H + 180) % 360;
    var aa = (V + 20) % 100;
    var bb = (V + 10) % 100;

    var color = new HSV(H, S, V)
    var color0 = new HSV(a, S, V);
    var color1 = new HSV(H, S, aa);
    var color2 = new HSV(H, S, bb);
    var color3 = new HSV(a, S, bb);
    var color4 = new HSV(a, S, aa);
    var array = [color, color2, color1, color0, color3, color4];
    var results = [];
    for (var i = 0; i < array.length; i++) {
        var hsl = array[i].toHSL();
        results.push(getColorFromHSL(hsl.H, hsl.S, hsl.L));
    }
    return results;
}

function splitcomplementFromHSV(H, S, V) {
    var a = (H + 100) % 360;
    var b = (H + 144) % 360;
    var array = [a, b];
    var results = [];
    for (var i = 0; i < array.length; i++) {
        var hsv = new HSV(array[i], S, V);
        var hsl = hsv.toHSL();
        results.push(getColorFromHSL(hsl.H, hsl.S, hsl.L));
    }
    return results;
}

function here(arr) {
    html = "<div>";
    for (var i = 0; i < arr.length; i++) {
        var rgb = arr[i].rgb.string();
        html += "<h1 style='background:" + rgb + "'>" + rgb + "</hi>";
    }
    html += "</div>";
    return html;
}

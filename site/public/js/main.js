var hex_array = ["EC644B", "D24D57", "F22613", "D91E18", "96281B", "EF4836", "D64541",
    "C0392B", "CF000F", "E74C3C", "DB0A5B", "F64747", "F1A9A0", "D2527F", "E08283", "F62459",
    "E26A6A", "DCC6E0", "663399", "674172", "AEA8D3", "913D88", "9A12B3", "BF55EC", "BE90D4",
    "8E44AD", "9B59B6", "446CB3", "E4F1FE", "4183D7", "59ABE3", "81CFE0", "52B3D9", "C5EFF7",
    "22A7F0", "3498DB", "2C3E50", "19B5FE", "336E7B", "22313F", "6BB9F0", "1E8BC3", "3A539B",
    "34495E", "67809F", "2574A9", "1F3A93", "89C4F4", "4B77BE", "5C97BF", "4ECDC4", "A2DED0",
    "87D37C", "90C695", "26A65B", "03C9A9", "68C3A3", "65C6BB", "1BBC9B", "1BA39C", "66CC99",
    "36D7B7", "C8F7C5", "86E2D5", "2ECC71", "16A085", "3FC380", "019875", "03A678", "4DAF7C",
    "2ABB9B", "00B16A", "1E824C", "049372", "26C281", "E9D460", "FDE3A7", "F89406", "EB9532",
    "E87E04", "F4B350", "F2784B", "EB974E", "F5AB35", "D35400", "F39C12", "F9690E", "F9BF3B",
    "F27935", "E67E22"
];

var error = false;

$(document).ready(function() {
    setSideBar();
    $('.side-bar__color').click(function() {
        setFromBar($(this));
    });
    $('.form__btn').click(function() {
        var meathod = $(this).attr('id');
        executeMeathod(meathod);
    });
    $('.form__input').change(function() {
        var value = $(this).val();
        var id = $(this).attr('id');
        checkInputError($(this), value, id);
        if(error == false) {

          if(id == 'hex-input'){
            var color = new smartcolor(value);
            fillFormColors(color);
          }
          if($(this).hasClass('rgb')){
            var r = parseInt($('#rgb-red').val());
            var g = parseInt($('#rgb-green').val());
            var b = parseInt($('#rgb-blue').val());
            var string = "rgb(" + r + "," + g + "," + b + ")";
            var color = new smartcolor(string);
            fillFormColors(color);
          }
          if($(this).hasClass('hsl')){
            var h = parseInt($('#hsl-h').val());
            var s = parseInt($('#hsl-s').val());
            var l = parseInt($('#hsl-l').val());
            var string = "hsl(" + h + "," + s + "," + l + ")";
            var color = new smartcolor(string);
            fillFormColors(color);
          }
          if($(this).hasClass('hsv')){
            var h = parseInt($('#hsv-h').val());
            var s = parseInt($('#hsv-s').val());
            var v = parseInt($('#hsv-v').val());
            var string = "hsv(" + h + "," + s + "," + v + ")";
            var color = new smartcolor(string);
            fillFormColors(color);
          }
        };
    });
});

$(document).keypress(function(e) {
    if(e.which == 13) {
        if(error != true && $('#hex-input').val() != ""){
          var hex = $('#hex-input').val();
          var color = new smartcolor(hex);
          fillFormColors(color);
          setColors(color);
        }
    }
});

function checkInputError(element, value, id) {
    if (element.hasClass('num-only')) {
        if (value.match(/[a-z]/i)) {
            element.css('background-color', '#F64747');
            error=true;
        } else {
            element.css('background-color', '#eae9e7');
            error=false;
        }

        if (element.hasClass('rgb')) {
            value = parseInt(value);
            checkCieling(value, element, 255);
        }

        if (element.hasClass('hue')) {
            value = parseInt(value);
            checkCieling(value, element, 360);
        }

        if (element.hasClass('hs')) {
            value = parseInt(value);
            checkCieling(value, element, 100);
        }
    }
    if (id = "hex-input") {
        if (!value.match(/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/)) {
            element.css('background-color', '#F64747');
            error=true;
        }
        else{
          element.css('background-color', '#eae9e7')
          error=false;
        }
    }
}

function checkCieling(value, element, cieling){
    if (value < 0 || value > cieling) {
        element.css('background-color', '#F64747');
        error=true;
    } else {
        element.css('background-color', '#eae9e7');
        error=false;
    }
}

function setFromBar(color) {
    var hex = "#" + color.attr('id');
    var color = new smartcolor(hex);
    fillFormColors(color);
    setColors(color);
}

function setColors(colors) {
    if (colors.hex != null) {
        var html = '<div class="colors__panel flexed-5" style="background-color:' +
          colors.rgb.string() + ';width:100%"><p class="colors__panel__label">' +
          colors.hex.replace("#", ""); + '</p><p class="colors__panel__label">' +
          colors.rgb.string()+'</p><p class="colors__panel__label">' +
          colors.hsl.string()+'</p></div>';
        $('#result-container').html(html);
    } else {
        var html = "";
        var width = 100 / colors.length;
        for (var i = 0; i < colors.length; i++) {
            html += '<div class="colors__panel flexed-5" ' + colors[i].rgb.string() +
                ' style="background-color:' + colors[i].rgb.string() +
                ';width:' + width + '%"><p class="colors__panel__label">' +
                colors[i].hex.substring(1) + '</p><p class="colors__panel__label">' +
                colors[i].rgb.string()+'</p><p class="colors__panel__label">' +
                colors[i].hsl.string()+'</p></div>';
        }
        $('#result-container').html(html);
    }
}

function fillFormColors(color){
    // var color = new smartcolor(value);
    $('#hex-input').val(color.hex);
    $('#rgb-red').val(color.rgb.r);
    $('#rgb-green').val(color.rgb.g);
    $('#rgb-blue').val(color.rgb.b);
    $('#hsl-h').val(color.hsl.H);
    $('#hsl-s').val(color.hsl.S);
    $('#hsl-l').val(color.hsl.L);
    $('#hsv-h').val(color.hsv.H);
    $('#hsv-s').val(color.hsv.S);
    $('#hsv-v').val(color.hsv.V);
}

function setSideBar() {
    var html = "";
    for (var i = 0; i < hex_array.length; i++) {
        html += '<div class="side-bar__color" id="' + hex_array[i] + '" style="background:#' + hex_array[i] + '">' +
            '<p>' + hex_array[i] + '</p>' +
            '</div>';
    }
    $('.side-bar').html(html);
}

function executeMeathod(meathod) {
    var temp = $('#hex-input').val();
    var color = new smartcolor(temp);
    switch (meathod) {
        case 'analogous':
            var ana = color.analogous();
            setColors(ana);
            break;
        case 'triad':
            var triad = color.triad();
            setColors(triad);
            break;
        case 'shades':
            var shades = color.shades();
            setColors(shades);
            break;
        case 'monochromatic':
            var mono = color.monochromatic();
            setColors(mono);
            break;
        case 'split':
            var split = color.splitcomplement();
            setColors(split);
            break;
        case 'complementary':
            var comp = color.complementary();
            setColors(comp);
            break;
    }
}

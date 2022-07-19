const argv = require('minimist')(process.argv.slice(2), {
    boolean: ["auto", "remove-null"],
    alias: {
        w: "width",
        h: "height"
    }
});

const fs = require("fs");
const path = require("path");
const { createCanvas } = require("canvas");
const Jimp = require("jimp-compact");

if (argv._.length > 0) {
    switch (path.parse(argv._[0]).ext.toLowerCase()) {
        case ".txt":
            fs.readFile(argv._[0], "utf8", (err, data) => {
                if (err) throw err;
                let w;
                let h;
                if (argv["auto"]) {
                    w = h = Math.ceil(Math.sqrt(data.length / 3));
                }
                else {
                    w = argv["w"] || 64;
                    h = argv["h"] || 64;
                }
                fs.writeFileSync(replaceExt(argv._[0], "png"), toImage(data, w, h));
                console.log(`Converted "${path.basename(argv._[0])}" into an image [${w}x${h}][${(data.length / (w * h * 3) * 100).toFixed(2)}%][${data.length}/${w * h * 3}]`);
            });
            break;
        case ".png":
            Jimp.read(argv._[0], (err, data) => {
                if (err) throw err;
                fs.writeFileSync(replaceExt(argv._[0], "txt"), toText(data, argv["remove-null"]));
                console.log(`Converted "${path.basename(argv._[0])}" into a text file`);
            });
            break;
    }
}

function toImage(string, w, h) {
    const canvas = createCanvas(w, h);
    const ctx = canvas.getContext("2d");
    let codes = [];
    for (let i = 0; i < string.length; i++) {
        codes.push(string.charCodeAt(i));
    }
    for (let i = 0; i < codes.length; i += 3) {
        let array = codes.slice(i, i + 3);
        let r = array[0] || 0;
        let g = array[1] || 0;
        let b = array[2] || 0;
        let x = i / 3 % w;
        let y = Math.floor(i / 3 / w);
        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        ctx.fillRect(x, y, 1, 1);
    }
    return canvas.toBuffer("image/png");
}

function toText(image, removeNull) {
    const w = image.bitmap.width;
    const h = image.bitmap.height;
    let codes = [];
    let string = "";
    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            let rgba = Jimp.intToRGBA(image.getPixelColor(x, y));
            (rgba.r != 0 || !removeNull) && codes.push(rgba.r);
            (rgba.g != 0 || !removeNull) && codes.push(rgba.g);
            (rgba.b != 0 || !removeNull) && codes.push(rgba.b);
        }
    }
    for (let i = 0; i < codes.length; i++) {
        string += String.fromCharCode(codes[i]);
    }
    return string;
}

function replaceExt(input, ext) {
    return path.normalize(`${path.dirname(input)}/${path.parse(input).name}.${ext}`);
}
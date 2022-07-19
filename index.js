const arguments = process.argv.slice(2);

const fs = require("fs");
const path = require("path");
const { createCanvas } = require("canvas");
const Jimp = require("jimp-compact");

const w = 64;
const h = 64;

switch (path.parse(arguments[0]).ext.toLowerCase()) {
    case ".txt":
        fs.readFile(arguments[0], "utf8", (err, data) => {
            if (err) {
                console.error(err);
                return;
            }
            fs.writeFileSync(replaceExt(arguments[0], "png"), toImage(data));
            console.log(`Converted "${path.basename(arguments[0])}" into an image [${(data.length / (w * h * 3) * 100).toFixed(2)}%][${data.length}/${w * h * 3}]`);
        });
        break;
    case ".png":
        Jimp.read(arguments[0], (err, data) => {
            if (err) {
                console.error(err);
                return;
            }
            fs.writeFileSync(replaceExt(arguments[0], "txt"), toText(data));
            console.log(`Converted "${path.basename(arguments[0])}" into a text file`);
        });
        break;
}

function toImage(string) {
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

function toText(image) {
    let w = image.bitmap.width;
    let h = image.bitmap.height;
    let codes = [];
    let string = "";
    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            let rgba = Jimp.intToRGBA(image.getPixelColor(x, y));
            (rgba.r != 0) && codes.push(rgba.r);
            (rgba.g != 0) && codes.push(rgba.g);
            (rgba.b != 0) && codes.push(rgba.b);
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
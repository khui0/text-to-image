# text-to-image
 
A CLI tool to turn text into an image and vice versa. Each pixel stores three characters with each rgb value representing an ASCII character code. Not sure what this can be used for but it can produce interesting results

## Examples

anh.txt

```
It is a period of civil war. Rebel spaceships, striking from a hidden base, have won their first victory against the evil Galactic Empire. During the battle, Rebel spies managed to steal secret plans to the Empire’s ultimate weapon, the DEATH STAR, and space station with enough power to destroy an entire planet. 

Pursued by the Empire’s sinister agents, Princess Leia races home aboard her starship, custodian of the stolen plans that can save her people and restore freedom to the galaxy....
```
anh.png (10x scale)

![anh](https://user-images.githubusercontent.com/101839505/179855325-f1820266-d046-4e66-b036-589aace9e1ab.png)

### Text to image

```
text-to-image "anh.txt" --auto
```

### Image to text

```
text-to-image "tos.txt" --remove-null
```

## Usage

```
text-to-image [PATH] [OPTIONS]
```
The path must be either a .txt or a .png file. Text files are converted to images and vice versa.

### For .txt files

```
--auto                  Automatically size the output file, attempts to fit the content inside the smallest square frame
-w, --width             Manually specify a width in pixels for the output file, defaults to 64
-h, --height            Manually specify a height in pixels for the output file, defaults to 64
```

### For .png files

```
--remove-null           Removes null characters from the output file, useful for storing text, may cause artifacting when converting back to an image
```

## Build

Install [pkg](https://github.com/vercel/pkg) if you don't have it

```
npm i pkg -g
```

Build with

```
pkg .
```

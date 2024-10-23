# ChatGPT Electron

## Requirements

- xdotool `apt install xdotool`
- wmctrl `apt install wmctrl`
- [NodeJS](https://nodejs.org) v20 or +

## Development

Start project:

```sh
npm i
npm run dev
```

## Installation

### Generate package
```sh
npm i
npm run package
```
This will create `out/chatgpt-electron-linux-x64` folder which contains the executable file for Debian.

You can directly run `out/chatgpt-electron-linux-x64/chatgpt-electron` or you may want to use it in a "widget":

### Use on debian

1. Move the executable folder `out/chatgpt-electron-linux-x64` anywhere you like it

2. Copy `run_debian/open_chatgpt.sh` anywhere you like it

3. In your new `open_chatgpt.sh`, edit line 17 `./chatgpt-electron-linux-x64/chatgpt-electron` to run executable from its path

5. Edit line 25 to place the window where you like it

6. Run your `./open_chatgpt.sh` and enjoy

### Generate build
```sh
npm i
npm run make
```
This *should* create `out/deb` and/or `out/rpm` folders so you can install the distribuable in your system

## Credits

This was made by [Axel Andaroth (aka Pirate)](https://anda.ninja) for personal use with Debian 12 XFCE.

Source is open because sharing is caring but I don't plan to spend time to maintain nor to update this project. 

Thanks for your support!

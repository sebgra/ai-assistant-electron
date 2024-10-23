# ChatGPT Electron

## Requirements

- xdotool `apt install xdotool`
- wmctrl `apt install wmctrl`

## Development

Start project:

```sh
$ npm i
$ npm run dev
```

## Installation

1. Generate package:
```sh
$ npm i
$ npm run package
```
This will create `out/chatgpt-electron-linux-x64` folder which contains the executable file for Debian.

2. Move this `chatgpt-electron-linux-x64` folder anywhere you like it

3. Copy `run_debian/open_chatgpt.sh` next to the folder as a sibling

4. Edit line 25 on your new `open_chatgpt.sh` to place the window where you like it

4. Run your `./open_chatgpt.sh` and enjoy

# Aura

Aura is a really small digital signage software written in Angular and Electron.

It can play local files of html, images and videos formats and it doesn't have any network capabilities.

All you have to do is to add files and then click play to turn your screen into a display. 

The software was tested on both Windows and Linux (Ubuntu and Solus).

![picture](https://raw.githubusercontent.com/1legality/aura/master/screenshot.png)

## Building the App

1. If not done already, install angular cli `yarn global add @angular/cli`
2. Run `yarn install` to install all the dependencies
3. Run `yarn dist` the install wizard and the executable will be located in the `release` directory.

## Run the App in Development Mode

1. If not done already, install angular cli `yarn global add @angular/cli`
2. Run `yarn install` to install all the dependencies
3. Run `yarn electron`

## Plugins Used
- Electron
- Angular 5
- Electron-Builder
- SortableJs
- Angular-SortableJS
- Videogular2
- ngx-electron
- ng-boostrap
- Small & Flat Icons by paomedia
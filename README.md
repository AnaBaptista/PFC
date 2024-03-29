# H.O.M.I

Hybrid Ontology Mapping Interface



## Getting Started

These instructions will get you a copy of the project up and running on your local machine.

### Prerequisites

* [Node.js](https://nodejs.org/en/download/)
* [MongoDb](https://www.mongodb.com/download-center/enterprise/releases) - The database used

### Installing

1. Clone this repo to a folder.
2. Open terminal to code repository.
3. Change directories to ```Aplicação``` folder and run ```npm install```.
4. Change directories to the ```express``` folder and run ```npm install```.
5. Change directories back to the ```Aplicação```.
6. Run ```npm start``` to start the desktop application.

### Package with electron-packager
For both cases make sure you are in ```Aplicação``` folder.
In ```desktopapp.js``` comment the line:

```
const cwd = './express'
```

#### Windows or Linux
1. In ```desktopapp.js``` uncomment the line:
```
const cwd = `./resources/app/express`
```
2. Run: 
    * ```npm run package-win``` if the platform is Windows.
    * ```npm run package-linux``` if the platform is Linux.

#### MAC
1. In ```desktopapp.js``` uncomment the line:
```
const cwd = `./Electron.app/Contents/Resources/app/express`
```
2. Run ```npm run package-mac```.

## Authors

* **Ana Baptista** - [github](https://github.com/AnaBaptista)
* **Eliane Almeida** - [github](https://github.com/elianealmeida13)

## Acknowledgments

* **João Cardoso** - *ChaosPop developer* - [github](https://github.com/JoaoMFCardoso)

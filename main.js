// Modules
const {app, BrowserWindow} = require('electron')
const {ipcMain} = require('electron');
const apiKEY = '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'

const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);




async function callOpenAI(n,studyTopic) {
  let objectData = {
    model: "text-davinci-002",
    prompt: `What are ${n} key points I should know when studying ${studyTopic}?`,
    temperature: 0.3,
    max_tokens: 150,
    top_p: 1.0,
    frequency_penalty: 0.0,
    presence_penalty: 0.0,
  }


  return await openai.createCompletion(objectData);

}

function getOpenAIData(callF){
    console.log(callF)

}

ipcMain.on('request-mainprocess-action',(event, arg) => {

  getOpenAIData(callOpenAI(arg))
});


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

// Create a new BrowserWindow when `app` is ready
function createWindow () {

  mainWindow = new BrowserWindow({
    width: 800, height: 600,
    webPreferences: {
      // --- !! IMPORTANT !! ---
      // Disable 'contextIsolation' to allow 'nodeIntegration'
      // 'contextIsolation' defaults to "true" as from Electron v12
      contextIsolation: false,
      nodeIntegration: true
    }
  })

  // Load index.html into the new BrowserWindow
  mainWindow.loadFile('dashboard2.html')

  // Open DevTools - Remove for PRODUCTION!
  mainWindow.webContents.openDevTools();

  // Listen for window being closed
  mainWindow.on('closed',  () => {
    mainWindow = null
  })
}

// Electron `app` is ready
app.on('ready', createWindow)

// Quit when all windows are closed - (Not macOS - Darwin)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// When app icon is clicked and app is running, (macOS) recreate the BrowserWindow
app.on('activate', () => {
  if (mainWindow === null) createWindow()
})

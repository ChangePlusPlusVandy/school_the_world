// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { contextBridge, ipcRenderer} = require("electron")
const { createProgram, getAllPrograms } = require("./Backend/programs")

contextBridge.exposeInMainWorld("electronAPI", {
    createProgram: (doc) => ipcRenderer.invoke("createProgram", doc),
    getAllPrograms: () => ipcRenderer.invoke("getAllPrograms"),
})

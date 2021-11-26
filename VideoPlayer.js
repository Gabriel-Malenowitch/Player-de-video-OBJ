const references = { 
    'video': 'video',
    'configContainer': 'configContainer',
    'controls': 'controls',
    'timeDivBar': 'timeDivBar',
    'play/pause': 'pp',
    'sound': {
        'container': 'soundPlayerContainer',
        'range': 'soundRange'
    },
    'time': {
        'range': 'timeRange',
        'minimum': 'min',
        'maximum': 'max',
        'separator': 'separate',
        'box': 'timeBox'
    },
    'velocity': {
        'fast': 'vFast',
        'slow': 'vSlow',
        'value': 'spanVelocityValue',
        'container': 'velocityContainer',
    },
    'controlsContainers': {
        'left': 'controlsContainersLeft',
        'right': 'controlsContainersRight'
    },
    'configuration':{
        'icon': 'config'
    },
    'resizer': 'resizeIcon'

}

class Utils{
    materialIcons = 'material-icons'

    createSource(a, b) {
        const source = document.createElement('source')
        source.src = a
        source.type = b
        return source
    }

    createIcon(a, b) {
        const icon = document.createElement('i')
        icon.className = `${this.materialIcons } ${b} `
        icon.innerHTML = a
        return icon
    }

    createRange(min, max, n){
        const range = document.createElement('input')
        range.type = 'range'; range.className = n
        range.min = min; range.max = max;
        return range
    }

    createSpan(a, b){
        const span = document.createElement('span')
        span.innerText = a
        span.className = b
        return span
    }

    createDiv(b){
        const div = document.createElement('div')
        div.className = b
        return div
    }

    toSec(n){
        return Math.round(n).toFixed()
    }

    
}

class Tools extends Utils{
    constructor(){
        super()
    }

    createTimeBox(obj){
        //criação do timebox
        this.timeBox = this.createSpan('', references['time']['box'])
        obj.appendChild(this.timeBox)

        //Tempo inicial do vídeo
        this.minSpan = this.createSpan(0, references['time']['minimum'])
        this.timeBox.appendChild(this.minSpan)
        this.player.addEventListener('timeupdate',()=>{
            this.minSpan.innerText = this.toSec(this.player.currentTime)
            this.videoDurationRange.value = this.toSec(this.player.currentTime)
        })

        //Barra que separa os times " / "
        this.timeSeparate = this.createSpan(' / ', references['time']['separator'])
        this.timeBox.appendChild(this.timeSeparate)

        //Tempo total do vídeo
        this.maxSpan = this.createSpan(this.player.duration, references['time']['maximum'])
        this.timeBox.appendChild(this.maxSpan)
        this.player.addEventListener('loadeddata', ()=>{
            this.maxSpan.innerText = this.toSec(this.player.duration)
            this.videoDurationRange.max = this.toSec(this.player.duration)
        })
    }

    createConfigContainer(){
        this.configContainer = this.createDiv(references['configContainer'])
        this.divPlayer.appendChild(this.configContainer)

        this.timeDivBar = this.createDiv(references['timeDivBar'])
        this.configContainer.appendChild(this.timeDivBar)
        this.controls = this.createDiv(references['controls'])
        this.configContainer.appendChild(this.controls)
    }

    createSoundBox(obj){
        //Criação do span Container
        this.timeSpan = this.createDiv(references['sound']['container'])

        //Criação do Icone
        this.timeIco = this.createIcon(this.volumeUp)
        this.timeIco.addEventListener('click', ()=>{
            if(this.player.volume > 0){
                this.timeIco.innerText = this.volumeMute
                this.timeRange.value = 0
                this.player.volume = 0
            }
        })

        //Correção do icone de volume que não sei pq mas ta errado
        this.timeIco.style.transform = 'translateY(3px)'

        //Criando o Range
        this.timeRange = this.createRange(0, 100, references['sound']['range'])

        //Apenas setar o range como 100 logo de início
        this.timeRange.value = 100

        //Na mudança do range fazer isso:
        this.timeRange.addEventListener('input' || 'change', ()=>{
            this.player.volume = this.timeRange.value/100
            if(this.timeRange.value == 0){
                this.timeIco.innerText = this.volumeMute
            }else{
                this.timeIco.innerText = this.volumeUp
            }
        })

        //Adição do icone e do input range ao span container
        this.timeSpan.appendChild(this.timeIco)
        this.timeSpan.appendChild(this.timeRange)

        //Adição do span container ao obj em que deve estar
        obj.appendChild(this.timeSpan)
    }

    getFullScreen(obj){
        this.resizeVideo = this.createIcon(this.resizeIconName)
        obj.appendChild(this.resizeVideo)
        this.resizeVideo.addEventListener('click', ()=>{
            document.fullscreenElement 
            ? document.exitFullscreen()
            : this.divPlayer.requestFullscreen() 
        })
    }

    createRangeTime(obj){
        this.videoDurationRange = this.createRange(0, 0, references['time']['range'])
        obj.appendChild(this.videoDurationRange)
        this.videoDurationRange.addEventListener('input' || 'change',()=>{
            this.player.currentTime = this.videoDurationRange.value
        })
        this.player.addEventListener('ended',()=>{
            this.playPauseVar = !this.playPauseVar
            this.playIcon.innerHTML = this.playPauseVar ? this.pauseName : this.playName
        })
    }

    createPlayPause(obj){
        this.playIcon = this.createIcon(this.playName, references['play/pause'])
        obj.appendChild(this.playIcon)
        this.playIcon.addEventListener('click', ()=>{
            this.playPauseVar = !this.playPauseVar
            this.playIcon.innerHTML = this.playPauseVar ? this.pauseName : this.playName
            this.playPauseVar ? this.player.play() : this.player.pause()
        })
    }

    createSpeed(obj){
        this.velocitySpan = this.createSpan('', references['velocity']['container'])
        this.velocitySpan.style.display = 'flex'
        this.velocitySpan.style.alignItems = 'center'
        obj.appendChild(this.velocitySpan)
        
        this.slowIco = this.createIcon(this.fastRewind)
        this.velocitySpan.appendChild(this.slowIco)
        this.slowIco.addEventListener('click', ()=>{
            this.player.playbackRate-=0.25
            this.spanVelocityValue.innerHTML = `${Number(this.player.playbackRate).toFixed(2)}X`
        })

        this.spanVelocityValue = this.createSpan(`${Number(this.player.defaultPlaybackRate).toFixed(2)}X`, references['velocity']['value'])
        this.velocitySpan.appendChild(this.spanVelocityValue)
        
        //Criação, adição e configuração do icone velocidade +
        this.fastIco = this.createIcon(this.fastFoward)
        this.velocitySpan.appendChild(this.fastIco)
        this.fastIco.addEventListener('click', ()=>{
            this.player.playbackRate+=0.25
            this.spanVelocityValue.innerHTML = `${Number(this.player.playbackRate).toFixed(2)}X`
        })

    }


}

export class VideoPlayer extends Tools{
    paths; player; divPlayer; controls; resolution; duration;
    playIcon; minSpan; maxSpan; videoDurationRange; timeSeparate;
    timeBox; timeDivBar; configContainer; timeSpan; timeRange;
    timeIco; resizeVideo; fastIco; slowIco; velocitySpan; spanVelocityValue;
    controlsLeft; controlsRight; 
    playName = 'play_arrow'; pauseName = 'pause'; playPauseVar = false;
    volumeUp = 'volume_up'; volumeMute = 'volume_mute';
    resizeIconName = 'tv'; fastFoward = 'fast_forward' ; fastRewind = 'fast_rewind'

    constructor(paths, playerId){
        super()
        this.paths = paths
        this.divPlayer = document.getElementById(playerId)

        this.player = document.createElement('video');
        this.player.defaultPlaybackRate = 1
        this.player.className = references['video']
        this.divPlayer.appendChild(this.player); this.player.controls = false
        
        this.createConfigContainer()
    }

    makeSense(){
        this.createAndLoadSources()
        this.createAndLoadIcons()
    }

    setResolution(resolution){
        this.resolution = resolution;
    }

    createAndLoadSources(){
        let source;
        this.paths.forEach(e => {
            const a = e[this.resolution].src; const b = e[this.resolution].type;
            source = this.createSource(a, b)
            this.player.appendChild(source)
        });
    }

    createAndLoadIcons(){

        this.controlsLeft = this.createDiv(references['controlsContainers']['left'])
        this.controlsRight = this.createDiv(references['controlsContainers']['right'])
        this.controls.appendChild(this.controlsLeft)
        this.controls.appendChild(this.controlsRight)

        //Adicionando Icone de play
        this.createPlayPause(this.controlsLeft)
        
        //Criação da configuração de som
        this.createSoundBox(this.controlsLeft)

        //Criação do Timebox
        this.createTimeBox(this.controlsLeft)

        //Range de tempo
        this.createRangeTime(this.timeDivBar)

        //Botao de velocidade
        this.createSpeed(this.controlsRight)

        //Botão de tela cheia
        this.getFullScreen(this.controlsRight)

    }
}


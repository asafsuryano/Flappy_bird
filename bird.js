class PipeColumn{
    constructor(upper,middle,lower,pipe_container){
        this.upper=upper;
        this.middle=middle;
        this.lower=lower;
        this.container=pipe_container;
    }
    moveLeft(){
      let bounding = this.container.getBoundingClientRect();
      this.container.style.left=(bounding['left']-5)+'px';
      if (bounding['right']<=0){
          return true;
      }else{
          return false;
      }
    }
    checkCollision(playerBounding){
        let upper_bounding=this.upper.getBoundingClientRect();
        let lower_bounding=this.lower.getBoundingClientRect();
        if ((upper_bounding['left']<=playerBounding['right'] && playerBounding['right']<=upper_bounding['right']) || (upper_bounding['left']<=playerBounding['left'] && playerBounding['left']<=upper_bounding['right'])){
            if (playerBounding['top']>upper_bounding['bottom'] && playerBounding['bottom']<lower_bounding['top']){
                console.log('not collided');
                return false;
            }else{
                console.log('collided');
                return true;
            }
        }else{
            return false;
        }
    }
}
var gameTop=0;
var gameBottom=20000;
var pipe_columns=[];
var steps=0;
var scrolling_speed=35;
var ready=true;
var jumping=false;
var jumping_steps=0;
var still_playing=true;
var main_screen=document.getElementById("mainScreen");
var score=0;
var score_elem=document.getElementById("scoreHeader");
var mutedSound=true;
score_elem.style.float='left';
var sound_btn_elem=document.getElementById("btnSound");
sound_btn_elem.style.marginTop='1vh';
sound_btn_elem.style.marginLeft='4vh';
let player_elem=document.getElementById('player');
player_elem.style.top='50vh';
window.setInterval(()=>{
    if (still_playing==true){
        if (pipe_columns.length<6 && ready==true){
        let pipe_cont=document.createElement("div");
        pipe_cont.style.width="50px";
        pipe_cont.style.height="92vh";
        pipe_cont.style.position='absolute';
        pipe_cont.style.left=(window.innerWidth-50)+'px';
        let body_bounding=document.body.getBoundingClientRect();
        gameTop=body_bounding['top'];
        gameBottom=body_bounding['bottom'];
        let elem_upper=document.createElement("canvas");
        elem_upper.style.backgroundColor="green";
        elem_upper.style.width="50px";
        elem_upper.style.left=window.innerWidth-50;
        let upper_h=Math.floor(Math.random()*67);
        elem_upper.style.height=upper_h+"vh";
        let elem_middle=document.createElement("canvas");
        elem_middle.style.width="50px";
        elem_middle.style.left=window.innerWidth-50;
        elem_middle.style.height=25+"vh";
        let elem_lower=document.createElement("canvas");
        elem_lower.style.backgroundColor="green";
        elem_lower.style.width="50px";
        elem_lower.style.left=window.innerWidth-50;
        elem_lower.style.height=(67-upper_h-2)+"vh";
        pipe_cont.appendChild(elem_upper);
        pipe_cont.appendChild(elem_middle);
        pipe_cont.appendChild(elem_lower);
        let pipe_column=new PipeColumn(elem_upper,elem_middle,elem_lower,pipe_cont);
        pipe_columns.push(pipe_column);
        document.body.appendChild(pipe_cont);
        ready=false;
    }
    for (let i=0;i<pipe_columns.length;i++){
        if (pipe_columns[i].moveLeft()==true){
            pipe_columns.splice(i,1);
            console.log(pipe_columns.length);
        }
        let player_elem=document.getElementById("player");
        if (pipe_columns[i].checkCollision(player_elem.getBoundingClientRect())){
            still_playing=false;
            let ans=window.confirm("press the OK button to retry");
            if (ans==true){
                location.reload();
            }
        }
    }
    steps++;
    steps=steps%100;
    
    if (steps%100==0){
        ready=true;
    }
    if (steps%10==0){
        score++;
    }
    score_elem.innerHTML='score: '+score;
}
},scrolling_speed);

window.setInterval(()=>{
    if (still_playing==true){
        let player_elem=document.getElementById("player");
        let bounding=player_elem.getBoundingClientRect();
        if (jumping==false){
            player_elem.style.top=(bounding['top']+1)+'px';
            bounding=player_elem.getBoundingClientRect();
            console.log('bounding bottom: '+bounding['bottom']);
            console.log('game bottom '+gameBottom);
            if (bounding['bottom']>=gameBottom){
                let ans=window.confirm("press the OK button to retry");
                if (ans==true){
                    still_playing=false;
                    location.reload();
                }
            }
        }else{
            player_elem.style.top=(bounding['top']-2)+'px';
            bounding=player_elem.getBoundingClientRect();
            console.log('bounding top: '+bounding['top']);
            console.log('game top '+gameTop);
            if (bounding['top']<=gameTop){
                let ans=window.confirm("press the OK button to retry");
                if (ans==true){
                    still_playing=false;
                    location.reload();
                }
            }
            jumping_steps++;
            if (jumping_steps>=30){
                jumping_steps=0;
                jumping=false;
            }
        }
    }
},5);

document.addEventListener('keypress',(event)=>{
    if (event.key==" "){
        jumping=true;
        jumping_steps=0;
    }
});

function soundClicked(){
    if (mutedSound==true){
        mutedSound=false;
        let audio_pic_elem=document.getElementById("soundPic");
        audio_pic_elem.src="soundOn.PNG";
        let audio_elem=document.getElementById("gameAudio");
        audio_elem.play();
    }else{
        mutedSound=true;
        let audio_pic_elem=document.getElementById("soundPic");
        audio_pic_elem.src="soundMute.PNG";
        let audio_elem=document.getElementById("gameAudio");
        audio_elem.pause();
    }
}
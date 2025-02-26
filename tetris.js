
const T_ROWS = 20;
const T_COLS = 10;
const stage = document.querySelector(".stage > ul");

let score = 0;
let duration = 1000;
let timeInterval;
let tempTetromino;

const tetromino = {
    type : "",
    direction : 0,
    top : 0,
    left : 3,
};

init()

function init(){
    score = 0;
    document.querySelector(".score").innerText = 0;
    tempTetromino = {...tetromino};
    
    for(let i = 0 ; i < T_ROWS; i++){
        makeNewLine();
    }    
    makeNewBlock();
}

function renderBlocks(moveType=""){
    const {type,direction,top,left} = tempTetromino;
    const movingBlocks = document.querySelectorAll(".moving");

    movingBlocks.forEach(moving=>{
        moving.classList.remove(type,"moving");
    })
    BLOCKS[type][direction].some(block=>{
        const x = block[0] + left;
        const y = block[1] + top;
        const target =  stage.childNodes[y] 
        ? stage.childNodes[y].childNodes[0].childNodes[x] 
        : null;
        const isAvailable = checkEmpty(target);

        if(isAvailable){
            target.classList.add(type,"moving");
        }else{
            tempTetromino = {...tetromino};
            if(moveType==='retry'){
                clearInterval(timeInterval)
                showGameoverText();
            }
            setTimeout(()=>{
                renderBlocks('retry'); 
                if(moveType=="top"){
                    seizeBlock();
                }
               
            },0) 
            return true;
        }        
    });

    tetromino.left = left;
    tetromino.top = top;
    tetromino.direction = direction;
}

function seizeBlock(){
    const movingBlocks = document.querySelectorAll(".moving");
    movingBlocks.forEach(moving=>{
        moving.classList.remove("moving");
        moving.classList.add("seized");
    })
    checkMatch()
}


function checkMatch(){
    const childNodes = stage.childNodes;
    childNodes.forEach(child=>{
        let matched = true;
        child.children[0].childNodes.forEach(li=>{
            if(!li.classList.contains("seized")){
                matched = false;
            }
        })
        if(matched){
            child.remove();
            makeNewLine();
            score++;
            document.querySelector(".score").innerText = score;
        }
    })
    makeNewBlock()
}

function makeNewLine(){
    const li = document.createElement("li");    
    const ul = document.createElement("ul");    
    for(let j = 0 ; j < T_COLS ; j++){   
        const matrix = document.createElement("li");    
        ul.prepend(matrix); 
    }   
    li.prepend(ul);     
    stage.prepend(li);     
}   

function makeNewBlock(){

    clearInterval(timeInterval);
    timeInterval=setInterval(()=>{
        moveBlock('top',1)
    },duration)

    const blockArray = Object.entries(BLOCKS);
    const randomIndex = Math.floor(Math.random()*blockArray.length);

    tetromino.type=blockArray[randomIndex][0];
    tetromino.top = 0;
    tetromino.left = 3;
    tetromino.direction = 0;
    tempTetromino = {...tetromino};
    renderBlocks(); 
}

function checkEmpty(target){
    if(!target || target.classList.contains("seized")){
        return false;
    }

    return true;
}


function moveBlock(moveType,amount){
    tempTetromino[moveType] += amount;
    renderBlocks(moveType)
}

function changeDirection(){
   const direction = tempTetromino.direction;
   direction === 3  ? tempTetromino.direction = 0 : tempTetromino.direction +=1;
   renderBlocks()
}

function dropBlock(){
    clearInterval(timeInterval);
    timeInterval = setInterval(()=>{
        moveBlock('top',1);
    },10)
}

function showGameoverText(){
    document.querySelector(".gameover").style.display = "flex";
}

document.addEventListener("keydown",e=>{
    switch(e.keyCode){
        case 39:
            moveBlock("left",1);
            break;
        case 37:
            moveBlock("left",-1);
            break;
        case 40:
            moveBlock("top",1);
            break;
        case 38:
            changeDirection();
            break;  
        case 32:
            dropBlock();
            break;  
        default:
            break;
    }
})

document.querySelector('.btn_change').addEventListener('click', function(){
	changeDirection();
});
document.querySelector('.btn_down').addEventListener('click', function(){
	dropBlock();
});
document.querySelector('.btn_left').addEventListener('click', function(){
	moveBlock("left",-1);
});
document.querySelector('.btn_right').addEventListener('click', function(){
	moveBlock("left",1);
});

document.querySelector(".gameover > button").addEventListener("click",()=>{
    stage.innerHTML = "";
    document.querySelector(".gameover").style.display = "none";
    init()
})
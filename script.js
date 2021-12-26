const img = new Image();
img.src = "images/sprite.png";

img.onload = () => {
    main();
}

var gameScore = 0;

// var game = false;
// var flag = false;
// console.log(img.src);
// console.log(game);

const canvas = document.getElementById("game");
var ctx = canvas.getContext("2d");
const speed = 0.5;


let lowerPipes = [];
let upperPipes = [];

function generatePipes() {
    for(let i = 0 ; i < 10 ; i++) {
        lowerPipes.push(new LowerPipe(ctx, i));
        upperPipes.push(new UpperPipe(ctx, i));
    }
}


class Game {
    constructor(ctx) {
        this.ctx = ctx;
        this.game = false;
        this.state = "init";
        this.p = new Player(this.ctx);   
        this.bg = new Background(this.ctx);     
    }

    ready() {
        this.game = true;
        this.gameScore = 0;
        this.bg.renderGetReady();
        this.p.show();
    }


    play() {
        this.bg.render();
        this.p.render();
        lowerPipes.forEach((p) => {
            p.render();
        });
            
        upperPipes.forEach((p) => {
            p.render();
        }); 

        checkCollision(lowerPipes, upperPipes, this.p); 
        
    }

    gameOver() {
        this.bg.renderGameOver();
        //this.state = "init";
    }

    render() {
        switch(this.state) {
            case "init":
                console.log("initialized")
                this.ready();
                break;
            
            case "play":
                this.play();
                break;

            case "over":
                this.gameOver();
                //this.ready();
                break;

            default:
                break;
        }
    }
}

class UpperPipe {
    constructor(ctx, index) {
        this.x = 200 + index * 80;
        this.y = 0;
        this.width = 30;
        this.height = Math.floor(Math.random()*10)+50;
        this.ctx = ctx;
    }

    render() {
        this.update();
        this.ctx.drawImage(img, 54, 331, 28, 153, this.x, this.y, this.width, this.height);
        //this.ctx.fillRect(this.x,this.y, this.width, this.height);
    }

    update() {
        this.x = this.x - 1;   
        if (this.x == -1) {
            this.x = 800; 
            gameScore++;
            document.getElementById("score").innerHTML = gameScore; 
        }
    }

    getCordinates() {
        return {
            x: this.x,
            y: this.y,
            h: this.height,
        }  
    }

}

class LowerPipe {
    constructor(ctx, index) {
        this.x = 200 + index * 80;
        this.height = Math.floor(Math.random()*10)+50;
        this.y = 150 - this.height;
        this.width = 30;
        this.ctx = ctx;
    }

    render() {
        this.update();
        this.ctx.drawImage(img, 83, 321, 28, 153, this.x, this.y, this.width, this.height);
        //this.ctx.fillRect(this.x,this.y, this.width, this.height);
    }

    update() {
        this.x = this.x - 1;   
        if (this.x == -1) {
            this.x = 800;
        }
    }   
    
    getCordinates() {
        return {
            x: this.x,
            y: this.y,
            h: this.height,
        }  
    }

}



class Player {
    constructor(ctx, color) {
        // this.x = Math.floor(Math.random()*100);
        // this.y = Math.floor(Math.random()*100);
        this.x = 60;
        this.y = 90;
        this.dx = 1;
        this.dy = 1;
        this.ctx = ctx;
        this.color = color;   
    }

    show(){
        // this.ctx.fillRect(this.x,this.y, 20 , 10);
        // this.ctx.fillStyle = this.color;
        this.ctx.drawImage(img, 114, 404, 19, 20, this.x, this.y, 20, 18);
    }

    render() {
        this.update();
        //this.ctx.fillRect(this.x,this.y, 20 , 10);
        this.ctx.drawImage(img, 114, 404, 19, 20, this.x, this.y, 20, 18);
        //this.ctx.fillStyle = this.color;
    }

    jump() {
        console.log("jumped");
        this.y = this.y - 12  ;
    }    

    update() { 
        this.y = this.y + this.dy * speed; 
    
    } 

    getCordinates() {
        return {
            x: this.x,
            y: this.y,
        }  
    }
}


class Background {
    constructor(ctx) {
        this.ctx = ctx;
    }

    render() {
        this.ctx.drawImage(img, 0, 0, 380, 1000, 0, 0, 800, 600); //background    
    }

    renderGameOver() {
        this.ctx.drawImage(img, 348, 87, 107, 28, 10, 0, 107, 28); //flappybirdText
        this.ctx.drawImage(img, 392, 56, 100, 30, 75, 70,  100, 20); //gameOverText
    }
    
    renderGetReady(){
        this.ctx.drawImage(img, 348, 87, 107, 28, 10, 0, 107, 28); //flappybirdText
        this.ctx.drawImage(img, 293, 58, 98, 29, 75, 70, 98, 29);
    }

}


function checkCollision(pipesLower, pipesUpper, playerFlappy){
    let cordsFlappy = playerFlappy.getCordinates();
    //console.log(cordsFlappy.x, cordsFlappy.y);

    pipesUpper.forEach((p) => {
        let cordsP = p.getCordinates();
        //console.log(cordsP.h);

        if(cordsFlappy.x >= cordsP.x && cordsFlappy.x+20 >= cordsP.x){
            if(cordsFlappy.y >= cordsP.y && cordsP.y+ cordsP.h >= cordsFlappy.y){
                console.log("Upper Collision " + " Game Over")
                g.state = "over";
                console.log(g.p.getCordinates());
                //flag = true;

            }
        }
    });

    pipesLower.forEach((p) => {
        let cordsP = p.getCordinates();
        if(cordsFlappy.x >= cordsP.x && cordsFlappy.x+20 >= cordsP.x){
            if(cordsFlappy.y >= cordsP.y && cordsFlappy.y + 18 >= cordsP.y){
                console.log("Lower Collision" + " Game Over");
                g.state = "over";
                console.log(g.p.getCordinates());
                //flag = true;
            }
        }
    });
    
}



/* Main function */

generatePipes();

//const player1 = new Player(ctx);
const bg = new Background(ctx);
const g = new Game(ctx);

function main(){
    bg.render();
    g.render();
    requestAnimationFrame(main);    
}




document.addEventListener('keydown' || 'keypress', (e) => {
    if(e.keyCode === 13) {
        g.state = "play";
        document.getElementById("pressKey").innerHTML = "press w or space or upper key";
    }
    
    if(g.game) {
        if (e.keyCode === 87 || e.keyCode === 32 || e.keyCode === 38 ) {
            console.log("pressed");
            g.p.jump();  
            //g.p.update();
        }
        else {
            console.log(e.keyCode);
            console.log("press proper key");
        }
    }
    
})





// document.addEventListener('keydown' || 'keypress', (e) => {
//     if(e.keyCode === 13) {
//         game = true;
//         document.getElementById("pressKey").innerHTML = "press w or space or upper key";
//     }
//     if(game) {
//         if (e.keyCode === 87 || e.keyCode === 32 || e.keyCode === 38 ) {
//             console.log("pressed");
//             player1.jump();  
//             player1.update();
//         }
//         else {
//             console.log(e.keyCode);
//             console.log("press proper key");
//         }
//     }
    
// })

var inGame = false;
var score = -10;

var MaxScoreBookTower = 0;
MaxScoreBookTower = window.localStorage.getItem("MaxScoreBookTower");
document.querySelector(".MaxScore").innerHTML = "Max Score: " + MaxScoreBookTower;

const api_url = "http://api.creativehandles.com/getRandomColor";
var request;

document.addEventListener('click',GameMain);
document.addEventListener('keypress',GameMain);


function bookPressSound(){
    var aud = new Audio("sounds/lifeup.wav");
    aud.play();
}


function gameOverSond(){
    var aud = new Audio("sounds/gameover.wav");
    aud.play();
}

function GameMain(){

    if(inGame){
        return;
    }
    inGame = true;

    // document.querySelector("body").style.backgroundColor = "#3BACB6";
    document.querySelector('h2').remove();
    document.querySelector('h3').style.display = 'block';
    document.querySelector('.MaxScore').style.display = 'block';

    var canvas = document.getElementById("w");

   var context = canvas.getContext("2d");

    window_width = window.innerWidth;
    window_height = window.innerHeight;

    canvas.width = window_width;
    canvas.height = window_height;
    canvas.style.background = "black";

    function generateRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
      }
      
    
    class Platform {
        constructor(xpos, ypos, radius, speed, color, inPlat, length, alreadyClicked) {
    
            this.position_x = xpos;
            this.position_y = ypos;
    
            this.radius = radius;
    
            this.speed = speed;
    
            this.dx = 4 * this.speed;
            this.dy = 0;
    
            if(score>=50){
                this.dx = 1.5 * this.dx;
            }
            if(score>=100){
                this.dx = 2 * this.dx;
            }
            if(score>=150){
                this.dx = 2.5 * this.dx;
            }

            if(color == ""){
                color=generateRandomColor();//"#F10531"
             }
            
            this.color = color;
    
            this.inPlat = inPlat;
            this.length = length;

            this.alreadyClicked = alreadyClicked;
        }
    
        draw(context) {
            context.beginPath();
            context.fillStyle = this.color;
            // context.textAlign = "center";
            // context.textBaseline = "middle";
            // context.font = "30px Arial";
            // context.lineWidth = 5;
            // context.arc(this.position_x, this.position_y, this.radius, 0, Math.PI * 2);
            context.rect(this.position_x, this.position_y, 3*this.length ,24);
            context.fill();
            // context.stroke();
            context.closePath();
            
        }
    
    
        update() {


            if(all_books.length >= 2){
                if(all_books[all_books.length - 1].position_y >=  window_height - 25*(all_books.length)){
                  if(all_books[all_books.length - 2].position_x > (all_books[all_books.length - 1].position_x + 210) || all_books[all_books.length - 1].position_x > (all_books[all_books.length - 2].position_x + 210)){
                      all_books = [];
                      if(score > MaxScoreBookTower){
                        window.localStorage.setItem("MaxScoreBookTower", score);
                      }
                      gameOverSond();
                      setTimeout(()=>{
                          alert("GameOver");
                          location.reload();
                      },200);
                     
                      
                  }
                }
              }

            this.draw(context);
                   
            if (this.position_x > 1100 ) {
                // context.clearRect(0,0,canvas.width,canvas.height);
                this.dx = -this.dx;
                // return;  
            }

            if (this.position_x < 210 ) {
                // context.clearRect(0,0,canvas.width,canvas.height);
                this.dx = -this.dx;
                // return; 
            }
            
            if(this.position_y > window_height - 24*(all_books.length)){
                this.dy = 0;
                if(!this.inPlat){
                    platDelay();
                    this.inPlat= true;
                    return;
                }
                if(all_books.length > 10){

                    all_books.forEach(element1 => {
                        element1.dy = 2 * element1.speed;
                      });
            
                 }  

                 if(all_books[0].position_y > window_height ){
                    all_books.forEach(element2 => {
                        element2.dy = 0;
                      }); 

                    all_books.shift();
                    return;
                    // all_books[0].dy = 1.5 *this.speed;

                }
                
                //  return;
            }

            document.addEventListener('click',()=>{
                if(this.alreadyClicked){
                    return;
                }
                this.alreadyClicked = true;
                bookPressSound();
                this.dx = 0;
                this.dy = 2*this.speed;
            });
            
            this.position_y += this.dy;
            this.position_x += this.dx; 

        }
    }
    
    
    var all_books = [];
    
    function platDelay(){
    
            var radius = 50;
            var random_x = 320;
            var random_y = 150;
            var len = 70;

            var colour = "";

            score += 10;
            console.log(score);

            document.querySelector('h3').innerHTML = "Score : " + score + "";


           request = new XMLHttpRequest();

           request.open('GET', api_url , true);
           
           request.onload = function () {
               var data = JSON.parse(this.response);
               colour = data.color;
               console.log(colour);

               let myPlatform = new Platform(2*random_x, random_y, radius, 3, colour, false, len, false);
               all_books.push(myPlatform);
            //    return;
           };

           request.send();

           
    }

    platDelay();

    
    let updatePlatform = function() {
        
      requestAnimationFrame(updatePlatform);
      context.clearRect(0, 0, window_width, window_height);
    
      all_books.forEach(element => {
        element.update();
      });
    };
    
    updatePlatform();
 
    
}



const largura = 1280;
const altura = 720;

const velocidade_chao = 5;

let piso;
let bird;
let tubos = []
let caindo = false;

let canvas;

let img_logo

function preload(){
  img_logo = loadImage("logo.png")
}
function setup() {
  canvas = createCanvas(largura, altura);
  windowResized();
  piso = new Piso();
  passaro = new Passaro();
  tubos.push(new Tubo())  
  
}

let contadortubos = 0;

let tela = 0;

function draw() {
  cursor(ARROW);
 background("#e6e6e6")
  
  if(tela == 0){
    menu();
  }
  if(tela == 1){
    tela1();
  }
  if(tela == 2){
    tela2();
  }
  if(tela == 3){
    tela3();
  }
  
 
  
}

function tela1(){
  if(tela == 1){ 
   background("dodgerblue");
    for (const tubo of tubos){
      tubo.desenhar();
    }
  piso.desenhar();
  passaro.desenhar();
  if(contadortubos * velocidade_chao % 400 == 0){
      tubos.push(new Tubo());
    }
  if(caindo){
      contadortubos++;
    }
    voltar()
  }
}
function tela2(){
  if(tela == 2){
    background("#e6e6e6")
    voltar()
  }

}
function tela3(){
  if(tela == 3){
    background("#e6e6e6")
    voltar()
  }

}
function menu(){
   
  cursor(ARROW);
  fill("#8dc63f");
  noStroke();
  rect(360,height/2.5,600,50,20);
  rect(360,height/2,600,50,20);
  rect(360,height/1.7,600,50,20);
  textos()
  
  image(img_logo,450,40,400,200)

  if(mouseX >=360 && mouseX<=960 && mouseY>=height/2.5 && mouseY<=(height/2.5)+50){
    cursor(HAND);
    noFill();   
    stroke(54,128,193);
    rect(360,height/2.5,600,50,20);
    if(mouseIsPressed){
      tela = 1;
      console.log(tela)
    }
    
  }
  else if(mouseX >=360 && mouseX<=960 && mouseY>=height/2 && mouseY<=(height/2)+50){
    cursor(HAND);
    noFill();   
    stroke(54,128,193);
    rect(360,height/2,600,50,20);
    if(mouseIsPressed){
      tela = 2;
    }
  }
  else if(mouseX >=360 && mouseX<=960 && mouseY>=height/1.7 && mouseY<=(height/1.7)+50){
    cursor(HAND);
    noFill();   
    stroke(54,128,193);
    rect(360,height/1.7,600,50,20);
    if(mouseIsPressed){
      tela = 3;
    }
    
  }

}
function voltar(){
  
  fill("#fff")
  rect(width/2, 3, 100,40,10)
  noStroke()
  textSize(20);
  textAlign(CENTER);
  fill("#000");
  text("Home",690 ,29);

  if(mouseX >= width/2 && mouseX <= (width/2)+100 && mouseY>=3 && mouseY <= 43){
    cursor(HAND)
    if(mouseIsPressed){
      tela = 0;
      menu();
    }
  }
}
function textos(){
  textSize(30);
  textAlign(CENTER);
  fill("#fff");
  text("Iniciar",670 ,323);
  text("Controles",670, 395);
  text("Sobre",670, 460);
}

function windowResized() {
  if (windowWidth < largura) {
    canvas.style("transform", `scale(${windowWidth / width})`);
  }
}

function keyPressed(){
    click();
}
function mousePressed(){
  click();
}
function click(){
  if(caindo){
     passaro.aceleracao.set(createVector(0, -5));      
  }else{//reseta tudo
    passaro.resetarVariables();
    caindo = true;
    contadortubos = 0;
    tubos = [];
  }
}

function perder(){
  caindo= false;
}

function Tubo(){
  const distanciaTubos = 150
  this.w = 100;
  this.h = 600;
  this.x = width;
  let aleatoriedade = 300 * Math.random() - 150;
  this.y = (height/2) + aleatoriedade;
  this.y2 = this.y - this.h - distanciaTubos;
  this.desenhar = function(){
    fill("green")
    rect(this.x,this.y, this.w, this.h);
    rect(this.x,this.y2, this.w, this.h);
    if(caindo){
      this.x -= velocidade_chao;
    }
  }
  this.areaColision = function(){
    return[
      new Rectangle(this.x,this.y,this.w,this.h),
      new Rectangle(this.x,this.y2,this.w,this.h)
    ];
  }
}

function Passaro() {
  this.r = 60 // raio = 60

  this.resetarVariables = function () {
    this.pos = createVector(width / 2, height / 2);
    this.aceleracao = createVector(0,0)
  }
  this.resetarVariables();
  this.desenhar = function () {
  fill("orange")
  circle(this.pos.x, this.pos.y, this.r);
   
  if(caindo){
     this.aceleracao.add(createVector(0,0.2));
     this.pos.add(this.aceleracao)
  }
  if(this.areaColision().collideRect(piso.areaColision())){
    perder();
  }
  for(const tubo of tubos){
    let colisao = tubo.areaColision();
    for(const c of colisao){
      if(this.areaColision().collideRect(c)){
      perder();
    }
    }
    
  }
  }
  this.areaColision = function(){
    return new Circle(this.pos.x, this.pos.y, this.r);
  }
}

function Piso() {
  this.w = largura;
  this.h = 140;
  this.x = 0;
  this.y = altura - this.h;
  this.desenhar = function () {
    fill("wheat");
    rect(this.x, this.y, this.w, this.h);
  }
this.areaColision = function(){ //cria a area que o passaro não pode passar
return new Rectangle(this.x, this.y, this.w, this.h);
}
}
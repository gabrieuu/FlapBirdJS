const largura = 1280;
const altura = 720;
const velocidade_chao = 5;
let canvas

let piso;
let bird;
let tubos = []
let caindo = false; 

function setup() {
  canvas = createCanvas(largura, altura);
  windowResized();
  piso = new Piso();
  passaro = new Passaro();
  tubos.push(new Tubo())  
}

let contadortubos = 0;

function draw() {
  
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
this.areaColision = function(){ //cria a area que o passaro não de passar
return new Rectangle(this.x, this.y, this.w, this.h);
}
}
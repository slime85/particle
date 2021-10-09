const $particleList = document.querySelector("#particle-list");
const $controller = document.querySelector("#controller");
const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");
const particleList = [];
const particleData = localStorage.getItem("particle-particleData") === null ? {max: 50, type: []} : JSON.parse(localStorage.getItem("particle-particleData"));
const preset = localStorage.getItem("particle-preset") === null ? [] : JSON.parse(localStorage.getItem("particle-preset"));
const pi = Math.PI;
const page = {x: window.innerWidth, y: window.innerHeight};
const images = [];
const imageCount = 4;
const particleCanvasList = [];
const particleAdd = document.createElement("canvas");
const addCtx = particleAdd.getContext("2d");
const preview = document.querySelector("#preview");
const preCtx = preview.getContext("2d");
let particleDefault = localStorage.getItem("particle-particleDefault") === null ? true : JSON.parse(localStorage.getItem("particle-particleDefault"));
let frame = null;
let frameTime = null;

// min = m, max = x, size = sz, speed = sp = rotate = rt , radius = rd, wave = wv, alpha = ap

const $type = document.querySelector("#type");
const $imgSelect = document.querySelector("#img-select");
const $polygon = document.querySelector("#polygon");
const $color = document.querySelector("#color");
const $colorText = document.querySelector("#color-text");
const $stroke = document.querySelector("#stroke");
const $strokeColor = document.querySelector("#stroke-color");
const $strokeColorText = document.querySelector("#stroke-color-text");
const $strokeWidthRange = document.querySelector("#stroke-width-range");
const $strokeWidth = document.querySelector("#stroke-width");
const $strokeJoin = document.querySelector("#stroke-join");
const $ratioRange = document.querySelector("#ratio-range");
const $ratio = document.querySelector("#ratio");
const $sizeRange = document.querySelector("#size-range");
const $sizeMin = document.querySelector("#size-min");
const $sizeMax = document.querySelector("#size-max");
const $speedRange = document.querySelector("#speed-range");
const $speedMin = document.querySelector("#speed-min");
const $speedMax = document.querySelector("#speed-max");
const $rotateRange = document.querySelector("#rotate-range");
const $rotateMin = document.querySelector("#rotate-min");
const $rotateMax = document.querySelector("#rotate-max");
const $rotateDirection = document.querySelector("#rotate-direction");
const $wave = document.querySelector("#wave");
const $waveDefault = document.querySelector("#wave-default");
const $waveRadiusRange = document.querySelector("#wave-radius-range");
const $waveRadiusMin = document.querySelector("#wave-radius-min");
const $waveRadiusMax = document.querySelector("#wave-radius-max");
const $waveSpeedRange = document.querySelector("#wave-speed-range");
const $waveSpeedMin = document.querySelector("#wave-speed-min");
const $waveSpeedMax = document.querySelector("#wave-speed-max");
const $alphaRange = document.querySelector("#alpha-range");
const $alphaMin = document.querySelector("#alpha-min");
const $alphaMax = document.querySelector("#alpha-max");

const $polyOption = document.querySelector("#poly-option");
const $arcOption = document.querySelector("#arc-option");
const $imgOption = document.querySelector("#img-option");

const $images = document.querySelectorAll(".image");
const $polygons = document.querySelectorAll(".polygon");
const $shapes = document.querySelectorAll(".shape");

const $imgList = document.querySelector("#img-list");
let $imgItem;

const $getValues = document.querySelectorAll("input, span");

const loadImage = (name)=>{
  return new Promise( (res, rej) => {
      let img = new Image();
      img.src = name;
      img.onload = ()=>{
          res(img);
      };
      img.onerror = () => {
          rej("error occured loading image");
      }
  })
}

const inputEvent = e => {
  const el = e.target;
  let parent = false;

  if(el.classList.contains("lever")) {
    parent = el.parentNode;
  }else {
    
  }
}

const addParticle = (start) => {
  const result = {};

  if(particleData.type.length > 1) {
    let random = 0;
    for(let j = 0; j < particleData.type.length; j++) {
      random += particleData.type[j].ratio * 10;
    }

    random = Math.floor(Math.random() * random) + 1;
    
    for(let j = 0; j < particleData.type.length; j++) {
      const item = particleData.type[j];
      if(random <= item.ratio * 10 && random > 0) {
        result.type = j;
        random = - 1;
      }else random -= item.ratio * 10;
      if(j === particleData.type.length - 1 && random > 0) {
        result.type = j;
      }
    }
  }else {
    result.type = 0;
  }
  
  const type = particleData.type[result.type];

  result.size = Math.random() * (type.xSz - type.mSz) + type.mSz;
  result.speed = Math.random() * (type.xSp - type.mSp) + type.mSp;
  result.rotateSpeed = Math.random() * (type.xRtSp - type.mRtSp) + type.mRtSp;
  result.rotateStep = 0;
  result.waveRadius = 0;
  result.waveStep = 0;
  result.waveSpeed = 0;
  result.alpha = Math.random() * (type.xAp - type.mAp) + type.mAp;
  result.direc = type.direc;
  result.life = type.life;
  result.tran = type.tran;

  if(result.rotateSpeed !== 0) {
    result.rotateStep = Math.random() * pi * 2;

    if(type.rtWay === 0) {
      const random = Math.random();
      if(random >= 0.5) {
        result.rotateSpeed *= - 1;
      }
    }else if(type.rtWay === - 1) {
      result.rotateSpeed *= - 1;
    }
  }

  if(type.wv) {
    result.waveStep = Math.random() * pi * 2;
    result.waveRadius = type.wv.default ? result.size / 2 : Math.random() * (type.wv.xRd - type.wv.mRd) + type.wv.mRd;
    result.waveSpeed = type.wv.default ? pi / result.size / 10 : Math.random() * (type.wv.xSp - type.wv.mSp) + type.wv.mSp;
  }
  
  if(start) {
    result.x = Math.random() * (page.x + (type.xSz * 2)) - type.xSz;
    result.y = Math.random() * (page.y + (type.xSz * 2)) - type.xSz;
    if(type.start === "center") {
      result.direc = Math.atan2(result.y - (page.y / 2), result.x - (page.x / 2));
    }
  }else {
    if(type.start === "default") {
      if(result.direc === "top" || result.direc === "bottom") {
        result.x = Math.random() * (page.x + (type.xSz * 2)) - type.xSz;
        if(result.direc === "top") result.y = - result.size * 2;
        else result.y = page.y + result.size * 2;
      }else if(result.direc === "left" || result.direc === "right") {
        result.y = Math.random() * (page.y + (type.xSz * 2)) - type.xSz;
        if(result.direc === "left") result.y = - result.size * 2;
        else result.y = page.y + result.size * 2;
      }
    }else if(type.start === "center") {
      result.direc = Math.random() * pi * 2;
      result.x = page.x / 2;
      result.y = page.y / 2;
    }else {
      result.x = Math.random() * (page.x + (result.size * 2)) - result.size;
      result.y = Math.random() * (page.y + (result.size * 2)) - result.size;
    }
  }

  if(result.life) {
    result.life = Math.random() * (type.life.max - type.life.min) + type.life.min;
  }

  if(result.tran) {
    result.tran.step = 0;
    result.tran.state = result.tran.pos !== "end" ? "start" : "stop";
  }

  return result;
}

const drawParticle = (ctx, coordinates, size, type, alpha) => {
  ctx.translate(coordinates.x, coordinates.y);
  ctx.rotate(coordinates.rotate);
  
  ctx.globalAlpha = alpha;

  if(typeof(type.type) === "string") {
    if(type.type * 1 > 2) {
      const angle = pi * 2 / (type.type * 1);
      let theta = - pi / 2;
      if(type.type === "4") theta = - pi / 4;
      ctx.moveTo(Math.cos(theta) * size, Math.sin(theta) * size);
      for(let i = 0; i <= type.type * 1; i++) {
        ctx.lineTo(Math.cos(theta + (angle * ((i + 1) % (type.type * 1)))) * size, Math.sin(theta + (angle * ((i + 1) % (type.type * 1)))) * size);
      }
    }else {
      ctx.arc(0, 0, size, 0, pi * 2);
    }

    if(type.design.color !== false) {
      ctx.fillStyle = type.design.color;
      ctx.fill();
    }
    
    ctx.beginPath();

    if(type.type * 1 > 2) {
      const angle = pi * 2 / (type.type * 1);
      let theta = - pi / 2;
      if(type.type === "4") theta = - pi / 4;
      ctx.moveTo(Math.cos(theta) * size, Math.sin(theta) * size);
      for(let i = 0; i <= type.type * 1; i++) {
        ctx.lineTo(Math.cos(theta + (angle * ((i + 1) % (type.type * 1)))) * size, Math.sin(theta + (angle * ((i + 1) % (type.type * 1)))) * size);
      }
    }else {
      ctx.arc(0, 0, size, 0, pi * 2);
    }
    
    if(type.design.stroke !== false) {
      ctx.strokeStyle = type.design.stroke.color;
      ctx.lineWidth = type.design.stroke.width;
      ctx.lineCap = type.design.stroke.cap;
      ctx.lineJoin = type.design.stroke.cap;
      ctx.stroke();
    }
  }else {
    ctx.drawImage(images[type.type], - size, - size, size * 2, size * 2);
  }

  ctx.beginPath();

  ctx.rotate(- coordinates.rotate);
  ctx.translate(- coordinates.x, - coordinates.y);
}

const animate = e => {
  if(frame === null) {
    if(frameTime === null) {
      frameTime = new Date().getTime();
    }else {
      frameTime = new Date().getTime();
      frame = new Date().getTime() - frameTime;
    }
  }else {
    frame = new Date().getTime() - frameTime;
    frameTime = frame + frameTime;

    canvas.width = page.x;
    canvas.height = page.y;
  
    for(let i = 0; i < particleList.length; i++) {
      const item = particleList[i];
      const type = particleData.type[item.type];
      // console.log(item.life);

      if(item.life >= 0 && item.life !== false) item.life -= frame / 1000;
  
      if(item.direc === "top") item.y += item.speed / (1000 / frame / 30);
      else if(item.direc === "bottom") item.y -= item.speed / (1000 / frame / 30);
      else if(item.direc === "left") item.x += item.speed / (1000 / frame / 30);
      else if(item.direc === "right") item.x -= item.speed / (1000 / frame / 30);
      else {
        item.x += (Math.cos(item.direc) * item.speed) / (1000 / frame / 30);
        item.y += (Math.sin(item.direc) * item.speed) / (1000 / frame / 30);
      }

      item.waveStep += item.waveSpeed / (1000 / frame / 30);
      item.rotateStep += item.rotateSpeed / (1000 / frame / 30);
  
      let x = item.x;
      let y = item.y;
      let alpha = item.alpha;
      
      if(item.direc === "top" || item.direc === "bottom") x = item.x + (Math.cos(item.waveStep) * item.waveRadius);
      else if(item.direc === "left" || item.direc === "right") y = item.y + (Math.cos(item.waveStep) * item.waveRadius);
      else {
        const theta = item.direc - (pi / 2);
        x = item.x + (Math.cos(theta) * (Math.cos(item.waveStep) * item.waveRadius));
        y = item.y + (Math.sin(theta) * (Math.cos(item.waveStep) * item.waveRadius));
      }

      if(item.tran !== false && item.tran.state !== "stop") {
        if(item.tran.state === "start") {
          alpha = item.alpha * (item.tran.speed * item.tran.step);
          if(item.alpha > alpha) item.tran.step++;
          else{
            alpha = item.alpha;
            item.tran.state = "stop";
            item.tran.step = 0;
          }
        }
      }

      drawParticle(ctx, {x: x, y: y, rotate: item.rotateStep}, item.size, type, alpha);

      if(item.life < 0) {
        particleList.splice(i, 1);
        particleList.unshift(addParticle(false));
      }else {
        if(item.y > page.y + (item.size * 2) && item.direc === "top") {
          particleList.splice(i, 1);
          particleList.unshift(addParticle(false));
        }
        if(item.y < - (item.size * 2) && item.direc === "bottom") {
          particleList.splice(i, 1);
          particleList.unshift(addParticle(false));
        }
        if(item.x > page.x + (item.size * 2) && item.direc === "left") {
          particleList.splice(i, 1);
          particleList.unshift(addParticle(false));
        }
        if(item.x < - (item.size * 2) && item.direc === "right") {
          particleList.splice(i, 1);
          particleList.unshift(addParticle(false));
        }
        if((item.y > page.y + (item.size * 2) || item.y < - (item.size * 2) || item.x > page.x + (item.size * 2) || item.x < - (item.size * 2)) && item.direc >= 0) {
          particleList.splice(i, 1);
          particleList.unshift(addParticle(false));
        }
      }
    }
  }

  requestAnimationFrame(animate);
}

const particleListSet = (idx = -1) => {
  if(idx < 0) {
    if(particleData.type.length >= 5) {
      $particleList.style.height = "150px";
    }else {
      $particleList.style.height = "100px";
    }
    for(let i = 0; i < particleData.type.length; i++) {
      const result = {};
      const type = particleData.type[i];

      result.canvas = document.createElement("canvas");
      result.ctx = result.canvas.getContext("2d");
      
      result.canvas.width = 100;
      result.canvas.height = 100;

      result.canvas.addEventListener("click", e => {toggleController(i)});

      $particleList.append(result.canvas);
      particleCanvasList.push(result);

      result.ctx.fillStyle = "#fff";
      result.ctx.fillRect(0, 0, 100, 100);
      
      drawParticle(result.ctx, {x: 50, y: 50, rotate: 0}, 20, type, 1);
    }
    particleAdd.width = 100;
    particleAdd.height = 100;
    
    addCtx.fillStyle = "#eee";
    addCtx.strokeStyle = "#aaa";
    addCtx.lineWidth = 4;
    
    addCtx.translate(50, 50);
    
    addCtx.strokeRect(-48, -48, 96, 96);
    addCtx.fillRect(-25, -5, 50, 10);
    addCtx.rotate(pi / 2);
    addCtx.fillRect(-25, -5, 50, 10);

    $particleList.append(particleAdd);
  }else {

  }
}

const particleSet = e => {
  particleList.length = 0;

  if(particleData.type.length > 0) {
    for(let i = 0; i < particleData.max; i++) {
      particleList.push(addParticle(true));
    }
  }
}

const toggleParticleList = e => {
  if(e.key === "Tab") {
    e.preventDefault();

    if($particleList.classList.contains("none")) {
      $particleList.classList.remove("none");
    }else {
      $particleList.classList.add("none");
      $controller.classList.add("none");
    }
  }
}

const toggleController = (idx = -1) => {
  if(idx > -1) {
    $controller.classList.remove("none");
    const type = particleData.type[idx];

    $images.forEach(el => el.style.display = "");
    $polygons.forEach(el => el.style.display = "");
    $shapes.forEach(el => el.style.display = "");

    if(typeof(type.type) === "number") {
      $imgOption.selected = true;
      $imgSelect.src = `image/${type.type + 1}.png`;
      $images.forEach(el => el.style.display = "inline");
      $stroke.checked = false;
    }else{
      if(type.type * 1 > 2) {
        $polyOption.selected = "poly";
        $polygon.value = type.type;
        $polygons.forEach(el => el.style.display = "block");
        $shapes.forEach(el => el.style.display = "block");
      }else {
        $arcOption.selected = true;
        $shapes.forEach(el => el.style.display = "block");
      }

      $color.value = type.design.color;
      $colorText.value = type.design.color;
      $stroke.checked = type.design.stroke === false ? false : true;
      if($stroke.checked) {
        $strokeColor.value = type.design.stroke.color;
        $strokeColorText.value = type.design.stroke.color;
        // $strokeWidthRange.value = "";
        $strokeWidth.value = type.design.stroke.width;
        $strokeJoin.value = type.design.stroke.cap;
      }
    }

    // $ratioRange.value = type.ratio;
    $ratio.value = type.ratio;
    // $sizeRange.value = "";
    $sizeMin.value = type.mSz;
    $sizeMax.value = type.xSz;
    // $speedRange.value = "";
    $speedMin.value = type.mSp;
    $speedMax.value = type.xSp;
    // $rotateRange.value = "";
    $rotateMin.value = type.mRtSp;
    $rotateMax.value = type.xRtSp;
    $rotateDirection.value = type.rtWay;
    $wave.checked = type.wv === false ? false : true;
    if($wave.value) {
      $waveDefault.checked = type.wv.default === false ? false : true;
      if(!$waveDefault.checked) {
        // $waveRadiusRange.value = "";
        $waveRadiusMin.value = type.wv.mRd;
        $waveRadiusMax.value = type.wv.xRd;
        // $waveSpeedRange.value = "";
        $waveSpeedMin.value = type.wv.mSp;
        $waveSpeedMax.value = type.wv.xSp;
      }
    }
    // $alphaRange.value = "";
    $alphaMin.value = type.mAp;
    $alphaMax.value = type.xAp;

  }else if(idx === -2){
    if($controller.classList.contains("none")) {
      $controller.classList.remove("none");
      $images.forEach(el => el.style.display = "");

      $polyOption.selected = "poly";
      $polygon.value = "4";
      $polygons.forEach(el => el.style.display = "block");
      $shapes.forEach(el => el.style.display = "block");

      $color.value = "#aaaaaa";
      $colorText.value = "#aaaaaa";
      $stroke.checked = false;

      // $ratioRange.value = type.ratio;
      $ratio.value = 10;
      // $sizeRange.value = "";
      $sizeMin.value = 5;
      $sizeMax.value = 20;
      // $speedRange.value = "";
      $speedMin.value = 5;
      $speedMax.value = 10;
      // $rotateRange.value = "";
      $rotateMin.value = 0;
      $rotateMax.value = 0;
      $rotateDirection.value = "0";
      $wave.checked = false;
      // $alphaRange.value = "";
      $alphaMin.value = 0.2;
      $alphaMax.value = 0.6;

    }else {
      $controller.classList.add("none");
    }
  }
}

const init = async e => {
  for(let i = 0; i < imageCount; i++) {
    images.push(await loadImage(`image/${i + 1}.png`));
  }

  for(let i = 0; i < imageCount; i++) {
    $imgList.append(await loadImage(`image/${i + 1}.png`));
  }

  $imgItem = document.querySelectorAll("#img-list>img");

  if(particleDefault) {
    particleData.type.length = 0;
    particleData.type.push({type: "4", ratio: 10, design: {color: "#88ddaa", stroke: {color: "#aaaaaa", width: 3, cap: "miter"}}, mSz: 10, xSz: 15, mSp: 3, xSp: 6, mRtSp: 0.02, xRtSp: 0.04, rtWay: 0, wv: false, mAp: 0.3, xAp: 0.8, direc: "top", start: "default", tran: false, life: false});
    particleData.type.push({type: "arc", ratio: 20, design: {color: "#ffccaa", stroke: false}, mSz: 5, xSz: 10, mSp: 2, xSp: 4, mRtSp: 0, xRtSp: 0, rtWay: 0, wv: {default: true}, mAp: 0.5, xAp: 1, direc: "bottom", start: "default", tran: false, life: false});
    particleData.type.push({type: 0, ratio: 5, mSz: 15, xSz: 20, mSp: 6, xSp: 10, mRtSp: 0.01, xRtSp: 0.05, rtWay: 1, wv: {default: false, mRd: 30, xRd: 50, mSp: 0.03, xSp: 0.06}, mAp: 0.7, xAp: 1, direc: "top", start: "center", tran: false, life: false});
    particleData.type.push({type: "3", ratio: 10, design: {color: "#aaccff", stroke: {color: "#aaaaaa", width: 10, cap: "round"}}, mSz: 5, xSz: 20, mSp: 1, xSp: 10, mRtSp: 0.01, xRtSp: 0.06, rtWay: -1, wv: false, mAp: 0.1, xAp: 0.8, direc: "top", start: "random", tran: {speed: 0.05, pos: "all"}, life: {min: 3, max: 6}});
    // particleDefault = false;
    localStorage.setItem("particle-particleDefault", particleDefault);
    localStorage.setItem("particle-particleData", JSON.stringify(particleData));
  }

  canvas.width = page.x;
  canvas.height = page.y;

  document.addEventListener("keydown", toggleParticleList);
  particleAdd.addEventListener("click", e => {toggleController(-2)});
  $getValues.forEach(el => el.addEventListener("click", inputEvent));
  
  particleListSet();
  particleSet();

  animate();
}

init();

window.addEventListener("resize", e => {
  page.x = window.innerWidth;
  page.y = window.innerHeight;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
})
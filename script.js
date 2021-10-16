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
const imageCount = [{key: "public", id: 0, count: 5}, {key: "test", id: 1, count: 0}, {key: "slime", id: 2, count: 1}];
const private = localStorage.getItem("particle-private") === null ? ["slime"] : JSON.parse(localStorage.getItem("particle-private"));
const particleCanvasList = [];
const particleAdd = document.createElement("canvas");
const addCtx = particleAdd.getContext("2d");
const preview = document.querySelector("#preview");
const preCtx = preview.getContext("2d");
const particleDefaultType = {type: 4, ratio: 10, design: {color: "#aaaaaa", stroke: false}, mSz: 5, xSz: 20, mSp: 5, xSp: 10, mRtSp: 0, xRtSp: 0, rtWay: 2, wv: false, mAp: 0.2, xAp: 0.6, direc: "top", start: "default", tran: false, life: false};
const previewParticleList = [];
const mouse = {x: 0, px: 0, plx: 0, down: false, el: null, lever: null};
let particleDefault = localStorage.getItem("particle-particleDefault") === null ? true : JSON.parse(localStorage.getItem("particle-particleDefault"));
let frame = null;
let frameTime = null;
let controllParticle = {idx: -1, type: {}, preview: false};

// min = m, max = x, size = sz, speed = sp = rotate = rt , radius = rd, wave = wv, alpha = ap

const $type = document.querySelector("#type");
const $imgSelect = document.querySelector("#img-select");
const $polygon = document.querySelector("#polygon");
const $background = document.querySelector("#background");
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
const $tran = document.querySelector("#tran");
const $tranPos = document.querySelector("#tran-pos");
const $tranSpeedRange = document.querySelector("#tran-speed-range");
const $tranSpeed = document.querySelector("#tran-speed");
const $life = document.querySelector("#life");
const $lifeRange = document.querySelector("#life-range");
const $lifeMin = document.querySelector("#life-min");
const $lifeMax = document.querySelector("#life-max");
const $start = document.querySelector("#start");
const $direc = document.querySelector("#direc");

const $polyOption = document.querySelector("#poly-option");
const $arcOption = document.querySelector("#arc-option");
const $imgOption = document.querySelector("#img-option");

const $images = document.querySelectorAll(".image");
const $polygons = document.querySelectorAll(".polygon");
const $shapes = document.querySelectorAll(".shape");

const $imgList = document.querySelector("#img-list");

const $inputNumber = document.querySelectorAll("input[type='number']");
const $inputCheckbox = document.querySelectorAll("input[type='checkbox']");
const $inputColor = document.querySelectorAll("input[type='color']");
const $inputText = document.querySelectorAll("input[type='text']");
const $select = document.querySelectorAll("select");
const $spans = document.querySelectorAll("span");

const $save = document.querySelector("#save");
const $delete = document.querySelector("#delete");

// 이미지 로드
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

// 프리뷰 타입 변경
const modifyPreviewType = e => {
  const type = controllParticle.type;

  $images.forEach(el => el.style.display = "");
  $polygons.forEach(el => el.style.display = "");
  $shapes.forEach(el => el.style.display = "");

  type.type = $type.value;

  if(type.type === "img") {
    type.type = $imgSelect.dataset.idx;
    $images.forEach(el => el.style.display = "inline");
    $background.checked = false;
    $stroke.checked = false;
  }else {
    if($background.checked) {
      type.design.color = $color.value;
    }else {
      type.design.color = false;
    }
    if($stroke.checked) {
      type.design.stroke = {};
      type.design.stroke.color = $strokeColor.value;
      type.design.stroke.width = $strokeWidth.value * 1;
      type.design.stroke.cap = $strokeJoin.value;
    }else {
      type.design.stroke = false;
    }
    
    if(type.type === "poly") {
      type.type = $polygon.value * 1;
      $polygons.forEach(el => el.style.display = "block");
      $shapes.forEach(el => el.style.display = "block");
      $background.checked = type.design.color === false ? false : true;
      $stroke.checked = type.design.stroke === false ? false : true;
    }else {
      $shapes.forEach(el => el.style.display = "block");
      $background.checked = type.design.color === false ? false : true;
      $stroke.checked = type.design.stroke === false ? false : true;
    }
  }

  type.ratio = $ratio.value * 1;
  type.mSz = $sizeMin.value * 1;
  type.xSz = $sizeMax.value * 1;
  type.mSp = $speedMin.value * 1;
  type.xSp = $speedMax.value * 1;
  type.mRtSp = $rotateMin.value * 1;
  type.xRtSp = $rotateMax.value * 1;
  type.rtWay = $rotateDirection.value * 1;
  
  if($wave.checked) {
    type.wv = {default: true};
    if(!$waveDefault.checked) {
      type.wv.default = false;
      type.wv.mRd = $waveRadiusMin.value * 1;
      type.wv.xRd = $waveRadiusMax.value * 1;
      type.wv.mSp = $waveSpeedMin.value * 1;
      type.wv.xSp = $waveSpeedMax.value * 1;
    }
  }else {
    type.wv = false;
  }

  type.mAp = $alphaMin.value * 1;
  type.xAp = $alphaMax.value * 1;

  type.direc = $direc.value;
  type.start = $start.value;

  if($tran.checked) {
    type.tran = {};
    type.tran.speed = $tranSpeed.value * 1;
    type.tran.pos = $tranPos.value;
  }else {
    type.tran = false;
  }

  if($life.checked) {
    type.life = {};
    type.life.min = $lifeMin.value * 1;
    type.life.max = $lifeMax.value * 1;
  }else {
    type.life = false
  }

  previewParticleList.length = 0;

  if(particleData.type.length > 0) {
    for(let i = 0; i < particleData.max; i++) {
      previewParticleList.push(addParticle(true, true));
    }
  }
}

// 인풋 숫자값을 막대형으로 변형
const inputToRange = (e, blur = false) => {
  const el = e.target;
  if(el === $polygon) {
    modifyPreviewType(); 
    return false;
  }
  const data = {min: 0, max: 0, range: false};
  let value = el.value;
  let trueValue = el.value;
  let lock = {el: false, value: false};

  if(value === "") trueValue = 0;

  if(el.id.indexOf("min") !== -1) lock = {el: "min", value: "max"};
  else if(el.id.indexOf("max") !== -1) lock = {el: "max", value: "min"};

  if(lock.value !== false) {
    lock.el = document.querySelector(`#${el.id.replace(lock.el, lock.value)}`);
    if(lock.value === "min" && value * 1 < lock.el.value * 1) {
      value = trueValue = lock.el.value;
      if(value !== "") {
        blur = true;
      }
    }else if(lock.value === "max" && value * 1 > lock.el.value * 1) {
      value = trueValue = lock.el.value;
      if(value !== "") {
        blur = true;
      }
    }
  }

  if(value === "") value = 0;

  if(el.id.indexOf("stroke-width") !== -1) {
    data.max = 20;
    data.min = 1;
    data.range = $strokeWidthRange;
  }
  if(el.id.indexOf("ratio") !== -1) {
    data.max = 100;
    data.min = 10;
    data.range = $ratioRange;
  }
  if(el.id.indexOf("size") !== -1) {
    data.max = 50;
    data.range = $sizeRange;
  }
  if(el.id.indexOf("speed") !== -1) {
    data.max = 50;
    data.range = $speedRange;
  }
  if(el.id.indexOf("rotate") !== -1) {
    data.max = 0.5;
    data.range = $rotateRange;
  }
  if(el.id.indexOf("wave-radius") !== -1) {
    data.max = 100;
    data.range = $waveRadiusRange;
  }
  if(el.id.indexOf("wave-speed") !== -1) {
    data.max = 0.5;
    data.range = $waveSpeedRange;
  }
  if(el.id.indexOf("alpha") !== -1) {
    data.max = 1;
    data.range = $alphaRange;
  }
  if(el.id.indexOf("tran-speed") !== -1) {
    data.max = 0.2;
    data.range = $tranSpeedRange;
  }
  if(el.id.indexOf("life") !== -1) {
    data.max = 20;
    data.range = $lifeRange;
  }

  if(value < data.min) {
    value = data.min;
    trueValue = value;
    blur = true;
    if(el.id.indexOf("ratio") !== -1) {
      if(el.value < 1 && el.value !== "") trueValue = 1;
    }
  }
  if(value > data.max) {
    value = data.max;
    if(el.id.indexOf("alpha") !== -1) {
      trueValue = value;
      blur = true;
    }
  }

  if(blur) {
    el.value = trueValue;
  }

  if(el.id.indexOf("min") !== -1){
    const lever = data.range.childNodes[0];
    lever.style.left = `${(value - data.min) / (data.max - data.min) * 130}px`;
  }else if(el.id.indexOf("max") !== -1){
    const lever = data.range.childNodes[1];
    lever.style.left = `${((value - data.min) / (data.max - data.min) * 130) + 10}px`;
  }else {
    const lever = data.range.childNodes[0];
    lever.style.left = `${(value - data.min) / (data.max - data.min) * 140}px`;
  }

  modifyPreviewType();
}

// 인풋 막대형을 숫자형으로 변형
const modifyRange = left => {
  let el = mouse.el;
  let lever = mouse.lever;
  let data = {min: 0, max: 0, step: 1, el: null, number: false, lock: false, value: false};
  value = 0;

  if(lever.classList.contains("min-lever")) {
    data.number = "min";
    data.lock = "max";
  }else if(lever.classList.contains("max-lever")) {
    data.number = "max";
    data.lock = "min";
  }

  if(el.id.indexOf("stroke-width") !== -1) {
    data.max = 20;
    data.min = 1;
    data.number = $strokeWidth;
  }
  if(el.id.indexOf("ratio") !== -1) {
    data.max = 100;
    data.min = 10;
    data.step = 10;
    data.number = $ratio;
  }
  if(el.id.indexOf("size") !== -1) {
    data.max = 50;
    data.number = document.querySelector(`#${el.id.replace("range", data.number)}`);
    data.value = document.querySelector(`#${el.id.replace("range", data.lock)}`);
  }
  if(el.id.indexOf("speed") !== -1 && el.id.indexOf("wave") === -1) {
    data.max = 50;
    data.number = document.querySelector(`#${el.id.replace("range", data.number)}`);
    data.value = document.querySelector(`#${el.id.replace("range", data.lock)}`);
  }
  if(el.id.indexOf("rotate") !== -1) {
    data.max = 0.5;
    data.step = 0.01;
    data.number = document.querySelector(`#${el.id.replace("range", data.number)}`);
    data.value = document.querySelector(`#${el.id.replace("range", data.lock)}`);
  }
  if(el.id.indexOf("wave-radius") !== -1) {
    data.max = 100;
    data.number = document.querySelector(`#${el.id.replace("range", data.number)}`);
    data.value = document.querySelector(`#${el.id.replace("range", data.lock)}`);
  }
  if(el.id.indexOf("wave-speed") !== -1) {
    data.max = 0.5;
    data.step = 0.01;
    data.number = document.querySelector(`#${el.id.replace("range", data.number)}`);
    data.value = document.querySelector(`#${el.id.replace("range", data.lock)}`);
  }
  if(el.id.indexOf("alpha") !== -1) {
    data.max = 1;
    data.step = 0.1;
    data.number = document.querySelector(`#${el.id.replace("range", data.number)}`);
    data.value = document.querySelector(`#${el.id.replace("range", data.lock)}`);
  }
  if(el.id.indexOf("tran-speed") !== -1) {
    data.max = 0.2;
    data.step = 0.01;
    data.number = $tranSpeed;
  }
  if(el.id.indexOf("life") !== -1) {
    data.max = 20;
    data.number = document.querySelector(`#${el.id.replace("range", data.number)}`);
    data.value = document.querySelector(`#${el.id.replace("range", data.lock)}`);
  }

  if(data.lock === "min") {
    value = Math.round(((left - 10) / 130 * (data.max - data.min)) / data.step) * data.step;
  }else if(data.lock === "max") {
    value = Math.round((left / 130 * (data.max - data.min)) / data.step) * data.step;
  }else {
    value = Math.round((left / 140 * (data.max - data.min)) / data.step) * data.step;
  }

  if(value < data.min) value = data.min;
  if(value > data.max) value = data.max;

  if(data.lock === "min" && data.value.value * 1 > value) {
    value = data.value.value;
  }else if(data.lock === "max" && data.value.value * 1 < value) {
    value = data.value.value;
  }

  data.number.value = value;
  if(data.lock === "min") {
    lever.style.left = `${((value - data.min) / (data.max - data.min) * 130) + 10}px`;
  }else if(data.lock === "max") {
    lever.style.left = `${((value - data.min) / (data.max - data.min) * 130)}px`;
  }else {
    lever.style.left = `${((value - data.min) / (data.max - data.min) * 140)}px`;
  }

  modifyPreviewType();
}

// 종류 값을 막대값으로 변형
const setRange = (el, value, max, min = 0) => {
  if(typeof(value) === "object") {
    const minLever = el.childNodes[0];
    const maxLever = el.childNodes[1];
    
    minLever.style.left = `${(value.min - min) / (max - min) * 130}px`;
    maxLever.style.left = `${((value.max - min) / (max - min) * 130) + 10}px`;
  }else {
    const lever = el.childNodes[0];

    lever.style.left = `${(value - min) / (max - min) * 140}px`;
  }
}

// 파티클 추가
const addParticle = (start, preview) => {
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
  
  let type = particleData.type[result.type];
  if(preview) type = controllParticle.type;

  result.size = Math.random() * (type.xSz - type.mSz) + type.mSz;
  result.speed = Math.random() * (type.xSp - type.mSp) + type.mSp;
  result.rotateSpeed = Math.random() * (type.xRtSp - type.mRtSp) + type.mRtSp;
  result.rotateStep = Math.random() * pi * 2;
  result.waveRadius = 0;
  result.waveStep = 0;
  result.waveSpeed = 0;
  result.alpha = Math.random() * (type.xAp - type.mAp) + type.mAp;
  result.direc = type.direc;
  result.life = type.life;
  result.tran = type.tran;

  if(result.tran !== false) {
    result.tran = {};
    result.tran.speed = type.tran.speed;
    result.tran.pos = type.tran.pos;
  }

  if(result.rotateSpeed !== 0) {
    if(type.rtWay === 0) {
      const random = Math.random();
      if(random >= 0.5) {
        result.rotateSpeed *= - 1;
      }
    }else if(type.rtWay === - 1) {
      result.rotateSpeed *= - 1;
    }
  }

  if(type.rtWay === 2) {
    result.rotateSpeed = 0;
    result.rotateStep = 0;
  }

  if(type.wv) {
    result.waveStep = Math.random() * pi * 2;
    result.waveRadius = type.wv.default ? result.size : Math.random() * (type.wv.xRd - type.wv.mRd) + type.wv.mRd;
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
        if(result.direc === "left") result.x = - result.size * 2;
        else result.x = page.x + result.size * 2;
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
    result.tran.step = result.tran.pos === "end" ? Math.ceil(1 / result.tran.speed) : 0;
    result.tran.state = result.tran.pos !== "end" ? "start" : "stop";
  }

  return result;
}

// 파티클 그리기
const drawParticle = (ctx, coordinates, size, type, alpha) => {
  ctx.translate(coordinates.x, coordinates.y);
  ctx.rotate(coordinates.rotate);
  
  ctx.globalAlpha = alpha;

  let shape = false;

  if(typeof(type.type) === "number") {
    const angle = pi * 2 / (type.type * 1);
    let theta = - pi / 2;
    if(type.type === 4) theta = - pi / 4;
    ctx.moveTo(Math.cos(theta) * size, Math.sin(theta) * size);
    for(let i = 0; i <= type.type * 1; i++) {
      ctx.lineTo(Math.cos(theta + (angle * ((i + 1) % (type.type * 1)))) * size, Math.sin(theta + (angle * ((i + 1) % (type.type * 1)))) * size);
    }
    shape = true;
  }else if(type.type === "arc") {
    ctx.arc(0, 0, size, 0, pi * 2);
    shape = true;
  }

  if(shape) {

    if(type.design.color !== false) {
      ctx.fillStyle = type.design.color;
      ctx.fill();
    }
    
    ctx.beginPath();

    if(type.type * 1 > 2) {
      const angle = pi * 2 / (type.type * 1);
      let theta = - pi / 2;
      if(type.type === 4) theta = - pi / 4;
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
    ctx.drawImage(images[type.type.split("-")[0] * 1][type.type.split("-")[1] * 1], - size, - size, size * 2, size * 2);
  }

  ctx.beginPath();

  ctx.rotate(- coordinates.rotate);
  ctx.translate(- coordinates.x, - coordinates.y);
}

// 애니메이션
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
    preview.width = page.x;
    preview.height = page.y;
  
    let animateParticle = particleList;
    if(controllParticle.preview) animateParticle = previewParticleList;
    
    for(let i = 0; i < animateParticle.length; i++) {
      const item = animateParticle[i];
      let type;
      if(controllParticle.preview) type = controllParticle.type;
      else type = particleData.type[item.type];

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
      
      if(item.direc === "top" || item.direc === "bottom") x = item.x + (Math.sin(item.waveStep) * item.waveRadius);
      else if(item.direc === "left" || item.direc === "right") y = item.y + (Math.sin(item.waveStep) * item.waveRadius);
      else {
        const theta = item.direc - (pi / 2);
        x = item.x + (Math.cos(theta) * (Math.sin(item.waveStep) * item.waveRadius));
        y = item.y + (Math.sin(theta) * (Math.sin(item.waveStep) * item.waveRadius));
      }

      if(item.tran !== false) {
        if(item.tran.state !== "stop") {
          alpha = item.alpha * (item.tran.speed * item.tran.step);
          if(item.tran.state === "start") {
            if(item.alpha > alpha) item.tran.step += frame / 33.333333333333336;
            else{
              alpha = item.alpha;
              item.tran.state = "stop";
              item.tran.test = true;
            }
          }else {
            if(item.tran.step > 0) item.tran.step -= frame / 33.333333333333336;
          }
        }
      }
      
      if(controllParticle.preview) drawParticle(preCtx, {x: x, y: y, rotate: item.rotateStep}, item.size, type, alpha);
      else drawParticle(ctx, {x: x, y: y, rotate: item.rotateStep}, item.size, type, alpha);
      
      let shift = false;

      if(item.life < 0) {
        if(item.tran !== false && item.tran.pos !== "start" && item.tran.step > 0 ) {
          item.tran.state = "end";
        }else {
          shift = true;
        }
      }else {
        if(item.y > page.y + (item.size * 2) && item.direc === "top") {
          shift = true;
        }
        if(item.y < - (item.size * 2) && item.direc === "bottom") {
          shift = true;
        }
        if(item.x > page.x + (item.size * 2) && item.direc === "left") {
          shift = true;
        }
        if(item.x < - (item.size * 2) && item.direc === "right") {
          shift = true;
        }
        if((item.y > page.y + (item.size * 2) || item.y < - (item.size * 2) || item.x > page.x + (item.size * 2) || item.x < - (item.size * 2)) && item.direc >= 0) {
          shift = true;
        }
      }

      if(shift) {
        if(controllParticle.preview) {
          previewParticleList.splice(i, 1);
          previewParticleList.unshift(addParticle(false, true));
        }else {
          animateParticle.splice(i, 1);
          animateParticle.unshift(addParticle(false));
        }
      }
    }
  }

  requestAnimationFrame(animate);
}

// 컨트롤러 토글
const toggleController = (idx = -1) => {
  controllParticle.idx = idx;
  if(idx !== -1) {
    if(idx > -1) {
      controllParticle.type = JSON.parse(JSON.stringify(particleData.type[idx]));
      $delete.classList.remove("none");
    }else {
      controllParticle.type = JSON.parse(JSON.stringify(particleDefaultType));
      $delete.classList.add("none");
    }

    $controller.classList.remove("none");
    preview.classList.remove("none");
    controllParticle.preview = true;
    const type = controllParticle.type;

    $images.forEach(el => el.style.display = "");
    $polygons.forEach(el => el.style.display = "");
    $shapes.forEach(el => el.style.display = "");

    let shape = false;

    if(typeof(type.type) === "number") {
      $polyOption.selected = "poly";
      $polygon.value = type.type;
      $polygons.forEach(el => el.style.display = "block");
      $shapes.forEach(el => el.style.display = "block");
      shape = true;
    }else{
      if(type.type === "arc") {
        $arcOption.selected = true;
        $shapes.forEach(el => el.style.display = "block");
        shape = true;
      }else {
        $imgOption.selected = true;
        $imgSelect.src = `image/${type.type}.png`;
        $imgSelect.dataset.idx = type.type;
        $images.forEach(el => el.style.display = "inline");
        $background.checked = false;
        $stroke.checked = false;
      }
    }

    if(shape) {
      $background.checked = type.design.color === false ? false : true;
      $stroke.checked = type.design.stroke === false ? false : true;
    }

    if($background.checked) {
      $color.value = type.design.color;
      $colorText.value = type.design.color;
    }else {
      $color.value = "#aaaaaa";
      $colorText.value = "#aaaaaa";
    }
    if($stroke.checked) {
      $strokeColor.value = type.design.stroke.color;
      $strokeColorText.value = type.design.stroke.color;
      $strokeWidth.value = type.design.stroke.width;
      $strokeJoin.value = type.design.stroke.cap;
    }else {
      $strokeColor.value = "#aaaaaa";
      $strokeColorText.value = "#aaaaaa";
      $strokeWidth.value = 5;
      $strokeJoin.value = "miter";
    }
    setRange($strokeWidthRange, $strokeWidth.value, 20, 1);

    $ratio.value = type.ratio;
    setRange($ratioRange, $ratio.value, 100, 10);
    $sizeMin.value = type.mSz;
    $sizeMax.value = type.xSz;
    setRange($sizeRange, {min: $sizeMin.value, max: $sizeMax.value}, 50);
    $speedMin.value = type.mSp;
    $speedMax.value = type.xSp;
    setRange($speedRange, {min: $speedMin.value, max: $speedMax.value}, 50);
    $rotateMin.value = type.mRtSp;
    $rotateMax.value = type.xRtSp;
    setRange($rotateRange, {min: $rotateMin.value, max: $rotateMax.value}, 0.5);
    $rotateDirection.value = type.rtWay;
    $wave.checked = type.wv === false ? false : true;
    if($wave.checked) {
      $waveDefault.checked = type.wv.default === false ? false : true;
      if(!$waveDefault.checked) {
        $waveRadiusMin.value = type.wv.mRd;
        $waveRadiusMax.value = type.wv.xRd;
        $waveSpeedMin.value = type.wv.mSp;
        $waveSpeedMax.value = type.wv.xSp;
      }else {
        $waveRadiusMin.value = 5;
        $waveRadiusMax.value = 10;
        $waveSpeedMin.value = 0.02;
        $waveSpeedMax.value = 0.05;
      }
    }else {
      $waveDefault.checked = true;
      $waveRadiusMin.value = 5;
      $waveRadiusMax.value = 10;
      $waveSpeedMin.value = 0.02;
      $waveSpeedMax.value = 0.05;
    }
    setRange($waveRadiusRange, {min: $waveRadiusMin.value, max: $waveRadiusMax.value}, 100);
    setRange($waveSpeedRange, {min: $waveSpeedMin.value, max: $waveSpeedMax.value}, 0.5);
    $alphaMin.value = type.mAp;
    $alphaMax.value = type.xAp;
    setRange($alphaRange, {min: $alphaMin.value, max: $alphaMax.value}, 1);
    $tran.checked = type.tran === false ? false : true;
    if($tran.checked) {
      $tranSpeed.value = type.tran.speed;
      $tranPos.value = type.tran.pos;
    }else {
      $tranPos.value = "start";
      $tranSpeed.value = 0.01;
    }
    setRange($tranSpeedRange, $tranSpeed.value, 0.1);
    $life.checked = type.life === false ? false : true;
    if($life.checked) {
      $lifeMin.value = type.life.min;
      $lifeMax.value = type.life.max;
    }else {
      $lifeMin.value = 2;
      $lifeMax.value = 6;
    }
    setRange($lifeRange, {min: $lifeMin.value, max: $lifeMax.value}, 20);

    $direc.value = type.direc;
    $start.value = type.start;

    modifyPreviewType();
  }else {
    $controller.classList.add("none");
    preview.classList.add("none");
    $imgList.classList.add("none");
    $delete.classList.add("none");
    controllParticle.preview = false;
    controllParticle.type = {};
  }
}

// 파티클 종류 리스트 설정
const particleListSet = e => {
  const child = $particleList.querySelectorAll("*");
  child.forEach(el => el.remove());

  // if(particleData.type.length >= 5) {
  //   $particleList.style.height = "150px";
  // }else {
  //   $particleList.style.height = "100px";
  // }
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
}

// 파티클 추가
const particleSet = e => {
  particleList.length = 0;

  if(particleData.type.length > 0) {
    for(let i = 0; i < particleData.max; i++) {
      particleList.push(addParticle(true));
    }
  }
}

// 파티클 종류 리스트 토글
const toggleParticleList = e => {
  if(e.key === "Tab") {
    e.preventDefault();

    if($particleList.classList.contains("none")) {
      $particleList.classList.remove("none");
    }else {
      $particleList.classList.add("none");
      $controller.classList.add("none");
      preview.classList.add("none");
      $imgList.classList.add("none");
      $delete.classList.add("none");
      controllParticle.preview = false;
      controllParticle.type = {};
    }
  }
}

// 이미지 종류 세팅
const imgListSet = async e => {
  const imgFor = [];

  for(let i = 0; i < imageCount.length; i++) {
    const count = imageCount[i];
    if(count.key === "public" || private.indexOf(count.key) !== -1) imgFor.push(count.count);
    else imgFor.push(0);
  }

  images.length = 0;
  for(let i = 0; i < imgFor.length; i++) {
    const length = imgFor[i];
    const result = [];
    for(let j = 0; j < length; j++) {
      result.push(await loadImage(`image/${i}-${j}.png`));
    }
    images.push(result);
  }
  
  const $child = $imgList.querySelectorAll("*");
  $child.forEach(el => el.remove());
  for(let i = 0; i < imgFor.length; i++) {
    const length = imgFor[i];
    for(let j = 0; j < length; j++) {
      const result = await loadImage(`image/${i}-${j}.png`);
      result.addEventListener("click", e => {
        $imgSelect.dataset.idx = `${i}-${j}`;
        $imgSelect.src = `image/${i}-${j}.png`;
        controllParticle.type.type = `${i}-${j}`;
      });
      $imgList.append(result);
    }
  }
}

const particleReset = (reset = false) => {
  if(particleDefault || reset) {
    particleData.type.length = 0;
    particleData.type.push({type: 4, ratio: 10, design: {color: "#88ddaa", stroke: {color: "#aaaaaa", width: 3, cap: "miter"}}, mSz: 10, xSz: 15, mSp: 3, xSp: 6, mRtSp: 0.02, xRtSp: 0.04, rtWay: 0, wv: false, mAp: 0.3, xAp: 0.8, direc: "top", start: "default", tran: {speed: 0.01, pos: "start"}, life: false});
    particleData.type.push({type: "arc", ratio: 20, design: {color: "#ffccaa", stroke: false}, mSz: 5, xSz: 10, mSp: 2, xSp: 4, mRtSp: 0, xRtSp: 0, rtWay: 0, wv: {default: true}, mAp: 0.5, xAp: 1, direc: "bottom", start: "default", tran: false, life: false});
    particleData.type.push({type: "0-0", ratio: 5, mSz: 15, xSz: 20, mSp: 6, xSp: 10, mRtSp: 0.01, xRtSp: 0.05, rtWay: 1, wv: {default: false, mRd: 30, xRd: 50, mSp: 0.03, xSp: 0.06}, mAp: 0.7, xAp: 1, direc: "top", start: "center", tran: {speed: 0.02, pos: "end"}, life: {min: 1, max: 3}});
    particleData.type.push({type: 3, ratio: 10, design: {color: false, stroke: {color: "#aaaaaa", width: 10, cap: "round"}}, mSz: 5, xSz: 20, mSp: 1, xSp: 10, mRtSp: 0.01, xRtSp: 0.06, rtWay: -1, wv: false, mAp: 0.1, xAp: 0.8, direc: "top", start: "random", tran: {speed: 0.01, pos: "all"}, life: {min: 3, max: 6}});
    particleDefault = false;
    particleData.max = 50;
    localStorage.setItem("particle-particleDefault", particleDefault);
    localStorage.setItem("particle-particleData", JSON.stringify(particleData));
  }
}

// 세팅
const init = async e => {
  await imgListSet();
  particleReset();

  canvas.width = page.x;
  canvas.height = page.y;

  document.addEventListener("keydown", toggleParticleList);
  particleAdd.addEventListener("click", e => {toggleController(-2)});
  $inputNumber.forEach(el => el.addEventListener("input", inputToRange));
  $inputNumber.forEach(el => el.addEventListener("blur", e => {inputToRange(e, true)}));
  $spans.forEach(el => el.addEventListener("mousedown", e => {
    mouse.down = true;
    mouse.px = e.pageX;
    if(e.target.classList.contains("lever")) {
      mouse.lever = e.target;
      mouse.el = e.target.parentNode;
    }else {
      mouse.el = e.target;
      mouse.lever = e.target.childNodes;
      const left = e.offsetX - 5;
      let dist = 1000;
      let lever = false;
      for(let i = 0; i < mouse.lever.length; i++) {
        const item = mouse.lever[i];
        if(Math.abs((item.style.left.replace(/[^0-9|\.]/g, "") * 1) - left) < Math.abs(dist - left)) {
          dist = item.style.left.replace(/[^0-9|\.]/g, "") * 1;
          lever = item;
        }
      }
      mouse.lever = lever;
      mouse.lever.style.left = `${left}px`;
    }
    mouse.plx = mouse.lever.style.left.replace(/[^0-9|\.]/g, "") * 1;
    modifyRange(mouse.plx);
  }));
  document.addEventListener("mousemove", e => {
    mouse.x = e.pageX;
    if(mouse.down) {
      mouse.lever.style.left = `${mouse.plx + mouse.x - mouse.px}px`;
      modifyRange(mouse.plx + mouse.x - mouse.px);
    }
  })
  document.addEventListener("mouseup", e => {
    mouse.down = false;
  });
  $inputCheckbox.forEach(el => el.addEventListener("input", modifyPreviewType));
  $inputColor.forEach(el => el.addEventListener("input", modifyPreviewType));
  $select.forEach(el => el.addEventListener("change", modifyPreviewType));
  $inputText.forEach(el => el.addEventListener("input", e => {

  }));
  $imgSelect.addEventListener("click", e => {
    $imgList.classList.remove("none");
  })
  $save.addEventListener("click", e => {
    if(controllParticle.idx > -1) particleData.type[controllParticle.idx] = JSON.parse(JSON.stringify(controllParticle.type));
    else particleData.type.push(JSON.parse(JSON.stringify(controllParticle.type)));

    toggleController();
    particleListSet();
    particleSet();
  })
  $delete.addEventListener("click", e => {
    particleData.type.splice(controllParticle.idx, 1);
    toggleController();
    particleListSet();
    particleSet();
  })
  
  particleListSet();
  particleSet();

  animate();
}

init();

// 페이지 리사이즈
window.addEventListener("resize", e => {
  page.x = window.innerWidth;
  page.y = window.innerHeight;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
})
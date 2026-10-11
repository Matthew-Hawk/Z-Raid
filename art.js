/* Stylized survivor/equipment illustrations, with native pixel environment art.
   Atlas windows preserve transparency and clip each illustration independently. */
window.ZArt = (() => {
  const ink='#0a1119',shade='#20303b',steel='#697f89',light='#c2d5cd';
  const illustrations={
    rook:['survivors-stylized.png',2172,724,0,0,757,724],
    echo:['survivors-stylized.png',2172,724,761,0,779,724],
    patch:['survivors-stylized.png',2172,724,1544,0,628,724],
    bat:['equipment-stylized.png',1774,887,0,0,430,442],
    bow:['equipment-stylized.png',1774,887,430,0,446,442],
    pistol:['equipment-stylized.png',1774,887,876,0,460,442],
    knife:['equipment-stylized.png',1774,887,1336,0,438,442],
    vest:['equipment-stylized.png',1774,887,0,442,418,445],
    boots:['equipment-stylized.png',1774,887,418,442,472,445],
    kit:['equipment-stylized.png',1774,887,890,442,431,445],
    pack:['equipment-stylized.png',1774,887,1321,442,453,445]
  };
  const cache=new Map();let illustrationNumber=0;
  function sprite(id){
    let p='';
    const r=(x,y,w,h,c)=>p+=`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}"/>`;
    const q=(points,c)=>p+=`<polygon points="${points}" fill="${c}"/>`;
    const cross=(x,y,c)=>{r(x+3,y,4,10,c);r(x,y+3,10,4,c);};
    const shadow=()=>{r(12,59,40,3,'#070e14');r(19,62,26,1,'#121e28');};
    if(id==='zombie'){
      shadow();q('23,24 39,26 44,34 38,46 22,43 18,31',ink);
      r(24,28,17,17,'#6b805a');r(24,28,3,16,'#a0b87c');r(37,30,4,15,'#374c3d');
      r(23,45,8,13,shade);r(35,45,8,13,shade);r(24,47,3,9,steel);r(36,47,2,9,'#4a626e');r(21,57,11,4,ink);r(34,57,12,4,ink);r(22,57,8,1,steel);r(35,57,8,1,steel);
      r(19,29,6,16,'#374c3d');r(19,29,2,11,'#6b805a');r(41,29,6,16,'#374c3d');r(41,29,2,11,'#6b805a');r(19,44,5,5,'#91a66d');r(41,44,5,5,'#708c5e');
      r(27,22,10,5,'#98785e');r(26,12,14,12,ink);r(28,13,10,10,'#8ca871');r(28,13,3,8,'#b0c48b');r(36,15,2,7,'#4c6549');r(29,17,2,2,ink);r(35,17,2,2,'#d9e879');
      r(26,9,13,5,'#303d35');r(28,7,7,2,'#59694a');r(25,15,3,8,'#738654');r(31,22,5,3,'#b0bb89');r(31,23,1,1,ink);r(34,23,1,1,ink);r(26,30,5,3,'#a0a47a');r(32,38,7,4,shade);r(25,41,3,5,'#81975f');r(15,31,4,12,'#6b805a');r(11,40,8,4,'#8fa56b');r(43,36,8,5,'#6b805a');r(48,39,8,4,'#8fa56b');r(39,47,4,5,'#829164');
    }else if(['pharmacy','metro','checkpoint'].includes(id)){
      r(0,0,64,64,'#12202e');r(0,0,64,12,'#192b3b');r(45,5,7,6,'#abb9ae');r(45,5,3,3,'#dae3cb');
      for(let i=0;i<7;i++){r(i*10,15-i%3*4,8,25,'#243b46');r(i*10+2,19-i%3*4,2,2,'#45625d');}
      r(0,51,64,13,'#35464b');r(0,60,64,4,'#263840');r(7,56,11,1,'#78958c');r(39,60,14,1,'#72847a');r(22,53,6,1,ink);
      if(id==='pharmacy'){
        r(4,20,52,32,ink);r(6,22,48,28,'#59604f');r(6,22,4,28,'#79775d');
        for(let y=24;y<50;y+=6)for(let x=10+(y%12?3:0);x<54;x+=11){r(x,y,8,1,'#8b8467');r(x+8,y,1,5,'#3b453e');}
        r(9,29,43,5,'#284b47');r(9,29,43,1,'#75a486');r(11,35,17,15,ink);r(32,35,17,15,ink);r(13,37,13,11,'#677c51');r(14,38,4,8,'#aec68a');r(20,39,2,7,'#859d62');r(34,37,12,11,'#2a5148');r(35,38,3,8,'#76a76d');r(39,36,2,14,steel);r(44,42,2,1,light);r(15,41,4,1,ink);r(24,37,2,5,ink);
        r(28,7,13,15,'#25443e');cross(29,9,'#a4d68b');r(30,10,1,3,'#e2edb8');r(30,19,9,1,'#679b65');r(7,50,48,3,steel);r(4,53,54,2,'#51665f');
        r(2,43,2,11,'#526c48');r(0,48,4,2,'#799455');r(54,46,3,9,'#526c48');r(57,49,3,3,'#799455');
      }else if(id==='metro'){
        r(9,15,46,7,ink);r(11,16,42,4,'#549699');r(14,17,4,2,'#a0d1be');r(22,17,19,1,'#c0d6c3');r(43,17,7,2,'#305d69');r(11,22,3,27,steel);r(50,22,3,27,steel);
        q('17,27 45,27 53,54 9,54',ink);q('21,30 41,30 47,50 15,50','#284452');
        for(let i=0;i<6;i++){r(20-i,31+i*3,24+i*2,1,'#7c9294');r(20-i,32+i*3,24+i*2,1,'#3c5764');}
        q('7,29 10,28 18,52 15,54',light);q('54,29 57,30 49,54 46,52',steel);r(6,27,5,3,'#c8d1ba');r(53,27,5,3,'#c8d1ba');r(24,25,16,3,'#87b294');r(9,55,44,3,'#687c7b');r(8,58,46,2,light);
        r(3,43,3,14,steel);r(2,41,5,3,'#e0b36e');r(58,44,3,13,steel);r(57,42,5,3,'#e0b36e');
      }else{
        r(3,10,3,45,'#6b7764');r(3,10,1,44,'#b6b38b');r(5,12,16,9,'#476a55');r(7,14,11,1,'#b2c69a');r(7,17,6,1,'#b2c69a');
        r(43,19,15,5,ink);r(45,24,3,22,steel);r(54,24,3,22,shade);r(45,20,11,3,'#8b9c79');r(47,20,5,2,'#ccda9d');r(44,17,2,3,steel);r(54,17,2,3,steel);q('47,24 32,45 48,45','#6f7c4f');
        r(9,34,51,1,steel);r(9,46,51,1,steel);for(let x=10;x<61;x+=5){q(`${x},34 ${x+5},40 ${x},46 ${x-5},40`,'none');r(x,35,1,11,'#547070');r(x+2,38,1,2,'#3a535a');r(x+3,42,1,2,'#3a535a');}
        r(7,31,2,23,steel);r(60,31,2,23,steel);r(12,48,39,9,ink);r(14,49,35,6,'#c6ae73');for(let x=16;x<48;x+=9){q(`${x},49 ${x+4},49 ${x+1},55 ${x-3},55`,'#49554c');}r(14,55,35,1,'#e7c98a');r(19,58,9,2,shade);r(36,58,10,2,shade);
      }
    }else{
      shadow();
      if(id==='fragment'||id==='victory'){
        r(24,6,16,4,ink);r(25,7,14,2,light);r(27,10,10,9,ink);r(28,10,8,6,steel);r(29,10,2,6,light);r(25,17,14,3,ink);
        q('24,19 40,19 45,24 45,53 41,58 23,58 19,53 19,24',ink);q('25,21 39,21 42,25 42,52 39,55 25,55 22,52 22,25','#538c90');r(24,26,16,25,'#79bba9');r(24,34,16,17,'#94bd69');r(26,36,12,13,'#bedb80');r(25,25,3,22,'#e1eed4');r(28,25,2,8,'#bbd9c8');r(38,29,2,19,'#487c78');r(24,51,16,2,'#416c68');r(30,32,3,2,'#cee8ad');r(35,42,2,2,'#e8f1b9');r(29,46,2,2,'#e8f1b9');r(30,17,5,1,light);
        if(id==='victory'){cross(5,14,'#aaca80');r(8,17,4,3,'#e9f1b5');cross(49,34,'#aaca80');r(52,37,4,3,'#e9f1b5');r(11,45,2,2,'#78b8ae');r(49,10,2,2,'#78b8ae');}
      }
    }
    return p;
  }
  return (id,cls='')=>{
    const illustration=illustrations[id];
    if(illustration){
      const [file,width,height,x,y,w,h]=illustration;
      const clip=`zart-${++illustrationNumber}`;
      const clipWindow=id==='patch'?`<path d="M0 0H${w}V${h}H0V560H60V260H0Z"/>`:`<rect width="${w}" height="${h}"/>`;
      return `<svg class="pixel illustrated ${cls}" viewBox="0 0 ${w} ${h}" aria-hidden="true" overflow="hidden"><defs><clipPath id="${clip}" clipPathUnits="userSpaceOnUse">${clipWindow}</clipPath></defs><g clip-path="url(#${clip})"><image href="assets/${file}" x="${-x}" y="${-y}" width="${width}" height="${height}"/></g></svg>`;
    }
    if(!cache.has(id))cache.set(id,sprite(id));
    return `<svg class="pixel ${cls}" viewBox="0 0 64 64" aria-hidden="true" shape-rendering="crispEdges">${cache.get(id)}</svg>`;
  };
})();

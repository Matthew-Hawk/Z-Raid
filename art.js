/* Stylized survivor, equipment and location illustrations, with native pixel cure art.
   Atlas windows preserve transparency and clip each illustration independently. */
window.ZArt = (() => {
  const ink='#0a1119',shade='#20303b',steel='#697f89',light='#c2d5cd';
  const illustrations={
    pharmacy:['locations-stylized.png',2172,724,0,0,720,724],
    metro:['locations-stylized.png',2172,724,720,0,710,724],
    checkpoint:['locations-stylized.png',2172,724,1430,0,742,724],
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

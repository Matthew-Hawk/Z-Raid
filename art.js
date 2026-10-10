/* Original pixel sprites shared by the viewport UI. */
window.ZArt = (() => { const C=ZContent;
  function art(id,cls='') {
    let p='',color='#b5d974';const rect=(x,y,w,h,c)=>p+=`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}"/>`;
    if(['rook','echo','patch','zombie'].includes(id)){
      color=C.characters.find(c=>c.id===id)?.color||'#83a15e';rect(12,27,11,2,'#080e12');rect(13,6,8,3,color);rect(12,9,10,6,id==='zombie'?'#779253':'#c99d7a');rect(14,12,2,1,'#17252c');rect(19,12,2,1,'#17252c');rect(11,16,12,8,color);rect(8,17,3,8,color);rect(23,17,3,8,color);rect(12,24,4,5,'#66707e');rect(19,24,4,5,'#66707e');rect(10,28,6,2,'#252e39');rect(19,28,6,2,'#252e39');rect(14,18,6,4,'#263840');if(id==='rook')rect(24,14,3,13,'#bca98b');if(id==='patch'){rect(15,18,2,5,'#e9eedc');rect(13,20,6,1,'#e9eedc');}if(id==='echo')rect(12,8,10,4,'#4b798a');
    } else if(['pharmacy','metro','checkpoint'].includes(id)){
      color=C.locations.find(l=>l.id===id).color;rect(0,0,32,32,'#182630');rect(2,8,28,22,'#35434a');rect(4,10,24,4,'#50605a');rect(5,17,7,8,'#101a21');rect(20,17,7,8,'#101a21');rect(14,17,4,13,color);rect(0,30,32,2,'#72785c');if(id==='pharmacy'){rect(14,3,4,9,color);rect(11,6,10,3,color);}if(id==='metro'){rect(9,3,14,5,color);rect(6,27,20,2,'#889694');}if(id==='checkpoint'){rect(2,3,2,27,'#a59071');rect(4,4,12,5,color);rect(2,24,28,3,'#b7a16b');}
    } else if(id==='fragment'||id==='victory'){rect(12,4,8,3,'#d8eed2');rect(13,7,6,4,'#8c9898');rect(10,11,12,17,'#77c9c5');rect(12,14,8,12,'#b5e866');rect(12,14,2,7,'#e7ffc5');if(id==='victory'){rect(3,6,3,3,'#b5d974');rect(26,16,3,3,'#b5d974');}}
    else if(id==='bat'){rect(9,21,3,9,'#99735a');rect(12,7,6,18,'#c1a173');rect(10,10,11,2,'#a7b6ba');rect(10,16,11,2,'#a7b6ba');}
    else if(id==='bow'){rect(19,5,3,22,'#d1ae79');rect(22,8,2,16,'#d1ae79');rect(12,6,1,21,'#dde4d1');rect(7,15,21,2,'#9eaca9');}
    else if(id==='pistol'){rect(5,9,22,6,'#95a7aa');rect(5,15,8,4,'#62747a');rect(6,19,5,10,'#9d7658');rect(21,10,6,2,'#ced7cf');}
    else if(id==='knife'){rect(16,3,5,16,'#c6dcdb');rect(14,19,10,3,'#8b9c96');rect(17,22,4,8,'#a18363');}
    else if(id==='vest'){rect(8,7,16,21,'#a48d65');rect(11,7,10,5,'#16232a');rect(7,13,18,3,'#c4b38c');rect(12,18,8,7,'#6d775e');}
    else if(id==='boots'){rect(6,9,7,15,'#78aaa1');rect(17,7,7,17,'#78aaa1');rect(6,24,12,5,'#9ebcaa');rect(17,24,12,5,'#9ebcaa');}
    else if(id==='kit'){rect(5,10,23,18,'#a98b68');rect(12,6,9,4,'#ccbd93');rect(14,13,5,12,'#dce1cc');rect(10,17,13,4,'#dce1cc');}
    else if(id==='pack'){rect(7,9,18,21,'#869c61');rect(11,5,10,5,'#b2bd85');rect(11,18,10,9,'#516c52');rect(7,12,18,3,'#d0bb85');}
    return `<svg class="pixel ${cls}" viewBox="0 0 32 32" aria-hidden="true" shape-rendering="crispEdges">${p}</svg>`;
  }
return art; })();

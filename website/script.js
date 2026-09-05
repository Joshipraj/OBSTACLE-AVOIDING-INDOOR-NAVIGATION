/* =========================================================
   AB3 WAYFINDER - NO VOICE
   ========================================================= */

const NODES = {
    entrance:{name:"Entrance",x:15,y:18,dest:true},
    washroom1:{name:"Washroom 1",x:18.5,y:18.5,dest:true},
    washroom2:{name:"Washroom 2",x:17.5,y:19,dest:true},
    stairs1:{name:"Stairs 1",x:5,y:17,dest:true},
    stairs2:{name:"Stairs 2",x:21,y:16,dest:true},
    stairs3:{name:"Stairs 3",x:26,y:17,dest:true},
    stairs4:{name:"Stairs 4",x:19,y:3,dest:true},
    exit1:{name:"Exit 1",x:16,y:2,dest:true},
    exit2:{name:"Exit 2",x:2,y:2,dest:true},
    lift:{name:"Lift",x:8,y:6,dest:true},
    canteen:{name:"AB3 Canteen",x:13,y:17,dest:true},
    kamaraj:{name:"Kamaraj Auditorium",x:9,y:13,dest:true},
    vnest:{name:"V-Nest",x:24,y:2,dest:true},
    jwest:{name:"West corridor junction",x:11,y:10,dest:false},
    jopen:{name:"Open hall junction",x:19,y:12,dest:false}
};

const EDGES = [
    ["stairs1","jwest"],
    ["jwest","kamaraj"],
    ["jwest","canteen"],
    ["jwest","lift"],
    ["lift","exit2"],
    ["jwest","jopen"],
    ["jopen","entrance"],
    ["entrance","washroom2"],
    ["washroom2","washroom1"],
    ["jopen","stairs2"],
    ["stairs2","stairs3"],
    ["jopen","exit1"],
    ["jopen","stairs4"],
    ["stairs4","vnest"]
];

function dist(a,b){
    const A=NODES[a],B=NODES[b];
    return Math.hypot(A.x-B.x,A.y-B.y);
}

const adjacency={};

Object.keys(NODES).forEach(id=>adjacency[id]=[]);

EDGES.forEach(([a,b])=>{
    const d=dist(a,b);
    adjacency[a].push({to:b,d});
    adjacency[b].push({to:a,d});
});

function shortestPath(start,end){
    const distTo={},prev={};
    const queue=new Set(Object.keys(NODES));

    Object.keys(NODES).forEach(id=>distTo[id]=Infinity);
    distTo[start]=0;

    while(queue.size){
        let u=null;

        queue.forEach(id=>{
            if(u===null || distTo[id]<distTo[u]) u=id;
        });

        queue.delete(u);

        if(u===end) break;

        adjacency[u].forEach(({to,d})=>{
            const alt=distTo[u]+d;

            if(alt<distTo[to]){
                distTo[to]=alt;
                prev[to]=u;
            }
        });
    }

    const path=[end];

    while(path[0]!==start){
        if(!(path[0] in prev)) return null;
        path.unshift(prev[path[0]]);
    }

    return path;
}

function bearing(a,b){
    const A=NODES[a],B=NODES[b];

    let ang=Math.atan2(
        B.x-A.x,
        B.y-A.y
    )*180/Math.PI;

    if(ang<0) ang+=360;

    return ang;
}

function compassName(ang){
    const dirs=[
        "north",
        "north-east",
        "east",
        "south-east",
        "south",
        "south-west",
        "west",
        "north-west"
    ];

    return dirs[Math.round(ang/45)%8];
}

function turnPhrase(prevAng,newAng){
    let diff=newAng-prevAng;

    diff=((diff+540)%360)-180;

    const abs=Math.abs(diff);

    if(abs<20) return "Continue straight ahead";

    if(abs<65)
        return diff>0
            ?"Veer slightly right"
            :"Veer slightly left";

    if(abs<135)
        return diff>0
            ?"Turn right"
            :"Turn left";

    if(abs<165)
        return diff>0
            ?"Turn sharply right"
            :"Turn sharply left";

    return "Turn around, doubling back";
}

function buildInstructions(path){
    const steps=[];
    let prevAng=null;

    for(let i=0;i<path.length-1;i++){
        const from=path[i];
        const to=path[i+1];

        const ang=bearing(from,to);
        const metres=Math.round(dist(from,to));
        const paces=Math.max(1,Math.round(metres/0.75));

        let lead;

        if(prevAng===null){
            lead=
                `Starting from ${NODES[from].name}, head ${compassName(ang)}`;
        }else{
            lead=turnPhrase(prevAng,ang);
        }

        const tail=NODES[to].dest
            ?`for about ${paces} paces, until you reach ${NODES[to].name}.`
            :`for about ${paces} paces, to the next junction.`;

        steps.push(`${lead}, and walk ${tail}`);

        prevAng=ang;
    }

    steps.push(
        `You have arrived at ${
            NODES[path[path.length-1]].name
        }.`
    );

    return steps;
}

const destIds=
    Object.keys(NODES).filter(id=>NODES[id].dest);

let current=null;
let steps=[];
let stepIndex=0;
let activeTarget=null;

function fillGrid(container,excludeId,onPick){
    container.innerHTML="";

    destIds
        .filter(id=>id!==excludeId)
        .forEach(id=>{
            const btn=document.createElement("button");

            btn.textContent=NODES[id].name;

            btn.setAttribute(
                "aria-label",
                "Go to "+NODES[id].name
            );

            btn.onclick=()=>onPick(id);

            container.appendChild(btn);
        });
}

function setCurrent(id){
    current=id;

    document.getElementById("hereName").textContent=
        NODES[id].name;

    document.getElementById("pickHerePanel").style.display=
        "none";

    document.getElementById("routePanel").style.display=
        "none";

    document.getElementById("destPanel").style.display=
        "block";

    fillGrid(
        document.getElementById("destGrid"),
        id,
        startRoute
    );

    drawMap();
}

function startRoute(destId){
    activeTarget=destId;

    const path=shortestPath(current,destId);

    document.getElementById("destPanel").style.display=
        "none";

    const panel=document.getElementById("routePanel");

    panel.style.display="block";

    document.getElementById("routeTitle").textContent=
        `${NODES[current].name} → ${NODES[destId].name}`;

    if(!path){
        steps=[
            "Sorry, no route could be found between these two points."
        ];
    }else{
        steps=buildInstructions(path);
    }

    stepIndex=0;

    showStep();
    drawMap(path);
}

function showStep(){
    document.getElementById("stepText").textContent=
        steps[stepIndex];

    document.getElementById("progressText").textContent=
        `Step ${stepIndex+1} of ${steps.length}`;

    document.getElementById("backBtn").disabled=
        stepIndex===0;

    document.getElementById("nextBtn").disabled=
        stepIndex===steps.length-1;
}

document.getElementById("nextBtn").onclick=()=>{
    if(stepIndex<steps.length-1){
        stepIndex++;
        showStep();
    }
};

document.getElementById("backBtn").onclick=()=>{
    if(stepIndex>0){
        stepIndex--;
        showStep();
    }
};

document.getElementById("doneBtn").onclick=()=>{
    setCurrent(activeTarget||current);
};

document.getElementById("changeHere").onclick=()=>{
    document.getElementById("pickHerePanel").style.display=
        "block";

    fillGrid(
        document.getElementById("hereGrid"),
        null,
        setCurrent
    );
};

function drawMap(highlightPath){
    const svg=document.getElementById("mapSvg");

    const pad=14;
    const scale=9;

    const xs=Object.values(NODES).map(n=>n.x);
    const ys=Object.values(NODES).map(n=>n.y);

    const minX=Math.min(...xs);
    const maxY=Math.max(...ys);

    const px=id=>
        (NODES[id].x-minX)*scale+pad;

    const py=id=>
        (maxY-NODES[id].y)*scale+pad;

    let hl=new Set();

    if(highlightPath){
        for(let i=0;i<highlightPath.length-1;i++){
            hl.add(
                highlightPath[i]+"|"+highlightPath[i+1]
            );
        }
    }

    let svgContent="";

    EDGES.forEach(([a,b])=>{
        const isHl=
            hl.has(a+"|"+b) ||
            hl.has(b+"|"+a);

        svgContent+=`
            <line
                class="${isHl?'path-edge':'edge'}"
                x1="${px(a)}"
                y1="${py(a)}"
                x2="${px(b)}"
                y2="${py(b)}"
            />
        `;
    });

    Object.keys(NODES).forEach(id=>{
        if(!NODES[id].dest) return;

        let cls="node dest";

        if(id===current){
            cls="node current";
        }else if(
            highlightPath &&
            id===highlightPath[highlightPath.length-1]
        ){
            cls="node target";
        }

        svgContent+=`
            <g class="${cls}">
                <circle
                    cx="${px(id)}"
                    cy="${py(id)}"
                    r="4"
                />
                <text
                    x="${px(id)+6}"
                    y="${py(id)+3}"
                >${NODES[id].name}</text>
            </g>
        `;
    });

    svg.innerHTML=svgContent;
}

const params=
    new URLSearchParams(window.location.search);

const startId=params.get("location");

if(startId && NODES[startId]){
    setCurrent(startId);
}else{
    document.getElementById("destPanel").style.display=
        "none";

    document.getElementById("routePanel").style.display=
        "none";

    document.getElementById("hereName").textContent=
        "No tag detected";

    document.getElementById("pickHerePanel").style.display=
        "block";

    fillGrid(
        document.getElementById("hereGrid"),
        null,
        setCurrent
    );

    drawMap();
}
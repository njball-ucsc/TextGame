class Engine {

    static load(...args) {
        window.onload = () => new Engine(...args);
    }

    constructor(firstSceneClass, storyDataUrl) {

        this.firstSceneClass = firstSceneClass;
        this.storyDataUrl = storyDataUrl;

        this.header = document.body.appendChild(document.createElement("h1"));
        this.output = document.body.appendChild(document.createElement("div"));
        this.guessContainer = document.body.appendChild(document.createElement("div"));
        this.movesContainer = document.body.appendChild(document.createElement("div"));
        this.actionsContainer = document.body.appendChild(document.createElement("div"));
    
        
        fetch(storyDataUrl).then(
            (response) => response.json()
        ).then(
            (json) => {
                this.storyData = json;
                this.gotoScene(firstSceneClass)
            }
        );
    }

    gotoScene(sceneClass, data) {
        this.scene = new sceneClass(this);
        this.scene.create(data);
    }

    addChoice(action, data) {
        let button = this.actionsContainer.appendChild(document.createElement("button"));
        button.innerText = action;
        button.onclick = () => {
            while(this.actionsContainer.firstChild) {
                this.actionsContainer.removeChild(this.actionsContainer.firstChild)
            }
            while(this.movesContainer.firstChild) {
                this.movesContainer.removeChild(this.movesContainer.firstChild)
            }
            this.scene.handleChoice(data);
        }
    }

    addGuess(guess) {
        let g_button = this.guessContainer.appendChild(document.createElement("button"));
        g_button.innerText = guess;
        g_button.onclick = () => {
            this.scene.handleGuess(guess);
        }
    }

    addMoves(move, data) {
        let m_button = this.movesContainer.appendChild(document.createElement("button"));
        m_button.innerText = move;
        m_button.onclick = () => {
            while(this.movesContainer.firstChild) {
                this.movesContainer.removeChild(this.movesContainer.firstChild)
            }
            while(this.actionsContainer.firstChild) {
                this.actionsContainer.removeChild(this.actionsContainer.firstChild)
            }
            this.scene.handleMove(data);
        }
    }

    setTitle(title) {
        document.title = title;
        this.header.innerText = title;
    }

    show(msg) {
        let div = document.createElement("div");
        div.innerHTML = msg;
        this.output.appendChild(div);
    }

    mCoord(coord) {
        let mCoords = {
            "00": "NaN",
            "A1": "11",
            "A2": "31",
            "B1": "13",
            "B3": "53",
            "B4": "73",
            "B5": "93",
            "C1": "15",
            "C2": "35",
            "C3": "55",
            "C5": "95",
            "D1": "17",
            "D3": "57",
            "D4": "77",
            "D5": "97",
            "E1": "19",
            "E2": "39",
            "E3": "59",
            "E4": "79"
        }
        return mCoords[coord];
    }

    mUpdate(Cr, Ce, L) {
        for(let i = 0; i <= 10; i++) {
            let printline = "";
            let space = "&nbsp;"
            for(let j = 0; j <= 10; j++) {
                if(i % 2 == 0 || j % 2 == 0) {
                    if(map[i][j] == 0) { printline += "&mdash;"; } 
                    else { printline += "&#124;"+space.repeat(3); }
                } else {
                    if(map[i][j] == "#") { printline += "#"+space.repeat(3); }
                    else if(map[i][j] == "C") { printline += "&#8362;"+space.repeat(2); }
                    else if(map[i][j] == "N") { printline += "&Xi;"+space.repeat(3); }
                    else if(map[i][j] == 1) {
                        if(String(i)+String(j) === Cr) { printline += "&Phi;"+space.repeat(2); } 
                        else if(String(i)+String(j) === Ce) { printline += "&Psi;"+space.repeat(2); } 
                        else if(String(i)+String(j) === L) { printline += "&Delta;"+space.repeat(2); }
                        else { 
                            printline += space.repeat(5);
                        }
                    }
                }
            }
            this.show(printline);
        }
        this.show("<br>Legend: <br>Cronus - &Phi;, Cerberus - &Psi;,<br>Network Link - &Xi;, Communication Tower - &#8362;,<br>Broken Sector - #, Locked Sector - &Delta;");
    }

    CerberusTurn(Cronus, Cerberus, Locked) {
        let cInit = Cerberus;
        let Cr = this.mCoord(Cronus);
        let Ce = this.mCoord(Cerberus);
        let x = Cr[0] - Ce[0];
        let y = Cr[1] - Ce[1];
        let d = "";
        let d2 = "";
        if(Math.abs(x) > Math.abs(y)) {
            if(x < 0) { d = "N"; }
            else { d = "S"; }
            if(y < 0) { d2 = "W"; }
            else { d2 = "E"; }
        } else {
            if(y < 0) { d = "W"; }
            else { d = "E"; }
            if(x < 0) { d2 = "N"; }
            else { d2 = "S"; }
        }
        for(let i = 0; i < this.storyData.Locations.Move.Moves[Cerberus].length; i++){
            if(d == "N") {
                if("North" == this.storyData.Locations.Move.Moves[Cerberus][i].Text) { 
                    if(this.storyData.Locations.Move.Moves[Cerberus][i].Target == Locked) { break; }
                    else { Cerberus = this.storyData.Locations.Move.Moves[Cerberus][i].Target;
                    break;
                    }
                } 
            }
            if(d == "E") {
                if("East" == this.storyData.Locations.Move.Moves[Cerberus][i].Text) { 
                    if(this.storyData.Locations.Move.Moves[Cerberus][i].Target == Locked) { break; }
                    else { Cerberus = this.storyData.Locations.Move.Moves[Cerberus][i].Target;
                    break;
                    }
                }
            }
            if(d == "S") {
                if("South" == this.storyData.Locations.Move.Moves[Cerberus][i].Text) {
                    if(this.storyData.Locations.Move.Moves[Cerberus][i].Target == Locked) { break; }
                    else { Cerberus = this.storyData.Locations.Move.Moves[Cerberus][i].Target;
                    break;
                    }
                }
            }
            if(d == "W") {
                if("West" == this.storyData.Locations.Move.Moves[Cerberus][i].Text) { 
                    if(this.storyData.Locations.Move.Moves[Cerberus][i].Target == Locked) { break; }
                    else { Cerberus = this.storyData.Locations.Move.Moves[Cerberus][i].Target;
                    break;
                    }
                }
            }
        }
        if(Cerberus == cInit) {
            for(let i = 0; i < this.storyData.Locations.Move.Moves[Cerberus].length; i++){
                if(d2 == "N") {
                    if("North" == this.storyData.Locations.Move.Moves[Cerberus][i].Text) {
                        if(this.storyData.Locations.Move.Moves[Cerberus][i].Target == Locked) { break; }
                        else { 
                            Cerberus = this.storyData.Locations.Move.Moves[Cerberus][i].Target;
                            break;
                        }
                    } 
                }
                if(d2 == "E") {
                    if("East" == this.storyData.Locations.Move.Moves[Cerberus][i].Text) { 
                        if(this.storyData.Locations.Move.Moves[Cerberus][i].Target == Locked) { break; }
                        else { 
                            Cerberus = this.storyData.Locations.Move.Moves[Cerberus][i].Target;
                            break;
                        }
                    }
                }
                if(d2 == "S") {
                    if("South" == this.storyData.Locations.Move.Moves[Cerberus][i].Text) { 
                        if(this.storyData.Locations.Move.Moves[Cerberus][i].Target == Locked) { break; }
                        else { 
                            Cerberus = this.storyData.Locations.Move.Moves[Cerberus][i].Target;
                            break;
                        }
                    }
                }
                if(d2 == "W") {
                    if("West" == this.storyData.Locations.Move.Moves[Cerberus][i].Text) { 
                        if(this.storyData.Locations.Move.Moves[Cerberus][i].Target == Locked) { break; }
                        else { 
                            Cerberus = this.storyData.Locations.Move.Moves[Cerberus][i].Target;
                            break;
                        }
                    }
                }
            }
        }
        this.show("&gt; Cerberus moved: "+cInit+" &#8594; "+Cerberus);
        return Cerberus;
    }
}

class Scene {
    constructor(engine) {
        this.engine = engine;
    }

    create() { }

    update() { }

    handleChoice(action) {
        console.warn('no choice handler on scene ', this);
    }
}
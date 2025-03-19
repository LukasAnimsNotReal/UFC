const UFC_FIGHTERS = {
    Lightweight: [
        "Islam Makhachev", "Arman Tsarukyan"," Charles Oliveira ", "Justin Gaethje"
        ,"Dustin Poirier",  "Max Holloway" ,"Dan Hooker" , "Michael Chandler" ,"Mateusz Gamrot"
        ,"Beneil Dariush" , "Renato Moicano" ,"Rafael Fiziev" , "Paddy Pimblett" ,
        "Benoît Saint Denis" ,"Grant Dawson"
    ],
    Welterweight: [
        "Leon Edwards", "Kamaru Usman", "Colby Covington",
        "Khamzat Chimaev", "Belal Muhammad", "Gilbert Burns",
        "Stephen Thompson", "Shavkat Rakhmonov", "Geoff Neal", "Sean Brady"
    ],
    Middleweight: [
        "Israel Adesanya", "Alex Pereira", "Robert Whittaker",
        "Marvin Vettori", "Paulo Costa", "Jared Cannonier",
        "Sean Strickland", "Dricus Du Plessis", "Jack Hermansson", "Nassourdine Imavov"
    ],
    Heavyweight: [
        "Jon Jones", "Ciryl Gane", "Stipe Miocic",
        "Sergei Pavlovich", "Curtis Blaydes", "Tom Aspinall",
        "Tai Tuivasa", "Derrick Lewis", "Alexander Volkov", "Jailton Almeida"
    ]
};

let fighter = {
    name: "New Fighter",
    division: "Lightweight",
    record: { wins: 0, losses: 0, draws: 0 },
    stats: {
        striking: 50,
        grappling: 50,
        conditioning: 50,
        stamina: 100
    },
    get overall() {
        return Math.round((this.stats.striking + this.stats.grappling + this.stats.conditioning) / 3);
    },
    rank: 0
};

let divisionFighters = {};
const divisions = ["Lightweight", "Welterweight", "Middleweight", "Heavyweight"];

function initializeGame() {
    divisions.forEach(div => {
        let fighters = UFC_FIGHTERS[div].map(name => ({
            name: name,
            overall: Math.floor(Math.random() * 20 + 70),
            record: {
                wins: Math.floor(Math.random() * 15),
                losses: Math.floor(Math.random() * 5),
                draws: Math.floor(Math.random() * 2)
            },
            stats: {
                striking: Math.floor(Math.random() * 20 + 70),
                grappling: Math.floor(Math.random() * 20 + 70),
                conditioning: Math.floor(Math.random() * 20 + 70)
            }
        }));
        
        fighters.sort((a, b) => b.overall - a.overall);
        fighters.forEach((f, i) => f.rank = i + 1);
        
        divisionFighters[div] = fighters;
    });
}

function setCustomName() {
    const name = document.getElementById("custom-name").value.trim();
    if (!name) return alert("Please enter a name!");
    fighter.name = name;
    startGame();
}

function generateFighter() {
    const names = ["Alex Pereira", "Jon Jones", "Conor McGregor", "Khabib Nurmagomedov"];
    fighter.name = names[Math.floor(Math.random() * names.length)];
    startGame();
}

function startGame() {
    fighter.division = document.getElementById("division-select").value;
    document.getElementById("creation-screen").style.display = "none";
    document.getElementById("game-interface").style.display = "block";
    updateUI();
    initializeGame();
    generateDivisionRankings();
}

function updateUI() {
    document.getElementById("fighter-name").textContent = fighter.name;
    document.getElementById("fighter-division").textContent = fighter.division;
    document.getElementById("fighter-record").textContent = 
        `${fighter.record.wins}-${fighter.record.losses}-${fighter.record.draws}`;
    document.getElementById("stamina").textContent = fighter.stats.stamina;
    document.getElementById("fighter-rank").textContent = `#${fighter.rank}`;
    updateProgressBars();
}

function startTraining(type) {
    if (fighter.stats.stamina < 30) return alert("Not enough stamina!");
    
    const trainingEffects = {
        striking: () => {
            fighter.stats.striking = Math.min(100, fighter.stats.striking + Math.floor(Math.random() * 3 + 2));
        },
        grappling: () => {
            fighter.stats.grappling = Math.min(100, fighter.stats.grappling + Math.floor(Math.random() * 3 + 2));
        },
        conditioning: () => {
            fighter.stats.conditioning = Math.min(100, fighter.stats.conditioning + Math.floor(Math.random() * 2 + 1));
            fighter.stats.stamina = Math.min(100, fighter.stats.stamina + 5);
        }
    };
    
    trainingEffects[type]();
    fighter.stats.stamina -= 25;
    updateUI();
    generateDivisionRankings();
}

function showOpponentSelection() {
    if (fighter.stats.stamina < 50) return alert("Not enough stamina for a fight!");
    const modal = document.getElementById("opponent-select");
    modal.style.display = "block";
    
    const opponents = divisionFighters[fighter.division]
        .filter(f => f.name !== fighter.name)
        .sort((a, b) => a.rank - b.rank);
    
    const opponentList = document.getElementById("opponent-list");
    opponentList.innerHTML = opponents.map(opp => `
        <div class="opponent-item" onclick="startFight('${opp.name}')">
            <span>#${opp.rank}</span>
            <span>${opp.name}</span>
            <span>Record: ${opp.record.wins}-${opp.record.losses}-${opp.record.draws}</span>
            <span>Overall: ${opp.overall}</span>
        </div>
    `).join("");
}

function closeModal() {
    document.getElementById("opponent-select").style.display = "none";
}

function startFight(opponentName) {
    closeModal();
    const opponents = divisionFighters[fighter.division];
    const opponent = opponents.find(f => f.name === opponentName);
    
    const playerScore = fighter.overall + (fighter.stats.conditioning / 2) + Math.random() * 10;
    const opponentScore = opponent.overall + (Math.random() * 15);
    
    if (playerScore > opponentScore) {
        fighter.record.wins++;
        fighter.stats.striking += 2;
        fighter.stats.grappling += 1;
    } else {
        fighter.record.losses++;
        fighter.stats.conditioning += 2;
    }
    
    if (playerScore > opponentScore) {
        opponent.record.losses++;
    } else {
        opponent.record.wins++;
    }
    
    fighter.stats.stamina -= 50;
    showFightResult(playerScore > opponentScore, opponent.name);
    updateUI();
    generateDivisionRankings();
}

function generateDivisionRankings() {
    const allFighters = [...divisionFighters[fighter.division]];
    if (!allFighters.find(f => f.name === fighter.name)) {
        allFighters.push(fighter);
    }
    
    allFighters.sort((a, b) => b.overall - a.overall);
    
    allFighters.forEach((f, index) => {
        f.rank = index + 1;
        if (f.name === fighter.name) fighter.rank = f.rank;
    });
    
    const rankingsList = document.getElementById("rankings-list");
    rankingsList.innerHTML = allFighters.map(f => `
        <div class="rankings-row ${f.name === fighter.name ? 'highlight' : ''}">
            <span>#${f.rank}</span>
            <span>${f.name}</span>
            <span>${f.record.wins}-${f.record.losses}-${f.record.draws}</span>
            <span>${f.overall}</span>
        </div>
    `).join("");
}

function showTab(tabId) {
    document.querySelectorAll(".tab-content").forEach(t => t.classList.remove("active"));
    document.querySelectorAll(".tab-btn").forEach(t => t.classList.remove("active"));
    document.getElementById(`${tabId}-tab`).classList.add("active");
    event.target.classList.add("active");
}

function updateProgressBars() {
    document.getElementById("striking-bar").style.width = `${fighter.stats.striking}%`;
    document.getElementById("grappling-bar").style.width = `${fighter.stats.grappling}%`;
    document.getElementById("conditioning-bar").style.width = `${fighter.stats.conditioning}%`;
}

function showFightResult(result, opponentName) {
    const resultBox = document.getElementById("fight-result");
    resultBox.className = `result-box ${result ? 'win' : 'lose'}`;
    resultBox.innerHTML = result ? 
        `🥊 Victory! You defeated ${opponentName}` :
        `💥 Defeat! Lost to ${opponentName}`;
    resultBox.style.display = 'block';
    resultBox.style.animation = 'none';
    void resultBox.offsetWidth;
    resultBox.style.animation = 'punch 0.5s';
}

function rest() {
    fighter.stats.stamina = Math.min(100, fighter.stats.stamina + 30);
    updateUI();
}

function showDetailedStats() {
    const stats = fighter.stats;
    alert(`Detailed Stats:\n\nStriking: ${stats.striking}\nGrappling: ${stats.grappling}\nConditioning: ${stats.conditioning}\nOverall Rating: ${fighter.overall}`);
}

window.onload = () => {
    updateProgressBars();
    document.addEventListener('keypress', (e) => {
        if (e.key === 't') startTraining('striking');
        if (e.key === 'f') showOpponentSelection();
        if (e.key === 'r') rest();
    });
};
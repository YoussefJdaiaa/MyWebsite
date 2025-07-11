const TAILLE_PLATEAU = 5;
const VIDE = 0;
const PION_ROUGE = 1;
const PION_BLEU = 3;
const NEUTRON = 2;
let joueurEnCours = PION_BLEU;
let exJoueurEnCours;

class Case {
    constructor(ligne, colonne) {
        this.ligne = ligne;
        this.colonne = colonne;
    }
}

class Damier {
    constructor() {
        this.plateau = Array(TAILLE_PLATEAU).fill().map(() => Array(TAILLE_PLATEAU).fill(VIDE));
        this.pion_rouge = 5;
        this.pion_bleu = 5;
        this.neutron = new Case(2, 2);
        this.plateau[2][2] = NEUTRON;
        for (let i = 0; i < 5; i++) {
            this.plateau[0][i] = PION_BLEU;
            this.plateau[4][i] = PION_ROUGE;
        }
    }
}

let damier = new Damier();

function updateBoard() {
    const board = document.getElementById('board');
    board.innerHTML = '';
    for (let i = 0; i < TAILLE_PLATEAU; i++) {
        for (let j = 0; j < TAILLE_PLATEAU; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.ligne = i;
            cell.dataset.colonne = j;
            if (damier.plateau[i][j] === PION_ROUGE) {
                cell.classList.add('red');
                cell.textContent = 'R';
            } else if (damier.plateau[i][j] === PION_BLEU) {
                cell.classList.add('blue');
                cell.textContent = 'B';
            } else if (damier.plateau[i][j] === NEUTRON) {
                cell.classList.add('green');
                cell.textContent = 'N';
            } else {
                cell.textContent = '.';
            }
            cell.addEventListener('click', () => handleCellClick(i, j));
            board.appendChild(cell);
        }
    }
}

function handleCellClick(ligne, colonne) {
    if (damier.plateau[ligne][colonne] === joueurEnCours || (joueurEnCours === NEUTRON && damier.plateau[ligne][colonne] === NEUTRON)) {
        const direction = choisirDirection();
        if (joueurEnCours === NEUTRON) {
            deplacerNeutron(damier, direction);
        } else {
            deplacerPion(damier, new Case(ligne, colonne), direction, joueurEnCours);
        }
        updateBoard();
        switchPlayer();
    } else {
        alert("C'est au tour de l'autre joueur ou la case sélectionnée est invalide.");
    }
}

function choisirDirection() {
    let direction = prompt("Choisissez une direction pour déplacer le pion (1-8) :");
    return parseInt(direction);
}

function estDansPlateau(ligne, colonne) {
    return ligne >= 0 && ligne < TAILLE_PLATEAU && colonne >= 0 && colonne < TAILLE_PLATEAU;
}

function estObstacle(damier, ligne, colonne) {
    return damier.plateau[ligne][colonne] !== VIDE;
}

function deplacerPion(damier, positionPion, direction, joueur) {
    const directions = [
        [1, 0], [1, 1], [0, 1], [-1, 1],
        [-1, 0], [-1, -1], [0, -1], [1, -1]
    ];
    let i = 0;
    let { ligne, colonne } = positionPion;
    let deplacementEffectue = false;

    while (!deplacementEffectue) {
        const [deltaLigne, deltaColonne] = directions[direction - 1];
        const nouvelleLigne = ligne + deltaLigne;
        const nouvelleColonne = colonne + deltaColonne;

        if (estDansPlateau(nouvelleLigne, nouvelleColonne) && !estObstacle(damier, nouvelleLigne, nouvelleColonne)) {
            damier.plateau[nouvelleLigne][nouvelleColonne] = damier.plateau[ligne][colonne];
            damier.plateau[ligne][colonne] = VIDE;
            ligne = nouvelleLigne;
            colonne = nouvelleColonne;
            i++;
        } else if (i !== 0) {
            deplacementEffectue = true;
        } else {
            alert("Direction invalide, le pion n'a pas bougé.\nChoisissez une direction possible.");
            direction = choisirDirection();
        }
    }

    if (joueur === PION_BLEU) {
        damier.pion_bleu = joueur;
    } else if (joueur === PION_ROUGE) {
        damier.pion_rouge = joueur;
    }
}

function deplacerNeutron(damier, direction) {
    const directions = [
        [1, 0], [1, 1], [0, 1], [-1, 1],
        [-1, 0], [-1, -1], [0, -1], [1, -1]
    ];

    let ligneNeutron, colonneNeutron;
    let neutronTrouve = false;

    for (let i = 0; i < TAILLE_PLATEAU && !neutronTrouve; i++) {
        for (let j = 0; j < TAILLE_PLATEAU && !neutronTrouve; j++) {
            if (damier.plateau[i][j] === NEUTRON) {
                ligneNeutron = i;
                colonneNeutron = j;
                neutronTrouve = true;
            }
        }
    }

    let deplacementEffectue = false;
    let k = 0;

    while (!deplacementEffectue) {
        const [deltaLigne, deltaColonne] = directions[direction - 1];
        const nouvelleLigne = ligneNeutron + deltaLigne;
        const nouvelleColonne = colonneNeutron + deltaColonne;

        if (estDansPlateau(nouvelleLigne, nouvelleColonne) && !estObstacle(damier, nouvelleLigne, nouvelleColonne)) {
            damier.plateau[ligneNeutron][colonneNeutron] = VIDE;
            damier.plateau[nouvelleLigne][nouvelleColonne] = NEUTRON;
            ligneNeutron = nouvelleLigne;
            colonneNeutron = nouvelleColonne;
            k++;
        } else if (k !== 0) {
            deplacementEffectue = true;
        } else {
            alert(`Déplacement du neutron impossible dans cette direction (${nouvelleLigne}, ${nouvelleColonne}).\nChoisissez une direction valide.`);
            direction = choisirDirection();
        }
    }
}

function estNeutronDansDernierePremiereLigne(damier, gagnant) {
    let ligneNeutron = -1;

    for (let i = 0; i < TAILLE_PLATEAU && ligneNeutron === -1; i++) {
        for (let j = 0; j < TAILLE_PLATEAU && ligneNeutron === -1; j++) {
            if (damier.plateau[i][j] === NEUTRON) {
                ligneNeutron = i;
            }
        }
    }

    if (ligneNeutron === 0) {
        gagnant.val = 1;
        return true;
    } else if (ligneNeutron === TAILLE_PLATEAU - 1) {
        gagnant.val = 2;
        return true;
    } else {
        return false;
    }
}

function estJoueurBloque(damier, joueurEnCours) {
    const directions = [
        [-1, 0], [-1, 1], [0, 1], [1, 1],
        [1, 0], [1, -1], [0, -1], [-1, -1]
    ];

    if (joueurEnCours === NEUTRON) {
        for (let i = 0; i < TAILLE_PLATEAU; i++) {
            for (let j = 0; j < TAILLE_PLATEAU; j++) {
                if (damier.plateau[i][j] === NEUTRON) {
                    for (let direction = 1; direction <= 8; direction++) {
                        const [deltaLigne, deltaColonne] = directions[direction - 1];
                        const nouvelleLigne = i + deltaLigne;
                        const nouvelleColonne = j + deltaColonne;

                        if (estDansPlateau(nouvelleLigne, nouvelleColonne) &&
                            !estObstacle(damier, nouvelleLigne, nouvelleColonne)) {
                            return false;
                        }
                    }
                }
            }
        }
        return true;
    } else {
        for (let i = 0; i < TAILLE_PLATEAU; i++) {
            for (let j = 0; j < TAILLE_PLATEAU; j++) {
                if ((joueurEnCours === PION_BLEU && damier.plateau[i][j] === PION_BLEU) ||
                    (joueurEnCours === PION_ROUGE && damier.plateau[i][j] === PION_ROUGE)) {
                    for (let direction = 1; direction <= 8; direction++) {
                        const [deltaLigne, deltaColonne] = directions[direction - 1];
                        const nouvelleLigne = i + deltaLigne;
                        const nouvelleColonne = j + deltaColonne;

                        if (estDansPlateau(nouvelleLigne, nouvelleColonne) &&
                            !estObstacle(damier, nouvelleColonne, nouvelleLigne)) {
                            return false;
                        }
                    }
                }
            }
        }
        return true;
    }
}

function switchPlayer() {
    if (joueurEnCours === PION_BLEU || joueurEnCours === PION_ROUGE) {
        joueurEnCours = NEUTRON;
    } else if (exJoueurEnCours === PION_ROUGE) {
        joueurEnCours = PION_BLEU;
    } else {
        joueurEnCours = PION_ROUGE;
    }
    exJoueurEnCours = joueurEnCours;
}

function resetGame() {
    damier = new Damier();
    joueurEnCours = PION_BLEU;
    exJoueurEnCours = null;
    updateBoard();
}

document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('restart-game').addEventListener('click', resetGame);
    resetGame();
});

function sontCoordonneesPionValides(damier, ligne, colonne, joueur) {
    if (joueur === PION_BLEU) {
        return estDansPlateau(ligne, colonne) && (damier.plateau[ligne][colonne] === PION_BLEU);
    } else if (joueur === PION_ROUGE) {
        return estDansPlateau(ligne, colonne) && (damier.plateau[ligne][colonne] === PION_ROUGE);
    } else {
        return estDansPlateau(ligne, colonne) && (damier.plateau[ligne][colonne] === NEUTRON);
    }
}

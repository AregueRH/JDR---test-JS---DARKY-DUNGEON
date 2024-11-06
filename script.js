// la classe Personnage, de laquelle hériteront les classes joueurs et ennemis
class Personnage {
    constructor(nomPersonnage, pvPersonnage, forcePersonnage, agilitePersonnage, defensePersonnage) {
        this.nom = nomPersonnage;
        this.pv = pvPersonnage;        // Points de vie
        this.force = forcePersonnage;  // Force pour infliger des dégâts
        this.agilite = agilitePersonnage;  // Agilité pour esquiver/atteindre
        this.defense = defensePersonnage;  // Défense pour réduire les dégâts
    }

// fonction qui compare la force de l'attaquant à la défense de sa cible (joueur ou monstre)
    attaquer(cible, vueInstance) {
        // on s'assure ainsi que les dégâts ne seront soit positifs soit nuls
        const degats = Math.max(0, (this.force + this.lancerDes()) - cible.defense);
        if (degats > 0) {
            cible.pv -= degats;
            // console.log(`${this.nom} inflige ${degats} dégâts à ${cible.nom} ! Il reste ${cible.pv} points de vie à ${cible.nom}`);
            vueInstance.htmlCombat += `${this.nom} inflige ${degats} dégâts à ${cible.nom}!  <br> Il reste ${cible.pv} points de vie à ${cible.nom}.  <br>`;
            if (cible instanceof Guerrier) {
                vueInstance.pv = cible.pv;
                vueInstance.showAndFadeCircles();
            }
        } else {
            console.log(`${cible.nom} bloque totalement l'attaque de ${this.nom}!  <br>`);
            vueInstance.htmlCombat += `${cible.nom} bloque totalement l'attaque de ${this.nom}!  <br>`;
        }
    }

    attaqueDuBouclier(cible, vueInstance) {
        const degats = Math.max(0, (this.force - cible.defense));
        console.log(`degats = ${degats}`);
        if (degats > 0) {
            cible.pv -= degats;
            if (cible.defense > 3) {
                cible.defense -= 3;
            }
            if (cible.agilite > 2) {
                cible.agilite -= 2;
            }
            vueInstance.htmlCombat += `${cible.nom} a perdu 3 en défense et 2 d'agilité pour le reste du combat ainsi que ${degats} points de vie. Il lui reste ${cible.pv} points de vie. <br>`;
        } else {
            vueInstance.htmlCombat += `${cible.nom} parvient à bloquer le coup de bouclier de ${this.nom} !<br>`;
        }
    }

// la cible a perdu 3 de défense pour le reste du combat et 2 points de vie.

// cette fonction permet de cloner la "fiche" des personnage à chaque appelle de la fonction. Cela permet de toujours garder une classe non altérée de chaque personnage et d'y refaire appelle.
    cloner() {
    if (this instanceof Guerrier) {
        return new Guerrier(this.nom, this.pv, this.force, this.agilite, this.defense);
    } else {
        return new Personnage(this.nom, this.pv, this.force, this.agilite, this.defense);
    }
}

// Génère un nombre aléatoire entre 1 et 6 (inclus)
    lancerDes() {
        return Math.floor(Math.random() * 6) + 1;
    }

// fonction d'attaque de base du joueur. on compare l'agilité pour savoir si l'attaque atteint sa cible, puis on lance la fonction attaquer(cible) 
    essayerAttaqueSimple(cible, vueInstance) {
    const jetAttaquant = this.agilite + this.lancerDes();
    const jetDefenseur = cible.agilite + cible.lancerDes();

    // console.log(`${this.nom} attaque ${cible.nom}!`);
    // console.log(`Jet d'agilité de ${this.nom}: ${jetAttaquant}`);
    // console.log(`Jet d'agilité de ${cible.nom}: ${jetDefenseur}`);

    // Met à jour la div 'htmlCombat' via l'instance Vue 
    vueInstance.htmlCombat = `${this.nom} attaque ${cible.nom}! <br>`;
    vueInstance.htmlCombat += `Jet d'agilité de ${this.nom}: ${jetAttaquant} <br>`;
    vueInstance.htmlCombat += `Jet d'agilité de ${cible.nom}: ${jetDefenseur} <br>`;

    if (jetAttaquant > jetDefenseur) {
        // Passe vueInstance pour synchroniser les PV
        this.attaquer(cible, vueInstance);
        // vueInstance.htmlCombat += `Il reste ${cible.pv} points de vie au ${cible.nom} <br>`;
    } else {
        console.log(`${this.nom} rate son attaque contre ${cible.nom}!`);
        vueInstance.htmlCombat += `${this.nom} rate son attaque contre ${cible.nom}!<br>`;
    }

    // Vérifie si le monstre a perdu avant de procéder à la contre-attaque
    if (cible.pv > 0) {
        // console.log(`${cible.nom} contre-attaque!`);
        vueInstance.htmlCombat += `${cible.nom} contre-attaque !!<br>`;

        cible.attaquer(this, vueInstance); // L'ennemi attaque le joueur

        // Vérifie les points de vie du joueur après la contre-attaque
        if (this.pv > 0) {
            // setTimeout(() => {
            //     vueInstance.htmlCombat += ` il vous reste ${this.pv} PV ! <br>`;
            // }, 1000);
            vueInstance.pv = this.pv;
        } else {
            // Si le joueur a perdu, met à jour l'état
            vueInstance.html = "Vous avez perdu";
            vueInstance.modeCombat = false;
            vueInstance.partieLancee = false;
        }
    } else {
        // Si l'ennemi est mort, termine le combat et le bouton pour passer les portes réapparait
        vueInstance.modeCombat = false;
    }
}
    essayerAttaqueBouclier(cible, vueInstance) {
        const jetAttaquant = this.agilite + this.lancerDes();
        const jetDefenseur = this.agilite + this.lancerDes();

        vueInstance.htmlCombat = `${this.nom} attaque ${cible.nom} ! <br>`;
        vueInstance.htmlCombat += `jet d'agilité de ${this.nom} : ${jetAttaquant} <br>`;
        vueInstance.htmlCombat += `jet d'agilité de ${cible.nom} : ${jetDefenseur} <br>`;

        if (jetAttaquant > jetDefenseur) {
            this.attaqueDuBouclier(cible, vueInstance);
        } else {
            vueInstance.htmlCombat += `${this.nom} rate de son coup de bouclier ${cible.nom} qui parvient à esquiver l'attaque <br>`;
        }

        if (cible.pv > 0) {
            vueInstance.htmlCombat += `${cible.nom} contre attaque !?!  `;
            cible.attaquer(this, vueInstance);
            if (this.pv > 0) {
                vueInstance.pv = this.pv;
            } else {
                vueInstance.htmlCombat = `Vous avez malheuresement succombé à vos blessures et avez perdu mais rien ne vous empêche de retenter l'aventure !`;
                vueInstance.partieLancee = false;
                vueInstance.modeCombat = false;
            }
        } else {
            vueInstance.modeCombat = false;
        }
}
    
   
}

class Guerrier extends Personnage {
   
}

// déclaration des personnages du jeu (différentes instances de la classe Personnage)
const prototypeJoueur_guerrier = new Guerrier("testGuerrier", 200, 30, 25, 25);
const prototypeGobelin = new Personnage("gobelin", 40, 22, 22, 22);
const protosquelette = new Personnage("squelette", 75, 21, 21, 21);
const protomagicien = new Personnage("magicien", 75, 23, 23, 23);
let gobelin = prototypeGobelin.cloner(); 
let joueur_guerrier = prototypeJoueur_guerrier.cloner();
let squelette = protosquelette.cloner();
let magicien = protomagicien.cloner();

// déclaration des méthodes de l'application, toutes les fonctions que l'on souhaite appeler de l'extérieur d'une intance de classe.
const app = Vue.createApp({
    data() {
        return {
            html: "Un petit JDR textuel pour m'entrainer à coder du JavaScript en Vue.JS.  Si une partie vous tente cliquez sur le bouton 'Nouvelle partie' pour commencer ou réinitialiser une partie. Amusez-vous bien ! =) ",
            htmlCombat: "texte combat test ",
            compteurAvancement: 0,
            joueur: joueur_guerrier,
            ennemi: gobelin,
            modeCombat: false,
            partieLancee : false,
            text: " ",
            pv: 200,
            sacVisible: false,
            potion: false,
            corde: false,
            lanterne: false,
        };
    },
    
    methods: {













        showAndFadeCircles() {
            // Créer 3 cercles rouges à des positions aléatoires
            for (let i = 0; i < 3; i++) {
                const circle = document.createElement('div');
                circle.classList.add('redCircle');

                // Position aléatoire sur l'écran
                const randomX = Math.random() * (window.innerWidth - 50);
                const randomY = Math.random() * (window.innerHeight - 50);
                circle.style.left = `${randomX}px`;
                circle.style.top = `${randomY}px`;

                // Ajouter le cercle au document
                document.body.appendChild(circle);

                // Déclencher la descente et la disparition avec un délai
                setTimeout(() => {
                    circle.style.transform = 'translateY(100px)'; // Descend de 100 pixels
                    circle.style.opacity = '0'; // Disparition progressive
                }, 100); // Légère attente pour que les cercles apparaissent avant de commencer

                // Retirer le cercle du DOM après l'animation pour libérer de l'espace
                setTimeout(() => {
                    circle.remove();
                }, 4100); // 4s pour l'animation + 100ms de délai
            }
        },
        

















        reinitialiserEnnemis() {
        // Recrée chaque ennemi pour garantir leurs valeurs de base à chaque nouvelle partie
        return {
            gobelin: prototypeGobelin.cloner(),
            squelette: protosquelette.cloner(),
            magicien: protomagicien.cloner(),
        };
        },

        affichageSac() {
            this.sacVisible = !this.sacVisible; // Basculer entre visible/invisible
        },

        nouvellePartie() {
            this.html = " ",
            this.joueur = prototypeJoueur_guerrier.cloner();
            this.compteurAvancement = 0;
            this.ennemis = this.reinitialiserEnnemis(); // Initialise tous les ennemis

        // Configure le premier ennemi
            this.ennemi = this.ennemis.gobelin;
            this.html = "";
            this.htmlCombat = " ";
            this.modeCombat = false;
            this.partieLancee = true;
            this.salle0();
            this.pvJoueur = this.pv;
            this.pv = 200;
            this.potion = false;
            this.corde = false;
            this.lanterne = false;
        },

        lancerCombat() {
            this.modeCombat = true;
            this.htmlCombat += "Le combat commence contre " + this.ennemi.nom + " !<br>";
            // this.joueur.essayerAttaqueSimple(this.ennemi, this);  // Passe l'instance Vue ici
        },

        attaqueDeBase() {
            this.joueur.essayerAttaqueSimple(this.ennemi, this);  // Passe l'instance Vue ici aussi
        },

        attaqueBouclier() {
            this.joueur.essayerAttaqueBouclier(this.ennemi, this);
        },

        compteurSalle() {
            this.compteurAvancement++;
            this.passerSalle();
            this.htmlCombat = " "; 
            // cela permet d'effacer le texte de combat en passant d'une salle à l'autre
        },

        passerSalle() {
            switch (this.compteurAvancement) {
                case 0:
                    this.salle0();
                    break;
                case 1:
                    this.salle1();
                    break;
                case 2:
                    this.salle2();
                    break;                
                case 3:
                    this.salle3();
                    break;
                case 4:
                    this.salle4();
                    break;
                case 5:
                    this.salle5();
                    break;
                case 6:
                    this.salle6();
                    break;
                case 7:
                    this.salle7();
                    break;
                case 8:
                    this.salle8();
                    break;
                
                default:
                    console.log('Traitement par défaut');
                    break;
            }
        },

        salle0() {
            this.html = "Vous vous réveillez dans une cage et désarmé tandis que des torches éclairent faiblement la piece de leurs ombres lugubres. Un simple regard autour de vous trahi les ambitions hostiles de votre tortionnaire à votre regard. Peu importe qui vous a ammené là , vous devez vous enfuir! En constatant la rouille qui a rongé certains barreaux vous les frappez de toute vos forces. C'est alors qu'après le 3eme coup, votre coeur s'embale en entendant les barres tomber au sol. Vous pouvez sortir de la cage et de cet endroit effroyable !";
            this.html += this.text;
            // console.log(joueur_guerrier instanceof Guerrier);  // Doit afficher true
            // console.log(typeof joueur_guerrier.essayerAttaqueSimple);  // Doit afficher 'function'
            // console.log(this.ennemi instanceof Personnage);
        },
                
        salle1() {
            this.html = "Vous passez la porte et etes surpris de la quantité d'armes qui vous entourent, il doit s'agir de l'armurerie ! Sans tardez vous récupérez une épée et un bouclier. En prenant le bouclier vous faites tomber une rangée d'armes et d'objet metalliques dans un grand fracas. Alors que vous realisez l'erreur que vous venez de commettre vous entendez des bruits de pas au loin. Le temps presse et vous courrez vers la seule porte au fond de la salle";
            this.html += this.text;
        },
        
        salle2() {
            this.html = "Alors que la porte se referme derriere vous, vous entendez un ricanement à votre gauche : Jamais tu ne sortiras d'ici. Du coin de l'oeil vous comprenez que la forme aux oreilles pointues et à la peau verte est un gobelin. En reculant d'un pas vous vous mettez face à la creature qui lance sa dague d'une main à l'autre. ";
            this.html += this.text;
            this.lancerCombat();
        },

        salle3() {
            this.html = "A peine la creature lâcha son dernier soupir que vous entendez d'autres de ses congénaires dont les pas résonnent dans les murs. Vous parcourez la piece à la recherche d'une sortie et l'espace d'un instant vous retournez vers là où vous est apparue la créature. Un petit passage semble se dessiner dans le coin où se tenait le gobelin. Alors que vous vous précépitez dans le passage de la porte vous manquez de vous tomber dans l'escalier étroit qui semble descendre.";
            this.html += this.text;
            this.lanterne = true;

        },

        salle4() {
            this.html = "vous trébuchez et vous retrouvez à terre à l'entrée d'une cave délabrée dont les odeurs de moisissures vous donne la nausée. toutefois un couloir de l'autre côté de la piece. En evitant de glisser sur le sol humide vous parvenez à vous faufiler vers ce qui semble être l'entrée d'un couloir.";
            this.html += this.text;
            this.potion = true;

        },

        salle5() {
            this.html = "Vous vous engouffrez dans le couloir qui ouvre vers un dédale où l'odeur de pourriture se fait inssuportable. Alors même que vous décidez de revenir sur vos pas, vous entendez un cliqueti irrégulier venir de derriere vous. Au bout de quelques instant il vous semble dicerner des bandelettes flottantes. Vous realisez qu'il s'agit d'ossements animés par une force inconnue. Des ossements tranchants recouvrent la créature qui se dirige déjà vers vous.";
            this.html += this.text;
            this.ennemi = this.ennemis.squelette;
            this.lancerCombat();
            // console.log(this.ennemi.nom);
        },

        salle6() {
            this.html = "Les ossements retombés au sol semblent avoir été libérés du sort qui les maintenait animés. Reprenant votre chemin, vous realisez que vous êtes grievement blessez. La paroi se fait terreuse et le sol inégal. Votre vue se trouble à mesure que vos pas se font difficiles. Une lumière devant vous semble représentez votre dernier espoir de survivre.";
            this.html += this.text;
            this.corde = true;

        },

        salle7() {
            this.html = "La lumière n'était pas un délire, elle semble venir d'une caverne au bout du dédalle. Au moment où vous y entrez vous voyez un être décharné mais dont les yeux brillent dans la lumiere des torches et qui se retourne désormais sur vous. Ses mains commencent à crépiter d'une énergie étrangement violette et bleu.";
            this.html += this.text;
            this.ennemi = this.ennemis.magicien;
            this.lancerCombat();
            this.potion = false;

        },

        salle8() {
            this.html = "Malgré votre acharnement vous finissez par lâcher votre arme qui tombe à vos pied. Vous tombez à votre tour, vos dernières forces vous quittes. Votre vue se trouble et les sons se font de plus en plus lointains. Mais quelques instants plus tard , la créature murmure quelque chose à votre oreille. Sans en avoir conscience, le regard vide, vous vous relevez tandis que la chose retourne à ses occupations. La créatures semble vous avoir dès lors accueilli à son service pour le reste de votre éternité...";
            this.html += this.text;
        },
        
    mounted() {
        this.passerSalle();
    }
    }
});
app.mount('#app');
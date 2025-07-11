
-- Suppression des tables existantes
DROP TABLE IF EXISTS Adherent CASCADE;
DROP TABLE IF EXISTS Intervenant CASCADE;
DROP TABLE IF EXISTS Cours CASCADE;
DROP TABLE IF EXISTS Seance CASCADE;
DROP TABLE IF EXISTS Competition CASCADE;
DROP TABLE IF EXISTS SousCategorie CASCADE;
DROP TABLE IF EXISTS Planning CASCADE;
DROP TABLE IF EXISTS Resultat CASCADE;
DROP TABLE IF EXISTS Presence CASCADE;
DROP TABLE IF EXISTS Utilisateurs CASCADE;

-- Création de la table Lieu
CREATE TABLE Lieu (
    Lieu INT PRIMARY KEY,
    Nom_Lieu VARCHAR(255) NOT NULL
);

-- Création de la table Adhérent
CREATE TABLE Adherent (
    ID_Adherent INT PRIMARY KEY,
    Nom VARCHAR(255) NOT NULL,
    Prenom VARCHAR(255) NOT NULL,
    Sexe VARCHAR(1) NOT NULL,
    Age INT
);

-- Création de la table Cours
CREATE TABLE Cours (
    ID_cours INT PRIMARY KEY,
    nom_Activite VARCHAR(255) NOT NULL
);

-- Création de la table Seance
CREATE TABLE Seance (
    ID_Seance INT PRIMARY KEY,
    Lieu INT,
    ID_cours INT,
    FOREIGN KEY (ID_cours) REFERENCES Cours(ID_cours),
    FOREIGN KEY (Lieu) REFERENCES Lieu(Lieu)
);

-- Création de la table Intervenant
CREATE TABLE Intervenant (
    ID_Seance INT PRIMARY KEY,
    Nom VARCHAR(255) NOT NULL,
    Prenom VARCHAR(255) NOT NULL,
    FOREIGN KEY (ID_Seance) REFERENCES Seance(ID_Seance)
);

-- Création de la table Competition
CREATE TABLE Competition (
    NomCompetition VARCHAR(255) PRIMARY KEY,
    Lieu INT,
    Date DATE,
    Categorie VARCHAR(255),
    FOREIGN KEY (Lieu) REFERENCES Lieu(Lieu)
);

-- Création de la table Planning
CREATE TABLE Planning (
    ID_Seance INT,
    Jour VARCHAR(255) NOT NULL,
    Heure VARCHAR(255) NOT NULL,
    PRIMARY KEY (ID_Seance, Jour),
    FOREIGN KEY (ID_Seance) REFERENCES Seance(ID_Seance)
);

-- Création de la table Resultat
CREATE TABLE Resultat (
    Score INT,
    ID_Adherent INT,
    NomCompetition VARCHAR(255),
    PRIMARY KEY (ID_Adherent, NomCompetition),
    FOREIGN KEY (ID_Adherent) REFERENCES Adherent(ID_Adherent),
    FOREIGN KEY (NomCompetition) REFERENCES Competition(NomCompetition)
);

-- Table pour enregistrer la présence des adhérents à chaque séance
CREATE TABLE Presence (
    ID_Presence SERIAL PRIMARY KEY,
    ID_Adherent INT REFERENCES Adherent(ID_Adherent),
    ID_Seance INT REFERENCES Seance(ID_Seance),
    EstPresent BOOLEAN,
    EstAbsent BOOLEAN
);

CREATE TABLE Utilisateurs (
    ID_Utilisateur INT PRIMARY KEY,
    NomUtilisateur VARCHAR(255) NOT NULL,
    MotDePasse VARCHAR(255) NOT NULL,
    Type_Utilisateur VARCHAR(255) NOT NULL
);

INSERT INTO Lieu (Lieu, Nom_Lieu) VALUES
(56, 'Stade Municipal'),
(45, 'Piscine Olympique'),
(81, 'Centre Sportif'),
(42, 'Salle de Gym'),
(13, 'Yoga Studio');

INSERT INTO Cours (ID_cours, nom_Activite) VALUES
(1, 'Course à Pied'),
(2, 'Natation'),
(3, 'Triathlon'),
(4, 'Gymnastique'),
(5, 'Stretching');

INSERT INTO Seance (ID_Seance, Lieu, ID_cours) VALUES
(1, 56, 1), -- Course à Pied au Stade Municipal
(2, 56, 1),
(3, 45, 2),-- Natation à la Piscine Olympique
(4, 45, 2),
(5, 81, 3), -- Triathlon au Centre Sportif
(6, 81, 3),
(7, 42, 4), -- Gymnastique à la Salle de Gym
(8, 42, 4),
(9, 13, 5), -- Stretching au Yoga Studio
(10, 13, 5);

INSERT INTO Adherent (ID_Adherent, Nom, Prenom, Sexe, Age) VALUES
(1, 'Smith', 'John', 'M', 25),
(2, 'Bouvier', 'Matiyou', 'F', 20),
(3, 'Cristanio', 'Ronaldo', 'M', 22),
(4, 'Khatrani', 'Emmenne', 'F', 28),
(5, 'Brown', 'Daniel', 'M', 23),
(6, 'Davis', 'Olivia', 'F', 29),
(7, 'LaMort', 'Ethan', 'M', 27),
(8, 'Sulek', 'Sam', 'F', 26),
(9, 'Tchetche', 'Matthew', 'M', 21),
(10, 'Tyson', 'Mike', 'M', 24),
(11, 'Zidane', 'Zinedine', 'M', 22),
(12, 'Lenine', 'Ahemdou', 'M', 23),
(13, 'Jackson', 'Lily', 'F', 28),
(14, 'Vantorre', 'Francois', 'M', 20),
(15, 'Balanciaga', 'Chloe', 'F', 23);

INSERT INTO Intervenant (ID_Seance, Nom, Prenom) VALUES
(1, 'Smith', 'Alice'),
(2, 'Jones', 'Bob'),
(3, 'Labis', 'Leane'),
(4, 'Jdaiaa', 'Youssef'),
(5, 'Brown', 'Grace'),
(6, 'Taylor', 'John'),
(7, 'Davis', 'Sophia'),
(8, 'Moore', 'Ethan'),
(9, 'Elerhabiye', 'Reda'),
(10, 'Martin', 'Olivia');

INSERT INTO Competition (NomCompetition, Lieu, Date, Categorie) VALUES
('RunExpress 10K', 56, '2023-05-15', 'Course à Pied'),
('SpeedChallenge 20K', 56, '2023-06-20', 'Course à Pied'),
('SprintFiesta', 56, '2023-07-25', 'Course à Pied'),
('EnduranceFest', 56, '2023-09-10', 'Course à Pied'),
('TriSpeed Thrill', 81, '2023-08-05', 'Triathlon'),
('TriUltimate Challenge', 81, '2023-09-15', 'Triathlon'),
('ExtremeTri Adventure', 81, '2023-10-20', 'Triathlon');

INSERT INTO Planning (ID_Seance, Jour, Heure) VALUES
(1, 'Lundi', '18:00'),
(2, 'Mardi', '17:00'),
(3, 'Mardi', '19:00'),
(4, 'Jeudi', '16:00'),
(5, 'Mercredi', '17:00'),
(6, 'Vendredi', '17:30'),
(7, 'Jeudi', '20:00'),
(8, 'Lundi', '18:15'),
(9, 'Vendredi', '18:30'),
(10, 'Mercredi', '18:30');

INSERT INTO Resultat (Score, ID_Adherent, NomCompetition) VALUES
(15, 1, 'RunExpress 10K'),
(17, 2, 'RunExpress 10K'),
(20, 3, 'RunExpress 10K'),
(18, 4, 'SpeedChallenge 20K'),
(20, 5, 'SpeedChallenge 20K'),
(19, 6, 'SpeedChallenge 20K'),
(16, 7, 'SprintFiesta'),
(18, 8, 'SprintFiesta'),
(17, 9, 'SprintFiesta'),
(14, 10, 'EnduranceFest'),
(16, 11, 'EnduranceFest'),
(15, 12, 'EnduranceFest'),
(12, 13, 'TriSpeed Thrill'),
(15, 14, 'TriSpeed Thrill'),
(14, 15, 'TriSpeed Thrill');

INSERT INTO Presence (ID_Presence,ID_Adherent,ID_Seance,EstPresent) VALUES
(1,2,2,TRUE);

INSERT INTO Utilisateurs(ID_Utilisateur,NomUtilisateur,MotDePasse,Type_Utilisateur) VALUES
(1,'mbouvier','postgres','adherent'),
(2,'yjdaiaa','postgres','admin'),
(3,'izarouri','postgres','admin');

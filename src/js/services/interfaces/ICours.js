export class ICours {
    id;
    libelle;
    dateCours;
    heureDebut;
    heureFin;
    professeurId;
    classeId;
    statut;
    seances;
}

export class ISeance {
    id;
    coursId;
    date;
    statut; // planifié, en_cours, terminé
    absences;
}

export class IAbsence {
    id;
    seanceId;
    etudiantId;
    justification;
    dateAbs;
    statut; // justifié, non_justifié
}

export class IEtudiant {
    id;
    matricule;
    nomComplet;
    adresse;
    login;
    mdp;
    photo;
    classeId;
}

export class IProfesseur {
    id;
    nom;
    prenom;
    grade;
    specialite;
    photo;
} 
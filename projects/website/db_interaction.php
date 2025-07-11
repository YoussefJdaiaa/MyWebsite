
<?php
/**
 * Exemple d'interaction avec la base de données - Association Sportive
 * Database Interaction Example - Sports Association
 * 
 * Ce fichier démontre les principales fonctionnalités d'interaction avec la base de données
 * This file demonstrates the main database interaction functionalities
 */

// Configuration de la base de données / Database configuration
class DatabaseConfig {
    private const HOST = 'localhost';
    private const DB_NAME = 'association_sportive';
    private const USERNAME = 'root';
    private const PASSWORD = '';
    
    public static function getConnection() {
        try {
            $dsn = "mysql:host=" . self::HOST . ";dbname=" . self::DB_NAME . ";charset=utf8mb4";
            $pdo = new PDO($dsn, self::USERNAME, self::PASSWORD);
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
            return $pdo;
        } catch (PDOException $e) {
            throw new Exception("Erreur de connexion à la base de données: " . $e->getMessage());
        }
    }
}

// Classe de gestion des membres / Member management class
class MemberManager {
    private $pdo;
    
    public function __construct() {
        $this->pdo = DatabaseConfig::getConnection();
    }
    
    /**
     * Ajouter un nouveau membre / Add a new member
     */
    public function addMember($data) {
        $sql = "INSERT INTO membres (nom, prenom, email, telephone, date_naissance, adresse, date_inscription) 
                VALUES (:nom, :prenom, :email, :telephone, :date_naissance, :adresse, :date_inscription)";
        
        $stmt = $this->pdo->prepare($sql);
        return $stmt->execute([
            ':nom' => $data['nom'],
            ':prenom' => $data['prenom'],
            ':email' => $data['email'],
            ':telephone' => $data['telephone'],
            ':date_naissance' => $data['date_naissance'],
            ':adresse' => $data['adresse'],
            ':date_inscription' => date('Y-m-d')
        ]);
    }
    
    /**
     * Récupérer tous les membres / Get all members
     */
    public function getAllMembers() {
        $sql = "SELECT m.*, COUNT(i.id) as nb_activites 
                FROM membres m 
                LEFT JOIN inscriptions i ON m.id = i.membre_id 
                WHERE m.statut = 'actif'
                GROUP BY m.id 
                ORDER BY m.nom, m.prenom";
        
        $stmt = $this->pdo->query($sql);
        return $stmt->fetchAll();
    }
    
    /**
     * Rechercher des membres / Search members
     */
    public function searchMembers($searchTerm) {
        $sql = "SELECT * FROM membres 
                WHERE (nom LIKE :search OR prenom LIKE :search OR email LIKE :search) 
                AND statut = 'actif'
                ORDER BY nom, prenom";
        
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([':search' => "%$searchTerm%"]);
        return $stmt->fetchAll();
    }
    
    /**
     * Mettre à jour un membre / Update a member
     */
    public function updateMember($id, $data) {
        $sql = "UPDATE membres SET 
                nom = :nom, prenom = :prenom, email = :email, 
                telephone = :telephone, adresse = :adresse 
                WHERE id = :id";
        
        $stmt = $this->pdo->prepare($sql);
        return $stmt->execute([
            ':id' => $id,
            ':nom' => $data['nom'],
            ':prenom' => $data['prenom'],
            ':email' => $data['email'],
            ':telephone' => $data['telephone'],
            ':adresse' => $data['adresse']
        ]);
    }
}

// Classe de gestion des activités / Activity management class
class ActivityManager {
    private $pdo;
    
    public function __construct() {
        $this->pdo = DatabaseConfig::getConnection();
    }
    
    /**
     * Inscrire un membre à une activité / Register a member to an activity
     */
    public function registerMemberToActivity($membreId, $activiteId) {
        // Vérifier si déjà inscrit / Check if already registered
        $checkSql = "SELECT COUNT(*) FROM inscriptions WHERE membre_id = :membre_id AND activite_id = :activite_id";
        $checkStmt = $this->pdo->prepare($checkSql);
        $checkStmt->execute([':membre_id' => $membreId, ':activite_id' => $activiteId]);
        
        if ($checkStmt->fetchColumn() > 0) {
            throw new Exception("Le membre est déjà inscrit à cette activité");
        }
        
        $sql = "INSERT INTO inscriptions (membre_id, activite_id, date_inscription, statut) 
                VALUES (:membre_id, :activite_id, :date_inscription, 'active')";
        
        $stmt = $this->pdo->prepare($sql);
        return $stmt->execute([
            ':membre_id' => $membreId,
            ':activite_id' => $activiteId,
            ':date_inscription' => date('Y-m-d')
        ]);
    }
    
    /**
     * Obtenir les activités d'un membre / Get member's activities
     */
    public function getMemberActivities($membreId) {
        $sql = "SELECT a.nom, a.description, a.tarif, i.date_inscription 
                FROM activites a 
                INNER JOIN inscriptions i ON a.id = i.activite_id 
                WHERE i.membre_id = :membre_id AND i.statut = 'active'
                ORDER BY a.nom";
        
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([':membre_id' => $membreId]);
        return $stmt->fetchAll();
    }
    
    /**
     * Statistiques des activités / Activity statistics
     */
    public function getActivityStats() {
        $sql = "SELECT a.nom, COUNT(i.id) as nb_inscrits, a.tarif 
                FROM activites a 
                LEFT JOIN inscriptions i ON a.id = i.activite_id AND i.statut = 'active'
                GROUP BY a.id 
                ORDER BY nb_inscrits DESC";
        
        $stmt = $this->pdo->query($sql);
        return $stmt->fetchAll();
    }
}

// Classe de gestion des paiements / Payment management class
class PaymentManager {
    private $pdo;
    
    public function __construct() {
        $this->pdo = DatabaseConfig::getConnection();
    }
    
    /**
     * Enregistrer un paiement / Record a payment
     */
    public function recordPayment($membreId, $montant, $type, $description = '') {
        $sql = "INSERT INTO paiements (membre_id, montant, type_paiement, description, date_paiement, statut) 
                VALUES (:membre_id, :montant, :type_paiement, :description, :date_paiement, 'valide')";
        
        $stmt = $this->pdo->prepare($sql);
        return $stmt->execute([
            ':membre_id' => $membreId,
            ':montant' => $montant,
            ':type_paiement' => $type,
            ':description' => $description,
            ':date_paiement' => date('Y-m-d H:i:s')
        ]);
    }
    
    /**
     * Rapport financier mensuel / Monthly financial report
     */
    public function getMonthlyReport($year, $month) {
        $sql = "SELECT 
                    COUNT(*) as nb_paiements,
                    SUM(montant) as total_revenus,
                    AVG(montant) as montant_moyen,
                    type_paiement
                FROM paiements 
                WHERE YEAR(date_paiement) = :year 
                AND MONTH(date_paiement) = :month 
                AND statut = 'valide'
                GROUP BY type_paiement";
        
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([':year' => $year, ':month' => $month]);
        return $stmt->fetchAll();
    }
}

// Script de création des tables / Table creation script
class DatabaseSetup {
    private $pdo;
    
    public function __construct() {
        $this->pdo = DatabaseConfig::getConnection();
    }
    
    /**
     * Créer toutes les tables / Create all tables
     */
    public function createTables() {
        $tables = [
            'membres' => "
                CREATE TABLE IF NOT EXISTS membres (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    nom VARCHAR(100) NOT NULL,
                    prenom VARCHAR(100) NOT NULL,
                    email VARCHAR(150) UNIQUE NOT NULL,
                    telephone VARCHAR(20),
                    date_naissance DATE,
                    adresse TEXT,
                    date_inscription DATE NOT NULL,
                    statut ENUM('actif', 'inactif', 'suspendu') DEFAULT 'actif',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",
            
            'activites' => "
                CREATE TABLE IF NOT EXISTS activites (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    nom VARCHAR(100) NOT NULL,
                    description TEXT,
                    tarif DECIMAL(10,2) NOT NULL,
                    capacite_max INT,
                    horaires TEXT,
                    lieu VARCHAR(200),
                    statut ENUM('active', 'inactive') DEFAULT 'active',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",
            
            'inscriptions' => "
                CREATE TABLE IF NOT EXISTS inscriptions (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    membre_id INT NOT NULL,
                    activite_id INT NOT NULL,
                    date_inscription DATE NOT NULL,
                    statut ENUM('active', 'inactive', 'annulee') DEFAULT 'active',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (membre_id) REFERENCES membres(id) ON DELETE CASCADE,
                    FOREIGN KEY (activite_id) REFERENCES activites(id) ON DELETE CASCADE,
                    UNIQUE KEY unique_inscription (membre_id, activite_id)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",
            
            'paiements' => "
                CREATE TABLE IF NOT EXISTS paiements (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    membre_id INT NOT NULL,
                    montant DECIMAL(10,2) NOT NULL,
                    type_paiement ENUM('cotisation', 'inscription', 'evenement', 'autre') NOT NULL,
                    description TEXT,
                    date_paiement DATETIME NOT NULL,
                    statut ENUM('valide', 'en_attente', 'annule') DEFAULT 'valide',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (membre_id) REFERENCES membres(id) ON DELETE CASCADE
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4"
        ];
        
        foreach ($tables as $tableName => $sql) {
            try {
                $this->pdo->exec($sql);
                echo "Table '$tableName' créée avec succès.\n";
            } catch (PDOException $e) {
                echo "Erreur lors de la création de la table '$tableName': " . $e->getMessage() . "\n";
            }
        }
    }
}

// Exemple d'utilisation / Usage example
try {
    // Initialiser les gestionnaires / Initialize managers
    $memberManager = new MemberManager();
    $activityManager = new ActivityManager();
    $paymentManager = new PaymentManager();
    
    // Exemples d'opérations / Operation examples
    echo "=== Système de Gestion d'Association Sportive ===\n\n";
    
    // Afficher les statistiques / Display statistics
    echo "Statistiques des activités:\n";
    $stats = $activityManager->getActivityStats();
    foreach ($stats as $stat) {
        echo "- {$stat['nom']}: {$stat['nb_inscrits']} inscrits (Tarif: {$stat['tarif']}€)\n";
    }
    
} catch (Exception $e) {
    echo "Erreur: " . $e->getMessage() . "\n";
}

/**
 * Notes de sécurité importantes / Important security notes:
 * 
 * 1. Utilisation de requêtes préparées pour éviter les injections SQL
 * 2. Validation des données côté serveur
 * 3. Hachage des mots de passe avec password_hash() et password_verify()
 * 4. Sessions sécurisées avec regeneration d'ID
 * 5. Protection CSRF avec des tokens
 * 6. Validation et nettoyage des entrées utilisateur
 * 7. Logs d'audit pour traçabilité
 * 8. Sauvegarde régulière des données
 */
?>


<?php
session_start();
include '../config/database.php';

// Vérification admin (simple)
if (!isset($_SESSION['admin']) || !$_SESSION['admin']) {
    header('Location: login.php');
    exit;
}

// Statistiques
$stats = [];
$stats['membres'] = $pdo->query("SELECT COUNT(*) FROM membres WHERE statut = 'actif'")->fetchColumn();
$stats['activites'] = $pdo->query("SELECT COUNT(*) FROM activites WHERE statut = 'active'")->fetchColumn();
$stats['inscriptions'] = $pdo->query("SELECT COUNT(*) FROM inscriptions WHERE statut = 'active'")->fetchColumn();
$stats['revenus'] = $pdo->query("SELECT SUM(montant) FROM paiements WHERE statut = 'valide'")->fetchColumn();
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard Admin - Association Sportive</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="../assets/css/admin.css">
</head>
<body>
    <div class="container-fluid">
        <div class="row">
            <nav class="col-md-2 d-none d-md-block bg-light sidebar">
                <div class="sidebar-sticky">
                    <h5 class="p-3">Admin Panel</h5>
                    <ul class="nav flex-column">
                        <li class="nav-item">
                            <a class="nav-link active" href="dashboard.php">📊 Dashboard</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="membres.php">👥 Membres</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="activites.php">🏃 Activités</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="paiements.php">💰 Paiements</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="../index.php">🏠 Retour au site</a>
                        </li>
                    </ul>
                </div>
            </nav>

            <main class="col-md-10 ml-sm-auto px-4">
                <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                    <h1 class="h2">Dashboard</h1>
                </div>

                <div class="row mb-4">
                    <div class="col-md-3">
                        <div class="card bg-primary text-white">
                            <div class="card-body">
                                <h5>Membres Actifs</h5>
                                <h2><?= $stats['membres'] ?></h2>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="card bg-success text-white">
                            <div class="card-body">
                                <h5>Activités</h5>
                                <h2><?= $stats['activites'] ?></h2>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="card bg-info text-white">
                            <div class="card-body">
                                <h5>Inscriptions</h5>
                                <h2><?= $stats['inscriptions'] ?></h2>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="card bg-warning text-white">
                            <div class="card-body">
                                <h5>Revenus</h5>
                                <h2><?= number_format($stats['revenus'], 2) ?>€</h2>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-6">
                        <div class="card">
                            <div class="card-header">
                                <h5>Derniers Membres Inscrits</h5>
                            </div>
                            <div class="card-body">
                                <?php
                                $derniers_membres = $pdo->query("SELECT nom, prenom, date_inscription FROM membres ORDER BY date_inscription DESC LIMIT 5")->fetchAll();
                                foreach($derniers_membres as $membre): ?>
                                    <div class="d-flex justify-content-between">
                                        <span><?= htmlspecialchars($membre['prenom'] . ' ' . $membre['nom']) ?></span>
                                        <small class="text-muted"><?= date('d/m/Y', strtotime($membre['date_inscription'])) ?></small>
                                    </div>
                                    <hr>
                                <?php endforeach; ?>
                            </div>
                        </div>
                    </div>
                    
                    <div class="col-md-6">
                        <div class="card">
                            <div class="card-header">
                                <h5>Activités les Plus Populaires</h5>
                            </div>
                            <div class="card-body">
                                <?php
                                $activites_populaires = $pdo->query("
                                    SELECT a.nom, COUNT(i.id) as nb_inscrits 
                                    FROM activites a 
                                    LEFT JOIN inscriptions i ON a.id = i.activite_id 
                                    GROUP BY a.id 
                                    ORDER BY nb_inscrits DESC 
                                    LIMIT 5
                                ")->fetchAll();
                                foreach($activites_populaires as $activite): ?>
                                    <div class="d-flex justify-content-between">
                                        <span><?= htmlspecialchars($activite['nom']) ?></span>
                                        <span class="badge bg-primary"><?= $activite['nb_inscrits'] ?></span>
                                    </div>
                                    <hr>
                                <?php endforeach; ?>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>

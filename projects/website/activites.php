
<?php
session_start();
include 'config/database.php';

if ($_POST && isset($_POST['activite_id'])) {
    if (!isset($_SESSION['user_id'])) {
        $_SESSION['error'] = "Vous devez être connecté pour vous inscrire à une activité.";
    } else {
        $activite_id = $_POST['activite_id'];
        $user_id = $_SESSION['user_id'];
        
        try {
            $stmt = $pdo->prepare("INSERT INTO inscriptions (membre_id, activite_id, date_inscription) VALUES (?, ?, NOW())");
            $stmt->execute([$user_id, $activite_id]);
            $_SESSION['success'] = "Inscription à l'activité réussie!";
        } catch(PDOException $e) {
            $_SESSION['error'] = "Vous êtes déjà inscrit à cette activité.";
        }
    }
}

$activites = $pdo->query("SELECT * FROM activites WHERE statut = 'active' ORDER BY nom")->fetchAll();
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Activités - Association Sportive</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
    <?php include 'includes/navbar.php'; ?>
    
    <div class="container py-5">
        <h1 class="text-center mb-5">Nos Activités</h1>
        
        <?php if(isset($_SESSION['success'])): ?>
            <div class="alert alert-success"><?= $_SESSION['success']; unset($_SESSION['success']); ?></div>
        <?php endif; ?>
        
        <?php if(isset($_SESSION['error'])): ?>
            <div class="alert alert-danger"><?= $_SESSION['error']; unset($_SESSION['error']); ?></div>
        <?php endif; ?>
        
        <div class="row">
            <?php foreach($activites as $activite): ?>
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="card h-100">
                    <div class="card-body">
                        <h5 class="card-title"><?= htmlspecialchars($activite['nom']) ?></h5>
                        <p class="card-text"><?= htmlspecialchars($activite['description']) ?></p>
                        <p class="text-muted">📍 <?= htmlspecialchars($activite['lieu']) ?></p>
                        <p class="text-muted">🕐 <?= htmlspecialchars($activite['horaires']) ?></p>
                        <p class="text-primary fw-bold fs-5"><?= $activite['tarif'] ?>€</p>
                        
                        <?php if($activite['capacite_max']): ?>
                            <?php
                            $stmt = $pdo->prepare("SELECT COUNT(*) as nb_inscrits FROM inscriptions WHERE activite_id = ? AND statut = 'active'");
                            $stmt->execute([$activite['id']]);
                            $nb_inscrits = $stmt->fetch()['nb_inscrits'];
                            ?>
                            <div class="progress mb-3">
                                <div class="progress-bar" style="width: <?= ($nb_inscrits / $activite['capacite_max']) * 100 ?>%"></div>
                            </div>
                            <small class="text-muted"><?= $nb_inscrits ?>/<?= $activite['capacite_max'] ?> places</small>
                        <?php endif; ?>
                    </div>
                    <div class="card-footer">
                        <form method="POST" class="d-grid">
                            <input type="hidden" name="activite_id" value="<?= $activite['id'] ?>">
                            <button type="submit" class="btn btn-primary">S'inscrire</button>
                        </form>
                    </div>
                </div>
            </div>
            <?php endforeach; ?>
        </div>
    </div>

    <?php include 'includes/footer.php'; ?>
    
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>

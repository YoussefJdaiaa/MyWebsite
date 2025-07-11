
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Association Sportive - Accueil</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
    <?php include 'includes/navbar.php'; ?>
    
    <div class="hero-section">
        <div class="container">
            <div class="row align-items-center">
                <div class="col-md-6">
                    <h1 class="display-4 fw-bold text-primary">Association Sportive</h1>
                    <p class="lead">Rejoignez notre communauté sportive et découvrez de nouvelles activités dans une ambiance conviviale.</p>
                    <a href="inscription.php" class="btn btn-primary btn-lg me-3">S'inscrire</a>
                    <a href="activites.php" class="btn btn-outline-primary btn-lg">Nos Activités</a>
                </div>
                <div class="col-md-6">
                    <img src="assets/images/sport-hero.jpg" alt="Sport" class="img-fluid rounded">
                </div>
            </div>
        </div>
    </div>

    <section class="py-5 bg-light">
        <div class="container">
            <h2 class="text-center mb-5">Nos Activités Populaires</h2>
            <div class="row">
                <?php
                include 'config/database.php';
                $stmt = $pdo->query("SELECT * FROM activites WHERE statut = 'active' LIMIT 3");
                while($activite = $stmt->fetch()): ?>
                <div class="col-md-4 mb-4">
                    <div class="card h-100">
                        <div class="card-body">
                            <h5 class="card-title"><?= htmlspecialchars($activite['nom']) ?></h5>
                            <p class="card-text"><?= htmlspecialchars($activite['description']) ?></p>
                            <p class="text-primary fw-bold"><?= $activite['tarif'] ?>€</p>
                        </div>
                    </div>
                </div>
                <?php endwhile; ?>
            </div>
        </div>
    </section>

    <?php include 'includes/footer.php'; ?>
    
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>

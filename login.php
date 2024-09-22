<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css" integrity="sha512-Kc323vGBEqzTmouAECnVceyQqyqdsSiqLQISBL29aUW4U/M7pSPA/gEUZQqv1cwx4OnYxTxve5UMg5GT6L4JJg==" crossorigin="anonymous" referrerpolicy="no-referrer" />
    <title>E-JeepPay Login</title>
    <link rel="stylesheet" href="./css/login.css">
</head>
<body>
    <div class="container">
        <!-- Left section -->
        <div class="welcome-section">
            <h1 style="padding-bottom: 70%;">Welcome to E-JeepPay!</h1>
        </div>

        <!-- Right section -->
        <div class="login-section">
            <div class="logo-container">
                <img src="img/logo-login.png" alt="Logo" class="logo" style="padding-bottom: 10px;">
            </div>
            <h2 style="margin-top: -20px;" style="font-family: Rubik, system-ui;">ADMIN LOGIN</h2>

            <?php if (isset($_GET['error'])): ?>
                <div style="color: red; text-align: center; font-weight:bolder; margin-bottom: 10px; box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;">
                Login failed. Check your credentials and try again.
                </div>
            <?php endif; ?>

            <form action="./php/checklogin.php" method="POST">
                <div class="input-container">
                    <i class="fas fa-user icon"></i>
                    <input type="text" name="email" placeholder="Email" required>
                </div>
                <div class="input-container">
                    <i class="fas fa-lock icon"></i>
                    <input type="password" name="password" placeholder="Password" required>
                    <i class="fas fa-eye-slash toggle-password"></i>
                </div>
                <input type="submit" class="login-button" value="LOGIN">
            </form>            
            <a href="#" class="forgot-password">Forget Password?</a>
        </div>
    </div>

    <script src="https://kit.fontawesome.com/a076d05399.js" crossorigin="anonymous"></script>

</body>
</html>
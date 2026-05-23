<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\HeroSectionController;
use App\Http\Controllers\Admin\ServiceSectionController;
use App\Http\Controllers\Admin\ProjectSectionController; // Import Controller Baru
use App\Http\Controllers\Admin\ContactSectionController;
use App\Http\Controllers\Admin\FooterSectionController;
use App\Http\Controllers\Admin\SkillsEducationController;
use App\Http\Controllers\HomeController;
use Illuminate\Support\Facades\Route;

Route::get('/', HomeController::class)->name('home');

Route::middleware(['auth', 'verified', \App\Http\Middleware\EnsureAdminRole::class])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    Route::prefix('admin')->name('admin.')->group(function () {
        Route::get('/', DashboardController::class)->name('dashboard');

        // Hero Section
        Route::get('hero', [HeroSectionController::class, 'edit'])->name('hero.edit');
        Route::patch('hero', [HeroSectionController::class, 'update'])->name('hero.update');

        // Services Section
        Route::get('services', [ServiceSectionController::class, 'edit'])->name('services.edit');
        Route::patch('services', [ServiceSectionController::class, 'update'])->name('services.update');

        // Projects Section Baru Terpisah
        Route::get('projects', [ProjectSectionController::class, 'edit'])->name('projects.edit');
        Route::patch('projects', [ProjectSectionController::class, 'update'])->name('projects.update');

        // Contact Section
        Route::get('contact', [ContactSectionController::class, 'edit'])->name('contact.edit');
        Route::patch('contact', [ContactSectionController::class, 'update'])->name('contact.update');

        // Footer Section
        Route::get('footer', [FooterSectionController::class, 'edit'])->name('footer.edit');
        Route::patch('footer', [FooterSectionController::class, 'update'])->name('footer.update');

        // Navbar Admin
        Route::get('navbar', [\App\Http\Controllers\Admin\NavbarController::class, 'edit'])->name('navbar.edit');
        Route::patch('navbar', [\App\Http\Controllers\Admin\NavbarController::class, 'update'])->name('navbar.update');

        Route::get('skills-educations', [SkillsEducationController::class, 'edit'])->name('skills_educations.edit');
        Route::patch('skills-educations', [SkillsEducationController::class, 'update'])->name('skills_educations.update');
        
        // Roles & Users
        Route::get('roles', [\App\Http\Controllers\Admin\RoleController::class, 'edit'])->name('roles.edit');
        Route::patch('roles', [\App\Http\Controllers\Admin\RoleController::class, 'update'])->name('roles.update');

        Route::get('users', [\App\Http\Controllers\Admin\UserController::class, 'edit'])->name('users.edit');
        Route::patch('users', [\App\Http\Controllers\Admin\UserController::class, 'update'])->name('users.update');
    });
});

require __DIR__ . '/settings.php';

<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\HeroSectionController;
use App\Http\Controllers\Admin\ServiceSectionController;
use App\Http\Controllers\Admin\ProjectSectionController; // Import Controller Baru
use App\Http\Controllers\Admin\ContactSectionController;
use App\Http\Controllers\Admin\FooterSectionController;
use App\Http\Controllers\Admin\SkillsEducationController;
use App\Http\Controllers\Admin\NavbarController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\WebsiteAppController;
use App\Http\Controllers\DesignPhotographyController;
use Illuminate\Support\Facades\Route;

Route::get('/', HomeController::class)->name('home');

// Public website / app gallery
Route::get('website-app', [WebsiteAppController::class, 'index'])->name('website-app.index');
Route::get('website-app/{website_app}', [WebsiteAppController::class, 'show'])->name('website-app.show');
Route::post('website-app', [WebsiteAppController::class, 'store'])->middleware('auth')->name('website-app.store');

// Design & Photography public pages
Route::get('design-photography', [DesignPhotographyController::class, 'index'])->name('design-photography.index');
Route::get('design-photography/design/{design}', [DesignPhotographyController::class, 'showDesign'])->name('design-photography.design.show');
Route::get('design-photography/photography/{photography}', [DesignPhotographyController::class, 'showPhotography'])->name('design-photography.photography.show');
Route::post('design-photography/design', [DesignPhotographyController::class, 'storeDesign'])->middleware('auth')->name('design-photography.design.store');
Route::post('design-photography/photography', [DesignPhotographyController::class, 'storePhotography'])->middleware('auth')->name('design-photography.photography.store');

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

        // Website & App Collection (Admin)
        Route::get('website-app', [\App\Http\Controllers\Admin\WebsiteAppController::class, 'edit'])->name('website-app.edit');
        Route::patch('website-app', [\App\Http\Controllers\Admin\WebsiteAppController::class, 'update'])->name('website-app.update');

        // Design & Photography Admin
        Route::get('design-photography', [\App\Http\Controllers\Admin\DesignPhotographyController::class, 'edit'])->name('design-photography.edit');
        Route::patch('design-photography', [\App\Http\Controllers\Admin\DesignPhotographyController::class, 'update'])->name('design-photography.update');

        // Contact Section
        Route::get('contact', [ContactSectionController::class, 'edit'])->name('contact.edit');
        Route::patch('contact', [ContactSectionController::class, 'update'])->name('contact.update');

        // Footer Section
        Route::get('footer', [FooterSectionController::class, 'edit'])->name('footer.edit');
        Route::patch('footer', [FooterSectionController::class, 'update'])->name('footer.update');

        // Navbar Admin
        Route::get('navbar', [NavbarController::class, 'edit'])->name('navbar.edit');
        Route::patch('navbar', [NavbarController::class, 'update'])->name('navbar.update');

        Route::get('skills-educations', [SkillsEducationController::class, 'edit'])->name('skills_educations.edit');
        Route::patch('skills-educations', [SkillsEducationController::class, 'update'])->name('skills_educations.update');
        
        // Roles & Users
        Route::get('roles', [RoleController::class, 'edit'])->name('roles.edit');
        Route::patch('roles', [RoleController::class, 'update'])->name('roles.update');

        Route::get('users', [UserController::class, 'edit'])->name('users.edit');
        Route::patch('users', [UserController::class, 'update'])->name('users.update');
    });
});

require __DIR__ . '/settings.php';

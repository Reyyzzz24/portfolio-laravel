<?php

use App\Models\HeroSection;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('guests cannot open admin panel', function () {
    $this->get(route('admin.dashboard'))
        ->assertRedirect(route('login'));
});

test('authenticated users can open admin panel', function () {
    $user = new User([
        'name' => 'Admin User',
        'email' => 'admin@example.com',
        'email_verified_at' => now(),
    ]);
    $user->id = 1;

    $this->actingAs($user)
        ->get(route('admin.dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/dashboard')
            ->where('sectionCount', 7),
        );
});

test('homepage receives hero content from the dedicated table', function () {
    HeroSection::query()->create([
        'eyebrow' => 'Welcome',
        'title' => 'Custom',
        'highlight' => 'Hero',
        'description' => 'Dedicated table content.',
        'button_label' => 'Contact',
        'button_href' => '#contact',
        'image' => 'images/custom.jpg',
        'image_alt' => 'Custom Hero',
    ]);

    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('homepage')
            ->where('portfolioContent.hero.title', 'Custom')
            ->where('portfolioContent.hero.highlight', 'Hero')
            ->where('portfolioContent.hero.image', 'images/custom.jpg'),
        );
});

test('guests cannot open portfolio content admin page', function () {
    $this->get(route('admin.portfolio-content.edit'))
        ->assertRedirect(route('login'));
});

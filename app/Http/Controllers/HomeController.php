<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use App\Models\ContactSection;
use App\Models\Education;
use App\Models\Footer;
use App\Models\HeroSection;
use App\Models\Navbar;
use App\Models\Project;
use App\Models\ResumeSection;
use App\Models\Service;
use App\Models\Skill;
use App\Models\ProjectSection;
use App\Models\ServiceSection;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('homepage', [
            'navbar'    => Navbar::orderBy('display_order')->get(),
            'hero'      => HeroSection::first(),
                'services'  => (function () {
                    $services = Service::orderBy('display_order')->get();
                    $section = ServiceSection::query()->first();

                    return [
                        'eyebrow' => $section?->section_eyebrow ?? ($services->first()?->section_eyebrow ?? ''),
                        'title' => $section?->section_title ?? ($services->first()?->section_title ?? ''),
                        'items' => $services->map(fn($s) => [
                            'title' => $s->title,
                            'description' => $s->description,
                            'color' => $s->color,
                            'iconPath' => $s->icon_path,
                        ])->values()->all(),
                    ];
                })(),

                'projects'  => (function () {
                    $projects = Project::orderBy('display_order')->get();
                    $section = ProjectSection::query()->first();

                    return [
                        'eyebrow' => $section?->section_eyebrow ?? ($projects->first()?->section_eyebrow ?? ''),
                        'title' => $section?->section_title ?? ($projects->first()?->section_title ?? ''),
                        'items' => $projects->map(fn($p) => [
                            'title' => $p->title,
                            'image' => $p->image,
                            'imageAlt' => $p->image_alt,
                            'tags' => $p->tags,
                            'description' => $p->description,
                            'link' => $p->link,
                            'isExternal' => (bool)$p->is_external,
                        ])->values()->all(),
                    ];
                })(),
            'contact'   => (function () {
                $contacts = Contact::orderBy('display_order')->get();
                $section = ContactSection::query()->first();

                return [
                    'eyebrow' => $section?->section_eyebrow ?? ($contacts->first()?->section_eyebrow ?? 'Get In Touch'),
                    'title' => $section?->section_title ?? ($contacts->first()?->section_title ?? "Let's work together"),
                    'formAction' => $section?->form_action ?? ($contacts->first()?->form_action ?? '#'),
                    'submitLabel' => $section?->submit_label ?? ($contacts->first()?->submit_label ?? 'Send Message'),
                    'items' => $contacts->map(fn(Contact $c) => [
                        'label' => $c->label,
                        'value' => $c->value,
                        'href' => $c->href,
                        'iconPath' => $c->icon_path,
                    ])->values()->all(),
                ];
            })(),
            'footer'    => Footer::orderBy('display_order')->get(),
            'section'   => ResumeSection::first(),
            'skills'    => Skill::orderBy('display_order')->get(),
            'education' => Education::orderBy('display_order')->get(),
        ]);
    }
}
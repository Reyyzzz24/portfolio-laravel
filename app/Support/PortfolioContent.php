<?php

namespace App\Support;

use App\Models\Contact;
use App\Models\Footer;
use App\Models\HeroSection;
use App\Models\Navbar;
use App\Models\Project;
use App\Models\Service;
use App\Models\Skill;
use App\Models\Education;
use App\Models\ResumeSection;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;

class PortfolioContent
{
    /**
     * @return array<string, mixed>
     */
    public static function forFrontend(): array
    {
        static::seedDefaults();

        $navbarItems = Navbar::query()->orderBy('display_order')->get();
        $navbarSettings = $navbarItems->first();
        $hero = HeroSection::query()->firstOrFail();
        $services = Service::query()->orderBy('display_order')->get();
        $projects = Project::query()->orderBy('display_order')->get();
        
        // Membaca dari tabel yang sudah terpisah
        $resumeSection = ResumeSection::query()->first();
        $skills = Skill::query()->orderBy('display_order')->get();
        $education = Education::query()->orderBy('display_order')->get();

        $contacts = Contact::query()->orderBy('display_order')->get();
        $contactSettings = $contacts->first();
        $footers = Footer::query()->orderBy('display_order')->get();
        $footerSettings = $footers->first();

        return [
            'navbar' => [
                'brand' => $navbarSettings?->brand ?? 'RY',
                'links' => static::navigationLinks($navbarItems, 'link'),
                'resumeLabel' => $navbarSettings?->resume_label ?? 'Resume',
                'documentsLabel' => $navbarSettings?->documents_label ?? 'Documents',
                'resumeLinks' => static::navigationLinks($navbarItems, 'resume'),
            ],
            'hero' => [
                'eyebrow' => $hero->eyebrow,
                'title' => $hero->title,
                'highlight' => $hero->highlight,
                'description' => $hero->description,
                'buttonLabel' => $hero->button_label,
                'buttonHref' => $hero->button_href,
                'image' => $hero->image,
                'imageAlt' => $hero->image_alt,
            ],
            'services' => [
                'eyebrow' => $services->first()?->section_eyebrow ?? 'Services',
                'title' => $services->first()?->section_title ?? 'Specialized In',
                'items' => $services->map(fn (Service $service): array => [
                    'title' => $service->title,
                    'description' => $service->description,
                    'color' => $service->color,
                    'iconPath' => $service->icon_path,
                ])->values()->all(),
            ],
            'projects' => [
                'eyebrow' => $projects->first()?->section_eyebrow ?? 'My Works',
                'title' => $projects->first()?->section_title ?? 'Featured Portfolios',
                'items' => $projects->map(fn (Project $project): array => [
                    'title' => $project->title,
                    'image' => $project->image,
                    'imageAlt' => $project->image_alt,
                    'tags' => static::tags($project->tags),
                    'description' => $project->description,
                    'link' => $project->link,
                    'isExternal' => $project->is_external,
                ])->values()->all(),
            ],
            // Struktur baru yang disesuaikan dengan kebutuhan React Component Anda
            'skills' => [
                'section' => $resumeSection ? [
                    'section_eyebrow' => $resumeSection->section_eyebrow,
                    'section_title' => $resumeSection->section_title,
                    'section_description' => $resumeSection->section_description,
                ] : null,
                'education' => $education->map(fn (Education $edu): array => [
                    'id' => $edu->id,
                    'institution' => $edu->institution,
                    'degree' => $edu->degree,
                    'period' => $edu->period,
                    'is_current' => $edu->is_current,
                ])->values()->all(),
                'items' => $skills->map(fn (Skill $skill): array => [
                    'id' => $skill->id,
                    'name' => $skill->name,
                    'display_order' => $skill->display_order,
                ])->values()->all(),
            ],
            'contact' => [
                'eyebrow' => $contactSettings?->section_eyebrow ?? 'Get In Touch',
                'title' => $contactSettings?->section_title ?? 'Let\'s work together',
                'formAction' => $contactSettings?->form_action ?? '#',
                'submitLabel' => $contactSettings?->submit_label ?? 'Send Message',
                'items' => $contacts->map(fn (Contact $contact): array => [
                    'label' => $contact->label,
                    'value' => $contact->value,
                    'href' => $contact->href,
                    'iconPath' => $contact->icon_path,
                ])->values()->all(),
            ],
            'footer' => [
                'copyright' => $footerSettings?->copyright ?? '',
                'socialLinks' => $footers->map(fn (Footer $footer): array => [
                    'name' => $footer->name,
                    'url' => $footer->url,
                    'iconPath' => $footer->icon_path,
                    'hoverClass' => $footer->hover_class,
                ])->values()->all(),
            ],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public static function forAdmin(): array
    {
        static::seedDefaults();

        return [
            'hero' => HeroSection::query()->firstOrFail(),
            'navbars' => Navbar::query()->orderBy('display_order')->get(),
            'services' => Service::query()->orderBy('display_order')->get(),
            'projects' => Project::query()->orderBy('display_order')->get(),
            'resume_section' => ResumeSection::query()->first(),
            'skills' => Skill::query()->orderBy('display_order')->get(),
            'education' => Education::query()->orderBy('display_order')->get(),
            'contacts' => Contact::query()->orderBy('display_order')->get(),
            'footers' => Footer::query()->orderBy('display_order')->get(),
        ];
    }

    public static function seedDefaults(): void
    {
        HeroSection::query()->firstOrCreate([], static::defaultHero());

        foreach (static::defaultNavbars() as $row) {
            Navbar::query()->firstOrCreate([
                'item_type' => $row['item_type'],
                'display_order' => $row['display_order'],
            ], $row);
        }

        foreach (static::defaultServices() as $row) {
            Service::query()->firstOrCreate(['display_order' => $row['display_order']], $row);
        }

        foreach (static::defaultProjects() as $row) {
            Project::query()->firstOrCreate(['display_order' => $row['display_order']], $row);
        }

        // Seeder Baru: Menghindari pemanggilan kolom item_type yang tidak ada di tabel skills
        $defaultSkillsData = static::defaultSkills();
        
        ResumeSection::query()->firstOrCreate([], $defaultSkillsData['section']);

        foreach ($defaultSkillsData['education'] as $row) {
            Education::query()->firstOrCreate([
                'institution' => $row['institution'],
                'degree' => $row['degree'],
            ], $row);
        }

        foreach ($defaultSkillsData['skills'] as $row) {
            Skill::query()->firstOrCreate([
                'name' => $row['name']
            ], $row);
        }

        foreach (static::defaultContacts() as $row) {
            Contact::query()->firstOrCreate(['display_order' => $row['display_order']], $row);
        }

        foreach (static::defaultFooters() as $row) {
            Footer::query()->firstOrCreate(['display_order' => $row['display_order']], $row);
        }
    }

    /**
     * @param  EloquentCollection<int, Navbar>  $items
     * @return list<array{label: string, href: string}>
     */
    private static function navigationLinks(EloquentCollection $items, string $type): array
    {
        return $items
            ->where('item_type', $type)
            ->map(fn (Navbar $navbar): array => [
                'label' => $navbar->label,
                'href' => $navbar->href,
            ])
            ->values()
            ->all();
    }

    /**
     * @return list<string>
     */
    private static function tags(string $tags): array
    {
        return collect(explode(',', $tags))
            ->map(fn (string $tag): string => trim($tag))
            ->filter()
            ->values()
            ->all();
    }

    /**
     * @return array<string, string>
     */
    private static function defaultHero(): array
    {
        return [
            'eyebrow' => 'Hello, My name is',
            'title' => 'Reva',
            'highlight' => 'Yulian Satria',
            'description' => 'I am a programmer specializing in machine learning and video editing. With a strong background in developing algorithms and data analysis, I create intelligent solutions that leverage machine learning to solve complex challenges.',
            'button_label' => 'Hire Me',
            'button_href' => '#contact',
            'image' => 'images/image.jpeg',
            'image_alt' => 'Reva Yulian',
        ];
    }

    /**
     * @return list<array<string, mixed>>
     */
    private static function defaultNavbars(): array
    {
        return [
            ['brand' => 'RY', 'resume_label' => 'Resume', 'documents_label' => 'Documents', 'item_type' => 'link', 'label' => 'Services', 'href' => '#services', 'display_order' => 1],
            ['brand' => 'RY', 'resume_label' => 'Resume', 'documents_label' => 'Documents', 'item_type' => 'link', 'label' => 'Portofolio', 'href' => '#portofolios', 'display_order' => 2],
            ['brand' => 'RY', 'resume_label' => 'Resume', 'documents_label' => 'Documents', 'item_type' => 'link', 'label' => 'Skills', 'href' => '#skills', 'display_order' => 3],
            ['brand' => 'RY', 'resume_label' => 'Resume', 'documents_label' => 'Documents', 'item_type' => 'link', 'label' => 'Contact', 'href' => '#contact', 'display_order' => 4],
            ['brand' => 'RY', 'resume_label' => 'Resume', 'documents_label' => 'Documents', 'item_type' => 'resume', 'label' => 'Resume Indonesia', 'href' => 'resume-id.pdf', 'display_order' => 5],
            ['brand' => 'RY', 'resume_label' => 'Resume', 'documents_label' => 'Documents', 'item_type' => 'resume', 'label' => 'Resume English', 'href' => 'resume-en.pdf', 'display_order' => 6],
        ];
    }

    /**
     * @return list<array<string, mixed>>
     */
    private static function defaultServices(): array
    {
        return [
            ['section_eyebrow' => 'Services', 'section_title' => 'Specialized In', 'title' => 'Web Development', 'description' => 'Creating responsive and user-friendly websites with modern technologies.', 'color' => 'green', 'icon_path' => 'M12.02 0c6.614.011 11.98 5.383 11.98 12 0 6.623-5.376 12-12 12-6.623 0-12-5.377-12-12 0-6.617 5.367-11.989 11.981-12h.039z', 'display_order' => 1],
            ['section_eyebrow' => 'Services', 'section_title' => 'Specialized In', 'title' => 'Machine Learning', 'description' => 'Developing intelligent algorithms and data-driven solutions.', 'color' => 'blue', 'icon_path' => 'M24 5c-3.923 3.265-5.623 4.716-7.15 4.716-2.44 0-3.681-3.675-4.85-7.716-1.165 4.028-2.41 7.715-4.853 7.715-1.513 0-3.168-1.404-7.147-4.715 3.321 7.018 3 14.292 3 17h18c0-1.718-.478-9.65 3-17z', 'display_order' => 2],
            ['section_eyebrow' => 'Services', 'section_title' => 'Specialized In', 'title' => 'Video Editing', 'description' => 'Crafting compelling visual stories through creative techniques.', 'color' => 'purple', 'icon_path' => 'M24 23h-24v-21h24v21zm-20-1v-4h-3v4h3z', 'display_order' => 3],
        ];
    }

    /**
     * @return list<array<string, mixed>>
     */
    private static function defaultProjects(): array
    {
        return [
            ['section_eyebrow' => 'My Works', 'section_title' => 'Featured Portfolios', 'title' => 'Machine Learning', 'image' => 'images/portofolios/figure4.jpg', 'image_alt' => 'Machine Learning', 'tags' => 'Machine Learning, Data Science, TensorFlow', 'description' => 'These are some machine learning projects I worked on at university, applying various techniques to real-world problems.', 'link' => 'https://github.com/Reyyzzz24/Machine-Learning', 'is_external' => true, 'display_order' => 1],
            ['section_eyebrow' => 'My Works', 'section_title' => 'Featured Portfolios', 'title' => 'Web & Mobile App', 'image' => 'images/portofolios/figure2.jpg', 'image_alt' => 'Web & Mobile App', 'tags' => 'Web Dev, UI/UX, Mobile App', 'description' => 'Developed and deployed dynamic applications focusing on performance, security, and user-friendly design.', 'link' => '/WebProjects', 'is_external' => false, 'display_order' => 2],
            ['section_eyebrow' => 'My Works', 'section_title' => 'Featured Portfolios', 'title' => 'Video Editing', 'image' => 'images/portofolios/figure6.jpg', 'image_alt' => 'Video Editing', 'tags' => 'Premiere Pro, Motion Graphics, VFX', 'description' => 'Cinematic films and animations, showcasing my skills in editing, animation, and visual storytelling.', 'link' => '/VideoEditing', 'is_external' => false, 'display_order' => 3],
            ['section_eyebrow' => 'My Works', 'section_title' => 'Featured Portfolios', 'title' => 'Game Projects', 'image' => 'images/portofolios/figure7.webp', 'image_alt' => 'Game Projects', 'tags' => 'Game Dev, Unity, GML', 'description' => 'Pixel game projects using GameMaker, focusing on 2D mechanics, AI, and interactive gameplay.', 'link' => '/GameProjects', 'is_external' => false, 'display_order' => 4],
            ['section_eyebrow' => 'My Works', 'section_title' => 'Featured Portfolios', 'title' => 'Design & Photography', 'image' => 'images/portofolios/figure8.jpg', 'image_alt' => 'Design & Photography', 'tags' => 'Graphic Design, Photography, Photoshop', 'description' => 'Exploring visual composition, branding, and creative storytelling through graphics and photography.', 'link' => '/DesignPhotography', 'is_external' => false, 'display_order' => 5],
        ];
    }

    /**
     * @return array<string, array<string, mixed>>
     */
    private static function defaultSkills(): array
    {
        return [
            'section' => [
                'section_eyebrow' => 'Learning Path',
                'section_title' => 'Skills & Education',
                'section_description' => 'Over the past five years, I have learned and developed a wide range of skills, starting with both front-end and back-end development. This journey has equipped me with valuable expertise in various technologies.',
            ],
            'education' => [
                ['institution' => 'Djuanda University', 'degree' => 'Bachelor\'s Degree - Computer Science', 'period' => '2022 - Now', 'is_current' => true, 'display_order' => 1],
                ['institution' => 'SMK Amaliah 1 Ciawi', 'degree' => 'Vocational High School - Computer & Engineering', 'period' => '2018 - 2022', 'is_current' => false, 'display_order' => 2],
                ['institution' => 'SMPN 1 Caringin', 'degree' => 'Middle School', 'period' => '2015 - 2018', 'is_current' => false, 'display_order' => 3],
            ],
            'skills' => collect(['HTML / CSS', 'PHP', 'Laravel', 'JavaScript', 'Python', 'Machine Learning', 'SQL', 'Video Editing'])
                ->map(fn (string $name, int $index): array => [
                    'name' => $name, 
                    'display_order' => $index + 1
                ])->all(),
        ];
    }

    /**
     * @return list<array<string, mixed>>
     */
    private static function defaultContacts(): array
    {
        return [
            ['section_eyebrow' => 'Get In Touch', 'section_title' => 'Let\'s work together', 'form_action' => 'https://formspree.io/f/xrbgknkv', 'submit_label' => 'Send Message', 'label' => 'Address', 'value' => "Caringin, Bogor Regency,\nWest Java 16730", 'href' => null, 'icon_path' => 'M12 1c-3.148 0-6 2.553-6 5.702 0 3.148 2.602 6.907 6 12.298 3.398-5.391 6-9.15 6-12.298 0-3.149-2.851-5.702-6-5.702z', 'display_order' => 1],
            ['section_eyebrow' => 'Get In Touch', 'section_title' => 'Let\'s work together', 'form_action' => 'https://formspree.io/f/xrbgknkv', 'submit_label' => 'Send Message', 'label' => 'Phone', 'value' => '+62 858-8597-8036', 'href' => 'tel:+6285885978036', 'icon_path' => 'M5 3.461c0 .978.001 16.224 0 17.213-.002 2.214 3.508 3.326 7.014 3.326 3.495 0 6.986-1.105 6.986-3.326v-17.213c0-2.348-3.371-3.461-6.805-3.461-3.563 0-7.195 1.199-7.195 3.461z', 'display_order' => 2],
            ['section_eyebrow' => 'Get In Touch', 'section_title' => 'Let\'s work together', 'form_action' => 'https://formspree.io/f/xrbgknkv', 'submit_label' => 'Send Message', 'label' => 'Email', 'value' => 'revayuliansatria@gmail.com', 'href' => 'mailto:revayuliansatria@gmail.com', 'icon_path' => 'M0 3v18h24v-18h-24zm21.518 2l-9.518 7.713-9.518-7.713h19.036z', 'display_order' => 3],
        ];
    }

    /**
     * @return list<array<string, mixed>>
     */
    private static function defaultFooters(): array
    {
        return [
            ['copyright' => 'made by Reva Yulian Satria', 'name' => 'Instagram', 'url' => 'https://www.instagram.com/reyulians._/?utm_source=ig_web_button_share_sheet', 'icon_path' => 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919z', 'hover_class' => 'hover:text-pink-600 hover:bg-pink-50 dark:hover:bg-pink-900/20', 'display_order' => 1],
            ['copyright' => 'made by Reva Yulian Satria', 'name' => 'LinkedIn', 'url' => 'https://id.linkedin.com/in/reva-yulian-satria-74114930b', 'icon_path' => 'M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16z', 'hover_class' => 'hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20', 'display_order' => 2],
            ['copyright' => 'made by Reva Yulian Satria', 'name' => 'YouTube', 'url' => 'https://www.youtube.com/@reyzonly8541', 'icon_path' => 'M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0z', 'hover_class' => 'hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20', 'display_order' => 3],
            ['copyright' => 'made by Reva Yulian Satria', 'name' => 'GitHub', 'url' => 'https://github.com/Reyyzzz24', 'icon_path' => 'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416z', 'hover_class' => 'hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700', 'display_order' => 4],
        ];
    }
}
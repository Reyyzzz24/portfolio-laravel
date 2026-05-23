<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use App\Models\Footer;
use App\Models\HeroSection;
use App\Models\Navbar;
use App\Models\Project;
use App\Models\Service;
use App\Models\Skill;
use App\Support\PortfolioContent;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class PortfolioContentController extends Controller
{
    public function edit(): Response
    {
        return Inertia::render('admin/portfolio-content', PortfolioContent::forAdmin());
    }

    public function update(Request $request): RedirectResponse
    {
        $imageOrStringRule = [
            'required',
            function ($attribute, $value, $fail) {
                if (!is_string($value) && !$value instanceof \Illuminate\Http\UploadedFile) {
                    $fail("The {$attribute} must be a valid image file or string path.");
                }
            }
        ];

        $validated = $request->validate([
            'hero.eyebrow' => ['required', 'string', 'max:255'],
            'hero.title' => ['required', 'string', 'max:255'],
            'hero.highlight' => ['required', 'string', 'max:255'],
            'hero.description' => ['required', 'string'],
            'hero.button_label' => ['required', 'string', 'max:255'],
            'hero.button_href' => ['required', 'string', 'max:255'],
            'hero.image' => $imageOrStringRule,
            'hero.image_alt' => ['required', 'string', 'max:255'],
            
            'navbars' => ['required', 'array'],
            'navbars.*.id' => ['required'],
            'navbars.*.brand' => ['required', 'string', 'max:255'],
            'navbars.*.resume_label' => ['required', 'string', 'max:255'],
            'navbars.*.documents_label' => ['required', 'string', 'max:255'],
            'navbars.*.item_type' => ['required', 'string', 'in:link,resume'],
            'navbars.*.label' => ['required', 'string', 'max:255'],
            'navbars.*.href' => ['required', 'string', 'max:255'],
            'navbars.*.display_order' => ['required', 'integer', 'min:0'],
            
            'services' => ['required', 'array'],
            'services.*.id' => ['required'],
            'services.*.section_eyebrow' => ['required', 'string', 'max:255'],
            'services.*.section_title' => ['required', 'string', 'max:255'],
            'services.*.title' => ['required', 'string', 'max:255'],
            'services.*.description' => ['required', 'string'],
            'services.*.color' => ['required', 'string', 'max:255'],
            'services.*.icon_path' => ['required', 'string'],
            'services.*.display_order' => ['required', 'integer', 'min:0'],
            
            'projects' => ['required', 'array'],
            'projects.*.id' => ['required'],
            'projects.*.section_eyebrow' => ['required', 'string', 'max:255'],
            'projects.*.section_title' => ['required', 'string', 'max:255'],
            'projects.*.title' => ['required', 'string', 'max:255'],
            'projects.*.image' => ['nullable'], // diubah nullable karena item baru bisa kosong di awal
            'projects.*.image_alt' => ['required_with:projects.*.image', 'nullable', 'string', 'max:255'],
            'projects.*.tags' => ['required', 'string', 'max:255'],
            'projects.*.description' => ['required', 'string'],
            'projects.*.link' => ['required', 'string', 'max:255'],
            'projects.*.is_external' => ['required', 'boolean'],
            'projects.*.display_order' => ['required', 'integer', 'min:0'],
            
            'skills' => ['required', 'array'],
            'skills.*.id' => ['required'],
            'skills.*.section_eyebrow' => ['required', 'string', 'max:255'],
            'skills.*.section_title' => ['required', 'string', 'max:255'],
            'skills.*.section_description' => ['required', 'string'],
            'skills.*.item_type' => ['required', 'string', 'in:skill,education'],
            'skills.*.name' => ['nullable', 'string', 'max:255'],
            'skills.*.institution' => ['nullable', 'string', 'max:255'],
            'skills.*.degree' => ['nullable', 'string', 'max:255'],
            'skills.*.period' => ['nullable', 'string', 'max:255'],
            'skills.*.is_current' => ['required', 'boolean'],
            'skills.*.display_order' => ['required', 'integer', 'min:0'],
            
            'contacts' => ['required', 'array'],
            'contacts.*.id' => ['required'],
            'contacts.*.section_eyebrow' => ['required', 'string', 'max:255'],
            'contacts.*.section_title' => ['required', 'string', 'max:255'],
            'contacts.*.form_action' => ['required', 'string', 'max:255'],
            'contacts.*.submit_label' => ['required', 'string', 'max:255'],
            'contacts.*.label' => ['required', 'string', 'max:255'],
            'contacts.*.value' => ['required', 'string'],
            'contacts.*.href' => ['nullable', 'string', 'max:255'],
            'contacts.*.icon_path' => ['required', 'string'],
            'contacts.*.display_order' => ['required', 'integer', 'min:0'],
            
            'footers' => ['required', 'array'],
            'footers.*.id' => ['required'],
            'footers.*.copyright' => ['required', 'string', 'max:255'],
            'footers.*.name' => ['required', 'string', 'max:255'],
            'footers.*.url' => ['required', 'string', 'max:255'],
            'footers.*.icon_path' => ['required', 'string'],
            'footers.*.hover_class' => ['required', 'string', 'max:255'],
            'footers.*.display_order' => ['required', 'integer', 'min:0'],
        ]);

        // Update Hero
        $hero = HeroSection::query()->firstOrFail();
        $heroData = $validated['hero'];

        if ($request->hasFile('hero.image')) {
            if ($hero->image && str_starts_with($hero->image, '/storage/')) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $hero->image));
            }
            $path = $request->file('hero.image')->store('portfolios', 'public');
            $heroData['image'] = '/storage/' . $path;
        }
        $hero->update($heroData);

        // Update Rows (Dukungan penuh untuk fitur Add & Delete)
        $this->updateRows(Navbar::class, $validated['navbars'], $request, 'navbars');
        $this->updateRows(Service::class, $validated['services'], $request, 'services');
        $this->updateRows(Project::class, $validated['projects'], $request, 'projects');
        $this->updateRows(Skill::class, $validated['skills'], $request, 'skills');
        $this->updateRows(Contact::class, $validated['contacts'], $request, 'contacts');
        $this->updateRows(Footer::class, $validated['footers'], $request, 'footers');

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Portfolio content updated.']);
        return back();
    }

    private function updateRows(string $model, array $rows, Request $request, string $prefix): void
    {
        $keptIds = [];

        foreach ($rows as $index => $row) {
            $id = $row['id'];
            unset($row['id']);

            // Jika ID berupa string "new_...", buat record baru di DB
            if (is_string($id) && str_starts_with($id, 'new_')) {
                if ($request->hasFile("{$prefix}.{$index}.image")) {
                    $path = $request->file("{$prefix}.{$index}.image")->store('portfolios', 'public');
                    $row['image'] = '/storage/' . $path;
                }
                $newRecord = $model::create($row);
                $keptIds[] = $newRecord->id;
            } else {
                // Proses update data lama
                $existingRecord = $model::query()->findOrFail($id);

                if ($request->hasFile("{$prefix}.{$index}.image")) {
                    if ($existingRecord->image && str_starts_with($existingRecord->image, '/storage/')) {
                        Storage::disk('public')->delete(str_replace('/storage/', '', $existingRecord->image));
                    }
                    $path = $request->file("{$prefix}.{$index}.image")->store('portfolios', 'public');
                    $row['image'] = '/storage/' . $path;
                }

                $existingRecord->update($row);
                $keptIds[] = $id;
            }
        }

        // Hapus data lama di DB yang tidak dikirim lagi dari frontend (fitur delete)
        $model::query()->whereNotIn('id', $keptIds)->delete();
    }
}
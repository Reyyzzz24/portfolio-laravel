<?php

namespace Database\Seeders;

use App\Support\PortfolioContent;
use Illuminate\Database\Seeder;

class PortfolioContentSeeder extends Seeder
{
    /**
     * Seed the portfolio content tables.
     */
    public function run(): void
    {
        PortfolioContent::seedDefaults();
    }
}

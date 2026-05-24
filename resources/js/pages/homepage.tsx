import Contact from './home/contact';
import Footer from './home/footer';
import Hero from './home/hero';
import Navbar from './home/navbar';
import Projects from './home/projects';
import Services from './home/services';
import Skills from './home/skills';

interface HomePageProps {
    navbar: any[] | null;
    hero: any | null;
    services: { eyebrow: string; title: string; items: any[] } | null;
    projects: { eyebrow: string; title: string; items: any[] } | null;
    contact: {
        eyebrow: string;
        title: string;
        formAction: string;
        submitLabel: string;
        items: { label: string; value: string; href: string | null; iconPath: string }[];
    } | null;
    footer: any[] | null;
    section: any;
    skills: any[];
    education: any[];
}

const HomePage = ({
    navbar,
    hero,
    services = null,
    projects = null,
    contact,
    footer,
    section,
    skills = [],
    education = [],
}: HomePageProps) => {
    return (
        <main className="homepage-root relative min-h-screen overflow-x-hidden bg-white text-foreground dark:bg-gray-900">
            <Navbar content={navbar} />

            {/* depthIndex 0: Hero maju ke depan, tilt kiri */}
            <Hero content={hero} depthIndex={0} />

            {/* depthIndex 1: Services mundur ke belakang, tilt kanan */}
            <Services content={services} depthIndex={1} />

            {/* depthIndex 2: Projects maju jauh, tilt kiri */}
            <Projects content={projects} depthIndex={2} />

            {/* depthIndex 3: Skills mundur jauh, tilt kanan */}
            <Skills section={section} skills={skills} education={education} depthIndex={3} />

            {/* depthIndex 4: Contact maju, tilt kiri */}
            <Contact content={contact} depthIndex={4} />

            <Footer content={footer} />
        </main>
    );
};

export default HomePage;
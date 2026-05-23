import Contact from './home/contact';
import Footer from './home/footer';
import Hero from './home/hero';
import Navbar from './home/navbar';
import Projects from './home/projects';
import Services from './home/services';
import Skills from './home/skills';

interface HomePageProps {
    navbar: any[] | null; // Navbar tetap array sesuai controller
    hero: any | null;
    services: { eyebrow: string; title: string; items: any[] } | null;
    projects: { eyebrow: string; title: string; items: any[] } | null;
    contact: {
        eyebrow: string;
        title: string;
        formAction: string;
        submitLabel: string;
        items: { label: string; value: string; href: string | null; iconPath: string }[]
    } | null;
    footer: any[] | null; // Footer tetap array[cite: 2]
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
        <>
            <Navbar content={navbar} />
            <Hero content={hero} />
            {/* Pass model data directly; child components accept both shapes */}
            <Services content={services} />
            <Projects content={projects} />

            {/* Pengiriman langsung ke komponen Skills yang sudah kamu pecah */}
            <Skills
                section={section}
                skills={skills}
                education={education}
            />

            <Contact content={contact} />
            <Footer content={footer} />
        </>
    );
};

export default HomePage;
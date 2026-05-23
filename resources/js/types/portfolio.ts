export type NavigationLink = {
    label: string;
    href: string;
};

export type PortfolioContent = {
    navbar: {
        brand: string;
        links: NavigationLink[];
        resumeLabel: string;
        documentsLabel: string;
        resumeLinks: NavigationLink[];
    };
    hero: {
        eyebrow: string;
        title: string;
        highlight: string;
        description: string;
        button_label: string;
        button_href: string;
        image: string;
        imageAlt: string;
    };
    services: {
        eyebrow: string;
        title: string;
        items: {
            title: string;
            description: string;
            color: 'green' | 'blue' | 'purple' | string;
            iconPath: string;
        }[];
    };
    projects: {
        eyebrow: string;
        title: string;
        items: {
            title: string;
            image: string;
            imageAlt: string;
            tags: string[];
            description: string;
            link: string;
            isExternal: boolean;
        }[];
    };
    skills: {
        eyebrow: string;
        title: string;
        description: string;
        education: {
            institution: string;
            degree: string;
            period: string;
            isCurrent: boolean;
        }[];
        items: string[];
    };
    contact: {
        eyebrow: string;
        title: string;
        formAction: string;
        submitLabel: string;
        items: {
            label: string;
            value: string;
            href: string | null;
            iconPath: string;
        }[];
    };
    footer: {
        copyright: string;
        socialLinks: {
            name: string;
            url: string;
            iconPath: string;
            hoverClass: string;
        }[];
    };
};

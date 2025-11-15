// Chat configuration similar to sleek-portfolio but adapted for Vite React
// You can expand these arrays with real data from your portfolio.

import profile from '@/assets/profile.png';

export const about = {
    name: "Kunal's Portfolio Assistant",
    description: 'Your real portfolio description here.',
};

export const heroConfig = {
    name: about.name,
    avatar: profile,
    skills: [
        { name: 'HTML' },
        { name: 'CSS' },
        { name: 'Reac   t' },
        { name: 'Javascript' },
        { name: 'Typescript' },
        { name: 'Node.js' },
        { name: 'Express' },
        { name: 'MongoDB' },
        { name: 'Postgres' },
    ],
};

export const experiences = [
    {
        position: 'Full Stack Developer',
        title: 'Research Paper Copilot',
        startDate: '2025',
        endDate: 'Present',
    },
];

export const projects = [
    {
        title: 'Portfolio Site',
        description: 'A responsive developer portfolio built with React and Tailwind.',
        live: 'https://kunalx1.is-a.dev/',
    },

    {
        title: "Todo Web-Application",
        discription: `A full-stack Todo application featuring secure user authentication, and a responsive design for seamless task management. Track their daily tasks efficiently.
    
            Example Creds, Email- kunalx1@gmail.com password- Kunal@1234`,
        link: `https://todo-project-kohl.vercel.app/`,
    },
    {
        title: "Expensify - Expense Tracker Application",
        discription: `A comprehensive full-stack expense tracking application designed to help users manage their finances effectively. Featured with a robust backend API and an intuitive frontend interface to help users organize and monitor their expenses efficiently.`,
        link: `https://expensify-update-project-2.vercel.app`,
    },
    {
        title: "VSCode Dark Theme",
        discription: `A modern dark theme for Visual Studio Code built with developers in mind. It offers balanced contrast, vibrant syntax colors, and smooth visual flow to keep focus during long coding hours. Designed for consistency across UI elements and readability in any environment.`,
        live: "https://marketplace.visualstudio.com/items?itemName=KunalRathore.kunal-dark-dev-theme",
    },
];

export const socialLinks = [
    { name: 'GitHub', href: 'https://github.com/kunal-rathore-111' },
    { name: 'LinkedIn', href: 'https://www.linkedin.com/in/kunal-rathore-111-in/' },
];

function generateSystemPrompt() {
    const skillNames = heroConfig.skills.map((s) => s.name).join(', ');
    const experienceText = experiences
        .map((exp) => `${exp.position} at ${exp.title} (${exp.startDate} - ${exp.endDate})`)
        .join('\n- ');
    const projectsText = projects
        .map((p) => `${p.title}: ${p.description}${p.live ? ` - ${p.live}` : ''}`)
        .join('\n- ');
    const socialLinksText = socialLinks.map((l) => `${l.name}: ${l.href}`).join('\n- ');

    return `You are ${about.name}'s Portfolio Assistant representing ${about.name}.

ABOUT: ${about.description}

SKILLS:
${skillNames}

EXPERIENCE:
- ${experienceText}

PROJECTS:
- ${projectsText}

SOCIAL LINKS:
- ${socialLinksText}

RESPONSE RULES:
- Keep responses under 120 words
- Use markdown formatting
- Make all links clickable using [text](url)
- Be concise, friendly, and helpful
- Answer questions about skills, experience, projects, and contact
- If unsure, suggest visiting sections of the site
- Refer to ${about.name} as 'I' or 'me' (first person)

Goal: Help visitors learn about my work in a friendly, concise way.`;
}

export const systemPrompt = generateSystemPrompt();

export const chatSuggestions = [
    'What technologies do you work with?',
    'Tell me about your recent projects',
    'How can I contact you for work?',
    'What projects have you built?',
    'What skills do you use?',
    'How can I contact you?',
];

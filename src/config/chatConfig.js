// Chat configuration similar to sleek-portfolio but adapted for Vite React
// You can expand these arrays with real data from your portfolio.

export const about = {
    name: 'Your Actual Name', // Change this
    description: 'Your real portfolio description here.',
};

export const heroConfig = {
    name: about.name,
    avatar: '/assets/logo.png',
    fallback: 'YN',
    skills: [
        { name: 'React' },
        { name: 'Node.js' },
        { name: 'Express' },
        { name: 'MongoDB' },
        { name: 'Docker' },
    ],
};

export const experiences = [
    {
        position: 'Full Stack Developer',
        company: 'Awesome Co',
        startDate: '2023',
        endDate: 'Present',
    },
];

export const projects = [
    {
        title: 'Portfolio Site',
        description: 'A responsive developer portfolio built with React and Tailwind.',
        live: 'https://your-portfolio-url.example.com',
    },
];

export const socialLinks = [
    { name: 'GitHub', href: 'https://github.com/yourusername' },
    { name: 'LinkedIn', href: 'https://www.linkedin.com/in/yourusername/' },
];

function generateSystemPrompt() {
    const skillNames = heroConfig.skills.map((s) => s.name).join(', ');
    const experienceText = experiences
        .map((exp) => `${exp.position} at ${exp.company} (${exp.startDate} - ${exp.endDate})`)
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

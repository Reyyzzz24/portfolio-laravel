import { motion } from 'framer-motion';
import { ParallaxSection } from '@/components/ParallaxSection';

type ResumeSection = {
  section_eyebrow: string;
  section_title: string;
  section_description: string;
};

type SkillItem = {
  id: number | string;
  name: string;
  display_order: number;
};

type EducationItem = {
  id: number | string;
  institution: string;
  degree: string;
  period: string;
  is_current: boolean;
  display_order: number;
};

type SkillsProps = {
  section: ResumeSection | null;
  skills: SkillItem[];
  education: EducationItem[];
};

const Skills = ({ section, skills = [], education = [] }: SkillsProps) => {
  const actualSkills = Array.isArray(skills) ? skills : [];
  const actualEducation = Array.isArray(education) ? education : [];

  const midpoint = Math.ceil(actualSkills.length / 2);
  const skillListLeft = actualSkills.slice(0, midpoint);
  const skillListRight = actualSkills.slice(midpoint);

  const eyebrow = section?.section_eyebrow || 'My Resume';
  const title = section?.section_title || 'Skills & Education';
  const description = section?.section_description || '';

  return (
    <ParallaxSection id="skills" intensity="medium" className="bg-gray-50 dark:bg-background">
      <div
        className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: `linear-gradient(#808080 1px, transparent 1px), linear-gradient(90deg, #808080 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />
      <div className="container mx-auto max-w-7xl px-6 md:px-12 z-10 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h3 className="text-sm font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400">
            {eyebrow}
          </h3>
          <h1 className="mt-2 text-4xl font-bold text-gray-900 md:text-5xl dark:text-white">
            {title}
          </h1>
          <div className="mx-auto mt-6 h-1.5 w-20 rounded-full bg-blue-600" />
        </motion.div>

        <div className="grid grid-cols-1 items-start gap-16 lg:grid-cols-2 lg:gap-24">
          <div className="space-y-0">
            {actualEducation.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-6"
              >
                <div className="flex flex-col items-center">
                  <div
                    className={`h-4 w-4 shrink-0 rounded-full bg-blue-600 shadow-[0_0_0_4px_rgba(37,99,235,0.2)] ${item.is_current ? 'animate-pulse' : ''}`}
                  />
                  <div
                    className={`h-full w-0.5 ${index === actualEducation.length - 1 ? 'bg-transparent' : 'bg-blue-200 dark:bg-gray-700'}`}
                  />
                </div>
                <div className="pb-12">
                  <h4 className="text-xl leading-none font-bold text-gray-900 dark:text-white">
                    {item.institution}
                  </h4>
                  <p className="mt-3 text-gray-600 dark:text-gray-400">{item.degree}</p>
                  <p className="mt-2 inline-block rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                    {item.period}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="rounded-[2rem] border border-gray-200 bg-white p-8 transition-all duration-300 md:p-12 dark:border-gray-700 dark:bg-gray-800"
          >
            <p className="mb-10 text-lg leading-relaxed text-gray-600 dark:text-gray-400">
              {description}
            </p>

            <div className="grid grid-cols-2 gap-x-8 gap-y-6">
              <ul className="space-y-5">
                {skillListLeft.map((skill) => (
                  <motion.li
                    key={skill.id}
                    whileHover={{ x: 5 }}
                    className="group flex items-center gap-4 text-gray-700 dark:text-gray-300"
                  >
                    <span className="h-2.5 w-2.5 rounded-full bg-blue-600 transition-transform group-hover:scale-125" />
                    <span className="font-medium">{skill.name}</span>
                  </motion.li>
                ))}
              </ul>
              <ul className="space-y-5">
                {skillListRight.map((skill) => (
                  <motion.li
                    key={skill.id}
                    whileHover={{ x: 5 }}
                    className="group flex items-center gap-4 text-gray-700 dark:text-gray-300"
                  >
                    <span className="h-2.5 w-2.5 rounded-full bg-blue-600 transition-transform group-hover:scale-125" />
                    <span className="font-medium">{skill.name}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </ParallaxSection>
  );
};

export default Skills;

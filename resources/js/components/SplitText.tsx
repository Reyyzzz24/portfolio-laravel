import { motion, type Variants } from 'framer-motion';

interface SplitTextProps {
    text: string;
    className?: string;
    variants?: Variants;
}

export const SplitText = ({ text, className = "", variants }: SplitTextProps) => {
    const words = text.split(" ");

    return (
        <span className={`inline-block overflow-hidden ${className}`}>
            {words.map((word, i) => (
                <motion.span
                    key={i}
                    variants={variants}
                    className="inline-block"
                >
                    {word}{i !== words.length - 1 && "\u00A0"}
                </motion.span>
            ))}
        </span>
    );
};
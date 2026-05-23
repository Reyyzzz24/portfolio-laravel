import type { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg
            {...props}
            viewBox="0 0 40 42"
            xmlns="http://www.w3.org/2000/svg"
        >
            <text
                x="50%"
                y="65%"
                textAnchor="middle"
                fontSize="24"
                fontWeight="bold"
                fontFamily="sans-serif"
                className="fill-blue-600 dark:fill-blue-400"
            >
                RY
            </text>
        </svg>
    );
}
import React from 'react';

const PodIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg viewBox="0 0 200 200" fill="none" {...props}>
      <path
        d="M46 105.5V177.5C71.2 191.1 92.5 183.167 100 177.5V105.5H98V95.5L100 94V68C85.2 54.8 77.5 42.1667 75.5 37.5H70.5C61.7 56.3 50.5 65 46 67V94L47.5 95.5V105.5H46Z"
        stroke="currentColor"
        strokeWidth={5}
      />
      <path
        d="M87.5 35L113 44.5M87.5 55.5V35L128.538 29.5612C128.751 29.533 128.857 29.519 128.962 29.5273C128.985 29.5292 129.008 29.5318 129.031 29.5351C129.135 29.5507 129.235 29.5883 129.436 29.6635L153 38.5L152.506 173.946C152.503 174.631 152.502 174.973 152.327 175.227C152.29 175.281 152.248 175.331 152.202 175.376C151.981 175.592 151.644 175.652 150.97 175.771L115.185 182.113C114.252 182.278 113.786 182.361 113.456 182.146C113.387 182.102 113.325 182.049 113.269 181.989C113 181.701 113 181.228 113 180.281V44.5M113 44.5L153 38.5"
        stroke="currentColor"
        strokeWidth={5}
        strokeLinecap="round"
      />
      <path d="M113 182.5L100 177" stroke="currentColor" strokeWidth={5} />
      <path d="M47.5 96.5C53.8333 99.3333 72.8 103.3 98 96.5" stroke="currentColor" strokeWidth={5} />
      <path d="M47 69C53.3333 71.8333 72.3 75.8 97.5 69" stroke="currentColor" strokeWidth={5} />
      <path d="M48 105C54.3333 107.833 73.3 111.8 98.5 105" stroke="currentColor" strokeWidth={5} />
      <rect x={52} y={127} width={42} height={27} rx={3} fill="currentColor" />
    </svg>
  );
};

export { PodIcon };

import React from 'react';

const SnusIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg viewBox="0 0 200 200" fill="none" {...props}>
      <path
        d="M82.5 187H123C128.6 187 131 175.667 131.5 170L130 162.5L131.5 112.5L132.5 79.5C131.833 78 130.2 74.5 129 72.5C132.2 62.9 130.333 57.1667 129 55.5L128 40.5L125 38.5L124.5 33.5L119 28.5L116.5 12H102L99.5 28.5L93.5 32V35.5C93.5 36.1667 92.2 37.6 87 38C81.8 38.4 75.1667 46.1667 72.5 50L71 75V178C73.4 182.4 79.6667 185.833 82.5 187Z"
        stroke="currentColor"
        strokeWidth={5}
      />
      <path d="M129 72.5L113 82.5L105 142.5L129.5 163" stroke="currentColor" strokeWidth={5} />
      <path d="M100.5 28.5H118.5" stroke="currentColor" strokeWidth={5} />
      <path d="M94.5 33.5H124.5" stroke="currentColor" strokeWidth={5} />
      <path d="M92 37L124.5 37.5" stroke="currentColor" strokeWidth={5} />
      <path d="M71.5 65.5L86.5 58.5H129.5" stroke="currentColor" strokeWidth={5} />
      <path
        d="M72 75H84.6207L93.0345 82.8086L84.6207 140.885C83.569 145.766 83.3586 155.917 90.931 157.478C124.586 173.486 131.552 176.988 130.5 176.5"
        stroke="currentColor"
        strokeWidth={5}
      />
      <circle cx={101} cy={84} r={4} fill="currentColor" />
      <circle cx={93} cy={146} r={4} fill="currentColor" />
      <path
        d="M66 83C66 81.8954 66.8954 81 68 81H69V100H68C66.8954 100 66 99.1046 66 98V83Z"
        fill="currentColor"
      />
      <path
        d="M66 153C66 151.895 66.8954 151 68 151H69V158H68C66.8954 158 66 157.105 66 156V153Z"
        fill="currentColor"
      />
    </svg>
  );
};

export { SnusIcon };

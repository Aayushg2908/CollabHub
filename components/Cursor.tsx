interface Props {
  color: string;
  x: number;
  y: number;
  name: string | undefined;
}

export default function Cursor({ color, x, y, name }: Props) {
  return (
    <div
      className="pointer-events-none absolute top-0 left-0"
      style={{
        transform: `translateX(${x}px) translateY(${y}px)`,
      }}
    >
      <svg
        width="24"
        height="36"
        viewBox="0 0 24 36"
        fill="none"
        stroke="white"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.500002 16.8829L0.500002 1.19841L11.7841 12.3673H5.65376Z"
          fill={color}
        />
      </svg>
      <div
        className="absolute top-4 left-2 rounded-xl p-2"
        style={{ backgroundColor: color }}
      >
        <p className="whitespace-nowrap text-sm leading-relaxed text-white">
          {name}
        </p>
      </div>
    </div>
  );
}

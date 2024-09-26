export default function Tooltip({
  message,
  children,
}: {
  message: string;
  children: any;
}) {
  return (
    <div className="group absolute flex">
      {children}
      <span className="absolute -top-10 scale-0 transition-all rounded bg-black p-2 text-xs text-white group-hover:scale-100">
        {message}
      </span>
    </div>
  );
}

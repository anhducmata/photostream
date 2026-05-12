type DateGroupHeaderProps = {
  label: string;
  count: number;
};

export function DateGroupHeader({ label, count }: DateGroupHeaderProps) {
  return (
    <div className="sticky top-0 z-10 -mx-2 mb-3 flex items-center justify-between rounded-2xl bg-slate-50/80 px-2 py-3 backdrop-blur-md">
      <h2 className="text-lg font-semibold text-slate-900">{label}</h2>
      <span className="text-sm text-slate-500">{count} item{count === 1 ? "" : "s"}</span>
    </div>
  );
}

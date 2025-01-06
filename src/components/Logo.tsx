import { Icons } from '../icons';

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <Icons.Store className="w-8 h-8 text-[#00A3FF]" />
      <span className="text-xl font-bold">Lobomat</span>
    </div>
  );
}
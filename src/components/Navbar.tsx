import { User } from "lucide-react";

export default function Navbar() {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b bg-white">
      <h1 className="text-xl font-semibold">ChartsAI</h1>
      <div className="bg-gray-200 p-2 rounded-full cursor-pointer">
        <User className="w-4 h-4" />
      </div>
    </header>
  );
}

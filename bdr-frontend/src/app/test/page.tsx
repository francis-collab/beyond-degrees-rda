// app/test/page.tsx
export default function Test() {
  return (
    <div className="p-8 space-y-8">
      {/* Blue Gradient */}
      <div className="h-32 bg-gradient-to-r from-[#00A1D6] to-[#0077B6]" />

      {/* Green Gradient */}
      <div className="h-32 bg-gradient-to-r from-[#00A651] to-[#008000]" />

      {/* Blue Button */}
      <button className="px-6 py-3 bg-[#00A1D6] text-white font-bold rounded-full hover:bg-[#00A1D6]/90 transition-all">
        Blue Button
      </button>

      {/* Green Button */}
      <button className="px-6 py-3 bg-[#00A651] text-white font-bold rounded-full hover:bg-[#00A651]/90 transition-all">
        Green Button
      </button>
    </div>
  );
}
// Shared blurry gradient background used by the landing and sign-in pages
const pattern = encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'><g fill='none' stroke='white' stroke-width='1'><path d='M40 8l9 23 23 9-23 9-9 23-9-23-23-9 23-9z'/><rect x='26' y='26' width='28' height='28' transform='rotate(45 40 40)'/></g></svg>`)

export default function GlassBg({ fixed = true }) {
  return (
    <div className={`${fixed ? 'fixed' : 'absolute'} inset-0 -z-10 overflow-hidden bg-[#0b0f2e]`} aria-hidden>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,#2a2f8f_0%,transparent_55%),radial-gradient(ellipse_at_bottom_right,#3b1d6e_0%,transparent_55%)]" />
      <div className="absolute -left-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-indigo-500/40 blur-[120px]" />
      <div className="absolute right-[-10rem] top-1/4 h-[30rem] w-[30rem] rounded-full bg-fuchsia-500/25 blur-[130px]" />
      <div className="absolute bottom-[-12rem] left-1/4 h-[32rem] w-[32rem] rounded-full bg-amber-400/20 blur-[140px]" />
      <div className="absolute bottom-10 right-10 h-64 w-64 rounded-full bg-teal-400/15 blur-[100px]" />
      <div className="absolute inset-0 opacity-[0.06] blur-[0.5px]" style={{ backgroundImage: `url("data:image/svg+xml,${pattern}")` }} />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0b0f2e]/70" />
    </div>
  )
}

import Link from "next/link";

export default function CollaborateCTA() {
  return (
    <section className="mb-16 animate-on-scroll">
      <div className="bg-card-light dark:bg-card-dark rounded-3xl p-8 border border-gray-200 dark:border-gray-800 relative overflow-hidden group card-hover">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-48 h-0.5 bg-primary transition-all duration-300 group-hover:w-72 group-hover:h-1 rounded-full" />
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Let&apos;s
                <br />
                <span className="text-primary">collaborate</span>
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md leading-relaxed">
                Looking for a Unity/C# engineer to build gameplay systems,
                optimize performance, or ship your next title? Let&apos;s
                work together to bring your game to life.
              </p>
            </div>
            <Link
              href="/contact"
              className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center hover:scale-110 transition shadow-lg shadow-primary/50 flex-shrink-0"
            >
              <span className="material-symbols-outlined text-lg transform -rotate-45">
                arrow_forward
              </span>
            </Link>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
      </div>
    </section>
  );
}

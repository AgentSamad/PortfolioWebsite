import ContactForm from "./ContactForm";

const faqs = [
  {
    q: "What services do you offer?",
    a: "I specialize in Unity/C# game development, custom editor tooling, gameplay systems architecture, multiplayer networking, and mobile performance optimization for iOS, Android, and PC platforms.",
  },
  {
    q: "What platforms do you develop for?",
    a: "I develop for PC (Steam), Android, iOS, and Amazon. I build cross-platform codebases with shared core logic and platform-specific builds to maximize code reuse.",
  },
  {
    q: "Can you work remotely with existing teams?",
    a: "Absolutely. I have years of experience working remotely with distributed teams across different time zones. I'm comfortable owning features end to end with high autonomy.",
  },
  {
    q: "What is your approach to performance optimization?",
    a: "I use Unity Profiler and Frame Debugger to identify bottlenecks, reduce draw calls through batching and texture atlasing, minimize canvas rebuilds and overdraw, and optimize memory usage for mid-tier mobile devices.",
  },
  {
    q: "What tools and technologies do you use?",
    a: "Unity3D, C#/.NET, Mirror Networking, Odin Inspector, DOTween, Cinemachine, Shader Graph, URP, Addressables, Firebase, Git/SVN, Jira, and Blender among others.",
  },
];

export default function ContactPage() {
  return (
    <>
      <section id="contact" className="mb-16 animate-on-scroll">
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            <span className="text-white">Let&apos;s</span>{" "}
            <span className="text-primary">Collaborate</span>
          </h1>
        </div>
        <ContactForm />
      </section>

      <section className="mb-16 animate-on-scroll">
        <h2 className="text-3xl font-bold mb-6">
          Frequently Asked <span className="text-primary">Questions</span>
        </h2>
        <div className="space-y-3">
          {faqs.map((faq) => (
            <details
              key={faq.q}
              className="group bg-card-light dark:bg-card-dark rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden"
            >
              <summary className="flex justify-between items-center p-4 font-medium text-sm cursor-pointer list-none">
                <span>{faq.q}</span>
                <span className="material-symbols-outlined transform group-open:rotate-180 transition-transform text-gray-500 text-lg">
                  expand_more
                </span>
              </summary>
              <div className="px-4 pb-4 text-xs text-gray-500 leading-relaxed">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}

import Image from "next/image";
import Link from "next/link";
import { PublicNav } from "@/components/PublicNav";
import { Footer } from "@/components/Footer";
import { Icon } from "@/components/Icon";
import {
  faStethoscope,
  faChartLine,
  faMobileScreenButton,
  faShieldHalved,
  faArrowRight,
  faQuoteLeft,
} from "@fortawesome/free-solid-svg-icons";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <PublicNav />

      {/* HERO — split with real image */}
      <section className="relative bg-kora-light overflow-hidden">
        <div className="container-kora py-16 md:py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <span className="eyebrow">Physiotherapy · Rwanda</span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-kora-dark leading-[1.1] tracking-tight">
                Rehabilitation that follows you home.
              </h1>
              <p className="mt-6 text-lg text-kora-muted leading-relaxed max-w-xl">
                Kora Health connects Rwandan patients with licensed
                physiotherapists for guided recovery. Prescribed exercises, pain
                tracked before and after each session, progress you and your
                therapist can actually see.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <Link href="/register" className="btn-primary">
                  Start your recovery
                  <Icon icon={faArrowRight} size="sm" />
                </Link>
                <Link href="/about" className="btn-ghost">
                  How Kora works
                </Link>
              </div>

              {/* Trust markers */}
              <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-kora-soft">
                <div className="flex items-center gap-2">
                  <Icon icon={faShieldHalved} size="sm" className="text-kora-primary" />
                  <span>Data stored in Rwanda</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon icon={faStethoscope} size="sm" className="text-kora-primary" />
                  <span>Licensed physiotherapists</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-2xl">
                <Image
                  src="/images/kora-1.jpg"
                  alt="A Kora Health physiotherapist guiding a patient on parallel bars"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              {/* Small floating card */}
              <div className="hidden md:block absolute -bottom-6 -left-6 bg-white rounded-xl border border-kora shadow-lg p-4 max-w-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-kora-light flex items-center justify-center text-kora-primary">
                    <Icon icon={faChartLine} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-kora-dark">
                      Pain reduced by 40%
                    </p>
                    <p className="text-xs text-kora-soft">
                      Across 3 weeks of care
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* THE PROBLEM — grounded in Rwandan context */}
      <section className="section bg-white">
        <div className="container-kora">
          <div className="max-w-3xl">
            <span className="eyebrow">Why Kora exists</span>
            <h2 className="text-3xl md:text-4xl font-bold text-kora-dark tracking-tight">
              Rwanda has 186 physiotherapists. It has 14.4 million people.
            </h2>
            <p className="mt-6 text-lg text-kora-muted leading-relaxed">
              For most patients, seeing a physiotherapist means travelling to
              the city, waiting in line, and paying for time they can barely
              afford. Recovery gets delayed. Injuries become disabilities. Some
              people never get care at all.
            </p>
            <p className="mt-4 text-lg text-kora-muted leading-relaxed">
              We built Kora Health to close that distance. A therapist can
              prescribe your plan from Kigali. You do the work at home. The app
              measures whether it's working, session by session, and shows both
              of you when to adjust.
            </p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS — 3 steps with image */}
      <section className="section bg-kora-surface-alt">
        <div className="container-kora">
          <div className="max-w-2xl mb-12 md:mb-16">
            <span className="eyebrow">How it works</span>
            <h2 className="text-3xl md:text-4xl font-bold text-kora-dark tracking-tight">
              Three steps between injury and recovery.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                num: "01",
                title: "Get a personalised plan",
                body: "A licensed physiotherapist reviews your case and prescribes exercises specific to your injury, not a generic routine.",
              },
              {
                num: "02",
                title: "Log every session",
                body: "Rate your pain before and after each workout. Follow the guided flow, complete your sets, note how it felt.",
              },
              {
                num: "03",
                title: "Track your progress",
                body: "See your pain drop over time. Your therapist reviews the same data and updates your plan when it's time to progress.",
              },
            ].map((step) => (
              <div key={step.num} className="card-kora">
                <div className="text-sm font-semibold text-kora-primary tracking-widest">
                  {step.num}
                </div>
                <h3 className="mt-3 text-xl font-bold text-kora-dark">
                  {step.title}
                </h3>
                <p className="mt-3 text-kora-muted leading-relaxed">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURE — pain tracking */}
      <section className="section bg-white">
        <div className="container-kora">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="order-2 lg:order-1 relative rounded-2xl overflow-hidden aspect-[4/3]">
              <Image
                src="/images/kora-2.jpg"
                alt="Kora Health therapist assisting a patient with resistance band exercise"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="order-1 lg:order-2">
              <span className="eyebrow">Pain tracking</span>
              <h2 className="text-3xl md:text-4xl font-bold text-kora-dark tracking-tight">
                Progress you can measure, not just feel.
              </h2>
              <p className="mt-6 text-lg text-kora-muted leading-relaxed">
                Every workout in Kora starts and ends with a pain rating from
                zero to ten. Over weeks that data becomes a line: rising when
                things are getting worse, falling when the plan is working.
              </p>
              <p className="mt-4 text-lg text-kora-muted leading-relaxed">
                Your therapist sees exactly what you see. When the numbers stall
                for too long, they adjust the plan. When you're improving
                faster than expected, they know it's safe to push harder.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "0–10 pain scale before and after every session",
                  "Optional body-location notes so patterns become visible",
                  "Chart view for the last 4 weeks, updated in real time",
                ].map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-kora-primary flex-shrink-0" />
                    <span className="text-kora-muted">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
      {/* PRACTITIONERS — real Rwandan physiotherapists */}
      <section className="section bg-white">
        <div className="container-kora">
          <div className="max-w-2xl mb-12 md:mb-16">
            <span className="eyebrow">Meet the practitioners</span>
            <h2 className="text-3xl md:text-4xl font-bold text-kora-dark tracking-tight">
              Real physiotherapists. On the ground in Rwanda.
            </h2>
            <p className="mt-4 text-lg text-kora-muted leading-relaxed">
              Kora Health is powered by licensed practitioners already working
              with patients across the country. When you register, you're
              connected to a real clinician, not an algorithm.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 md:gap-8 max-w-3xl">
            <div className="rounded-2xl overflow-hidden bg-white border border-kora">
              <div className="relative aspect-[3/4]">
                <Image
                  src="/images/practitioner-red.jpg"
                  alt="Kora Health practitioner in her clinic"
                  fill
                  sizes="(max-width: 640px) 100vw, 400px"
                  className="object-cover"
                />
              </div>
              <div className="p-5">
                <p className="text-xs font-semibold text-kora-primary tracking-widest uppercase">
                  Physiotherapist
                </p>
                <p className="mt-1 font-semibold text-kora-dark">
                  Dr. Peace Akinwotu
                </p>
                <p className="mt-1 text-sm text-kora-soft">
                  Musculoskeletal rehabilitation
                </p>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden bg-white border border-kora">
              <div className="relative aspect-[3/4]">
                <Image
                  src="/images/practitioner-pink.jpg"
                  alt="Kora Health practitioner during a session"
                  fill
                  sizes="(max-width: 640px) 100vw, 400px"
                  className="object-cover"
                />
              </div>
              <div className="p-5">
                <p className="text-xs font-semibold text-kora-primary tracking-widest uppercase">
                  Physiotherapist
                </p>
                <p className="mt-1 font-semibold text-kora-dark">
                  Kigali practice
                </p>
                <p className="mt-1 text-sm text-kora-soft">
                  Post-surgical recovery
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QUOTE — pull from a real practitioner */}
      <section className="section bg-kora-dark text-white">
        <div className="container-narrow text-center">
          <Icon icon={faQuoteLeft} size="2xl" className="text-kora-light opacity-40" />
          <blockquote className="mt-6 text-2xl md:text-3xl font-medium leading-snug">
            Most of my patients drop off after two visits because getting to the
            clinic is hard. With Kora I can keep guiding them long after they
            leave the room.
          </blockquote>
          <cite className="not-italic mt-6 block text-kora-light">
            Practising physiotherapist, Kigali
          </cite>
        </div>
      </section>

      {/* WHO IT'S FOR — two paths */}
      <section className="section bg-white">
        <div className="container-kora">
          <div className="max-w-2xl mb-12">
            <span className="eyebrow">Who Kora is for</span>
            <h2 className="text-3xl md:text-4xl font-bold text-kora-dark tracking-tight">
              Two sides. One shared record.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {/* For patients */}
            <div className="rounded-2xl overflow-hidden border border-kora bg-white">
              <div className="relative aspect-[16/10]">
                <Image
                  src="/images/hero-recovery.jpg"
                  alt="Patient recovering with a walker"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-2 mb-3">
                  <Icon icon={faMobileScreenButton} className="text-kora-primary" />
                  <span className="text-sm font-semibold text-kora-primary">
                    For patients
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-kora-dark">
                  Recovery without the commute.
                </h3>
                <p className="mt-3 text-kora-muted leading-relaxed">
                  Post-injury, post-surgery, chronic pain, elder mobility. Get a
                  plan you can follow from home, on any phone.
                </p>
                <Link
                  href="/register"
                  className="mt-6 inline-flex items-center gap-2 text-kora-primary font-semibold hover:gap-3 transition-all"
                >
                  Register as a patient
                  <Icon icon={faArrowRight} size="sm" />
                </Link>
              </div>
            </div>

            {/* For therapists */}
            <div className="rounded-2xl overflow-hidden border border-kora bg-white">
              <div className="relative aspect-[16/10]">
                <Image
                  src="/images/therapist-exam.jpg"
                  alt="Physiotherapist examining a patient's knee"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-2 mb-3">
                  <Icon icon={faStethoscope} className="text-kora-primary" />
                  <span className="text-sm font-semibold text-kora-primary">
                    For therapists
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-kora-dark">
                  Extend your practice across the country.
                </h3>
                <p className="mt-3 text-kora-muted leading-relaxed">
                  Prescribe exercise plans, watch patient adherence and pain
                  data in one dashboard, adjust care based on evidence.
                </p>
                <Link
                  href="/register"
                  className="mt-6 inline-flex items-center gap-2 text-kora-primary font-semibold hover:gap-3 transition-all"
                >
                  Register as a therapist
                  <Icon icon={faArrowRight} size="sm" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section bg-kora-surface-alt">
        <div className="container-narrow">
          <div className="mb-12 md:mb-16 text-center">
            <span className="eyebrow">Common questions</span>
            <h2 className="text-3xl md:text-4xl font-bold text-kora-dark tracking-tight">
              Answers before you ask.
            </h2>
          </div>

          <dl className="space-y-6">
            {[
              {
                q: "Do I need a smartphone to use Kora?",
                a: "You need any device with a web browser. Kora works on entry-level Android phones over 3G. We designed it to load quickly on the network you actually have.",
              },
              {
                q: "How much does it cost?",
                a: "During our current pilot, Kora is free for patients. Payment integration through Mobile Money is coming in the next release, priced within reach of a standard clinic visit.",
              },
              {
                q: "Who reviews my treatment plan?",
                a: "A licensed physiotherapist registered with the Rwandan physiotherapy board. Their license number is visible on their profile before you begin.",
              },
              {
                q: "Is my health data private?",
                a: "Your records are stored on infrastructure hosted in Europe with strict access controls. Only you and the therapists you actively work with can see your data.",
              },
              {
                q: "Can I use Kora if I've never had physiotherapy before?",
                a: "Yes. Registration includes a short intake so your therapist understands your history before writing a plan. If they need more context, they'll ask before you begin.",
              },
              {
                q: "What if I don't understand an exercise?",
                a: "Every prescribed exercise supports a demo video link your therapist can attach. You can also message them directly from the app when it's live.",
              },
            ].map((item) => (
              <div key={item.q} className="card-kora">
                <dt className="text-lg font-semibold text-kora-dark">
                  {item.q}
                </dt>
                <dd className="mt-2 text-kora-muted leading-relaxed">
                  {item.a}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="section bg-kora-primary text-white">
        <div className="container-narrow text-center">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight">
            Your recovery starts today.
          </h2>
          <p className="mt-6 text-lg text-kora-light max-w-xl mx-auto leading-relaxed">
            Whether you're rebuilding from injury or extending your practice to
            patients across Rwanda, Kora is built for you.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/register"
              className="btn-primary bg-white text-kora-primary hover:bg-kora-light"
            >
              Create an account
              <Icon icon={faArrowRight} size="sm" />
            </Link>
            <Link
              href="/about"
              className="text-white/90 hover:text-white font-semibold px-6 py-3"
            >
              Learn more
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

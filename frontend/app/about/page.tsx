import Image from "next/image";
import Link from "next/link";
import { PublicNav } from "@/components/PublicNav";
import { Footer } from "@/components/Footer";
import { Icon } from "@/components/Icon";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

export const metadata = {
  title: "About · Kora Health",
  description:
    "Why Kora Health exists, how it works, and who it's built for.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <PublicNav />

      {/* Header */}
      <section className="bg-kora-light">
        <div className="container-kora py-16 md:py-24">
          <div className="max-w-3xl">
            <span className="eyebrow">About Kora</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-kora-dark tracking-tight leading-[1.1]">
              Physiotherapy shouldn't stop at the clinic door.
            </h1>
            <p className="mt-6 text-lg text-kora-muted leading-relaxed">
              For most of Rwanda, seeing a physiotherapist means a long journey
              to Kigali, a full day away from work, and follow-ups that never
              happen. Kora Health closes that distance.
            </p>
          </div>
        </div>
      </section>

      {/* Mission section */}
      <section className="section bg-white">
        <div className="container-narrow">
          <div className="prose prose-lg max-w-none">
            <span className="eyebrow">Our mission</span>
            <h2 className="text-3xl md:text-4xl font-bold text-kora-dark tracking-tight">
              Make recovery reach every patient.
            </h2>
            <div className="mt-6 space-y-5 text-lg text-kora-muted leading-relaxed">
              <p>
                Rwanda has approximately 186 registered physiotherapists serving
                a population of 14.4 million people. That's one therapist for
                every 77,000 citizens. Most work in and around Kigali. For
                someone in a rural district recovering from a stroke, a
                workplace injury, or a joint replacement, seeing a therapist
                regularly is often impossible.
              </p>
              <p>
                The consequences are quiet but severe. Recovery windows are
                missed. Injuries become disabilities. Patients drop out of care
                because getting to the clinic is more expensive than the visit
                itself.
              </p>
              <p>
                Kora Health was built to change that. We connect patients with
                licensed physiotherapists remotely, deliver personalised
                exercise plans through the phone, and measure pain and
                progression at every session. Therapists see real data. Patients
                see real improvement. And distance stops being the reason
                treatment ends.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Image row */}
      <section className="bg-kora-surface-alt py-12">
        <div className="container-kora">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
              <Image
                src="/images/kora-6.jpg"
                alt="Kora Health therapist providing manual therapy"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
              />
            </div>
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
              <Image
                src="/images/kora-7.jpg"
                alt="Kora Health rehabilitation session with elder patient"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
              />
            </div>
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
              <Image
                src="/images/kora-8.jpg"
                alt="Kora Health assessment with tablet-enabled tracking"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section bg-white">
        <div className="container-kora">
          <div className="max-w-2xl mb-12">
            <span className="eyebrow">What we care about</span>
            <h2 className="text-3xl md:text-4xl font-bold text-kora-dark tracking-tight">
              Three principles that shape every decision.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Evidence, not effort",
                body: "A patient who works hard but sees no improvement is being failed by their plan. Every session captures data so care can be adjusted based on what's actually happening.",
              },
              {
                title: "Distance is not disqualification",
                body: "A patient in Nyagatare deserves the same quality of guidance as one in Kimihurura. Kora is built to work over the networks people actually have, on the phones they already own.",
              },
              {
                title: "Therapists are the practice",
                body: "Kora doesn't replace a physiotherapist. It gives licensed practitioners a way to extend their reach without diluting their care. Every plan is written by a human.",
              },
            ].map((value) => (
              <div key={value.title} className="card-kora">
                <h3 className="text-xl font-bold text-kora-dark">
                  {value.title}
                </h3>
                <p className="mt-3 text-kora-muted leading-relaxed">
                  {value.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder note */}
      <section className="section bg-kora-surface-alt">
        <div className="container-narrow">
          <span className="eyebrow">From the founder</span>
          <h2 className="text-3xl md:text-4xl font-bold text-kora-dark tracking-tight">
            A note from Emmanuel.
          </h2>

          <div className="mt-8 space-y-5 text-lg text-kora-muted leading-relaxed">
            <p>
              I started Kora Health while studying software engineering at
              African Leadership University. The idea began close to home. A
              licensed physiotherapist I know spent hours describing the same
              exercises to different patients, over and over, because there was
              no system to hand them a plan they could take with them.
            </p>
            <p>
              I built the first version to solve that one problem. Along the
              way it became clear the problem was bigger: therapists across
              Rwanda were watching patients fall out of care because getting to
              a follow-up was harder than living with the injury.
            </p>
            <p>
              Kora Health is early. It's an alpha. But it's real, it's live,
              and it's built for the practitioners who inspired it.
            </p>
          </div>

          <div className="mt-10 pt-6 border-t border-kora">
            <p className="text-lg font-semibold text-kora-dark">
              Atigbi Emmanuel Ayomikun
            </p>
            <p className="mt-1 text-sm text-kora-soft">
              Founder, Kora Health · Kigali, Rwanda
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-kora-primary text-white">
        <div className="container-narrow text-center">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight">
            Join the alpha.
          </h2>
          <p className="mt-6 text-lg text-kora-light max-w-xl mx-auto leading-relaxed">
            We're onboarding a small group of therapists and patients now.
            Registration is free.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/register"
              className="btn-primary bg-white text-kora-primary hover:bg-kora-light"
            >
              Create an account
              <Icon icon={faArrowRight} size="sm" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

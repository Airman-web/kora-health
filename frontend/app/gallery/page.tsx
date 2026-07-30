import Image from "next/image";
import Link from "next/link";
import { PublicNav } from "@/components/PublicNav";
import { Footer } from "@/components/Footer";
import { Icon } from "@/components/Icon";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

export const metadata = {
  title: "Gallery · Kora Health",
  description: "Moments from Kora Health physiotherapy care in Rwanda.",
};

const galleryItems = [
  {
    src: "/images/kora-1.jpg",
    alt: "Physiotherapist guiding a patient on parallel bars",
    caption: "Guided walking rehabilitation",
  },
  {
    src: "/images/kora-2.jpg",
    alt: "Therapist working with an older patient using a resistance band",
    caption: "Resistance band therapy",
  },
  {
    src: "/images/hero-recovery.jpg",
    alt: "Patient practising walking with support of a walker",
    caption: "Post-surgery mobility",
  },
  {
    src: "/images/therapist-exam.jpg",
    alt: "Physiotherapist assessing a patient's knee",
    caption: "Clinical assessment",
  },
  {
    src: "/images/therapist-leg.jpg",
    alt: "Leg pulley exercise supervised by a therapist",
    caption: "Assisted leg strengthening",
  },
  {
    src: "/images/kora-4.jpg",
    alt: "Kora Health practitioner in the clinic",
    caption: "Our practitioners",
  },
  {
    src: "/images/kora-5.jpg",
    alt: "Kora Health practitioner working alongside gym equipment",
    caption: "In practice",
  },
  {
    src: "/images/kora-6.jpg",
    alt: "Kora Health manual therapy session",
    caption: "Manual therapy",
  },
  {
    src: "/images/kora-7.jpg",
    alt: "Rehabilitation with elder patient",
    caption: "Rehabilitation care",
  },
  {
    src: "/images/kora-8.jpg",
    alt: "Kora Health consultation with elder patient",
    caption: "Consultation",
  },
];

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-white">
      <PublicNav />

      {/* Header */}
      <section className="bg-kora-light">
        <div className="container-kora py-12 md:py-16">
          <div className="max-w-3xl">
            <span className="eyebrow">Gallery</span>
            <h1 className="text-4xl md:text-5xl font-bold text-kora-dark tracking-tight leading-[1.1]">
              Moments from the practice.
            </h1>
            <p className="mt-4 text-lg text-kora-muted leading-relaxed">
              A look at the work behind Kora Health, from assessment to
              rehabilitation.
            </p>
          </div>
        </div>
      </section>

      {/* Gallery grid */}
      <section className="section bg-white">
        <div className="container-kora">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {galleryItems.map((item, i) => (
              <figure
                key={item.src}
                className="group rounded-xl overflow-hidden bg-kora-surface-alt"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    priority={i < 3}
                  />
                </div>
                <figcaption className="p-4 text-sm text-kora-muted">
                  {item.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-kora-surface-alt">
        <div className="container-narrow text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-kora-dark tracking-tight">
            Ready to start your own recovery?
          </h2>
          <div className="mt-8">
            <Link href="/register" className="btn-primary">
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

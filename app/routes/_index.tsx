import { useEffect, useRef, useState, type ReactNode } from "react";
import { IconMapPin, IconArrowUpRight } from "@tabler/icons-react";

export function meta() {
  return [
    { title: "Telangana — Land of Heritage" },
    {
      name: "description",
      content:
        "An illustrated journey through Telangana's map, history, culture and heritage.",
    },
  ];
}

const MAP_URL =
  "https://cdn.builder.io/api/v1/image/assets%2F117efa82b731491bb4e2fa220e3dac98%2Fd0916466409c453e82a29820880aac88?format=webp&width=800&height=1200";

// Marker positions as percentages of the 800×625 map image.
const MARKERS: Record<string, { x: number; y: number }> = {
  Adilabad: { x: 37, y: 10.9 },
  Nizamabad: { x: 29.9, y: 33 },
  Karimnagar: { x: 46.8, y: 39.2 },
  Warangal: { x: 53.6, y: 48 },
  Medak: { x: 25.8, y: 55 },
  Hyderabad: { x: 36.3, y: 62.6 },
  Khammam: { x: 62.4, y: 65.3 },
  Nalgonda: { x: 47.9, y: 69.1 },
  Mahabubnagar: { x: 26.8, y: 76 },
};

type Place = {
  name: string;
  lon: number;
  lat: number;
  tag: string;
  text: string;
  photo?: string;
};

const PLACES: Place[] = [
  { name: "Hyderabad", lon: 78.48, lat: 17.38, tag: "Capital", photo: "/images/hyderabad.jpg", text: "Founded in 1591 by Muhammad Quli Qutb Shah. Home of the Charminar, Golconda and the world's pearl and biryani traditions." },
  { name: "Warangal", lon: 79.59, lat: 17.97, tag: "Kakatiya capital", photo: "/images/warangal.jpg", text: "Capital of the Kakatiya dynasty, with its Fort, ornate Thousand Pillar Temple and Kakatiya Kala Thoranam gateways." },
  { name: "Palampet", lon: 79.94, lat: 18.26, tag: "UNESCO site", text: "Home of the Ramappa Temple, a 13th-century marvel inscribed as a UNESCO World Heritage Site in 2021, built with floating bricks." },
  { name: "Karimnagar", lon: 79.13, lat: 18.44, tag: "Filigree", text: "Known for silver filigree craft and as a gateway to the Godavari basin and ancient Buddhist sites." },
  { name: "Nizamabad", lon: 78.09, lat: 18.67, tag: "Turmeric belt", text: "A fertile agricultural hub, famed for turmeric and the Nizam Sagar reservoir." },
  { name: "Basar", lon: 77.98, lat: 19.15, tag: "Saraswati", text: "Gnana Saraswati Temple on the Godavari bank, where children begin their first letters." },
  { name: "Adilabad", lon: 78.53, lat: 19.67, tag: "Gond lands", text: "Forested north, home of the Gond and Kolam tribes, Dokra metal craft and the Kuntala waterfalls." },
  { name: "Medak", lon: 78.27, lat: 18.05, tag: "Cathedral", text: "Site of a grand 1924 Gothic cathedral and a hill fort of the Kakatiya period." },
  { name: "Khammam", lon: 80.15, lat: 17.25, tag: "Fort city", text: "Dominated by its hill fort and the lush, rice-growing plains of eastern Telangana." },
  { name: "Bhadrachalam", lon: 80.89, lat: 17.67, tag: "Godavari", text: "Sri Sita Ramachandra Swamy temple on the banks of the Godavari, a major pilgrimage." },
  { name: "Nalgonda", lon: 79.27, lat: 17.05, tag: "Ancient", text: "Close to Nagarjuna Sagar, once a thriving seat of Buddhism under the Ikshvakus." },
  { name: "Mahabubnagar", lon: 77.99, lat: 16.74, tag: "Krishna", text: "Southern district along the Krishna river, home of Pillalamarri, a 700-year-old banyan." },
];

const TIMELINE = [
  { era: "Prehistoric", title: "Stone Age beginnings", text: "Megalithic burials and rock art across the Deccan plateau show human settlement thousands of years before the empires arrived." },
  { era: "3rd c. BCE", title: "Satavahanas & Buddhism", text: "Kotilingala on the Godavari was an early Satavahana capital. Buddhist stupas flourished at Phanigiri and Nagarjunakonda." },
  { era: "1000–1323", title: "The Kakatiyas", text: "From Orugallu (Warangal), the Kakatiyas built great tanks, forts and the Ramappa Temple, uniting Telugu lands under one rule." },
  { era: "1518–1687", title: "The Qutb Shahis", text: "Golconda’s sultans founded Hyderabad in 1591, built the Charminar and fostered a luminous Deccani culture of poetry and art." },
  { era: "1724–1948", title: "The Asaf Jahis", text: "The Nizams ruled a princely state, shaping railways, universities, Osmania Hospital and a refined cuisine and courtly life." },
  { era: "1948–2014", title: "Integration & Statehood", text: "Hyderabad joined India in 1948. After a long movement, Telangana was formed on 2 June 2014 as India’s 29th state." },
];

const CULTURE = [
  { title: "Bathukamma", label: "Festival", text: "A joyous floral festival where women stack seasonal flowers into a towering cone and sing around it, honouring the Goddess." },
  { title: "Bonalu", label: "Devotion", text: "Held in Hyderabad’s monsoon, communities offer pots of food to Goddess Mahankali amid drums and dance." },
  { title: "Pochampally Ikat", label: "Craft", text: "Hand-dyed yarn woven into geometric patterns on handlooms, protected by a Geographical Indication tag." },
  { title: "Bidriware", label: "Craft", text: "Silver inlay on blackened metal, a craft that travelled from Bidar and became a Hyderabadi signature." },
  { title: "Perini & Oggu Katha", label: "Performance", text: "The warrior dance of Perini Shivatandavam and folk ballads of Oggu Katha keep ancient storytelling alive." },
  { title: "Hyderabadi Cuisine", label: "Food", text: "From dum biryani and haleem to Telangana’s fiery sarvapindi and sakinalu, food carries centuries of Deccani flavour." },
];

const HERITAGE = [
  { title: "Ramappa Temple", place: "Palampet", text: "A sandstone temple with floating bricks and sculptures that seem alive." },
  { title: "Charminar", place: "Hyderabad", text: "The 1591 monument with four minarets, the icon of the city." },
  { title: "Golconda Fort", place: "Hyderabad", text: "A hill fortress famed for its acoustics and diamond trade." },
  { title: "Thousand Pillar Temple", place: "Hanamkonda", text: "Kakatiya architecture in star-shaped stone, dedicated to Shiva, Vishnu and Surya." },
  { title: "Chowmahalla Palace", place: "Hyderabad", text: "The seat of the Nizams, a grand courtyard palace of four halls." },
  { title: "Medak Cathedral", place: "Medak", text: "One of Asia's largest churches, with stained glass of astonishing scale." },
];

function Reveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out ${shown ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
    >
      {children}
    </div>
  );
}

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="mb-4 text-xs font-medium uppercase tracking-[0.25em] text-primary">
      {children}
    </p>
  );
}

function TextLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      className="group inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-primary"
    >
      {children}
      <IconArrowUpRight size={16} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </a>
  );
}

function Intro() {
  return (
    <section id="story" className="mx-auto grid max-w-6xl gap-12 px-6 py-28 md:grid-cols-[1fr_2fr]">
      <Reveal>
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">01 / The Introduction</p>
        <p className="mt-6 font-serif text-2xl leading-snug">An ancient land.<br />A living legacy.</p>
      </Reveal>
      <Reveal delay={120}>
        <Eyebrow>Namaskaram, welcome</Eyebrow>
        <h2 className="font-serif text-4xl leading-tight md:text-6xl">
          Rock, river and <em className="italic">a royal memory.</em>
        </h2>
        <div className="mt-8 max-w-2xl space-y-5 text-lg leading-relaxed text-muted-foreground">
          <p>
            Telangana sits on the Deccan plateau, where granite boulders rise from the
            land and the Godavari and Krishna rivers have shaped farming, faith and trade
            for millennia.
          </p>
          <p>
            Its story runs from megalithic burials and Satavahana towns to Kakatiya
            temples and Qutb Shahi poetry, and it still lives in festivals, crafts and
            the kitchens of old Hyderabad.
          </p>
        </div>
        <div className="mt-10">
          <TextLink href="#map">Get to know the land</TextLink>
        </div>
        <blockquote className="mt-16 border-l-2 border-primary pl-6">
          <p className="font-serif text-2xl italic leading-snug">
            Every fort has a legend. <br />Every river has a song.
          </p>
          <footer className="mt-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">— On Telangana</footer>
        </blockquote>
      </Reveal>
    </section>
  );
}

function MapSection() {
  const [active, setActive] = useState<Place>(PLACES[0]!);
  const index = PLACES.indexOf(active) + 1;
  return (
    <section id="map" className="bg-secondary/60 py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-10 md:grid-cols-2 md:items-end">
          <Reveal>
            <Eyebrow>A sense of place</Eyebrow>
            <h2 className="font-serif text-4xl leading-tight md:text-6xl">
              Thirty-three districts. <em className="italic">Many worlds.</em>
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="max-w-md text-muted-foreground">
              From the Western Ghats in the north-west to the Godavari plains of the east, the
              state's districts each carry their own shrines, forts and crafts.
            </p>
            <div className="mt-8 flex gap-10">
              <div>
                <p className="font-serif text-4xl">2,000+</p>
                <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">Years of history</p>
              </div>
              <div>
                <p className="font-serif text-4xl">2</p>
                <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">Great rivers</p>
              </div>
            </div>
          </Reveal>
        </div>

        <div className="mt-16 grid items-start gap-10 md:grid-cols-[1.1fr_1fr]">
          <Reveal>
            <div className="rounded-2xl border bg-background p-4">
              <p className="mb-2 flex items-center gap-2 px-2 text-xs uppercase tracking-widest text-muted-foreground">
                <IconMapPin size={14} /> Tap a place to discover more
              </p>
              <div className="relative">
                <img src={MAP_URL} alt="Map of Telangana's districts" className="h-auto w-full" />
                {PLACES.filter((p) => MARKERS[p.name]).map((p) => {
                  const on = p.name === active.name;
                  const pos = MARKERS[p.name]!;
                  return (
                    <button
                      key={p.name}
                      onClick={() => setActive(p)}
                      aria-label={p.name}
                      aria-pressed={on}
                      style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                      className="group absolute -translate-x-1/2 -translate-y-1/2"
                    >
                      <span className={`block rounded-full border-2 transition-all ${on ? "size-5 border-background bg-primary ring-4 ring-primary/30" : "size-3.5 border-primary bg-background group-hover:scale-125"}`} />
                    </button>
                  );
                })}
                {MARKERS[active.name] && (
                  <span
                    className="pointer-events-none absolute -translate-x-1/2 whitespace-nowrap rounded bg-background/90 px-1.5 py-0.5 text-xs font-medium shadow-sm"
                    style={{ left: `${MARKERS[active.name]!.x}%`, top: `${MARKERS[active.name]!.y + 4}%` }}
                  >
                    {active.name}
                  </span>
                )}
              </div>
            </div>
          </Reveal>

          <Reveal delay={150}>
            <div key={active.name} className="animate-in fade-in duration-500">
              {active.photo ? (
                <img src={active.photo} alt={`${active.name}, Telangana`} className="mb-6 aspect-[3/2] w-full rounded-2xl object-cover" />
              ) : (
                <div className="mb-6 flex aspect-[3/2] w-full items-center justify-center rounded-2xl border border-dashed bg-muted text-sm text-muted-foreground">
                  Photo of {active.name} coming soon
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-[0.2em] text-primary">{active.tag}</span>
                <span className="font-serif text-sm text-muted-foreground">
                  {String(index).padStart(2, "0")} / {String(PLACES.length).padStart(2, "0")}
                </span>
              </div>
              <h3 className="mt-3 font-serif text-4xl">{active.name}</h3>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{active.text}</p>
            </div>
            <div className="mt-8 flex flex-wrap gap-2">
              {PLACES.map((p) => (
                <button
                  key={p.name}
                  onClick={() => setActive(p)}
                  aria-pressed={p.name === active.name}
                  className={`rounded-full border px-3 py-1 text-xs transition-colors ${p.name === active.name ? "border-primary bg-primary text-primary-foreground" : "bg-background hover:bg-accent"}`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

const CARE = [
  { title: "Dress and behave with respect", text: "Remove footwear at temples and dargahs, dress modestly, and ask before photographing people or rituals." },
  { title: "Buy directly from makers", text: "Choose Pochampally ikat and Bidriware with a Geographical Indication tag, or buy from weavers' cooperatives." },
  { title: "Protect what has survived", text: "Keep to marked paths at ruins, never climb or carve on monuments, and take your litter home." },
  { title: "Stay beyond the capital", text: "Book homestays and local guides in the districts, so the income reaches the villages that keep these traditions alive." },
];

function TravelCare() {
  return (
    <section className="border-y bg-background py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-12 md:grid-cols-[1fr_2fr]">
          <Reveal>
            <Eyebrow>Travel with care</Eyebrow>
            <h2 className="font-serif text-4xl leading-tight md:text-5xl">Leave the stones <em className="italic">as you found them.</em></h2>
            <p className="mt-6 max-w-sm leading-relaxed text-muted-foreground">
              Telangana's temples are still places of worship and its crafts are still someone's livelihood. A few habits go a long way.
            </p>
          </Reveal>
          <ol className="grid gap-x-10 gap-y-12 sm:grid-cols-2">
            {CARE.map((c, i) => (
              <li key={c.title}>
                <Reveal delay={(i % 2) * 120}>
                  <p className="font-serif text-sm text-primary">{String(i + 1).padStart(2, "0")}</p>
                  <h3 className="mt-3 font-serif text-2xl">{c.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{c.text}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

const CHAPTERS = [
  { title: "A royal past", label: "History", href: "#history", image: "/images/charminar.jpg", alt: "Charminar in Hyderabad", text: "Qutb Shahi monuments, Kakatiya gateways and the courts that shaped the Deccan." },
  { title: "A living culture", label: "Culture", href: "#culture", image: "/images/bathukamma.jpg", alt: "Bathukamma flower festival", text: "Festivals sung and danced each year, from floral Bathukamma to monsoon Bonalu." },
  { title: "Stone and craft", label: "Heritage", href: "#heritage", image: "/images/golconda.jpg", alt: "Golconda Fort", text: "Temples carved from sandstone, forts raised on granite hills and crafts passed down by hand." },
];

function Chapters() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-28">
      <Reveal>
        <Eyebrow>Three doorways</Eyebrow>
        <h2 className="font-serif text-4xl leading-tight md:text-5xl">Come a little closer.</h2>
      </Reveal>
      <div className="mt-14 grid gap-8 md:grid-cols-3">
        {CHAPTERS.map((c, i) => (
          <Reveal key={c.title} delay={i * 120}>
            <div className="group">
              <img src={c.image} alt={c.alt} className="aspect-[4/5] w-full rounded-2xl object-cover transition-transform duration-700 group-hover:scale-[1.02]" />
              <p className="mt-6 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {String(i + 1).padStart(2, "0")} / {c.label}
              </p>
              <h3 className="mt-2 font-serif text-3xl">{c.title}</h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">{c.text}</p>
              <p className="mt-5">
                <TextLink href={c.href}>Read the story</TextLink>
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export default function HomeRoute() {
  return (
    <div className="min-h-screen scroll-smooth bg-background text-foreground">
      <header className="fixed inset-x-0 top-0 z-30 border-b bg-background/80 backdrop-blur">
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <a href="#top" className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-full border border-primary font-serif text-lg text-primary">తె</span>
            <span>
              <span className="block text-sm font-medium uppercase tracking-[0.2em]">Telangana</span>
              <span className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Land of rivers &amp; rock</span>
            </span>
          </a>
          <div className="hidden gap-7 text-xs uppercase tracking-[0.15em] text-muted-foreground md:flex">
            <a href="#story" className="hover:text-foreground">Our story</a>
            <a href="#map" className="hover:text-foreground">Map</a>
            <a href="#history" className="hover:text-foreground">History</a>
            <a href="#culture" className="hover:text-foreground">Culture</a>
            <a href="#heritage" className="hover:text-foreground">Heritage</a>
          </div>
          <a href="#map" className="inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs uppercase tracking-[0.15em] hover:bg-accent">
            Explore the land <IconArrowUpRight size={14} />
          </a>
        </nav>
      </header>

      <section id="top" className="relative isolate flex min-h-screen flex-col justify-between px-6 pb-10 pt-32">
        <div
          className="absolute inset-0 -z-10 bg-cover bg-center"
          style={{ backgroundImage: "url(/images/golconda.jpg)" }}
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background/70 via-background/80 to-background" />
        <p className="absolute right-6 top-1/2 hidden -translate-y-1/2 text-[10px] uppercase tracking-[0.3em] text-muted-foreground [writing-mode:vertical-rl] md:block">
          A land shaped by rock &amp; river · India
        </p>
        <div className="mx-auto w-full max-w-6xl animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <Eyebrow>A journey through the Deccan heartland</Eyebrow>
          <p className="font-serif text-2xl text-primary">తెలంగాణ</p>
          <h1 className="mt-4 font-serif text-6xl leading-[0.95] tracking-tight md:text-8xl">
            Where history <br /><em className="italic">meets the hills.</em>
          </h1>
          <p className="mt-8 max-w-md text-lg text-muted-foreground">
            A land of granite ridges, river valleys and royal memory. Walk through its past,
            its culture and its living heritage.
          </p>
          <div className="mt-10">
            <TextLink href="#story">Begin the journey</TextLink>
          </div>
        </div>
        <div className="mx-auto mt-16 flex w-full max-w-6xl items-end justify-between text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          <span className="flex items-center gap-4">
            Scroll to discover
            <span className="block h-px w-16 bg-muted-foreground/50" />
          </span>
          <span className="hidden font-serif text-sm tracking-normal sm:block">17° 23′ N &nbsp; 78° 28′ E</span>
        </div>
      </section>

      <Intro />
      <MapSection />
      <TravelCare />
      <Chapters />

      <section id="history" className="py-28">
        <div className="mx-auto max-w-3xl px-6">
          <Reveal>
            <Eyebrow>Chapter 01 — History</Eyebrow>
            <h2 className="font-serif text-4xl leading-tight md:text-5xl">Two thousand years in <em className="italic">six chapters.</em></h2>
          </Reveal>
          <ol className="relative mt-16 space-y-14 border-l border-primary/30 pl-8">
            {TIMELINE.map((t, i) => (
              <li key={t.title} className="relative">
                <span className="absolute -left-[37px] top-2 size-3 rounded-full border-2 border-primary bg-background" />
                <Reveal delay={i % 2 ? 80 : 0}>
                  <p className="text-xs font-medium uppercase tracking-widest text-primary">{t.era}</p>
                  <h3 className="mt-1 font-serif text-2xl">{t.title}</h3>
                  <p className="mt-2 leading-relaxed text-muted-foreground">{t.text}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="culture" className="relative isolate overflow-hidden py-28">
        <div
          className="absolute inset-0 -z-10 bg-cover bg-center"
          style={{ backgroundImage: "url(/images/bathukamma.jpg)" }}
        />
        <div className="absolute inset-0 -z-10 bg-background/90" />
        <div className="mx-auto grid max-w-6xl gap-16 px-6 md:grid-cols-[1fr_1.3fr]">
          <Reveal>
            <Eyebrow>Chapter 02 — Culture</Eyebrow>
            <h2 className="font-serif text-4xl leading-tight md:text-5xl">Tradition, <em className="italic">alive in every season.</em></h2>
            <p className="mt-6 max-w-sm leading-relaxed text-muted-foreground">
              Here culture is sung, danced, woven and cooked. It is shared at village fairs and
              family tables rather than kept behind glass.
            </p>
          </Reveal>
          <ol>
            {CULTURE.map((c, i) => (
              <li key={c.title} className="border-t py-7">
                <Reveal delay={(i % 3) * 80}>
                  <p className="text-xs uppercase tracking-[0.2em] text-primary">
                    {String(i + 1).padStart(2, "0")} / {c.label}
                  </p>
                  <h3 className="mt-2 font-serif text-2xl">{c.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.text}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="heritage" className="relative isolate overflow-hidden bg-secondary/60 py-28 text-foreground">
        <div
          className="absolute inset-0 -z-10 bg-cover bg-center opacity-30"
          style={{ backgroundImage: "url(/images/charminar.jpg)" }}
        />
        <div className="absolute inset-0 -z-10 bg-background/85" />
        <div className="mx-auto max-w-6xl px-6">
          <Reveal>
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.25em] text-primary">Chapter 03 — Heritage</p>
            <h2 className="max-w-xl font-serif text-4xl leading-tight md:text-5xl">Made by stone. <em className="italic">Kept in memory.</em></h2>
          </Reveal>
          <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {HERITAGE.map((h, i) => (
              <Reveal key={h.title} delay={(i % 3) * 100}>
                <div className="border-t border-foreground/20 pt-5">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">{h.place}</p>
                  <h3 className="mt-2 font-serif text-2xl">{h.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{h.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <div className="mt-24 text-center">
              <p className="font-serif text-3xl text-primary">స్వాగతం</p>
              <p className="mt-4 font-serif text-2xl italic">The road keeps going past every fort.</p>
              <div className="mt-8 flex justify-center">
                <TextLink href="#top">Back to the beginning</TextLink>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <footer className="border-t py-12">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-xs uppercase tracking-[0.2em] text-muted-foreground md:flex-row">
          <span className="font-serif text-sm normal-case tracking-normal text-foreground">తెలంగాణ · Telangana</span>
          <span className="normal-case tracking-normal">Rivers, rock and royal memory.</span>
          <span>Formed 2 June 2014</span>
        </div>
      </footer>
    </div>
  );
}

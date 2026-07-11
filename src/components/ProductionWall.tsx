interface WallImage {
  id: string;
  src: string;
  aspect: string;
}

const images: WallImage[] = [
  { id: "w-sprite", src: "/PPM Decks/Sprite.png", aspect: "4:3" },
  { id: "w-centrum", src: "/PPM Decks/Centrum.png", aspect: "16:9" },
  { id: "w-ax", src: "/PPM Decks/AX.png", aspect: "4:5" },
  { id: "w-idee", src: "/PPM Decks/IDEE.png", aspect: "4:3" },
  { id: "w-hdfc", src: "/PPM Decks/HDFC.png", aspect: "16:9" },
  { id: "w-kinder", src: "/PPM Decks/Kinder.png", aspect: "3:4" },
  { id: "w-fossil", src: "/Treatment Notes/Fossil.png", aspect: "4:5" },
  { id: "w-godrej", src: "/Treatment Notes/godrej.png", aspect: "4:3" },
  { id: "w-ponds", src: "/Treatment Notes/ponds.png", aspect: "16:9" },
  { id: "w-tanishq", src: "/Others/Tanishq.png", aspect: "3:4" },
  { id: "w-lifestyle", src: "/Others/lifestyle.png", aspect: "4:3" },
  { id: "w-artkalaa", src: "/Marketing Pitch/artkalaa.png", aspect: "4:5" },
  { id: "w-artkalaa-2", src: "/Marketing Pitch/artkalaa 2.png", aspect: "1:1" },
  { id: "w-oool", src: "/Marketing Pitch/oool.png", aspect: "4:3" },
  { id: "w-kitser", src: "/Marketing Pitch/kister.png", aspect: "3:4" },
  { id: "w-deva", src: "/Marketing Pitch/Deva.png", aspect: "4:5" },
  { id: "w-justbe", src: "/Marketing Pitch/Just be.png", aspect: "16:9" },
  { id: "w-bubbling", src: "/Marketing Pitch/the.png", aspect: "4:5" },
  { id: "w-murgi-1", src: "/Movie - OTT pitches/Murgi.png", aspect: "4:5" },
  { id: "w-murgi-2", src: "/Movie - OTT pitches/Murgi 1.png", aspect: "9:16" },
  { id: "w-pathan-1", src: "/Movie - OTT pitches/Pathan 1.png", aspect: "4:5" },
  { id: "w-pathan-2", src: "/Movie - OTT pitches/Pathan 2.png", aspect: "3:4" },
];

function shuffle(arr: WallImage[]) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const shuffled = shuffle(images);

function Card({ img }: { img: WallImage }) {
  return (
    <div className="break-inside-avoid mb-6">
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: img.aspect, borderRadius: "10px", backgroundColor: "#1a1a1a" }}>
        <img
          src={img.src}
          alt=""
          className="w-full h-full object-cover"
          style={{ display: "block", borderRadius: "10px" }}
          loading="lazy"
        />
      </div>
    </div>
  );
}

export default function ProductionWall() {
  return (
    <section className="py-24 md:py-32 bg-cinema-black">
      <div className="max-w-[1440px] mx-auto px-8 md:px-10">
        <div className="mb-14">
          <p className="text-caption font-switzer font-[400] text-stone uppercase tracking-[0.02em]">Production Archive</p>
          <h2 className="text-display md:text-heading-lg font-switzer font-[300] text-cinema-white leading-[1] tracking-[-0.04em] mt-3">The Wall</h2>
        </div>

        <div
          className="columns-2 md:columns-3 xl:columns-5"
          style={{ columnGap: "24px", columnFill: "auto" }}
        >
          {shuffled.map((img) => (
            <Card key={img.id} img={img} />
          ))}
        </div>
      </div>
    </section>
  );
}

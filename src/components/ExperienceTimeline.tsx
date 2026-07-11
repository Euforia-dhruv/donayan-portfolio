import experience from "@/data/experience.json";
import productionHouses from "@/data/production-houses.json";

const phMap = new Map(productionHouses.map((ph) => [ph.id, ph.name]));

function formatDate(dateStr: string) {
  const [year, month] = dateStr.split("-");
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  return `${months[parseInt(month) - 1]} ${year}`;
}

export default function ExperienceTimeline() {
  const sorted = [...experience].sort(
    (a, b) => (b.displayOrder || 0) - (a.displayOrder || 0)
  );

  return (
    <section id="experience" className="py-16 md:py-24 bg-parchment">
      <div className="w-full max-w-[1200px] mx-auto px-5 md:px-8">
        <div className="max-w-3xl mb-10 md:mb-14">
          <p className="text-caption font-af font-[500] text-ash uppercase tracking-normal mb-3">
            Timeline
          </p>
          <h2 className="text-heading-lg md:text-display font-ppmondwest font-[400] leading-[1.1] tracking-[-0.02em] text-graphite text-balance">
            Experience
          </h2>
        </div>

        <div className="max-w-3xl bg-paper border border-mist rounded-xl shadow-subtle p-6 md:p-8">
          <div className="space-y-0">
            {sorted.map((entry, i) => (
              <div
                key={entry.id}
                className={`py-5 ${i < sorted.length - 1 ? "border-b border-mist" : ""}`}
              >
                <div className="grid grid-cols-1 md:grid-cols-[150px_1fr] gap-2 md:gap-5">
                  <div>
                    <p className="text-body-sm font-af font-[500] text-ash leading-[1] tracking-[-0.01em]">
                      {formatDate(entry.startDate)} –{" "}
                      {entry.endDate ? formatDate(entry.endDate) : "Present"}
                    </p>
                    <p className="text-caption font-af font-[400] text-fog mt-1 leading-[1.3]">
                      {phMap.get(entry.productionHouseId) || entry.productionHouseId}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-heading-sm font-ppmondwest font-[400] leading-[1.5] tracking-[-0.02em] text-graphite">
                      {entry.roleTitle}
                    </h3>
                    {entry.description && (
                      <p className="mt-1.5 text-caption font-af font-[400] text-charcoal leading-[1.3] max-w-lg">
                        {entry.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

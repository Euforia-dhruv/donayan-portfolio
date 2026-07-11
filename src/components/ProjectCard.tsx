interface ProjectCardProps {
  project: {
    id: string;
    title: string;
    brand: string;
    role: string;
    year: string;
    description: string;
    featured: boolean;
    talents: string[];
    mediaAssets: { url?: string; altText?: string }[];
  };
  index: number;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const hasImage = project.mediaAssets && project.mediaAssets.length > 0 && project.mediaAssets[0]?.url;

  return (
    <article className="group bg-paper border border-mist rounded-xl shadow-subtle overflow-hidden hover:border-fog transition-colors">
      <div className="relative aspect-[4/5] overflow-hidden bg-linen">
        {hasImage ? (
          <img
            src={project.mediaAssets[0].url}
            alt={project.mediaAssets[0].altText || `${project.brand} campaign`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center p-6">
            <div className="text-center">
              <p className="text-body-sm font-af font-[500] text-ash mb-1 leading-[1]">
                {project.brand}
              </p>
              <p className="text-caption font-af font-[400] text-fog leading-[1.3]">
                No image yet
              </p>
            </div>
          </div>
        )}

        {project.featured && (
          <span className="absolute top-3 right-3 px-3 py-1 bg-signal-blue text-white text-caption font-af font-[500] rounded-lg leading-none">
            Featured
          </span>
        )}

        {project.talents.length > 0 && (
          <div className="absolute bottom-3 left-3 flex flex-wrap gap-1">
            {project.talents.map((talent) => (
              <span
                key={talent}
                className="px-2.5 py-1 bg-white/90 text-charcoal text-caption font-af font-[500] rounded-lg leading-none shadow-sm"
              >
                {talent}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-heading-sm font-ppmondwest font-[400] leading-[1.5] tracking-[-0.02em] text-graphite">
          {project.brand}
        </h3>

        <p className="mt-1 text-body-sm font-af font-[400] text-ash leading-[1] tracking-[-0.01em]">
          {project.role} &middot; {project.year}
        </p>

        {project.description && (
          <p className="mt-2 text-caption font-af font-[400] text-charcoal leading-[1.3] line-clamp-2">
            {project.description}
          </p>
        )}
      </div>
    </article>
  );
}

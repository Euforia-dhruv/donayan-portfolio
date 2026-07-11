import siteContent from "@/data/site-content.json";

export default function Footer() {
  return (
    <footer className="bg-bone-white border-t border-ash/50 py-12 md:py-16">
      <div className="max-w-[1400px] mx-auto px-8 md:px-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <h3 className="text-heading-sm font-switzer font-[300] text-ink-black leading-[1] tracking-[-0.02em]">
              Donayan Sahdev
            </h3>
            <p className="mt-2 text-body-sm font-switzer font-[400] text-graphite">
              {siteContent.tagline}
            </p>
          </div>

          <div className="flex gap-6 text-body-sm font-switzer font-[400] text-graphite uppercase tracking-[0.02em]">
            <a href={siteContent.social.instagram} target="_blank" rel="noopener noreferrer" className="no-underline text-inherit hover:text-ink-black transition-colors">Instagram</a>
            <a href={siteContent.social.linkedin} target="_blank" rel="noopener noreferrer" className="no-underline text-inherit hover:text-ink-black transition-colors">LinkedIn</a>
            <a href={siteContent.resumePdf} target="_blank" rel="noopener noreferrer" className="no-underline text-inherit hover:text-ink-black transition-colors">Resume</a>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-ash/50 flex flex-col md:flex-row justify-between gap-4">
          <p className="text-caption font-switzer font-[400] text-ash">
            {siteContent.footer.copyright}
          </p>
          <p className="text-caption font-switzer font-[400] text-ash">
            {siteContent.contact.location}
          </p>
        </div>
      </div>
    </footer>
  );
}

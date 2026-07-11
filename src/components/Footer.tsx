import siteContent from "@/data/site-content.json";

export default function Footer() {
  return (
    <footer>
      {/* Marker Orange brand band */}
      <div
        className="bg-marker-orange px-6 md:px-8 py-12 md:py-16"
        style={{ borderRadius: "56px 56px 0 0" }}
      >
        <div className="max-w-[1200px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <h3 className="font-gelica font-[500] text-charcoal leading-[1.2] lowercase"
                style={{ fontSize: "clamp(28px, 3vw, 36px)" }}>
                Donayan Sahdev
              </h3>
              <p className="mt-2 font-gelica font-[400] text-charcoal/70" style={{ fontSize: "18px" }}>
                {siteContent.tagline}
              </p>
            </div>

            <div className="flex gap-8 font-geist font-[400] text-charcoal/80" style={{ fontSize: "16px" }}>
              <a href={siteContent.social.instagram} target="_blank" rel="noopener noreferrer" className="no-underline text-inherit hover:text-charcoal transition-colors">Instagram</a>
              <a href={siteContent.social.linkedin} target="_blank" rel="noopener noreferrer" className="no-underline text-inherit hover:text-charcoal transition-colors">LinkedIn</a>
              <a href={siteContent.resumePdf} target="_blank" rel="noopener noreferrer" className="no-underline text-inherit hover:text-charcoal transition-colors">Resume</a>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-charcoal/20 flex flex-col md:flex-row justify-between gap-4">
            <p className="font-geist font-[400] text-charcoal/50" style={{ fontSize: "14px" }}>
              {siteContent.footer.copyright}
            </p>
            <p className="font-geist font-[400] text-charcoal/50" style={{ fontSize: "14px" }}>
              {siteContent.contact.location}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

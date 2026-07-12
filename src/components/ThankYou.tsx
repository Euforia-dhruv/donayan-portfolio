"use client";

import { useEffect, useRef, useState } from "react";

export default function ThankYou() {
  const [show, setShow] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setShow(true); },
      { threshold: 0.2 }
    );
    const el = ref.current;
    if (el) obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      style={{
        backgroundColor: "#0A0A0A",
        padding: "100px 32px",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          opacity: show ? 1 : 0,
          transform: show ? "translateY(0)" : "translateY(30px)",
          transition: "opacity 0.8s ease, transform 0.8s ease",
          textAlign: "center",
        }}
      >
        <img
          src="/assets/images/thank-you.png"
          alt="Thank You"
          style={{
            width: "100%",
            height: "auto",
            maxWidth: "700px",
            margin: "0 auto",
            display: "block",
          }}
        />
      </div>
    </section>
  );
}

"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface GalleryItem {
  src: string;
  alt: string;
  caption: string;
}

interface LightboxGalleryProps {
  items: GalleryItem[];
}

export function LightboxGallery({ items }: LightboxGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActiveIndex(null);
      }

      if (activeIndex === null) {
        return;
      }

      if (event.key === "ArrowRight") {
        setActiveIndex((activeIndex + 1) % items.length);
      }

      if (event.key === "ArrowLeft") {
        setActiveIndex((activeIndex - 1 + items.length) % items.length);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeIndex, items.length]);

  const activeItem = activeIndex === null ? null : items[activeIndex];

  return (
    <>
      <div className="masonry-grid" role="list" aria-label="Parish gallery">
        {items.map((item, index) => (
          <button
            key={item.src}
            type="button"
            className="masonry-item"
            onClick={() => setActiveIndex(index)}
            aria-label={`Open image: ${item.caption}`}
          >
            <Image src={item.src} alt={item.alt} width={900} height={1200} />
            <span>{item.caption}</span>
          </button>
        ))}
      </div>

      {activeItem ? (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={activeItem.caption}>
          <button type="button" className="lightbox-close" onClick={() => setActiveIndex(null)}>
            Close
          </button>
          <button
            type="button"
            className="lightbox-nav lightbox-prev"
            onClick={() => setActiveIndex((activeIndex! - 1 + items.length) % items.length)}
            aria-label="Previous image"
          >
            Prev
          </button>
          <figure>
            <Image src={activeItem.src} alt={activeItem.alt} width={1400} height={980} />
            <figcaption>{activeItem.caption}</figcaption>
          </figure>
          <button
            type="button"
            className="lightbox-nav lightbox-next"
            onClick={() => setActiveIndex((activeIndex! + 1) % items.length)}
            aria-label="Next image"
          >
            Next
          </button>
        </div>
      ) : null}
    </>
  );
}

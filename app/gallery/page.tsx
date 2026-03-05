import { LightboxGallery } from "@/components/lightbox-gallery";

const items = [
  {
    src: "/images/gallery/community-1.jpg",
    alt: "Parishioners gathered in church",
    caption: "Sunday gathering and welcome"
  },
  {
    src: "/images/gallery/liturgy-1.jpg",
    alt: "Church exterior and parish entrance",
    caption: "Church exterior"
  },
  {
    src: "/images/gallery/choir-1.jpg",
    alt: "Music and liturgy preparation",
    caption: "Liturgy and music ministry"
  },
  {
    src: "/images/gallery/outreach-1.jpg",
    alt: "Parish outreach support",
    caption: "Community outreach"
  },
  {
    src: "/images/gallery/prayer-1.jpg",
    alt: "Prayer in church interior",
    caption: "Prayer and adoration"
  },
  {
    src: "/images/gallery/feast-1.jpg",
    alt: "Parish feast and celebration",
    caption: "Feast day celebration"
  }
];

export default function GalleryPage() {
  return (
    <>
      <header className="page-header">
        <div className="site-width">
          <h1>Parish Gallery</h1>
          <p>Moments from liturgy, prayer, and community life. Select an image to open lightbox view.</p>
        </div>
      </header>
      <section className="section">
        <div className="site-width">
          <LightboxGallery items={items} />
        </div>
      </section>
    </>
  );
}

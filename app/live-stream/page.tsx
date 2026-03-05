export default function LiveStreamPage() {
  return (
    <>
      <header className="page-header">
        <div className="site-width">
          <h1>Live Stream</h1>
          <p>Join Mass and parish prayer online when you are unable to attend in person.</p>
        </div>
      </header>
      <section className="section">
        <div className="site-width">
          <iframe
            className="live-stream-frame"
            src="https://www.youtube.com/embed/live_stream?channel=UC4R8DWoMoI7CAwX8_LjQHig"
            title="Parish live stream"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
          <div className="typographic-block">
            <p>
              <a href="https://www.youtube.com" target="_blank" rel="noreferrer">
                Open stream in a new window
              </a>
            </p>
            <p>
              Donation options: parish offertory envelope, card giving at church, or
              online donation platform (replace with parish-approved link).
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

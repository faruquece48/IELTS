# Maps Trip Time Recorder

## Install in Chrome

1. Open `chrome://extensions`.
2. Turn on **Developer mode**.
3. Click **Load unpacked**.
4. Select this `maps-trip-recorder` folder.
5. Open Google Maps, choose **Directions**, and enter a starting point and destination.
6. Wait for the route results to appear. The extension compares the displayed alternatives, records only the route with the shortest travel time and its matching distance, and saves another snapshot every 60 seconds while Chrome remains open.
7. Click the extension icon to review history, edit and save a separate copy, or export CSV.

The extension stores trip records locally in Chrome. Every one-minute shortest-route snapshot is retained so changes in traffic time can be reviewed later. Once a journey has been captured, the extension remembers its Maps URL. While Chrome is open, it revisits saved journeys in inactive tabs every minute, waits for the route alternatives to load, records the fastest one, and closes the tabs. You do not need to keep Google Maps open. Between scheduled snapshots, duplicate records caused by ordinary Maps page redraws are ignored. Use **Export CSV** to download the history. If the extension was installed while Google Maps was already open, reload the Maps tab once.

Use the **Automatic collection** switch in the extension popup to pause or resume data collection. Pausing closes background collector tabs immediately and prevents open Maps tabs from creating automatic snapshots. Existing history is preserved, and manually saving a trip remains available.

Automatic snapshots estimate the share of the four Google Maps traffic colors (green, yellow, red, and maroon) from the rendered Maps tab. This image-based breakdown is free and requires no API key. It is marked as an estimate because nearby visible roads can contribute pixels. The extension uses Chrome's debugger capture permission so the same analysis can run in inactive collector tabs without bringing them to the foreground.

When `/personal/traffic` is opened on localhost, `127.0.0.1`, or a Vercel deployment, the extension automatically sends its saved history to that Traffic page. Reload both the extension and the Traffic tab after installing an updated version.

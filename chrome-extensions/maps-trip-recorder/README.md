# Maps Trip Time Recorder

## Install in Chrome

1. Open `chrome://extensions`.
2. Turn on **Developer mode**.
3. Click **Load unpacked**.
4. Select this `maps-trip-recorder` folder.
5. Open Google Maps, choose **Directions**, and enter a starting point and destination.
6. Wait for the route results to appear. The extension compares the displayed alternatives, records only the route with the shortest travel time and its matching distance, and saves another snapshot every 60 seconds while Chrome remains open.
7. Click the extension icon to review history, edit and save a separate copy, or export CSV.

The extension monitors ten long, junction-based Dhaka survey circuits. Each Google Maps URL includes all required intermediate junctions, so the collector does not replace a circuit with the former short street path. The circuits cover Airport Road, Mirpur Road, Pragati Sarani, Hatirjheel, Gulshan/Badda, Old Dhaka, Jatrabari, Demra, and the western/southern arterials. Each circuit is at least 50 km long.

The extension stores trip records locally in Chrome. Every one-minute shortest-route snapshot is retained so changes in traffic time can be reviewed later. While Chrome is open, it revisits the ten Dhaka corridors and saved journeys in inactive tabs every minute, waits for route details to load, records the fastest displayed route, and closes the tabs. You do not need to keep Google Maps open. Between scheduled snapshots, duplicate records caused by ordinary Maps page redraws are ignored. Use **Export CSV** to download the history. If the extension was installed while Google Maps was already open, reload the Maps tab once.

The collector keeps the ten configured Google Maps routes inside one minimized background window, outside the main Chrome tab bar. The extension's one-minute alarm explicitly asks every route tab to record, including when Chrome throttles ordinary background timers. A startup lock prevents extension reloads from creating duplicate collector windows. Snapshot writes are serialized by the background worker so one route cannot overwrite another route's reading.

While a route is loading, an independent five-second readiness check looks for complete directions. This prevents Google Maps' continuous page updates from postponing the first snapshot indefinitely.

Traffic history is stored in `data/traffic-records.json` inside the website project instead of inside a Chrome profile. Keep the website running at `http://localhost:3000` while collecting. Every Chrome profile using the extension reads and writes the same file. Copying the complete project folder to another PC carries the history with it; run the website there and load the unpacked extension again.

Use the **Automatic collection** switch in the extension popup to pause or resume data collection. Pausing closes background collector tabs immediately and prevents open Maps tabs from creating automatic snapshots. Existing history is preserved, and manually saving a trip remains available.

Automatic snapshots use Chrome's debugger capture permission to estimate green, yellow, red, and maroon portions. The ten routes remain rendered in one normal, unfocused collector window because minimized windows do not reliably render Google Maps' traffic layer. Chrome always displays its debugging notice during this capture; extensions cannot hide that browser notice.

## Keep the debugger notice out of other Chrome profiles

A regular Chrome profile still shares the same running Chrome application, so the debugger notice can appear above windows belonging to other profiles. Use `Start-Isolated-Recorder.cmd` to launch the recorder in a separate Chrome instance with its own user-data directory. The debugger notice will then remain inside that isolated recorder instance.

On the first launch only, open `chrome://extensions`, enable **Developer mode**, choose **Load unpacked**, and select this `maps-trip-recorder` folder. Keep automatic collection enabled in this isolated instance and disable or remove the extension from ordinary Chrome profiles. Later, start the recorder by double-clicking `Start-Isolated-Recorder.cmd`.

The collector window stays rendered and unfocused between collection rounds so Google Maps' traffic layer remains available for reliable color capture.

Each automatic snapshot includes the circuit ID and its waypoint URL, as well as the origin and destination coordinates embedded by Google Maps. This keeps records for circuits with the same start and end point separate.

The study map renders its fixed major-junction circuits and ignores live traffic when drawing the coverage line.

When `/personal/traffic` is opened on localhost, `127.0.0.1`, or a Vercel deployment, the extension automatically sends its saved history to that Traffic page. Reload both the extension and the Traffic tab after installing an updated version.

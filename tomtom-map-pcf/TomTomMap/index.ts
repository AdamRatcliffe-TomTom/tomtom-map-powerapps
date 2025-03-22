import { IInputs, IOutputs } from "./generated/ManifestTypes";

const isRunningLocally =
  window.location.hostname === "localhost" ||
  window.location.hostname.startsWith("127.");

const mapUrl = isRunningLocally
  ? "http://localhost:3000/tomtom-map-iframe"
  : "https://cpmdemos.blob.core.windows.net/$web/tomtom-map-iframe/index.html";

export class TomTomMap
  implements ComponentFramework.StandardControl<IInputs, IOutputs>
{
  private _container: HTMLDivElement;
  private _iframe: HTMLIFrameElement;
  private _fullscreenOverlay: HTMLDivElement | null = null;
  private _context: ComponentFramework.Context<IInputs>;
  private _notifyOutputChanged: () => void;
  private _handleKeydown: (e: KeyboardEvent) => void;

  public init(
    context: ComponentFramework.Context<IInputs>,
    notifyOutputChanged: () => void,
    state: ComponentFramework.Dictionary,
    container: HTMLDivElement
  ): void {
    this._context = context;
    this._notifyOutputChanged = notifyOutputChanged;
    this._container = container;
    this._container.style.position = "relative";

    this._iframe = document.createElement("iframe");
    this._iframe.id = "tomtom-map-iframe";
    this._iframe.className = "map-hidden-style";

    this._iframe.onload = () => this.postMapMessage(this._iframe);

    this.renderMap();
    this._container.appendChild(this._iframe);

    const fullscreenBtn = document.createElement("div");
    fullscreenBtn.className = "map-btn fullscreen-btn";
    fullscreenBtn.title = "Enter fullscreen";
    fullscreenBtn.onclick = () => this.launchFullscreenOverlay();
    this._container.appendChild(fullscreenBtn);
  }

  private launchFullscreenOverlay(): void {
    if (this._fullscreenOverlay) return;

    this._fullscreenOverlay = document.createElement("div");
    this._fullscreenOverlay.id = "tomtom-map-fullscreen-overlay";
    this._fullscreenOverlay.style.position = "fixed";
    this._fullscreenOverlay.style.top = "0";
    this._fullscreenOverlay.style.left = "0";
    this._fullscreenOverlay.style.width = "100vw";
    this._fullscreenOverlay.style.height = "100vh";
    this._fullscreenOverlay.style.zIndex = "99999";
    this._fullscreenOverlay.style.backgroundColor = "#fff";

    const iframe = document.createElement("iframe");
    iframe.src = mapUrl;
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    iframe.style.border = "none";

    iframe.onload = () => this.postMapMessage(iframe);

    const closeBtn = document.createElement("div");
    closeBtn.className = "map-btn close-btn";
    closeBtn.title = "Exit fullscreen";
    closeBtn.onclick = () => this.closeFullscreenOverlay();

    this._fullscreenOverlay.appendChild(iframe);
    this._fullscreenOverlay.appendChild(closeBtn);
    document.body.appendChild(this._fullscreenOverlay);

    this._handleKeydown = (e: KeyboardEvent) => {
      if (e.key === "Escape") this.closeFullscreenOverlay();
    };
    document.addEventListener("keydown", this._handleKeydown);
  }

  private closeFullscreenOverlay(): void {
    if (this._fullscreenOverlay) {
      this._fullscreenOverlay.remove();
      this._fullscreenOverlay = null;
      document.removeEventListener("keydown", this._handleKeydown);
    }
  }

  public renderMap(): void {
    const url = this._context.parameters.url?.raw || "";

    if (url) {
      if (!this._iframe.src || this._iframe.src !== mapUrl) {
        this._iframe.src = mapUrl;
      }
      this._iframe.className = "map-visible-style";
    } else {
      this._iframe.className = "map-hidden-style";
    }
  }

  private postMapMessage(iframe: HTMLIFrameElement): void {
    const context = this._context;

    const apiKey = context.parameters.apiKey.raw || "";
    const latitude = Number(context.parameters.latitude.raw) || 0;
    const longitude = Number(context.parameters.longitude.raw) || 0;
    const zoom = context.parameters.zoom.raw || 12;
    const map = context.parameters.map.raw || "";
    const url = context.parameters.url?.raw || "";
    const method = context.parameters.method?.raw || "GET";
    const headersRaw = context.parameters.headers?.raw || "";
    const body = context.parameters.body?.raw || "";

    let headers: { key: string; value: string }[] = [];
    try {
      const parsed = JSON.parse(headersRaw);
      if (Array.isArray(parsed)) {
        headers = parsed;
      } else if (typeof parsed === "object") {
        headers = Object.entries(parsed).map(([key, value]) => ({
          key,
          value: String(value)
        }));
      }
    } catch (e) {
      console.warn("Could not parse headers JSON:", e);
    }

    iframe.contentWindow?.postMessage(
      {
        type: "pcfMapConfig",
        payload: {
          apiKey,
          center: [longitude, latitude],
          zoom,
          map,
          url,
          method,
          headers,
          body
        }
      },
      "*"
    );
  }

  public updateView(context: ComponentFramework.Context<IInputs>): void {
    this._context = context;
    this.renderMap();

    // Post new data to iframe if already visible
    if (this._iframe.className === "map-visible-style") {
      this.postMapMessage(this._iframe);
    }

    // Update fullscreen overlay iframe if it's open
    const overlayIframe = this._fullscreenOverlay?.querySelector("iframe");
    if (overlayIframe) {
      this.postMapMessage(overlayIframe);
    }
  }

  public getOutputs(): IOutputs {
    return {};
  }

  public destroy(): void {
    this._container.innerHTML = "";
    this.closeFullscreenOverlay();
  }
}

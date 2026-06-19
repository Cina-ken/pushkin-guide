"use client";

import { useEffect, useRef, useState } from "react";
import { SITES } from "@/lib/sites";
import { initRecognition, identify, indexedCount, isReady, type MatchResult } from "@/lib/recognition";

type Mode = "scan" | "directory";

export default function Home() {
  const [mode, setMode] = useState<Mode>("scan");
  const [modelReady, setModelReady] = useState(false);
  const [status, setStatus] = useState("Loading recognition model...");
  const [cameraOn, setCameraOn] = useState(false);
  const [result, setResult] = useState<MatchResult>(null);
  const [busy, setBusy] = useState(false);
  const [shownImage, setShownImage] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    initRecognition(setStatus)
      .then(() => {
        setModelReady(true);
        setStatus("Ready - " + indexedCount() + " reference images indexed.");
      })
      .catch((e) => {
        setStatus("Could not load the model: " + e.message);
      });
    return () => stopCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function attachStream(stream: MediaStream) {
    streamRef.current = stream;
    setCameraOn(true);
    setShownImage(null);
    await new Promise((r) => setTimeout(r, 60));
    const v = videoRef.current;
    if (!v) return;
    v.srcObject = stream;
    v.setAttribute("playsinline", "true");
    v.setAttribute("webkit-playsinline", "true");
    v.muted = true;
    const tryPlay = () => v.play().catch(() => {});
    if (v.readyState >= 1) tryPlay();
    v.onloadedmetadata = tryPlay;
  }

  async function startCamera() {
    setResult(null);
    setStatus("Requesting camera...");
    try {
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" } },
          audio: false,
        });
      } catch {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      }
      await attachStream(stream);
      setStatus("Point at a landmark and tap Identify.");
    } catch (err) {
      const name = (err as Error)?.name || "";
      if (name === "NotAllowedError") {
        setStatus("Camera permission was denied. Allow it in the browser, or use Upload a photo.");
      } else if (name === "NotFoundError") {
        setStatus("No camera found on this device - use Upload a photo.");
      } else {
        setStatus("Camera unavailable - use Upload a photo instead.");
      }
      setCameraOn(false);
    }
  }

  function stopCamera() {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraOn(false);
  }

  function identifyFromVideo() {
    if (!videoRef.current || !canvasRef.current) return;
    if (!isReady()) { setStatus("Model still loading, please wait a moment."); return; }
    const v = videoRef.current;
    if (!v.videoWidth) { setStatus("Camera still starting - try again in a second."); return; }
    setBusy(true);
    const c = canvasRef.current;
    c.width = v.videoWidth;
    c.height = v.videoHeight;
    c.getContext("2d")!.drawImage(v, 0, 0);
    // Freeze the captured frame on screen so the user SEES what was analyzed
    setShownImage(c.toDataURL("image/jpeg"));
    const match = identify(c);
    setResult(match);
    setStatus(match ? "" : "No confident match - try a clearer, straight-on shot.");
    stopCamera();
    setBusy(false);
  }

  function identifyFromFile(file: File) {
    if (!isReady()) { setStatus("Model still loading, please wait a moment."); return; }
    setBusy(true);
    setResult(null);
    stopCamera();
    const url = URL.createObjectURL(file);
    setShownImage(url); // show the uploaded image on screen
    const img = new Image();
    img.onload = () => {
      const match = identify(img);
      setResult(match);
      setStatus(match ? "" : "No confident match - try another photo.");
      setBusy(false);
    };
    img.onerror = () => { setStatus("Could not read that image."); setBusy(false); };
    img.src = url;
  }

  return (
    <div className="wrap">
      <div className="topbar">
        <div className="crest">П</div>
        <div className="title">
          Pushkinskaya Walk
          <small>Rostov-on-Don - landmark guide</small>
        </div>
      </div>
      <p className="lede">
        Point your camera at a monument or historic building on Pushkinskaya
        Street - the app recognises it and tells you its story. No camera? Upload
        a photo instead.
      </p>

      <div className="tabs">
        <div className={"tab " + (mode === "scan" ? "active" : "")} onClick={() => setMode("scan")}>Identify</div>
        <div className={"tab " + (mode === "directory" ? "active" : "")} onClick={() => setMode("directory")}>All sites</div>
      </div>

      {mode === "scan" && (
        <>
          <div className="card">
            <div className="viewport">
              {cameraOn ? (
                <>
                  <video ref={videoRef} autoPlay playsInline muted />
                  <div className="reticle" />
                  <div className="scanline" />
                </>
              ) : shownImage ? (
                <img src={shownImage} alt="Captured" />
              ) : (
                <div className="viewport-empty">
                  {modelReady ? "Camera preview or your photo will appear here" : "Loading recognition model..."}
                </div>
              )}
            </div>
            <canvas ref={canvasRef} style={{ display: "none" }} />
            <div className="status">{status}</div>

            <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
              {!cameraOn ? (
                <button className="btn" onClick={startCamera}>Start camera</button>
              ) : (
                <>
                  <button className="btn" disabled={busy} onClick={identifyFromVideo}>Identify</button>
                  <button className="btn ghost" onClick={stopCamera}>Stop</button>
                </>
              )}
            </div>

            <label className="btn ghost" style={{ display: "block", marginTop: 10, textAlign: "center" }}>
              Upload a photo
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => e.target.files?.[0] && identifyFromFile(e.target.files[0])}
              />
            </label>
          </div>

          {result && (
            <div className="card">
              <span className="badge">{result.site.category}</span>
              <h2 className="result-name">{result.site.name}</h2>
              <div className="result-meta">{result.site.nameRu} - {result.site.address} - {result.site.year}</div>
              <div className="conf">Match confidence: {(result.similarity * 100).toFixed(0)}%</div>
              <p className="summary" style={{ marginTop: 10 }}>{result.site.summary}</p>
            </div>
          )}

          <div className="notice">
            Only civilian cultural-heritage sites are included. In keeping with
            the assignment, no military buildings are catalogued or photographed.
          </div>
        </>
      )}

      {mode === "directory" && (
        <div className="card">
          <h2 style={{ marginTop: 0, fontSize: 17 }}>Tourist sites on Pushkinskaya Street</h2>
          <p className="note" style={{ marginTop: 0 }}>The eight sites this prototype recognises:</p>
          <div className="gallery">
            {SITES.map((s) => (
              <div className="g" key={s.id}>
                <h3>{s.name}</h3>
                <p>{s.nameRu}</p>
                <p style={{ marginTop: 6 }}>{s.address} - {s.year}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <footer className="credits">
        <div className="credits-title">Developed by</div>
        <div className="credits-names">
          Kenneth Chukwu · Akinbola Samuel Oluyemi · Mashuk Musfiq Ahmed · Umeh Samuel Ifeanyi
        </div>
        <div className="credits-sub">Modern Software Development · Technology Practicum 2026</div>
      </footer>
    </div>
  );
}
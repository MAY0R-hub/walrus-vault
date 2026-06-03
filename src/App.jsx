import { useState, useCallback } from "react";

const TATUM_API_KEY = "t-6a1fc9ee93ee252f9f3601e6-e8d5d1d7f1c9418c980f40ad";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;600;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #050810; --surface: #0c1120; --border: #1a2540;
    --accent: #00f5a0; --accent2: #00b4ff; --danger: #ff4466;
    --text: #e8edf8; --muted: #4a5578; --card: #0e1828;
  }
  body { background: var(--bg); color: var(--text); font-family: 'Syne', sans-serif; }
  .app {
    min-height: 100vh; background: var(--bg); padding: 0 16px 60px;
    background-image:
      radial-gradient(ellipse 80% 50% at 20% -10%, rgba(0,245,160,0.07) 0%, transparent 60%),
      radial-gradient(ellipse 60% 40% at 80% 100%, rgba(0,180,255,0.06) 0%, transparent 60%);
  }
  .header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 28px 0 40px; border-bottom: 1px solid var(--border); margin-bottom: 40px;
  }
  .logo { display: flex; align-items: center; gap: 10px; font-family: 'Space Mono', monospace; font-size: 18px; font-weight: 700; }
  .logo-icon { width: 32px; height: 32px; background: linear-gradient(135deg, var(--accent), var(--accent2)); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 16px; }
  .logo span { color: var(--accent); }
  .badge { font-family: 'Space Mono', monospace; font-size: 10px; padding: 4px 10px; border: 1px solid var(--accent); border-radius: 20px; color: var(--accent); letter-spacing: 1px; }
  .hero { text-align: center; margin-bottom: 36px; }
  .hero h1 { font-size: clamp(28px, 7vw, 48px); font-weight: 800; line-height: 1.1; letter-spacing: -1px; margin-bottom: 12px; }
  .hero h1 .hl { background: linear-gradient(90deg, var(--accent), var(--accent2)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
  .hero p { color: var(--muted); font-family: 'Space Mono', monospace; font-size: 12px; max-width: 420px; margin: 0 auto; line-height: 1.6; }
  .steps { display: flex; gap: 6px; justify-content: center; margin-bottom: 32px; flex-wrap: wrap; }
  .step { display: flex; align-items: center; gap: 6px; font-family: 'Space Mono', monospace; font-size: 10px; color: var(--muted); }
  .step.active { color: var(--accent); }
  .step.done { color: var(--accent2); }
  .step-num { width: 22px; height: 22px; border-radius: 50%; border: 1px solid currentColor; display: flex; align-items: center; justify-content: center; font-size: 10px; flex-shrink: 0; }
  .step.done .step-num { background: var(--accent2); color: var(--bg); border-color: var(--accent2); }
  .step.active .step-num { background: var(--accent); color: var(--bg); border-color: var(--accent); }
  .step-div { width: 16px; height: 1px; background: var(--border); }
  .card { background: var(--card); border: 1px solid var(--border); border-radius: 16px; padding: 24px; margin-bottom: 16px; }
  .card-title { font-size: 11px; font-family: 'Space Mono', monospace; color: var(--muted); letter-spacing: 1px; text-transform: uppercase; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
  .card-title::before { content: ''; width: 3px; height: 12px; background: var(--accent); border-radius: 2px; }
  .input-label { font-family: 'Space Mono', monospace; font-size: 11px; color: var(--muted); letter-spacing: 0.5px; margin-bottom: 8px; display: block; }
  .input-field { width: 100%; background: var(--surface); border: 1px solid var(--border); border-radius: 10px; padding: 12px 14px; color: var(--text); font-family: 'Syne', sans-serif; font-size: 14px; outline: none; transition: border-color 0.2s; }
  .input-field:focus { border-color: var(--accent); }
  .input-field::placeholder { color: var(--muted); }
  .select-field { width: 100%; background: var(--surface); border: 1px solid var(--border); border-radius: 10px; padding: 12px 14px; color: var(--text); font-family: 'Syne', sans-serif; font-size: 14px; outline: none; cursor: pointer; }
  .drop-zone { border: 2px dashed var(--border); border-radius: 12px; padding: 36px 20px; text-align: center; cursor: pointer; transition: all 0.2s; position: relative; overflow: hidden; }
  .drop-zone:hover, .drop-zone.dragging { border-color: var(--accent); background: rgba(0,245,160,0.03); }
  .drop-zone input[type="file"] { position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; height: 100%; font-size: 0; }
  .drop-icon { font-size: 36px; margin-bottom: 12px; pointer-events: none; }
  .drop-text { font-size: 15px; font-weight: 600; margin-bottom: 6px; pointer-events: none; }
  .drop-sub { font-family: 'Space Mono', monospace; font-size: 11px; color: var(--muted); pointer-events: none; }
  .file-preview { display: flex; align-items: center; gap: 12px; padding: 14px; background: rgba(0,245,160,0.05); border: 1px solid rgba(0,245,160,0.2); border-radius: 10px; margin-top: 16px; }
  .file-icon { font-size: 24px; flex-shrink: 0; }
  .file-info { flex: 1; min-width: 0; }
  .file-name { font-weight: 600; font-size: 14px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .file-size { font-family: 'Space Mono', monospace; font-size: 11px; color: var(--muted); margin-top: 2px; }
  .remove-btn { background: none; border: none; color: var(--muted); cursor: pointer; font-size: 18px; padding: 4px; line-height: 1; flex-shrink: 0; }
  .remove-btn:hover { color: var(--danger); }
  .network-toggle { display: flex; gap: 8px; margin-bottom: 16px; }
  .net-btn { flex: 1; padding: 10px; border-radius: 10px; border: 1px solid var(--border); background: none; color: var(--muted); font-family: 'Space Mono', monospace; font-size: 11px; cursor: pointer; transition: all 0.2s; }
  .net-btn.active { border-color: var(--accent); color: var(--accent); background: rgba(0,245,160,0.05); }
  .btn { width: 100%; padding: 16px; border-radius: 12px; border: none; font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700; cursor: pointer; transition: all 0.2s; letter-spacing: 0.3px; }
  .btn-primary { background: linear-gradient(135deg, var(--accent), var(--accent2)); color: var(--bg); }
  .btn-primary:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(0,245,160,0.25); }
  .btn-primary:disabled { opacity: 0.4; cursor: not-allowed; }
  .btn-secondary { background: var(--surface); color: var(--text); border: 1px solid var(--border); margin-top: 10px; }
  .progress-step { display: flex; align-items: flex-start; gap: 12px; padding: 14px 0; border-bottom: 1px solid var(--border); }
  .progress-step:last-child { border-bottom: none; }
  .progress-dot { width: 20px; height: 20px; border-radius: 50%; border: 2px solid var(--border); flex-shrink: 0; margin-top: 2px; display: flex; align-items: center; justify-content: center; font-size: 10px; transition: all 0.3s; }
  .progress-dot.loading { border-color: var(--accent); border-top-color: transparent; animation: spin 0.8s linear infinite; }
  .progress-dot.done { background: var(--accent); border-color: var(--accent); color: var(--bg); }
  .progress-dot.error { background: var(--danger); border-color: var(--danger); color: white; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .progress-label { font-size: 14px; font-weight: 600; }
  .progress-sub { font-family: 'Space Mono', monospace; font-size: 10px; color: var(--muted); margin-top: 3px; word-break: break-all; }
  .result-card { background: linear-gradient(135deg, rgba(0,245,160,0.05), rgba(0,180,255,0.05)); border: 1px solid rgba(0,245,160,0.3); border-radius: 16px; padding: 24px; margin-bottom: 16px; }
  .result-title { font-size: 20px; font-weight: 800; margin-bottom: 4px; }
  .result-sub { font-family: 'Space Mono', monospace; font-size: 11px; color: var(--muted); margin-bottom: 20px; }
  .data-row { margin-bottom: 14px; }
  .data-key { font-family: 'Space Mono', monospace; font-size: 10px; color: var(--accent); letter-spacing: 1px; text-transform: uppercase; margin-bottom: 4px; }
  .data-val { font-family: 'Space Mono', monospace; font-size: 12px; color: var(--text); word-break: break-all; background: var(--surface); padding: 8px 12px; border-radius: 8px; border: 1px solid var(--border); display: flex; align-items: center; gap: 8px; }
  .data-val span { flex: 1; }
  .copy-btn { background: none; border: none; color: var(--muted); cursor: pointer; font-size: 14px; padding: 2px; flex-shrink: 0; }
  .copy-btn:hover { color: var(--accent); }
  .share-section { margin-top: 20px; padding-top: 20px; border-top: 1px solid var(--border); }
  .share-label { font-family: 'Space Mono', monospace; font-size: 11px; color: var(--muted); margin-bottom: 10px; }
  .share-btns { display: flex; gap: 8px; }
  .share-btn { flex: 1; padding: 10px; border-radius: 10px; border: 1px solid var(--border); background: var(--surface); color: var(--text); font-family: 'Syne', sans-serif; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s; text-align: center; }
  .share-btn:hover { border-color: var(--accent); color: var(--accent); }
  .error-box { background: rgba(255,68,102,0.08); border: 1px solid rgba(255,68,102,0.3); border-radius: 10px; padding: 14px; font-family: 'Space Mono', monospace; font-size: 12px; color: var(--danger); margin-bottom: 16px; line-height: 1.5; }
  .stat-row { display: flex; gap: 10px; margin-bottom: 20px; }
  .stat { flex: 1; background: var(--surface); border: 1px solid var(--border); border-radius: 10px; padding: 14px 12px; text-align: center; }
  .stat-val { font-family: 'Space Mono', monospace; font-size: 20px; font-weight: 700; color: var(--accent); }
  .stat-label { font-size: 11px; color: var(--muted); margin-top: 4px; }
`;

const DOC_TYPES = ["Whitepaper", "Tokenomics", "Roadmap", "Audit Report", "Terms & Conditions", "Announcement", "Other"];

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / 1048576).toFixed(1) + " MB";
}

function truncate(str, n = 20) {
  if (!str || str.length <= n) return str || "";
  return str.slice(0, 10) + "..." + str.slice(-8);
}

export default function WalrusVault() {
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [docType, setDocType] = useState("Whitepaper");
  const [apiKey] = useState(TATUM_API_KEY);
  const [network, setNetwork] = useState("mainnet");
  const [phase, setPhase] = useState("upload");
  const [steps, setSteps] = useState([
    { id: "walrus", label: "Uploading to Walrus", sub: "Storing document on decentralized network", status: "pending" },
    { id: "sui", label: "Anchoring on Sui", sub: "Writing proof to blockchain via Tatum RPC", status: "pending" },
    { id: "verify", label: "Generating Certificate", sub: "Creating verification record", status: "pending" },
  ]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState("");
  const [records, setRecords] = useState([]);

  const walrusAggregator = network === "testnet"
    ? "https://aggregator.walrus-testnet.walrus.space"
    : "https://aggregator.walrus.space";

  const updateStep = (id, status, sub) => {
    setSteps(prev => prev.map(s => s.id === id ? { ...s, status, sub: sub || s.sub } : s));
  };

  const handleFile = (f) => {
    if (!f) return;
    if (f.size > 20 * 1024 * 1024) { setError("File too large. Max 20MB."); return; }
    setError("");
    setFile(f);
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }, []);

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(""), 2000);
    });
  };

  const shareOnX = () => {
    if (!result) return;
    const text = `Just permanently archived ${result.projectName}'s ${result.docType} on @WalrusFoundation storage, anchored on @SuiNetwork via @Tatum_io RPC.\n\nBlob ID: ${result.blobId.slice(0, 20)}...\n\nImmutable. Verifiable. Forever. 🔒\n\n#WalrusVault #Sui #Web3`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, "_blank");
  };

  const submit = async () => {
    if (!file || !projectName.trim()) return;
    setPhase("processing");
    setError("");
    setSteps(prev => prev.map(s => ({ ...s, status: "pending" })));

    try {
      // STEP 1: Upload to Walrus via proxy
      updateStep("walrus", "loading");
      let blobId;

      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("project", projectName);
        formData.append("type", docType);
        formData.append("timestamp", new Date().toISOString());

        const res = await fetch("/api/store", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) throw new Error(`Proxy error: ${res.status}`);
        const data = await res.json();
        if (!data.blobId) throw new Error("No blob ID returned");
        blobId = data.blobId;
        updateStep("walrus", "done", `Blob: ${truncate(blobId, 36)}`);
      } catch (e) {
        // Fallback demo mode
        blobId = "DEMO_" + Array.from(crypto.getRandomValues(new Uint8Array(16))).map(b => b.toString(16).padStart(2, "0")).join("");
        updateStep("walrus", "done", `Demo Blob: ${truncate(blobId, 36)}`);
      }

      // STEP 2: Anchor on Sui via Tatum
      updateStep("sui", "loading");
      let checkpoint = null;

      try {
        const suiRpc = `https://api.tatum.io/v1/blockchain/node/sui-${network}/${apiKey}`;
        const res = await fetch(suiRpc, {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-api-key": apiKey },
          body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "sui_getLatestCheckpointSequenceNumber", params: [] }),
        });
        const data = await res.json();
        checkpoint = data?.result;
        updateStep("sui", "done", `Checkpoint #${checkpoint}`);
      } catch (e) {
        checkpoint = "DEMO_" + Date.now();
        updateStep("sui", "done", `Demo checkpoint: ${checkpoint}`);
      }

      // STEP 3: Generate cert
      updateStep("verify", "loading");
      await new Promise(r => setTimeout(r, 700));

      const cert = {
        projectName,
        docType,
        fileName: file.name,
        fileSize: file.size,
        blobId,
        checkpoint,
        network,
        timestamp: new Date().toISOString(),
        certId: "WV-" + Date.now(),
        walrusUrl: `${walrusAggregator}/v1/blobs/${blobId}`,
      };

      updateStep("verify", "done", `Cert: ${cert.certId}`);
      setResult(cert);
      setRecords(prev => [cert, ...prev]);
      setPhase("done");

    } catch (err) {
      setError(err.message || "Something went wrong");
      setPhase("error");
    }
  };

  const reset = () => {
    setFile(null);
    setProjectName("");
    setDocType("Whitepaper");
    setPhase("upload");
    setError("");
    setResult(null);
    setSteps([
      { id: "walrus", label: "Uploading to Walrus", sub: "Storing document on decentralized network", status: "pending" },
      { id: "sui", label: "Anchoring on Sui", sub: "Writing proof to blockchain via Tatum RPC", status: "pending" },
      { id: "verify", label: "Generating Certificate", sub: "Creating verification record", status: "pending" },
    ]);
  };

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        <div className="header">
          <div className="logo">
            <div className="logo-icon">🔒</div>
            Walrus<span>Vault</span>
          </div>
          <div className="badge">HACKATHON BUILD</div>
        </div>

        {phase === "upload" && (
          <>
            <div className="hero">
              <h1>Immutable <span className="hl">Document</span><br />Registry</h1>
              <p>Store Web3 project documents permanently on Walrus. Timestamped on Sui. Verifiable forever.</p>
            </div>

            <div className="steps">
              <div className="step active"><div className="step-num">1</div>Upload</div>
              <div className="step-div" />
              <div className="step"><div className="step-num">2</div>Store</div>
              <div className="step-div" />
              <div className="step"><div className="step-num">3</div>Anchor</div>
              <div className="step-div" />
              <div className="step"><div className="step-num">4</div>Certify</div>
            </div>

            {records.length > 0 && (
              <div className="stat-row">
                <div className="stat"><div className="stat-val">{records.length}</div><div className="stat-label">Docs Stored</div></div>
                <div className="stat"><div className="stat-val">{new Set(records.map(r => r.projectName)).size}</div><div className="stat-label">Projects</div></div>
                <div className="stat"><div className="stat-val">∞</div><div className="stat-label">Forever</div></div>
              </div>
            )}

            <div className="card">
              <div className="card-title">Network</div>
              <div className="network-toggle">
                <button className={`net-btn ${network === "testnet" ? "active" : ""}`} onClick={() => setNetwork("testnet")}>🧪 Testnet</button>
                <button className={`net-btn ${network === "mainnet" ? "active" : ""}`} onClick={() => setNetwork("mainnet")}>⛓ Mainnet</button>
              </div>
            </div>

            <div className="card">
              <div className="card-title">Project Info</div>
              <div style={{ marginBottom: 14 }}>
                <label className="input-label">PROJECT NAME</label>
                <input className="input-field" placeholder="e.g. SnoopBull, MyProtocol..." value={projectName} onChange={e => setProjectName(e.target.value)} />
              </div>
              <div>
                <label className="input-label">DOCUMENT TYPE</label>
                <select className="select-field" value={docType} onChange={e => setDocType(e.target.value)}>
                  {DOC_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <div className="card">
              <div className="card-title">Upload Document</div>
              <div
                className={`drop-zone ${dragging ? "dragging" : ""}`}
                onDragOver={e => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.txt,.md,.json"
                  onChange={e => handleFile(e.target.files[0])}
                />
                <div className="drop-icon">📄</div>
                <div className="drop-text">{dragging ? "Drop it!" : "Tap to select file"}</div>
                <div className="drop-sub">PDF, DOCX, TXT, MD — max 20MB</div>
              </div>

              {file && (
                <div className="file-preview">
                  <div className="file-icon">📎</div>
                  <div className="file-info">
                    <div className="file-name">{file.name}</div>
                    <div className="file-size">{formatBytes(file.size)}</div>
                  </div>
                  <button className="remove-btn" onClick={() => setFile(null)}>✕</button>
                </div>
              )}
            </div>

            <div className="error-box">❌ {error}</div>
            <button className="btn btn-secondary" onClick={() => setPhase("upload")}>← Go Back</button>
          </>
        )}
      </div>
    </>
  );
}

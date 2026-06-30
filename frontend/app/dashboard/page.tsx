"use client";

import React, { useState, useEffect } from "react";
import { 
  Upload, Sparkles, AlertCircle, RefreshCw, Download, 
  Settings, Cpu, BarChart3, HelpCircle, FileImage, 
  Play, CheckCircle, HelpCircle as HelpIcon, Layers,
  Activity
} from "lucide-react";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import FrameTimeline from "@/components/FrameTimeline";

const API_BASE_URL = "http://localhost:8000";

interface GeneratedFrame {
  index: number;
  timestamp: string;
  is_ai: boolean;
  image_url: string;
  flow_url: string;
  heatmap_url: string;
}

interface GenerationMetrics {
  psnr: number;
  ssim: number;
  lpips: number;
  frames_generated: number;
}

interface GenerationResponse {
  success: boolean;
  inference_time_ms: number;
  model_used: string;
  metrics: GenerationMetrics;
  frames: GeneratedFrame[];
}

export default function DashboardPage() {
  // Inputs
  const [frameA, setFrameA] = useState<File | null>(null);
  const [frameB, setFrameB] = useState<File | null>(null);
  const [frameAPreview, setFrameAPreview] = useState<string | null>(null);
  const [frameBPreview, setFrameBPreview] = useState<string | null>(null);
  
  const [numFrames, setNumFrames] = useState<number>(3);
  const [modelType, setModelType] = useState<string>("rife");

  // State
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hwStatus, setHwStatus] = useState<any>(null);
  
  // Results
  const [result, setResult] = useState<GenerationResponse | null>(null);
  const [currentFrameIdx, setCurrentFrameIdx] = useState<number>(0);
  const [visualizationMode, setVisualizationMode] = useState<"normal" | "flow" | "heatmap">("normal");

  // Fetch health check / hardware status on mount
  useEffect(() => {
    fetch(`${API_BASE_URL}/health`)
      .then((res) => res.json())
      .then((data) => setHwStatus(data))
      .catch((err) => console.error("Failed to fetch backend health:", err));
  }, [isGenerating]);

  // Load sample data
  const handleLoadSamples = async () => {
    try {
      setError(null);
      const res = await fetch(`${API_BASE_URL}/generate/samples`);
      if (!res.ok) throw new Error("Failed to load sample files from backend.");
      const data = await res.json();
      
      // Convert base64 data to File objects to simulate local uploads
      const fetchBlob = async (b64: string, filename: string) => {
        const res = await fetch(b64);
        const blob = await res.blob();
        return new File([blob], filename, { type: "image/png" });
      };
      
      const fileA = await fetchBlob(data.frameA_b64, "sample_cyclone_A.png");
      const fileB = await fetchBlob(data.frameB_b64, "sample_cyclone_B.png");
      
      setFrameA(fileA);
      setFrameB(fileB);
      setFrameAPreview(data.frameA_b64);
      setFrameBPreview(data.frameB_b64);
      
      // Clear previous outputs
      setResult(null);
    } catch (err: any) {
      setError(err.message || "Could not retrieve sample images.");
    }
  };

  // Handle file selections
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, slot: "A" | "B") => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const preview = reader.result as string;
      if (slot === "A") {
        setFrameA(file);
        setFrameAPreview(preview);
      } else {
        setFrameB(file);
        setFrameBPreview(preview);
      }
      setResult(null);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  // Reset dashboard
  const handleReset = () => {
    setFrameA(null);
    setFrameB(null);
    setFrameAPreview(null);
    setFrameBPreview(null);
    setResult(null);
    setError(null);
    setCurrentFrameIdx(0);
    setVisualizationMode("normal");
  };

  // Submit Generation Request
  const handleGenerate = async () => {
    if (!frameA || !frameB) {
      setError("Please upload both Frame A and Frame B before generating.");
      return;
    }

    setIsGenerating(true);
    setError(null);

    const formData = new FormData();
    formData.append("frameA", frameA);
    formData.append("frameB", frameB);
    formData.append("number_of_frames", numFrames.toString());
    formData.append("model_type", modelType);

    try {
      const response = await fetch(`${API_BASE_URL}/generate`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Server error occurred during frame generation.");
      }

      const data: GenerationResponse = await response.json();
      setResult(data);
      // Select the first generated frame initially (index 1)
      setCurrentFrameIdx(1);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Download all frames as a series
  const handleDownloadFrame = () => {
    if (!result) return;
    const currentFrame = result.frames[currentFrameIdx];
    let url = currentFrame.image_url;
    if (visualizationMode === "flow") url = currentFrame.flow_url;
    else if (visualizationMode === "heatmap") url = currentFrame.heatmap_url;

    // Trigger standard download
    const link = document.createElement("a");
    link.href = `${API_BASE_URL}${url}`;
    link.download = `satflow_${currentFrame.timestamp.replace(":", "-").replace(" ", "_")}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Get active image to display based on mode
  const getActiveImageUrl = (frame: GeneratedFrame) => {
    if (visualizationMode === "flow") return `${API_BASE_URL}${frame.flow_url}`;
    if (visualizationMode === "heatmap") return `${API_BASE_URL}${frame.heatmap_url}`;
    return `${API_BASE_URL}${frame.image_url}`;
  };

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8 relative">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-white/5">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
            Analysis Dashboard
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Upload consecutive satellite passes to synthesize intermediate frames and estimate wind velocity fields.
          </p>
        </div>
        
        {/* Quick Sample Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleLoadSamples}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-isro-cyan bg-isro-cyan/10 border border-isro-cyan/20 rounded-lg hover:bg-isro-cyan/20 transition-all duration-300"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Load Sample Cyclone Data</span>
          </button>
          
          {(frameA || frameB) && (
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-gray-300 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Control Column (Upload & Settings) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* 1. File Uploaders Card */}
          <div className="glass-panel p-5 rounded-xl border border-white/5 space-y-4">
            <h2 className="text-sm font-bold tracking-wider text-gray-400 uppercase flex items-center gap-2">
              <FileImage className="h-4 w-4 text-isro-cyan" />
              <span>Upload Imagery</span>
            </h2>

            {/* Frame A Slot */}
            <div className="flex flex-col gap-2">
              <label className="text-xs text-gray-300 font-medium">First Pass (Frame A):</label>
              {frameAPreview ? (
                <div className="relative aspect-video rounded-lg border border-white/15 overflow-hidden group bg-space-deep">
                  <img src={frameAPreview} alt="Frame A Preview" className="w-full h-full object-contain" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <label className="cursor-pointer text-xs bg-white text-space-deep py-1 px-3 rounded font-bold hover:scale-105 active:scale-95 transition">
                      Replace Image
                      <input type="file" onChange={(e) => handleFileChange(e, "A")} className="hidden" accept="image/*" />
                    </label>
                  </div>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center aspect-video rounded-lg border-2 border-dashed border-white/10 hover:border-isro-cyan/50 hover:bg-isro-cyan/5 cursor-pointer transition duration-300">
                  <Upload className="h-6 w-6 text-gray-400 mb-2 group-hover:text-isro-cyan" />
                  <span className="text-xs text-gray-400 font-medium">Upload Pass A</span>
                  <input type="file" onChange={(e) => handleFileChange(e, "A")} className="hidden" accept="image/*" />
                </label>
              )}
            </div>

            {/* Frame B Slot */}
            <div className="flex flex-col gap-2">
              <label className="text-xs text-gray-300 font-medium">Second Pass (Frame B):</label>
              {frameBPreview ? (
                <div className="relative aspect-video rounded-lg border border-white/15 overflow-hidden group bg-space-deep">
                  <img src={frameBPreview} alt="Frame B Preview" className="w-full h-full object-contain" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <label className="cursor-pointer text-xs bg-white text-space-deep py-1 px-3 rounded font-bold hover:scale-105 active:scale-95 transition">
                      Replace Image
                      <input type="file" onChange={(e) => handleFileChange(e, "B")} className="hidden" accept="image/*" />
                    </label>
                  </div>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center aspect-video rounded-lg border-2 border-dashed border-white/10 hover:border-isro-cyan/50 hover:bg-isro-cyan/5 cursor-pointer transition duration-300">
                  <Upload className="h-6 w-6 text-gray-400 mb-2" />
                  <span className="text-xs text-gray-400 font-medium">Upload Pass B</span>
                  <input type="file" onChange={(e) => handleFileChange(e, "B")} className="hidden" accept="image/*" />
                </label>
              )}
            </div>
          </div>

          {/* 2. Parameters Card */}
          <div className="glass-panel p-5 rounded-xl border border-white/5 space-y-4">
            <h2 className="text-sm font-bold tracking-wider text-gray-400 uppercase flex items-center gap-2">
              <Settings className="h-4 w-4 text-isro-orange" />
              <span>Model Parameters</span>
            </h2>

            {/* Selector: N-Frames */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-gray-300 font-medium">Interpolation Frames:</label>
              <div className="grid grid-cols-3 gap-2">
                {[1, 3, 5].map((val) => (
                  <button
                    key={val}
                    onClick={() => setNumFrames(val)}
                    className={`py-1.5 text-xs font-bold rounded-lg border transition ${
                      numFrames === val 
                        ? "bg-isro-cyan/10 border-isro-cyan text-isro-cyan" 
                        : "bg-white/5 border-white/5 text-gray-400 hover:bg-white/10"
                    }`}
                  >
                    {val} Frame{val > 1 ? "s" : ""}
                  </button>
                ))}
              </div>
            </div>

            {/* Selector: Model Choice */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-gray-300 font-medium">Inference Architecture:</label>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setModelType("rife")}
                  className={`p-3 text-left rounded-lg border transition flex flex-col gap-0.5 ${
                    modelType === "rife" 
                      ? "bg-isro-cyan/5 border-isro-cyan text-white" 
                      : "bg-white/5 border-white/5 text-gray-400 hover:bg-white/10"
                  }`}
                >
                  <span className="text-xs font-bold flex items-center gap-1.5">
                    <span>RIFE AI Interpolation (Default)</span>
                    <span className="text-[9px] px-1 bg-isro-cyan/20 border border-isro-cyan/30 rounded text-isro-cyan font-bold uppercase">
                      Neural Network
                    </span>
                  </span>
                  <span className="text-[10px] text-gray-400">
                    Runs pre-trained RIFE model. Auto-falls back to optical flow if weights are absent.
                  </span>
                </button>

                <button
                  onClick={() => setModelType("optical_flow")}
                  className={`p-3 text-left rounded-lg border transition flex flex-col gap-0.5 ${
                    modelType === "optical_flow" 
                      ? "bg-isro-orange/5 border-isro-orange text-white" 
                      : "bg-white/5 border-white/5 text-gray-400 hover:bg-white/10"
                  }`}
                >
                  <span className="text-xs font-bold flex items-center gap-1.5">
                    <span>Farneback Classical Flow warping</span>
                    <span className="text-[9px] px-1 bg-isro-orange/20 border border-isro-orange/30 rounded text-isro-orange font-bold uppercase">
                      Baseline
                    </span>
                  </span>
                  <span className="text-[10px] text-gray-400">
                    Warp pixels along motion vectors using Farneback dense optical flow. Runs purely on CPU.
                  </span>
                </button>
              </div>
            </div>
            
            {/* Generate Trigger */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !frameA || !frameB}
              className="w-full py-3 bg-gradient-to-r from-isro-cyan to-isro-blue text-space-deep text-sm font-bold tracking-wider rounded-lg flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-isro-cyan/20 disabled:opacity-30 disabled:pointer-events-none hover:scale-102 active:scale-98 transition-all"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>SYNTHESIZING...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 fill-current" />
                  <span>GENERATE INTERMEDIATE OBSERVATIONS</span>
                </>
              )}
            </button>
          </div>

          {/* 3. Hardware Monitor Panel */}
          {hwStatus && (
            <div className="glass-panel p-5 rounded-xl border border-white/5 space-y-3">
              <h2 className="text-xs font-bold tracking-wider text-gray-400 uppercase flex items-center gap-2">
                <Activity className="h-4 w-4 text-isro-purple" />
                <span>Backend Hardware Status</span>
              </h2>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400">Inference Core:</span>
                  <span className="text-white font-bold uppercase">{hwStatus.hardware.device_used}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">GPU Availability:</span>
                  <span className={`font-bold ${hwStatus.hardware.gpu_available ? "text-isro-cyan" : "text-isro-orange"}`}>
                    {hwStatus.hardware.gpu_available ? "Active" : "Unavailable (CPU Fallback)"}
                  </span>
                </div>
                {hwStatus.hardware.gpu_available && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">GPU Device:</span>
                    <span className="text-white font-medium max-w-[150px] truncate text-right">
                      {hwStatus.hardware.gpu_device}
                    </span>
                  </div>
                )}
                <div className="flex justify-between border-t border-white/5 pt-1.5 mt-1.5">
                  <span className="text-gray-400">RIFE Core Status:</span>
                  <span className={`font-bold ${hwStatus.rife_model.available ? "text-isro-cyan" : "text-isro-orange"}`}>
                    {hwStatus.rife_model.available ? "Weights Loaded" : "Weights Missing"}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Output Column (Visualization & Timeline) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {error && (
            <div className="p-4 bg-red-950/20 border border-red-500/30 rounded-xl flex gap-3 text-red-200">
              <AlertCircle className="h-5 w-5 text-red-400 shrink-0" />
              <div className="text-sm">
                <span className="font-bold">Execution Error:</span> {error}
              </div>
            </div>
          )}

          {!result && !isGenerating ? (
            /* Dashboard Empty State placeholder */
            <div className="w-full min-h-[400px] border border-white/5 rounded-xl flex flex-col items-center justify-center text-center p-8 bg-space-card/25 backdrop-blur-md">
              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 border border-white/10 mb-4 animate-float">
                <Cpu className="h-8 w-8 text-isro-cyan" />
                <div className="absolute inset-0 bg-isro-cyan/5 blur-md rounded-2xl" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Workspace Idle</h3>
              <p className="text-sm text-gray-400 max-w-sm leading-relaxed">
                Click <span className="text-isro-cyan font-bold">"Load Sample Cyclone Data"</span> to test the setup instantly, or upload custom consecutive satellite frames in the sidebar.
              </p>
            </div>
          ) : isGenerating ? (
            /* Skeleton/Loading State */
            <div className="w-full aspect-video min-h-[350px] border border-white/5 rounded-xl flex flex-col items-center justify-center p-8 bg-space-card/25 backdrop-blur-sm space-y-4">
              <div className="h-10 w-10 border-4 border-isro-cyan/30 border-t-isro-cyan rounded-full animate-spin" />
              <div className="text-center space-y-1.5">
                <p className="text-sm text-white font-bold tracking-wider">RUNNING TEMPORAL SUPER-RESOLUTION</p>
                <p className="text-xs text-gray-400">Loading model layers, estimating dense optical flow fields, and generating intermediate frames...</p>
              </div>
            </div>
          ) : (
            /* Result Panel */
            <div className="flex flex-col gap-6">
              
              {/* Toolbar & Visual Mode selection */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 glass-panel border border-white/5 rounded-xl">
                {/* Mode Selectors */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-wider hidden sm:inline-block">Overlay:</span>
                  <div className="flex bg-white/5 border border-white/10 rounded-lg p-0.5">
                    <button
                      onClick={() => setVisualizationMode("normal")}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-md transition ${
                        visualizationMode === "normal" 
                          ? "bg-isro-cyan text-space-deep font-bold" 
                          : "text-gray-400 hover:text-white"
                      }`}
                    >
                      Original
                    </button>
                    <button
                      onClick={() => setVisualizationMode("flow")}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-md transition ${
                        visualizationMode === "flow" 
                          ? "bg-isro-cyan text-space-deep font-bold" 
                          : "text-gray-400 hover:text-white"
                      }`}
                    >
                      Flow Vectors
                    </button>
                    <button
                      onClick={() => setVisualizationMode("heatmap")}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-md transition ${
                        visualizationMode === "heatmap" 
                          ? "bg-isro-cyan text-space-deep font-bold" 
                          : "text-gray-400 hover:text-white"
                      }`}
                    >
                      Change Heatmap
                    </button>
                  </div>
                </div>

                {/* Info badge */}
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-gray-400">
                    Model Used:{" "}
                    <span className="text-white uppercase px-2 py-0.5 rounded bg-white/5 border border-white/10">
                      {result?.model_used.replace("_fallback", " (Fallback)")}
                    </span>
                  </span>
                  
                  <button
                    onClick={handleDownloadFrame}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold rounded-lg text-white transition-all"
                  >
                    <Download className="h-3.5 w-3.5 text-isro-cyan" />
                    <span>Download Frame</span>
                  </button>
                </div>
              </div>

              {/* Slider Viewer */}
              <BeforeAfterSlider 
                leftImage={frameAPreview || ""}
                rightImage={getActiveImageUrl(result.frames[currentFrameIdx])}
                leftLabel="Start Pass A (10:00)"
                rightLabel={`Selected Frame (${result.frames[currentFrameIdx].timestamp})`}
              />

              {/* Playback Timeline */}
              <FrameTimeline 
                frames={result.frames}
                currentIndex={currentFrameIdx}
                onFrameChange={setCurrentFrameIdx}
              />

              {/* Evaluation Metrics Card */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                
                {/* Card SSIM */}
                <div className="glass-panel p-4 rounded-xl border border-white/5 flex flex-col gap-1">
                  <span className="text-[10px] text-gray-400 tracking-wider font-bold uppercase">SSIM (Structural Similarity)</span>
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <span className="text-2xl font-extrabold text-isro-cyan">{result?.metrics.ssim}</span>
                    <span className="text-[10px] text-gray-400">/ 1.0</span>
                  </div>
                  <p className="text-[10px] text-gray-500 leading-tight mt-1">Estimates structural shape preservation of clouds.</p>
                </div>

                {/* Card PSNR */}
                <div className="glass-panel p-4 rounded-xl border border-white/5 flex flex-col gap-1">
                  <span className="text-[10px] text-gray-400 tracking-wider font-bold uppercase">PSNR (Peak Signal-to-Noise)</span>
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <span className="text-2xl font-extrabold text-isro-cyan">{result?.metrics.psnr}</span>
                    <span className="text-[10px] text-gray-400">dB</span>
                  </div>
                  <p className="text-[10px] text-gray-500 leading-tight mt-1">Measures pixel amplitude difference metrics.</p>
                </div>

                {/* Card LPIPS */}
                <div className="glass-panel p-4 rounded-xl border border-white/5 flex flex-col gap-1">
                  <span className="text-[10px] text-gray-400 tracking-wider font-bold uppercase">LPIPS (Perceptual Distance)</span>
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <span className="text-2xl font-extrabold text-isro-orange">{result?.metrics.lpips}</span>
                    <span className="text-[10px] text-gray-400">(est.)</span>
                  </div>
                  <p className="text-[10px] text-gray-500 leading-tight mt-1">Perceptual error distance (lower is better).</p>
                </div>

                {/* Card Inference time */}
                <div className="glass-panel p-4 rounded-xl border border-white/5 flex flex-col gap-1">
                  <span className="text-[10px] text-gray-400 tracking-wider font-bold uppercase">Inference Time</span>
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <span className="text-2xl font-extrabold text-isro-cyan">{result?.inference_time_ms}</span>
                    <span className="text-[10px] text-gray-400">ms</span>
                  </div>
                  <p className="text-[10px] text-gray-500 leading-tight mt-1">Combined pre-processing, interpolation, and rendering.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

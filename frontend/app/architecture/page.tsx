"use client";

import React, { useState } from "react";
import { 
  Database, RefreshCw, Cpu, Film, BarChart3, 
  Layers, ChevronRight, Code 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PipelineNode {
  id: string;
  title: string;
  subtitle: string;
  icon: any;
  color: string;
  description: string;
  details: string[];
  mathSymbol?: string;
  mathFormula?: string;
  codeSnippet: string;
}

export default function ArchitecturePage() {
  const [selectedNodeId, setSelectedNodeId] = useState<string>("rife");

  const nodes: PipelineNode[] = [
    {
      id: "input",
      title: "1. Satellite Images",
      subtitle: "Optical Observation Passes",
      icon: Database,
      color: "#4F8CFF", // Accent Secondary
      description: "Consecutive satellite image acquisitions (e.g. from INSAT-3D or Sentinel-2) capturing cloud systems at timestamps T0 and T1.",
      details: [
        "Accepts multi-spectral or standard RGB imagery.",
        "Allows dynamic resolution inputs.",
        "Integrates with geostationary meteorological datasets."
      ],
      codeSnippet: `async def generate_frames(
    frameA: UploadFile = File(...),
    frameB: UploadFile = File(...),
    number_of_frames: int = Form(1)
):
    # Load raw file bytes into numpy grids
    img_a = load_image_from_bytes(await frameA.read())
    img_b = load_image_from_bytes(await frameB.read())`
    },
    {
      id: "preprocessing",
      title: "2. Preprocessing",
      subtitle: "Padding & Normalization",
      icon: RefreshCw,
      color: "#16D9FF", // Accent Primary
      description: "Prepares raw image channels for the neural network. RIFE requires input dimensions to be divisible by 32 due to its multi-scale pooling architecture.",
      details: [
        "Normalizes values from [0, 255] to PyTorch float tensors in [0.0, 1.0].",
        "Calculates border padding for H and W to round up to the nearest multiple of 32.",
        "Applies channel transpositions from HWC (OpenCV) to 1CHW (PyTorch)."
      ],
      mathSymbol: "ph = ⌈H / 32⌉ * 32",
      mathFormula: "P_bottom = ph - H,  P_right = pw - W",
      codeSnippet: `h, w, c = img_bgr.shape
img_tensor = torch.from_numpy(img_bgr.transpose(2, 0, 1)).float() / 255.0
img_tensor = img_tensor.unsqueeze(0).to(device)

ph = ((h - 1) // 32 + 1) * 32
pw = ((w - 1) // 32 + 1) * 32
padding = (0, pw - w, 0, ph - h)
padded_tensor = F.pad(img_tensor, padding)`
    },
    {
      id: "rife",
      title: "3. RIFE Flow Engine",
      subtitle: "Flow Estimation (IFNet)",
      icon: Cpu,
      color: "#16D9FF", // Accent Primary
      description: "Real-time Intermediate Flow Estimation (RIFE). Leverages a multi-scale CNN (IFNet) to estimate intermediate flow vectors from T0 and T1 directly, avoiding complex independent optical flow calculations.",
      details: [
        "Estimates coarse-to-fine optical flow fields at 3 resolution scales.",
        "Computes soft fusion occlusion masks to identify overlapping/disappearing clouds.",
        "Accepts arbitrary timesteps t ∈ [0, 1] to synthesize any intermediate temporal position."
      ],
      mathSymbol: "I_t = (1-t) * W(I_0, F_t->0) + t * W(I_1, F_t->1)",
      mathFormula: "F_t->0 = t * F_1->0,  F_t->1 = (1-t) * F_0->1",
      codeSnippet: `# Import official RIFE class from cloned module
from train_log.RIFE_HDv3 import Model

model = Model()
model.load_model('train_log')
model.eval()

# Interpolate at arbitrary timestep t (e.g. 0.5)
with torch.no_grad():
    output_tensor = model.inference(img0_tensor, img1_tensor, scale=1.0)`
    },
    {
      id: "interpolation",
      title: "4. Frame Synthesis",
      subtitle: "Temporal Super-Resolution",
      icon: Film,
      color: "#4F8CFF", // Accent Secondary
      description: "Generates the intermediate frame sequence. Warps the original input frames along the predicted motion path and blends them. A classical Farneback baseline is executed if GPU neural weights are absent.",
      details: [
        "Computes progressive frames for t = [0.25, 0.5, 0.75] (for 3-frame synthesis).",
        "Warping uses bilinear remapping on pixel grids.",
        "Classical fallback computes forward/backward dense flow fields and warps frames."
      ],
      codeSnippet: `# Bisection Temporal step logic in rife_inference.py
f5 = model.inference(img0_tensor, img1_tensor)
f25 = model.inference(img0_tensor, f5)
f75 = model.inference(f5, img1_tensor)
generated_tensors = [f25, f5, f75]`
    },
    {
      id: "evaluation",
      title: "5. Metric Evaluation",
      subtitle: "Validation & Diagnostics",
      icon: BarChart3,
      color: "#4F8CFF", // Accent Secondary
      description: "Evaluates the mathematical and structural similarity between original and generated images, providing diagnostic parameters for ISRO engineers.",
      details: [
        "PSNR (Peak Signal-to-Noise Ratio) monitors pixel amplitude reconstruction quality.",
        "SSIM (Structural Similarity Index) measures structural preservation of clouds.",
        "LPIPS approximation models perceptual human vision distance."
      ],
      mathSymbol: "PSNR = 10 * log10( L^2 / MSE )",
      mathFormula: "SSIM(x,y) = [ (2*ux*uy + c1) * (2*sxy + c2) ] / [ (ux^2 + uy^2 + c1) * (sx^2 + sy^2 + c2) ]",
      codeSnippet: `def calculate_ssim(img1, img2):
    # OpenCV-based SSIM
    x = cv2.cvtColor(img1, cv2.COLOR_BGR2GRAY).astype(np.float64)
    y = cv2.cvtColor(img2, cv2.COLOR_BGR2GRAY).astype(np.float64)
    mu_x = cv2.GaussianBlur(x, (11, 11), 1.5)
    mu_y = cv2.GaussianBlur(y, (11, 11), 1.5)
    # ... calculates covariance and variance
    num = (2 * mu_xy + c1) * (2 * sigma_xy + c2)
    den = (mu_x_sq + mu_y_sq + c1) * (sigma_x_sq + sigma_y_sq + c2)
    return float(np.mean(num / den))`
    },
    {
      id: "visualization",
      title: "6. Advanced Visualization",
      subtitle: "Flow Vectors & Heatmaps",
      icon: Layers,
      color: "#16D9FF", // Accent Primary
      description: "Visualizes underlying dynamics. Converts dense flow tensors into vector arrow overlays (showing wind/cyclone directions) and outputs difference heatmaps highlighting changing storm centers.",
      details: [
        "Farneback dense optical flow runs to generate detailed wind fields.",
        "Draws custom anti-aliased arrows on pixels displaying vector directions.",
        "Difference heatmaps apply a JET colormap (Red = high movement, Blue = stationary)."
      ],
      codeSnippet: `# Generate difference heatmap
diff = cv2.absdiff(img0, img1)
diff_gray = cv2.cvtColor(diff, cv2.COLOR_BGR2GRAY)
diff_blur = cv2.GaussianBlur(diff_gray, (9, 9), 0)
heatmap = cv2.applyColorMap(diff_blur, cv2.COLORMAP_JET)
overlay = cv2.addWeighted(img0, 0.6, heatmap, 0.4, 0.0)`
    }
  ];

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || nodes[2];
  const SelectedIcon = selectedNode.icon;

  return (
    <div className="relative min-h-screen bg-bg-primary text-text-primary overflow-hidden tech-grid-bg radial-spotlight pt-28 pb-20 px-6 sm:px-12 max-w-7xl mx-auto">
      <div className="noise-overlay" />
      
      {/* Page Header */}
      <div className="pb-6 border-b border-white/5 mb-8">
        <h1 className="text-2xl font-black tracking-tight text-white uppercase">Pipeline Architecture</h1>
        <p className="text-xs text-text-muted mt-1 leading-relaxed font-medium">
          Explore the modular stages of the SATFLOW AI framework. Select a pipeline stage to inspect algorithms and references.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
        
        {/* Left Side: Interactive Pipeline Chart */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="glass-panel p-8 rounded-2xl border border-white/5 flex flex-col items-center justify-center min-h-[500px]">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-10">
              SATFLOW AI Process Pipeline
            </span>

            {/* Pipeline flowchart nodes */}
            <div className="w-full max-w-md flex flex-col gap-4 relative">
              {nodes.map((node, index) => {
                const NodeIcon = node.icon;
                const isSelected = node.id === selectedNodeId;
                
                return (
                  <div key={node.id} className="flex flex-col items-center">
                    {/* Node Button */}
                    <button
                      onClick={() => setSelectedNodeId(node.id)}
                      className={`w-full p-4 rounded-xl border text-left flex items-center justify-between group transition-all duration-200 ${
                        isSelected 
                          ? "bg-[#101826]/40 border-accent-primary shadow-[0_0_12px_rgba(22,217,255,0.08)] scale-102" 
                          : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div 
                          className="h-9 w-9 rounded-lg flex items-center justify-center transition-colors"
                          style={{ 
                            backgroundColor: isSelected ? `${node.color}15` : "rgba(255, 255, 255, 0.03)",
                            color: node.color
                          }}
                        >
                          <NodeIcon className="h-4.5 w-4.5" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-white group-hover:text-accent-primary transition-colors">
                            {node.title}
                          </span>
                          <span className="text-[10px] text-gray-400 mt-0.5 font-medium">{node.subtitle}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {isSelected && (
                          <span className="h-1.5 w-1.5 rounded-full bg-accent-primary animate-pulse" />
                        )}
                        <ChevronRight className={`h-3.5 w-3.5 transition-transform ${isSelected ? "text-accent-primary translate-x-0.5" : "text-gray-500"}`} />
                      </div>
                    </button>

                    {/* Connecting line */}
                    {index < nodes.length - 1 && (
                      <div className="h-5 w-0.5 bg-gradient-to-b from-white/10 to-transparent my-0.5" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side: Details Pane */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedNode.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] as const }}
              className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col gap-5 min-h-[500px]"
            >
              {/* Card Header */}
              <div className="flex items-center gap-3.5 pb-4 border-b border-white/5">
                <div 
                  className="h-9 w-9 rounded-lg flex items-center justify-center"
                  style={{ 
                    backgroundColor: `${selectedNode.color}15`,
                    color: selectedNode.color
                  }}
                >
                  <SelectedIcon className="h-4.5 w-4.5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-black text-white uppercase">{selectedNode.title.split(". ")[1]}</span>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">{selectedNode.subtitle}</span>
                </div>
              </div>

              {/* Description */}
              <div className="text-xs text-text-muted leading-relaxed font-medium">
                <p>{selectedNode.description}</p>
              </div>

              {/* Technical bullet points */}
              <div className="space-y-2">
                <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block">Operational Details</span>
                <ul className="space-y-2">
                  {selectedNode.details.map((detail, index) => (
                    <li key={index} className="text-xs text-gray-400 flex items-start gap-2 leading-relaxed font-medium">
                      <span className="h-1 w-1 rounded-full bg-accent-primary mt-2 shrink-0" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Mathematical Formula (if available) */}
              {selectedNode.mathSymbol && (
                <div className="p-3.5 bg-[#05070B]/60 font-mono rounded-xl border border-white/5 space-y-1">
                  <span className="text-[9px] text-accent-secondary font-black uppercase tracking-wider block">Mathematical Formula</span>
                  <div className="text-xs text-white font-bold py-1 select-all">
                    {selectedNode.mathSymbol}
                  </div>
                  {selectedNode.mathFormula && (
                    <div className="text-[10px] text-gray-400 select-all">
                      {selectedNode.mathFormula}
                    </div>
                  )}
                </div>
              )}

              {/* Code Snippet */}
              <div className="space-y-2 flex-1 flex flex-col">
                <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Code className="h-3 w-3" />
                  <span>Python Source Implementation</span>
                </span>
                <pre className="p-3.5 bg-[#05070B] border border-white/5 rounded-xl text-[10px] text-gray-300 font-mono overflow-x-auto leading-relaxed max-h-[220px] select-text">
                  <code>{selectedNode.codeSnippet}</code>
                </pre>
              </div>
              
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { 
  Database, RefreshCw, Cpu, Film, BarChart3, 
  Layers, ChevronRight, HelpCircle, Code 
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
      color: "#ff9933", // Orange
      description: "Consecutive satellite image acquisitions (e.g. from INSAT-3D, Himawari, or Sentinel-2) capturing cloud systems, cyclones, floods, or wildfires at timestamps T0 and T1.",
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
      color: "#bd00ff", // Purple
      description: "Prepares raw image channels for the neural network. RIFE requires input dimensions to be divisible by 32 due to its multi-scale pooling architecture.",
      details: [
        "Normalizes values from [0, 255] to PyTorch float tensors in [0.0, 1.0].",
        "Calculates border padding for H and W to round up to the nearest multiple of 32.",
        "Applies channel transpositions from HWC (OpenCV) to 1CHW (PyTorch)."
      ],
      mathSymbol: "ph = \\lceil H / 32 \\rceil \\times 32",
      mathFormula: "P_{bottom} = ph - H, \\quad P_{right} = pw - W",
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
      color: "#00f2fe", // Cyan
      description: "Real-time Intermediate Flow Estimation (RIFE). Leverages a multi-scale CNN (IFNet) to estimate intermediate flow vectors from T0 and T1 directly, avoiding complex independent optical flow calculations.",
      details: [
        "Estimates coarse-to-fine optical flow fields at 3 resolution scales.",
        "Computes soft fusion occlusion masks to identify overlapping/disappearing clouds.",
        "Accepts arbitrary timesteps t ∈ [0, 1] to synthesize any intermediate temporal position."
      ],
      mathSymbol: "I_t = (1-t) \\cdot W(I_0, F_{t \\to 0}) + t \\cdot W(I_1, F_{t \\to 1})",
      mathFormula: "F_{t \\to 0} = t \\cdot F_{1 \\to 0}, \\quad F_{t \\to 1} = (1-t) \\cdot F_{0 \\to 1}",
      codeSnippet: `# Import official RIFE class from cloned module
from model.RIFE import Model

model = Model(arbitrary=True)
model.load_model('train_log')
model.eval()

# Interpolate at arbitrary timestep t (e.g. 0.5)
with torch.no_grad():
    output_tensor = model.inference(img0_tensor, img1_tensor, timestep=t)`
    },
    {
      id: "interpolation",
      title: "4. Frame Synthesis",
      subtitle: "Temporal Super-Resolution",
      icon: Film,
      color: "#4facfe", // Blue
      description: "Generates the intermediate frame sequence. Warps the original input frames along the predicted motion path and blends them. A classical Farneback baseline is executed if GPU neural weights are absent.",
      details: [
        "Computes progressive frames for t = [0.25, 0.5, 0.75] (for 3-frame synthesis).",
        "Warping uses bilinear remapping on pixel grids.",
        "Classical fallback computes forward/backward dense flow fields and warps frames."
      ],
      codeSnippet: `# Temporal step logic
step = 1.0 / (num_frames + 1)
timesteps = [step * (i + 1) for i in range(num_frames)]

generated_frames = []
for t in timesteps:
    # RIFE inference or fallback
    frame_tensor = rife_model.inference(img0_tensor, img1_tensor, timestep=t)
    generated_frames.append(postprocess_tensor(frame_tensor))`
    },
    {
      id: "evaluation",
      title: "5. Metric Evaluation",
      subtitle: "Validation & Diagnostics",
      icon: BarChart3,
      color: "#ff9933", // Orange
      description: "Evaluates the mathematical and structural similarity between original and generated images, providing diagnostic parameters for ISRO engineers.",
      details: [
        "PSNR (Peak Signal-to-Noise Ratio) monitors pixel amplitude reconstruction quality.",
        "SSIM (Structural Similarity Index) measures structural preservation of clouds.",
        "LPIPS approximation models perceptual human vision distance."
      ],
      mathSymbol: "PSNR = 10 \\cdot \\log_{10}\\left(\\frac{L^2}{MSE}\\right)",
      mathFormula: "SSIM(x,y) = \\frac{(2\\mu_x\\mu_y+c_1)(2\\sigma_{xy}+c_2)}{(\\mu_x^2+\\mu_y^2+c_1)(\\sigma_x^2+\\sigma_y^2+c_2)}",
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
      color: "#bd00ff", // Purple
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
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8 relative">
      
      {/* Page Header */}
      <div className="pb-6 border-b border-white/5">
        <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
          Pipeline Architecture
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Explore the modular stages of the SATFLOW AI framework. Click any block in the pipeline to inspect equations, implementation logs, and raw backend code.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Interactive Pipeline Chart (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="glass-panel p-6 rounded-xl border border-white/5 flex flex-col items-center justify-center min-h-[450px]">
            <span className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-8">
              SATFLOW AI Interactive Flowchart
            </span>

            {/* Pipeline flowchart nodes */}
            <div className="w-full max-w-lg flex flex-col gap-6 relative">
              {nodes.map((node, index) => {
                const NodeIcon = node.icon;
                const isSelected = node.id === selectedNodeId;
                
                return (
                  <div key={node.id} className="flex flex-col items-center">
                    {/* Node Button */}
                    <button
                      onClick={() => setSelectedNodeId(node.id)}
                      className={`w-full max-w-md p-4 rounded-xl border text-left flex items-center justify-between group transition-all duration-300 ${
                        isSelected 
                          ? "bg-space-dark border-isro-cyan shadow-lg shadow-isro-cyan/10 scale-102" 
                          : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10 hover:scale-101"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div 
                          className="h-10 w-10 rounded-lg flex items-center justify-center transition-colors"
                          style={{ 
                            backgroundColor: isSelected ? `${node.color}20` : "rgba(255, 255, 255, 0.05)",
                            color: node.color
                          }}
                        >
                          <NodeIcon className="h-5 w-5" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-white group-hover:text-isro-cyan transition-colors">
                            {node.title}
                          </span>
                          <span className="text-xs text-gray-400 mt-0.5">{node.subtitle}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {isSelected && (
                          <span className="h-2 w-2 rounded-full bg-isro-cyan animate-pulse" />
                        )}
                        <ChevronRight className={`h-4 w-4 transition-transform ${isSelected ? "text-isro-cyan translate-x-1" : "text-gray-500"}`} />
                      </div>
                    </button>

                    {/* Connecting line */}
                    {index < nodes.length - 1 && (
                      <div className="h-6 w-0.5 bg-gradient-to-b from-white/10 to-white/5 my-1" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side: Details Pane (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedNode.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="glass-panel p-5 rounded-xl border border-white/5 flex flex-col gap-5 min-h-[500px]"
            >
              {/* Card Header */}
              <div className="flex items-center gap-3 pb-4 border-b border-white/5">
                <div 
                  className="h-10 w-10 rounded-lg flex items-center justify-center"
                  style={{ 
                    backgroundColor: `${selectedNode.color}20`,
                    color: selectedNode.color
                  }}
                >
                  <SelectedIcon className="h-5 w-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-base font-bold text-white">{selectedNode.title.split(". ")[1]}</span>
                  <span className="text-xs text-gray-400">{selectedNode.subtitle}</span>
                </div>
              </div>

              {/* Description */}
              <div className="text-xs text-gray-300 leading-relaxed">
                <p>{selectedNode.description}</p>
              </div>

              {/* Technical bullet points */}
              <div className="space-y-2">
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Operational Details</span>
                <ul className="space-y-1.5">
                  {selectedNode.details.map((detail, index) => (
                    <li key={index} className="text-xs text-gray-400 flex items-start gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-isro-cyan mt-1.5 shrink-0" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Mathematical Formula (if available) */}
              {selectedNode.mathSymbol && (
                <div className="p-3 bg-white/3 font-mono rounded-lg border border-white/5 space-y-1">
                  <span className="text-[9px] text-isro-orange font-bold uppercase tracking-wider block">Mathematical Formulations</span>
                  <div className="text-xs text-white text-center py-1">
                    {selectedNode.mathSymbol}
                  </div>
                  {selectedNode.mathFormula && (
                    <div className="text-[11px] text-gray-400 text-center">
                      {selectedNode.mathFormula}
                    </div>
                  )}
                </div>
              )}

              {/* Code Snippet */}
              <div className="space-y-2 flex-1 flex flex-col">
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider flex items-center gap-1">
                  <Code className="h-3 w-3" />
                  <span>Implementation Reference</span>
                </span>
                <pre className="p-3 bg-space-deep border border-white/5 rounded-lg text-[10px] text-gray-300 font-mono overflow-x-auto leading-relaxed max-h-[220px] select-text">
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

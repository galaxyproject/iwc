<script setup lang="ts">
import { ref, nextTick, watch } from "vue";
import { marked } from "marked";
import mermaid from "mermaid";

// Props
const props = defineProps({
    markdownContent: {
        type: String,
        required: true,
    },
});

// Refs
const renderedHtml = ref<string>("");

// Initialize Mermaid
mermaid.initialize({
    startOnLoad: false,
    theme: "neutral",
});

// Watch Markdown Content for Changes
watch(
    () => props.markdownContent,
    (newContent) => {
        renderMarkdown(newContent);
    },
    { immediate: true },
);

// Render Markdown Function
async function renderMarkdown(content: string) {
    renderedHtml.value = await marked(content);
    await nextTick();
    renderMermaidDiagrams();
}

// Render Mermaid Diagrams
function renderMermaidDiagrams() {
    const mermaidElements = document.querySelectorAll(".language-mermaid");
    mermaidElements.forEach((element) => {
        const parent = element.parentElement;
        const code = element.textContent || "";
        if (parent) {
            try {
                const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
                mermaid.render(id, code).then((value) => {
                    // Create container with zoom controls
                    const container = document.createElement("div");
                    container.className = "mermaid-zoom-container";

                    const controls = document.createElement("div");
                    controls.className = "mermaid-zoom-controls";

                    // Create buttons
                    const zoomInBtn = document.createElement("button");
                    zoomInBtn.textContent = "+";
                    zoomInBtn.className = "mermaid-zoom-btn";
                    zoomInBtn.setAttribute("aria-label", "Zoom in");

                    const zoomOutBtn = document.createElement("button");
                    zoomOutBtn.textContent = "−";
                    zoomOutBtn.className = "mermaid-zoom-btn";
                    zoomOutBtn.setAttribute("aria-label", "Zoom out");

                    const resetBtn = document.createElement("button");
                    resetBtn.textContent = "⌂";
                    resetBtn.className = "mermaid-zoom-btn";
                    resetBtn.setAttribute("aria-label", "Reset zoom");

                    const fullscreenBtn = document.createElement("button");
                    fullscreenBtn.textContent = "⛶";
                    fullscreenBtn.className = "mermaid-zoom-btn";
                    fullscreenBtn.setAttribute("aria-label", "Toggle fullscreen");

                    controls.appendChild(zoomInBtn);
                    controls.appendChild(zoomOutBtn);
                    controls.appendChild(resetBtn);
                    controls.appendChild(fullscreenBtn);

                    const content = document.createElement("div");
                    content.className = "mermaid-zoom-content";
                    content.innerHTML = value.svg;

                    container.appendChild(controls);
                    container.appendChild(content);
                    parent.innerHTML = "";
                    parent.appendChild(container);
                    parent.classList.add("not-prose");

                    // Zoom functionality
                    let scale = 1;
                    let originX = 0;
                    let originY = 0;
                    let isDragging = false;
                    let startX = 0;
                    let startY = 0;

                    const svg = content.querySelector("svg");
                    if (svg) {
                        svg.style.cursor = "grab";
                        svg.style.transformOrigin = "0 0";

                        function updateTransform() {
                            svg.style.transform = `translate(${originX}px, ${originY}px) scale(${scale})`;
                        }

                        let lastMouseX = content.offsetWidth / 2;
                        let lastMouseY = content.offsetHeight / 2;

                        content.addEventListener("mousemove", (e) => {
                            if (!isDragging) {
                                const rect = content.getBoundingClientRect();
                                lastMouseX = e.clientX - rect.left;
                                lastMouseY = e.clientY - rect.top;
                            }
                        });

                        function zoomToPoint(newScale, mouseX, mouseY) {
                            const oldScale = scale;
                            const scaleDiff = newScale / oldScale;

                            const newOriginX = mouseX - (mouseX - originX) * scaleDiff;
                            const newOriginY = mouseY - (mouseY - originY) * scaleDiff;

                            scale = newScale;
                            originX = newOriginX;
                            originY = newOriginY;
                            updateTransform();
                        }

                        zoomInBtn.addEventListener("click", () => {
                            svg.style.transition = "transform 0.2s ease";
                            const newScale = Math.min(scale * 1.2, 5);
                            const centerX = content.offsetWidth / 2;
                            const centerY = content.offsetHeight / 2;
                            zoomToPoint(newScale, centerX, centerY);
                            setTimeout(() => (svg.style.transition = "none"), 200);
                        });

                        zoomOutBtn.addEventListener("click", () => {
                            svg.style.transition = "transform 0.2s ease";
                            const newScale = Math.max(scale / 1.2, 0.1);
                            const centerX = content.offsetWidth / 2;
                            const centerY = content.offsetHeight / 2;
                            zoomToPoint(newScale, centerX, centerY);
                            setTimeout(() => (svg.style.transition = "none"), 200);
                        });

                        resetBtn.addEventListener("click", () => {
                            svg.style.transition = "transform 0.3s ease";
                            scale = 1;
                            originX = 0;
                            originY = 0;
                            updateTransform();
                            setTimeout(() => (svg.style.transition = "none"), 300);
                        });

                        fullscreenBtn.addEventListener("click", () => {
                            if (container.classList.contains("mermaid-fullscreen")) {
                                container.classList.remove("mermaid-fullscreen");
                                document.body.style.overflow = "";
                            } else {
                                container.classList.add("mermaid-fullscreen");
                                document.body.style.overflow = "hidden";
                            }
                        });

                        // Mouse wheel zoom
                        content.addEventListener("wheel", (e) => {
                            e.preventDefault();
                            const rect = content.getBoundingClientRect();
                            const mouseX = e.clientX - rect.left;
                            const mouseY = e.clientY - rect.top;

                            // Detect if this is likely a trackpad (fine-grained) vs mouse wheel (coarse)
                            // Trackpads typically have smaller deltaY values and more frequent events
                            const isTrackpad = Math.abs(e.deltaY) < 50;
                            const zoomFactor = isTrackpad ? 1.01 : 1.1;

                            const newScale =
                                e.deltaY > 0 ? Math.max(scale / zoomFactor, 0.1) : Math.min(scale * zoomFactor, 5);

                            zoomToPoint(newScale, mouseX, mouseY);
                        });

                        svg.addEventListener("mousedown", (e) => {
                            isDragging = true;
                            startX = e.clientX - originX;
                            startY = e.clientY - originY;
                            svg.style.cursor = "grabbing";
                            e.preventDefault();
                        });

                        document.addEventListener("mousemove", (e) => {
                            if (isDragging) {
                                originX = e.clientX - startX;
                                originY = e.clientY - startY;
                                updateTransform();
                            }
                        });

                        document.addEventListener("mouseup", () => {
                            if (isDragging) {
                                isDragging = false;
                                svg.style.cursor = "grab";
                            }
                        });

                        // Touch support
                        let initialDistance = 0;
                        let initialScale = 1;

                        svg.addEventListener("touchstart", (e) => {
                            if (e.touches.length === 2) {
                                const touch1 = e.touches[0];
                                const touch2 = e.touches[1];
                                initialDistance = Math.hypot(
                                    touch2.clientX - touch1.clientX,
                                    touch2.clientY - touch1.clientY,
                                );
                                initialScale = scale;
                            } else if (e.touches.length === 1) {
                                isDragging = true;
                                const touch = e.touches[0];
                                startX = touch.clientX - originX;
                                startY = touch.clientY - originY;
                            }
                            e.preventDefault();
                        });

                        svg.addEventListener("touchmove", (e) => {
                            if (e.touches.length === 2) {
                                const touch1 = e.touches[0];
                                const touch2 = e.touches[1];
                                const distance = Math.hypot(
                                    touch2.clientX - touch1.clientX,
                                    touch2.clientY - touch1.clientY,
                                );
                                scale = Math.max(0.1, Math.min(5, initialScale * (distance / initialDistance)));
                                updateTransform();
                            } else if (e.touches.length === 1 && isDragging) {
                                const touch = e.touches[0];
                                originX = touch.clientX - startX;
                                originY = touch.clientY - startY;
                                updateTransform();
                            }
                            e.preventDefault();
                        });

                        svg.addEventListener("touchend", () => {
                            isDragging = false;
                        });
                    }
                });
            } catch (e) {
                console.error("Mermaid rendering error:", e);
            }
        }
    });
}
</script>

<template>
    <div v-html="renderedHtml"></div>
</template>

<style scoped>
:deep(.mermaid-zoom-container) {
    position: relative;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    background: #fff;
    margin: 1rem 0;
    overflow: hidden;
}

:deep(.mermaid-zoom-container.mermaid-fullscreen) {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 1000;
    border-radius: 0;
    margin: 0;
}

:deep(.mermaid-zoom-controls) {
    position: absolute;
    top: 8px;
    right: 8px;
    display: flex;
    gap: 4px;
    z-index: 10;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(4px);
    border-radius: 6px;
    padding: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

:deep(.mermaid-zoom-btn) {
    width: 32px;
    height: 32px;
    border: 1px solid #d1d5db;
    background: #f9fafb;
    color: #374151;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 16px;
    font-weight: bold;
    transition: all 0.2s ease;
    user-select: none;
}

:deep(.mermaid-zoom-btn:hover) {
    background: #e5e7eb;
    border-color: #9ca3af;
}

:deep(.mermaid-zoom-btn:active) {
    transform: scale(0.95);
}

:deep(.mermaid-zoom-content) {
    width: 100%;
    height: 400px;
    overflow: hidden;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
}

:deep(.mermaid-fullscreen .mermaid-zoom-content) {
    height: 100vh;
}

:deep(.mermaid-zoom-content svg) {
    transform-origin: center center;
    max-width: none;
    max-height: none;
    user-select: none;
}

/* Dark mode support */
:deep(.dark .mermaid-zoom-container) {
    border-color: #374151;
    background: #1f2937;
}

:deep(.dark .mermaid-zoom-controls) {
    background: rgba(31, 41, 55, 0.9);
}

:deep(.dark .mermaid-zoom-btn) {
    border-color: #4b5563;
    background: #374151;
    color: #d1d5db;
}

:deep(.dark .mermaid-zoom-btn:hover) {
    background: #4b5563;
    border-color: #6b7280;
}

/* Instructions overlay for first time users */
:deep(.mermaid-zoom-container::after) {
    content: "💡 Use mouse wheel to zoom, drag to pan, or use controls in top-right";
    position: absolute;
    bottom: 8px;
    left: 8px;
    font-size: 12px;
    color: #6b7280;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(4px);
    padding: 4px 8px;
    border-radius: 4px;
    opacity: 0;
    animation: fade-in-out 4s ease-in-out;
    pointer-events: none;
}

:deep(.dark .mermaid-zoom-container::after) {
    background: rgba(31, 41, 55, 0.9);
    color: #d1d5db;
}

@keyframes fade-in-out {
    0%,
    100% {
        opacity: 0;
    }
    20%,
    80% {
        opacity: 1;
    }
}
</style>

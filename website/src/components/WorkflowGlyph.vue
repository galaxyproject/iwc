<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import * as jdenticon from "jdenticon";
import { getWorkflowTheme, galaxyColors, type ShapeType } from "../utils/collectionThemes";
import { extractInitials } from "../utils/initialsExtractor";

const props = withDefaults(
    defineProps<{
        /** Unique identifier (uuid) for pattern generation */
        identifier: string;
        /** Workflow name for initials extraction */
        name: string;
        /** Collections array - primary collection determines theme */
        collections?: string[];
        /** Size in pixels (default: 40) */
        size?: number;
        /** Optional custom icon URL to override generated glyph */
        customIconUrl?: string;
    }>(),
    {
        size: 40,
        collections: () => [],
        customIconUrl: undefined,
    },
);

const patternSvg = ref<string>("");
const theme = computed(() => getWorkflowTheme(props.collections));
const initials = computed(() => extractInitials(props.name));

// SVG path data for each shape type
const shapePaths: Record<ShapeType, (size: number) => string> = {
    circle: (s) => {
        const r = s / 2;
        return `M ${r},0 A ${r},${r} 0 1,1 ${r},${s} A ${r},${r} 0 1,1 ${r},0`;
    },
    "rounded-square": (s) => {
        const r = s * 0.18;
        return `M ${r},0 H ${s - r} Q ${s},0 ${s},${r} V ${s - r} Q ${s},${s} ${s - r},${s} H ${r} Q 0,${s} 0,${s - r} V ${r} Q 0,0 ${r},0`;
    },
    hexagon: (s) => {
        const cx = s / 2;
        const cy = s / 2;
        const r = s / 2;
        const points: string[] = [];
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i - Math.PI / 2;
            points.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
        }
        return `M ${points.join(" L ")} Z`;
    },
    octagon: (s) => {
        const cx = s / 2;
        const cy = s / 2;
        const r = s / 2;
        const points: string[] = [];
        for (let i = 0; i < 8; i++) {
            const angle = (Math.PI / 4) * i - Math.PI / 8;
            points.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
        }
        return `M ${points.join(" L ")} Z`;
    },
    diamond: (s) => {
        const h = s / 2;
        return `M ${h},0 L ${s},${h} L ${h},${s} L 0,${h} Z`;
    },
    pill: (s) => {
        const r = s * 0.35;
        const w = s;
        const h = s * 0.7;
        const y = (s - h) / 2;
        return `M ${r},${y} H ${w - r} A ${r},${r} 0 0 1 ${w - r},${y + h} H ${r} A ${r},${r} 0 0 1 ${r},${y}`;
    },
    shield: (s) => {
        const cx = s / 2;
        return `M ${cx},${s * 0.05} L ${s * 0.95},${s * 0.2} L ${s * 0.95},${s * 0.5} Q ${s * 0.95},${s * 0.8} ${cx},${s * 0.95} Q ${s * 0.05},${s * 0.8} ${s * 0.05},${s * 0.5} L ${s * 0.05},${s * 0.2} Z`;
    },
    pentagon: (s) => {
        const cx = s / 2;
        const cy = s / 2;
        const r = s / 2;
        const points: string[] = [];
        for (let i = 0; i < 5; i++) {
            const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
            points.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
        }
        return `M ${points.join(" L ")} Z`;
    },
    square: (s) => {
        const r = s * 0.08;
        return `M ${r},0 H ${s - r} Q ${s},0 ${s},${r} V ${s - r} Q ${s},${s} ${s - r},${s} H ${r} Q 0,${s} 0,${s - r} V ${r} Q 0,0 ${r},0`;
    },
};

// Generate clip path ID based on identifier
const clipPathId = computed(() => `glyph-clip-${props.identifier.substring(0, 8)}`);

// Get the shape path for clipping
const shapePath = computed(() => {
    const generator = shapePaths[theme.value.shape];
    return generator(props.size);
});

// Generate jdenticon pattern on mount
onMounted(() => {
    // Configure jdenticon with Galaxy blue palette - subtle and cohesive
    jdenticon.configure({
        hues: [210], // Galaxy blue hue
        lightness: {
            color: [0.35, 0.65],
            grayscale: [0.4, 0.7],
        },
        saturation: {
            color: 0.35, // Subtle saturation
            grayscale: 0.0,
        },
        backColor: "transparent",
    });

    // Generate the pattern SVG
    patternSvg.value = jdenticon.toSvg(props.identifier, props.size);
});

// Font size scales with glyph size
const fontSize = computed(() => {
    if (props.size <= 32) return props.size * 0.42;
    if (props.size <= 48) return props.size * 0.4;
    return props.size * 0.36;
});

// Colors from Galaxy palette
const colors = {
    background: galaxyColors.bayOfMany[100],
    backgroundGradientEnd: galaxyColors.bayOfMany[200],
    border: galaxyColors.bayOfMany[600],
    text: galaxyColors.ebonyClay[900],
    textShadow: galaxyColors.bayOfMany[50],
};
</script>

<template>
    <!-- Custom icon override -->
    <img
        v-if="customIconUrl"
        :src="customIconUrl"
        :alt="`${name} icon`"
        :width="size"
        :height="size"
        class="workflow-glyph-custom" />

    <!-- Generated glyph -->
    <svg
        v-else
        :width="size"
        :height="size"
        :viewBox="`0 0 ${size} ${size}`"
        class="workflow-glyph"
        role="img"
        :aria-label="`${name} glyph`">
        <defs>
            <clipPath :id="clipPathId">
                <path :d="shapePath" />
            </clipPath>
            <!-- Subtle gradient for depth -->
            <linearGradient :id="`${clipPathId}-grad`" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" :stop-color="colors.background" />
                <stop offset="100%" :stop-color="colors.backgroundGradientEnd" />
            </linearGradient>
        </defs>

        <!-- Background with gradient -->
        <path :d="shapePath" :fill="`url(#${clipPathId}-grad)`" />

        <!-- Jdenticon pattern (clipped to shape, subtle) -->
        <g :clip-path="`url(#${clipPathId})`" class="pattern-layer" v-html="patternSvg" />

        <!-- Shape border -->
        <path :d="shapePath" fill="none" :stroke="colors.border" stroke-width="1.5" />

        <!-- Initials -->
        <text
            :x="size / 2"
            :y="size / 2"
            text-anchor="middle"
            dominant-baseline="central"
            :fill="colors.text"
            :font-size="fontSize"
            font-weight="600"
            font-family="'Atkinson Hyperlegible', system-ui, sans-serif"
            class="glyph-initials">
            {{ initials }}
        </text>
    </svg>
</template>

<style scoped>
.workflow-glyph {
    flex-shrink: 0;
}

.workflow-glyph-custom {
    flex-shrink: 0;
    object-fit: contain;
}

.pattern-layer {
    opacity: 0.4;
}

.glyph-initials {
    pointer-events: none;
    user-select: none;
    letter-spacing: -0.02em;
}
</style>

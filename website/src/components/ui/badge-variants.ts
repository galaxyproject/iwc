import { type VariantProps, cva } from "class-variance-authority";

export const badgeVariants = cva(
    "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2",
    {
        variants: {
            variant: {
                default: "border-transparent bg-bay-of-many-700 text-white shadow hover:bg-bay-of-many-800",
                secondary: "border-transparent bg-gray-100 text-gray-900 hover:bg-gray-200",
                destructive: "border-transparent bg-red-500 text-white shadow hover:bg-red-600",
                outline: "text-gray-950",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    },
);

export type BadgeVariantProps = VariantProps<typeof badgeVariants>;

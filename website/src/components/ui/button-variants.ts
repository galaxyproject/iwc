import { type VariantProps, cva } from "class-variance-authority";

export const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
    {
        variants: {
            variant: {
                default: "bg-hokey-pokey-600 text-white shadow hover:bg-hokey-pokey-700",
                destructive: "bg-red-500 text-white shadow-sm hover:bg-red-600",
                outline: "border border-gray-300 bg-white shadow-sm hover:bg-gray-50 hover:text-gray-900",
                secondary: "bg-gray-100 text-gray-900 shadow-sm hover:bg-gray-200",
                ghost: "hover:bg-gray-100 hover:text-gray-900",
                link: "text-bay-of-many-700 underline-offset-4 hover:underline",
            },
            size: {
                default: "h-9 px-4 py-2",
                sm: "h-8 rounded-md px-3 text-xs",
                lg: "h-10 rounded-md px-8",
                icon: "h-9 w-9",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    },
);

export type ButtonVariantProps = VariantProps<typeof buttonVariants>;

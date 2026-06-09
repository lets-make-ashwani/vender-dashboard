import { cn } from "./utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-accent/80 animate-[pulse_1s_cubic-bezier(0.4,0,0.6,1)_infinite] rounded-md", className)}
      {...props}
    />
  );
}

export { Skeleton };

import { cn } from "@/lib/utils";
import { cloneElement, Children, forwardRef, useMemo } from "react";


import type { ElementRef, HTMLAttributes, ReactElement } from "react";

type TAvatarGroupRef = ElementRef<"div">;
type TAvatarGroupProps = HTMLAttributes<HTMLDivElement> & { max?: number; spacing?: number };

const AvatarGroup = forwardRef<TAvatarGroupRef, TAvatarGroupProps>(({ className, children, max = 1, spacing = 10, ...props }, ref) => {
    const avatarItems = Children.toArray(children) as ReactElement[];


    const renderContent = useMemo(() => {
        const typedAvatarItems = avatarItems as ReactElement<{ className?: string; style?: React.CSSProperties }>[];
        return (
            <>
                {typedAvatarItems.slice(0, max).map((child, index) => {
                    return cloneElement(child, {
                        className: cn(child.props.className, "border-2 border-bg-primary"),
                        style: { marginLeft: index === 0 ? 0 : -spacing, ...child.props.style },
                    });
                })}

                {typedAvatarItems.length > max && (
                    <div
                        className={cn("relative flex items-center justify-center rounded-full border-2 border-bg-primary bg-bg-tertiary", typedAvatarItems[0].props.className)}
                        style={{ marginLeft: -spacing }}
                    >
                        <p>+{avatarItems.length - max}</p>
                    </div>
                )}
            </>
        );
    }, [avatarItems, max, spacing]);

    return (
        <div ref={ref} className={cn("relative flex", className)} {...props}>
            {renderContent}
        </div>
    );
});

AvatarGroup.displayName = "AvatarGroup";


export { AvatarGroup };
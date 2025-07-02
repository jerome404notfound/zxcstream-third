import { cn } from "@/lib/utils";
import React, {
  useState,
  useContext,
  createContext,
  ReactNode,
  MouseEvent as ReactMouseEvent,
  useEffect,
} from "react";

interface SpotLightContextProps {
  ProximitySpotlight: boolean;
  HoverFocusSpotlight: boolean;
  CursorFlowGradient: boolean;
}

const SpotLightContext = createContext<SpotLightContextProps | undefined>(
  undefined
);

export const useSpotlight = (): SpotLightContextProps => {
  const context = useContext(SpotLightContext);
  if (!context)
    throw new Error("useSpotlight must be used within a SpotlightProvider");
  return context;
};

interface SpotlightProps {
  children: ReactNode;
  className?: string;
  ProximitySpotlight?: boolean;
  HoverFocusSpotlight?: boolean;
  CursorFlowGradient?: boolean;
}

export const Spotlight: React.FC<SpotlightProps> = ({
  children,
  className,
  ProximitySpotlight = true,
  HoverFocusSpotlight = false,
  CursorFlowGradient = true,
}) => (
  <SpotLightContext.Provider
    value={{ ProximitySpotlight, HoverFocusSpotlight, CursorFlowGradient }}
  >
    <div className={cn(className, "group relative ")}>{children}</div>
  </SpotLightContext.Provider>
);

interface SpotLightItemProps {
  children: ReactNode;
  className?: string;
}

export const SpotLightItem: React.FC<SpotLightItemProps> = ({
  children,
  className,
}) => {
  const { HoverFocusSpotlight, ProximitySpotlight, CursorFlowGradient } =
    useSpotlight();
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState<{
    x: number | null;
    y: number | null;
  }>({ x: null, y: null });
  const [overlayPos, setOverlayPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) =>
      setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  const onMouseMoveDiv = (e: ReactMouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setOverlayPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      onMouseMove={onMouseMoveDiv}
      onMouseEnter={() => CursorFlowGradient && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        className,
        "relative flex justify-center items-center lg:p-[1.5px] p-[1px] lg:rounded-md rounded-sm overflow-hidden"
      )}
    >
      {isHovered && (
        <div
          className="pointer-events-none absolute opacity-0 z-50 rounded-xl w-full h-full group-hover:opacity-100 transition duration-300"
          style={{
            background: `radial-gradient(250px circle at ${overlayPos.x}px ${overlayPos.y}px, rgba(0,0,255,0.137), transparent 80%)`,
          }}
        />
      )}
      {HoverFocusSpotlight && mousePos.x !== null && mousePos.y !== null && (
        <div
          className="absolute opacity-0 group-hover:opacity-100 z-10 inset-0 bg-fixed rounded-lg"
          style={{
            background: `radial-gradient(circle at ${mousePos.x}px ${mousePos.y}px, #ffffff76 0%, transparent 20%) fixed`,
          }}
        />
      )}
      {ProximitySpotlight && mousePos.x !== null && mousePos.y !== null && (
        <div
          className="absolute inset-0 z-0 bg-fixed"
          style={{
            background: `radial-gradient(circle at ${mousePos.x}px ${mousePos.y}px, blue 0%, transparent 20%) fixed`,
          }}
        />
      )}
      {children}
    </div>
  );
};

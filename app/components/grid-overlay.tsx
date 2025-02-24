interface GridOverlayProps {
    visible: boolean;
  }
  
  export const GridOverlay = ({ visible }: GridOverlayProps) => {
    if (!visible) return null;
  
    return (
      <div 
        className="absolute inset-0 pointer-events-none" 
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />
    );
  };
  
  
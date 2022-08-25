import React, { useEffect, useRef } from 'react';
import cgl from "./cg";
import data from "./data/mult_view.json";

function Clustergrammer() {
  const containerRef = useRef(null);

  useEffect(() => {
    const args = {
      container: containerRef.current,
      network: data,
      viz_width: "100%",
      viz_height: "100%",
      showControls: true,
    };
    cgl(args);
  }, [containerRef]);

  return (
    <div style={{ height: "800px", width: "800px" }}>
      <div
        id="cgm"
        ref={containerRef}
        style={{ height: "100%", width: "100%" }}
      />
    </div>
  );
}
export default Clustergrammer;

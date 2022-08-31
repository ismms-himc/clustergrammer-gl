import React, { useEffect, useRef } from "react";
import cgl, { ClustergrammerProps } from "./cg";
// import data from "./data/cytof.json";
import data from "./data/mult_view.json";

function Clustergrammer() {
  const containerRef = useRef(null);

  useEffect(() => {
    const args: ClustergrammerProps = {
      container: containerRef.current,
      network: data as unknown as ClustergrammerProps["network"],
      width: "100%",
      height: "100%",
      showControls: true,
      onClick: (row: string | null, col: string | null) => console.log(row, col),
      // disableTooltip: true,
      enabledTooltips: ["dendro", "cell"]
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

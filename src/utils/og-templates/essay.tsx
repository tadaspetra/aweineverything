import type { CollectionEntry } from "astro:content";
import React from "react";

export default (essay: CollectionEntry<"essays">) => {
  return (
    <div
      style={{
        background: "#ffffff",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "60px 80px",
      }}
    >
      {/* Title */}
      <p
        style={{
          fontSize: 96,
          fontFamily: "La Belle Aurore",
          color: "#171717",
          lineHeight: 1.2,
          marginTop: 50,
          maxWidth: "95%",
        }}
      >
        {essay.data.title}
      </p>

      {/* Footer with site name */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontSize: 48,
            fontFamily: "La Belle Aurore",
            color: "#525252",
          }}
        >
          awe in everything
        </span>
      </div>
    </div>
  );
};

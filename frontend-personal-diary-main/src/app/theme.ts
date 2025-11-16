// theme.ts
import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  fonts: {
    body: "SolaimanLipi, sans-serif",
    heading: "SolaimanLipi, sans-serif",
  },
  colors: {
    // brand: {
    //   darkNavy: "#000000",
    //   darkSlate: "#1a202c",
    // },
  },
  styles: {
    global: {
      body: {
        // bg: "#000000",
        // color: "white",
        lineHeight: "1.6",
        fontSize: "16px",
      },
      h1: {
        fontSize: "2.25rem",
        fontWeight: "bold",
        mt: 6,
        mb: 4,
      },
      h2: {
        fontSize: "1.875rem",
        fontWeight: "bold",
        mt: 5,
        mb: 3,
      },
      h3: {
        fontSize: "1.5rem",
        fontWeight: "semibold",
        mt: 4,
        mb: 2,
      },
      p: {
        mb: 4,
        fontSize: "1rem",
      },
      a: {
        color: "teal.300",
        textDecoration: "none",
        _hover: {
          color: "teal.200",
        },
      },
      ul: {
        pl: 6,
        mb: 4,
      },
      ol: {
        pl: 6,
        mb: 4,
      },
      li: {
        mb: 2,
      },
      blockquote: {
        pl: 4,
        borderLeft: "4px solid teal",
        fontStyle: "italic",
        color: "gray.300",
        mb: 4,
      },
      img: {
        maxW: "100%",
        height: "auto",
        mb: 4,
        borderRadius: "md",
      },
      iframe: {
        maxW: "100%",
        mb: 6,
        borderRadius: "md",
      },
      strong: {
        fontWeight: "bold",
      },
      em: {
        fontStyle: "italic",
      },
    },
  },
});

export default theme;

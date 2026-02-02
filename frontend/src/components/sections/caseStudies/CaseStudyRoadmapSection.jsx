import React from "react";
import { alpha, useTheme } from "@mui/material/styles";
import { Box, Stack, Typography, Card, CardContent } from "@mui/material";

const DEFAULT_STEPS = [];

/** ✅ No-lib intersection observer hook */
function useInView(options = { threshold: 0.25, rootMargin: "0px 0px -10% 0px" }) {
  const ref = React.useRef(null);
  const [inView, setInView] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        observer.unobserve(el); // animate once
      }
    }, options);

    observer.observe(el);
    return () => observer.disconnect();
  }, [options]);

  return { ref, inView };
}

/** ✅ Gradient border like your screenshot (pink/purple) */
const GradientBorderCard = ({ children, sx, isDark }) => {
  const borderGradient =
    "linear-gradient(90deg, #a855f7 0%, #ec4899 50%, #8b5cf6 100%)";

  // ✅ theme-wise inner background + shadow only
  const cardBg = isDark ? "#151515" : alpha("#ffffff", 0.92);
  const cardShadow = isDark
    ? "0 20px 60px rgba(0,0,0,0.45)"
    : "0 20px 60px rgba(2,6,23,0.10)";

  return (
    <Box
      sx={{
        p: "1px",
        borderRadius: 1.2,
        background: borderGradient,
        boxShadow: isDark
          ? "0 12px 50px rgba(168,85,247,0.25)"
          : "0 12px 50px rgba(168,85,247,0.14)",
        ...sx,
      }}
    >
      <Card
        sx={{
          bgcolor: cardBg,
          color: isDark ? "white" : alpha("#0b1220", 0.92),
          borderRadius: 1.2,
          border: isDark ? "1px solid transparent" : `1px solid ${alpha("#0b1220", 0.06)}`,
          boxShadow: cardShadow,
        }}
      >
        {children}
      </Card>
    </Box>
  );
};

const RoadmapStep = ({ step, index, isEven, animate = true, isLast = false }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const mainGradient = "linear-gradient(90deg, #5b5fe8 0%, #a855f7 100%)";
  const ringGradient = "linear-gradient(135deg, #a855f7 0%, #38bdf8 100%)";

  const { ref, inView } = useInView();

  const slideFrom = isEven ? -24 : 24;

  // ✅ theme-wise text colors only
  const titleMuted = isDark ? "#a1a1aa" : alpha("#0b1220", 0.55);
  const bodyMuted = isDark ? "#9ca3af" : alpha("#0b1220", 0.68);

  // ✅ theme-wise semicircle bg + wing shadow only
  const semiCircleBg = isDark ? "#fff" : alpha("#0b1220", 0.08);
  const wingShadow = isDark
    ? "0 10px 60px rgba(255, 255, 255, 0.35)"
    : "0 10px 60px rgba(2,6,23,0.12)";

  // ✅ theme-wise number circle styling only
  const numberBaseBg = "#5b5fe8";
  const numberOuterRing = isDark ? "#dbeafe" : alpha("#5b5fe8", 0.18);

  return (
    <Box
      ref={ref}
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: isEven ? "row" : "row-reverse" },
        alignItems: "center",
        width: "100%",
        position: "relative",
        mb: { xs: 2.2, md: isLast ? 4 : 0.75 },
        opacity: !animate ? 1 : inView ? 1 : 0,
        transform: !animate ? "none" : inView ? "translateY(0px)" : "translateY(14px)",
        transition: "opacity 700ms ease, transform 700ms ease",
      }}
    >
      {/* 1. TEXT CONTENT */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: isEven ? "flex-end" : "flex-start",
          px: { xs: 1.5, md: 4 },
          zIndex: 10,
          width: "100%",
        }}
      >
        <GradientBorderCard
          isDark={isDark}
          sx={{
            maxWidth: 440,
            width: "100%",
            opacity: !animate ? 1 : inView ? 1 : 0,
            transform: !animate
              ? "none"
              : inView
              ? "translateX(0px)"
              : `translateX(${slideFrom}px)`,
            transition: "opacity 800ms ease, transform 800ms ease",
            transitionDelay: inView ? `${index * 80}ms` : "0ms",
            "&:hover": {
              transform: inView ? "translateX(0px) translateY(-2px)" : undefined,
            },
          }}
        >
          <CardContent sx={{ p: { xs: 1.8, md: 2.2 } }}>
            <Typography variant="h6" fontWeight={700} sx={{ lineHeight: 1.2 }}>
              {step.label}
              {step.duration ? (
                <Typography component="span" sx={{ color: titleMuted, fontWeight: 400, ml: 0.5 }}>
                  {step.duration}
                </Typography>
              ) : null}
            </Typography>

            <Typography variant="body2" sx={{ color: bodyMuted, mt: 1 }}>
              {step.detail}
            </Typography>
          </CardContent>
        </GradientBorderCard>
      </Box>

      {/* 2. CENTER GRAPHIC ELEMENT */}
      <Box
        sx={{
          position: "relative",
          width: { xs: 140, md: 180 },
          height: { xs: 140, md: 180 },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mt: { xs: 1.6, md: 0 },
          mb: { xs: 0.5, md: 0 },
          opacity: !animate ? 1 : inView ? 1 : 0,
          transform: !animate ? "none" : inView ? "scale(1)" : "scale(0.92)",
          transition: "opacity 700ms ease, transform 700ms ease",
          transitionDelay: inView ? `${index * 80 + 120}ms` : "0ms",
        }}
      >
        {/* Background Semi-Circle */}
        <Box
          sx={{
            position: "absolute",
            width: 150,
            height: 150,
            bgcolor: semiCircleBg,
            borderRadius: "50%",
            zIndex: 1,
            clipPath: isEven
              ? "polygon(50% 0, 100% 0, 100% 100%, 50% 100%)"
              : "polygon(0 0, 50% 0, 50% 100%, 0 100%)",
            display: { xs: "none", md: "block" },
            animation: !animate
              ? "none"
              : inView
              ? "pulseGlow 2.2s ease-in-out infinite"
              : "none",
            "@keyframes pulseGlow": {
              "0%, 100%": { filter: "blur(0px)", opacity: 1 },
              "50%": { filter: "blur(0.6px)", opacity: isDark ? 0.92 : 0.82 },
            },
          }}
        />

        {/* The Colored Wing / Arrow */}
        <Box
          sx={{
            position: "absolute",
            width: { xs: 120, md: 140 },
            height: { xs: 44, md: 50 },
            background: mainGradient,
            zIndex: 2,
            left: isEven ? "auto" : { xs: -38, md: -50 },
            right: isEven ? { xs: -38, md: -50 } : "auto",
            borderRadius: isEven ? "0 48px 48px 0" : "48px 0 0 48px",
            boxShadow: wingShadow,
            transform: !animate
              ? "none"
              : inView
              ? "translateX(0px)"
              : `translateX(${isEven ? 18 : -18}px)`,
            opacity: !animate ? 1 : inView ? 1 : 0,
            transition: "opacity 650ms ease, transform 650ms ease",
            transitionDelay: inView ? `${index * 80 + 200}ms` : "0ms",
          }}
        />

        {/* The Number Circle */}
        <Box
          sx={{
            width: { xs: 76, md: 90 },
            height: { xs: 76, md: 90 },
            borderRadius: "50%",
            bgcolor: numberBaseBg,
            border: { xs: `7px solid ${numberBaseBg}`, md: `8px solid ${numberBaseBg}` },
            boxShadow: {
              xs: `0 0 0 5px ${numberOuterRing}`,
              md: `0 0 0 6px ${numberOuterRing}`,
            },
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 5,
            position: "relative",
            "&::before": {
              content: '""',
              position: "absolute",
              inset: { xs: 7, md: 8 },
              borderRadius: "50%",
              background: ringGradient,
              opacity: isDark ? 0.65 : 0.45,
            },
            transform: !animate
              ? "none"
              : inView
              ? "scale(1) rotate(0deg)"
              : "scale(0.9) rotate(-6deg)",
            transition: "transform 650ms ease",
            transitionDelay: inView ? `${index * 80 + 260}ms` : "0ms",
          }}
        >
          <Typography
            variant="h4"
            fontWeight={800}
            sx={{
              fontSize: { xs: 26, md: 34 },
              color: "white",
              position: "relative",
              zIndex: 2,
              opacity: !animate ? 1 : inView ? 1 : 0,
              transition: "opacity 500ms ease",
              transitionDelay: inView ? `${index * 80 + 320}ms` : "0ms",
            }}
          >
            {String(index + 1).padStart(2, "0")}
          </Typography>
        </Box>
      </Box>

      {/* 3. SPACER */}
      <Box sx={{ flex: 1, display: { xs: "none", md: "block" } }} />
    </Box>
  );
};

const CaseStudyRoadmapSection = ({ animate = true, steps }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const accentColor = "#a855f7";

  // ✅ FIX: correct fallback constant name
  const stepsToRender =
    Array.isArray(steps) && steps.length > 0 ? steps : DEFAULT_STEPS;

  return (
    <Box sx={{ overflow: "visible" }}>
      {/* Badge */}
      <Box sx={{ mx: "auto", display: "flex", justifyContent: "center" }}>
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            px: 2,
            py: 1,
            borderRadius: 0.5,
            border: `1px solid ${
              isDark ? alpha("#ffffff", 0.1) : alpha("#0b1220", 0.12)
            }`,
            background: isDark ? alpha("#0000007c", 0.9) : alpha("#ffffff", 0.9),
            color: alpha(accentColor, 0.9),
            fontWeight: 600,
            letterSpacing: 1,
            textTransform: "uppercase",
            fontSize: 11,
            lineHeight: 1.3,
            width: "fit-content",
            mx: { xs: "auto", md: 0 },
            animation: animate ? "badgeIn 900ms ease both" : "none",
            "@keyframes badgeIn": {
              from: { opacity: 0, transform: "translateY(10px)" },
              to: { opacity: 1, transform: "translateY(0px)" },
            },
          }}
        >
          <Box
            component="span"
            sx={{
              background: "linear-gradient(90deg, #9c27b0 0%, #2196f3 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Execution Roadmap & Timeline: 34 Weeks
          </Box>
        </Box>
      </Box>

      <Box mt={10} />

      <Box sx={{ mt: { xs: 8, md: 5 } }}>
        <Stack alignItems="center">
          {stepsToRender.map((step, index) => (
            <RoadmapStep
              key={index}
              step={step}
              index={index}
              isEven={index % 2 === 0}
              animate={animate}
              isLast={index === stepsToRender.length - 1}
            />
          ))}
        </Stack>
      </Box>
    </Box>
  );
};

export default CaseStudyRoadmapSection;

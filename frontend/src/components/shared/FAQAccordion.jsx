import React, { useMemo } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Stack,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";

const safeStr = (v) => String(v ?? "").trim();

/** ✅ normalize any backend shape into an array of {question, answer} */
const normalizeFaqs = (faqs) => {
  if (!faqs) return [];

  // already array
  if (Array.isArray(faqs)) {
    return faqs
      .map((f) => ({
        question: safeStr(f?.question || f?.q || f?.title),
        answer: safeStr(f?.answer || f?.a || f?.description),
      }))
      .filter((x) => x.question || x.answer);
  }

  // common wrappers
  const wrapped =
    faqs?.data ||
    faqs?.items ||
    faqs?.results ||
    faqs?.faqs ||
    faqs?.faq ||
    faqs?.list;

  if (Array.isArray(wrapped)) return normalizeFaqs(wrapped);

  // single object
  if (typeof faqs === "object") {
    const q = safeStr(faqs?.question || faqs?.q || faqs?.title);
    const a = safeStr(faqs?.answer || faqs?.a || faqs?.description);
    if (!q && !a) return [];
    return [{ question: q, answer: a }];
  }

  return [];
};

const FAQAccordion = ({ faqs }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const resolvedFaqs = useMemo(() => normalizeFaqs(faqs), [faqs]);

  // ✅ if no FAQs, render nothing (no crash)
  if (!resolvedFaqs.length) return null;

  return (
    <Stack spacing={3}>
      <Typography variant="h4" sx={{ fontWeight: 700, textAlign: "center", mb: 1 }}>
        FAQs
      </Typography>

      <Stack spacing={2}>
        {resolvedFaqs.map((faq, index) => {
          const key = faq.question || `faq-${index}`;

          return (
            <Accordion
              key={key}
              defaultExpanded={index === 0}
              sx={{
                borderRadius: 0.5,
                border: `1px solid ${alpha(theme.palette.divider, isDark ? 0.4 : 0.6)}`,
                backgroundColor: alpha(
                  theme.palette.background.paper,
                  isDark ? 0.75 : 0.97
                ),
                transition:
                  "transform 0.4s ease, box-shadow 0.4s ease, border-color 0.4s ease",
                "&:hover": {
                  transform: "translateY(-5px) scale(1.02)",
                },
                "&:before": { display: "none" },
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreRoundedIcon />}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    transition: "color 0.3s ease",
                  }}
                >
                  {faq.question || "FAQ"}
                </Typography>
              </AccordionSummary>

              <AccordionDetails>
                <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.6 }}>
                  {faq.answer || ""}
                </Typography>
              </AccordionDetails>
            </Accordion>
          );
        })}
      </Stack>
    </Stack>
  );
};

export default FAQAccordion;

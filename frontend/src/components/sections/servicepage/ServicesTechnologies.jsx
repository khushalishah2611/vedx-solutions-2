import {
  Avatar,
  Box,
  Tab,
  Tabs,
  Grid,
  Paper,
  Stack,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";

/* ---------------- helpers ---------------- */
const slug = (v) =>
  String(v || "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

const pickGroupTitle = (group) =>
  String(group?.title || group?.category || group?.name || "Group").trim();

const resolveImg = (val) => {
  if (!val) return "";
  if (typeof val === "string") return val.trim();

  if (typeof val === "object") {
    const direct =
      val.url ||
      val.src ||
      val.path ||
      val.href ||
      val.image ||
      val.icon ||
      val.logo ||
      val.file ||
      val.location;

    if (typeof direct === "string") return direct.trim();

    if (val.image) {
      const nested = resolveImg(val.image);
      if (nested) return nested;
    }
    if (val.icon) {
      const nested = resolveImg(val.icon);
      if (nested) return nested;
    }
    if (val.logo) {
      const nested = resolveImg(val.logo);
      if (nested) return nested;
    }

    for (const k of Object.keys(val)) {
      const v = val[k];
      if (typeof v === "string" && v.trim()) return v.trim();
      if (typeof v === "object") {
        const deep = resolveImg(v);
        if (deep) return deep;
      }
    }
  }

  return "";
};

const getItemName = (it) => {
  if (!it) return "";
  if (typeof it === "string") return it;
  return (
    it?.name ||
    it?.title ||
    it?.label ||
    it?.technology ||
    it?.tech ||
    it?.text ||
    ""
  );
};

const getItemIcon = (it) => {
  if (!it || typeof it === "string") return ""; // ✅ string item => no icon
  return (
    resolveImg(it?.icon) ||
    resolveImg(it?.image) ||
    resolveImg(it?.logo) ||
    resolveImg(it?.src) ||
    ""
  );
};

const normalizeTechnologyGroupsToTabs = (technologyGroups, fallbackTabs) => {
  if (!technologyGroups?.length) return fallbackTabs || [];

  const map = new Map();

  technologyGroups.forEach((group, gi) => {
    const title = pickGroupTitle(group);
    const key = slug(title) || `group-${gi}`;

    // ✅ group image (base64/url) from API
    const groupImage =
      resolveImg(group?.image) ||
      resolveImg(group?.icon) ||
      resolveImg(group?.logo) ||
      "";

    if (!map.has(key)) {
      map.set(key, {
        category: title,
        image: groupImage, // tab icon usage (optional)
        technologies: [],
      });
    }

    const existing = map.get(key);
    if (!existing.image && groupImage) existing.image = groupImage;

    const listFromItems = Array.isArray(group?.items) ? group.items : null;
    const rawTech = group?.technologies ?? group?.technology ?? null;

    const listFromTech =
      listFromItems ??
      (Array.isArray(rawTech) ? rawTech : rawTech ? [rawTech] : []);

    const seen = new Set(
      (existing.technologies || []).map((t) =>
        String(t?.name || "").toLowerCase().trim()
      )
    );

    listFromTech.forEach((it) => {
      const name = getItemName(it);
      if (!name) return;

      const nm = String(name).toLowerCase().trim();
      if (seen.has(nm)) return;

      // ✅ item icon if object has icon/image, else ""
      const itemIcon = getItemIcon(it) || "";

      // ✅ KEY FIX:
      // store groupImage in each item as fallback
      existing.technologies.push({
        name,
        icon: itemIcon,
        groupIcon: groupImage,
      });

      seen.add(nm);
    });

    map.set(key, existing);
  });

  return Array.from(map.values()).sort((a, b) =>
    String(a.category).localeCompare(String(b.category))
  );
};

/* ---------------- component ---------------- */
const ServicesTechnologies = ({ technologyGroups }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const subtleText = alpha(theme.palette.text.secondary, isDark ? 0.85 : 0.78);

  const [activeTab, setActiveTab] = useState(0);

  const tabs = useMemo(() => {
    return normalizeTechnologyGroupsToTabs(technologyGroups, []);
  }, [technologyGroups]);

  const technologies = useMemo(() => {
    return tabs?.[activeTab]?.technologies ?? [];
  }, [activeTab, tabs]);

  useEffect(() => {
    if (activeTab >= (tabs?.length || 0)) setActiveTab(0);
  }, [activeTab, tabs?.length]);

  return (
    <Box component="section" sx={{ mt: { xs: 6, md: 8 } }}>
      {/* Header Section */}
      <Stack
        spacing={2.5}
        alignItems="center"
        textAlign="center"
        sx={{ mb: { xs: 4, md: 5 }, px: { xs: 2, md: 0 } }}
      >
        <Typography
          variant="h3"
          sx={{ fontSize: { xs: 28, md: 40 }, fontWeight: 700 }}
        >
          Technologies We Support
        </Typography>
        <Typography variant="body1" sx={{ color: subtleText, }}>
          Choose from a comprehensive library of frontend, backend, and DevOps
          expertise to ship resilient platforms.
        </Typography>
      </Stack>

      {/* Tabs */}
      <Box sx={{ display: "flex", justifyContent: "center", px: { xs: 2, md: 0 } }}>
        <Tabs
          value={activeTab}
          onChange={(_, value) => setActiveTab(value)}
          variant="scrollable"
          allowScrollButtonsMobile
          centered={false}
          sx={{
            borderRadius: 0.5,
            bgcolor: alpha(theme.palette.background.paper, isDark ? 0.35 : 0.8),
            maxWidth: "100%",
            px: 1,
            "& .MuiTabs-flexContainer": { gap: 4 },
          }}
        >
          {tabs.map((tab, index) => (
            <Tab
              key={`${slug(tab.category)}-${index}`}
              label={tab.category}
              value={index}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                borderRadius: 0.5,
                minHeight: 44,
                px: { xs: 1.5, md: 2.5 },
                fontSize: { xs: 13, md: 14 },
                "&.Mui-selected": {
                  bgcolor: "primary.main",
                  color: theme.palette.primary.contrastText,
                },
              }}
            />
          ))}
        </Tabs>
      </Box>

      {/* Technology Grid */}
      <Grid
        container
        spacing={2.5}
        sx={{ mt: { xs: 4, md: 5 }, px: { xs: 2, md: 0 } }}
      >
        {technologies.map((tech, idx) => {
          const name = String(tech?.name || "").trim();
          const letter = name ? name[0].toUpperCase() : "?";

          // ✅ Card icon priority:
          // 1) tech.icon (item specific)
          // 2) tech.groupIcon (group base64)
          const src = tech?.icon || tech?.groupIcon || "";

          const hasImg = Boolean(src);

          return (
            <Grid item xs={6} sm={4} md={3} lg={2} key={`${name}-${idx}`}>
              <Paper
                elevation={0}
                sx={{
                  height: "100%",
                  borderRadius: 0.5,
                  p: 2.5,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1.5,
                  backgroundColor: alpha(
                    theme.palette.background.paper,
                    isDark ? 0.75 : 0.98
                  ),
                  border: `1px solid ${alpha(
                    theme.palette.divider,
                    isDark ? 0.4 : 0.5
                  )}`,
                  transition:
                    "transform 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease",
                  boxShadow: isDark
                    ? "0 20px 35px rgba(15,23,42,0.35)"
                    : "0 20px 35px rgba(15,23,42,0.08)",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    borderColor: isDark ? "#67e8f9" : theme.palette.primary.main,
                    boxShadow: isDark
                      ? "0 24px 40px rgba(15,23,42,0.6)"
                      : "0 24px 40px rgba(15,23,42,0.14)",
                  },
                  "&:hover .techName": {
                    color: "transparent",
                    backgroundImage:
                      "linear-gradient(90deg, #FF4C4C 0%, #9333EA 100%)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  },
                }}
              >
                {/* ✅ Avatar: now group base64 binds if item icon missing */}
                <Avatar
                  src={hasImg ? src : undefined}
                  alt={name || "Technology"}
                  sx={{
                    width: 50,
                    height: 50,
                    mb: 2,
                    fontWeight: 800,
                   
                    "& img": { objectFit: "contain" },
                  }}
                >
                  {/* If image exists, letter will be hidden by img. If image missing => letter shows */}
                  {letter}
                </Avatar>

                <Typography
                  className="techName"
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    textAlign: "center",
                    wordBreak: "break-word",
                    transition: "color 0.3s ease, background-image 0.3s ease",
                  }}
                >
                  {name}
                </Typography>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default ServicesTechnologies;

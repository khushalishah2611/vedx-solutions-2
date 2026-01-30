import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Box,
  Breadcrumbs,
  Container,
  Divider,
  Grid,
  Link as MuiLink,
  Stack,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import { keyframes } from "@mui/system";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";

import { AppButton } from "../shared/FormControls.jsx";
import ServicesBlog from "../shared/ServicesBlog.jsx";

import { apiUrl } from "../../utils/const.js";
import { useLoadingFetch } from "../../hooks/useLoadingFetch.js";

/* =========================
   ANIMATIONS
========================= */
const slideInLeft = keyframes`
  0% { opacity: 0; transform: translateX(-40px); }
  100% { opacity: 1; transform: translateX(0); }
`;

const slideInRight = keyframes`
  0% { opacity: 0; transform: translateX(40px); }
  100% { opacity: 1; transform: translateX(0); }
`;

/* =========================
   ✅ date formatter: "22 Jan 2025"
========================= */
const formatDate = (value) => {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);

  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const BlogDetailPage = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const navigate = useNavigate();
  const { slug } = useParams();
  const { fetchWithLoading } = useLoadingFetch();

  const [apiPost, setApiPost] = useState(null);
  const [isApiLoading, setIsApiLoading] = useState(true);

  // ✅ NEW: store list for recent + related
  const [apiAllPosts, setApiAllPosts] = useState([]);
  const [isPostsLoading, setIsPostsLoading] = useState(true);

  /* =========================
     HELPERS (stable)
  ========================= */
  const buildHtml = useCallback((value) => ({ __html: value ?? "" }), []);

  const resolveImg = useCallback((value) => {
    if (!value) return "";
    const v = String(value).trim();
    if (!v) return "";
    if (v.startsWith("data:")) return v;
    if (v.startsWith("http://") || v.startsWith("https://")) return v;
    return apiUrl(v.startsWith("/") ? v : `/${v}`);
  }, []);

  // ✅ Navigate to contact AND scroll to top
  const navigateToContactTop = useCallback(
    (href = "/contact") => {
      navigate(href);

      // ensure scroll even after route render
      requestAnimationFrame(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 120);
    },
    [navigate]
  );

  /* =========================
     FETCH API POST (detail)
  ========================= */
  useEffect(() => {
    let mounted = true;

    const loadPost = async () => {
      if (!slug) {
        if (mounted) {
          setApiPost(null);
          setIsApiLoading(false);
        }
        return;
      }

      setIsApiLoading(true);
      try {
        const res = await fetchWithLoading(apiUrl(`/api/blog-posts/${slug}`));
        if (!res?.ok) throw new Error("Failed to fetch blog post");
        const payload = await res.json();

        if (!mounted) return;
        setApiPost(payload?.post ?? null);
      } catch (_e) {
        if (mounted) setApiPost(null);
      } finally {
        if (mounted) setIsApiLoading(false);
      }
    };

    loadPost();
    return () => {
      mounted = false;
    };
  }, [fetchWithLoading, slug]);

  /* =========================
     ✅ FETCH ALL POSTS (for Recent + Related)
     - If your API path differs, just change this one line
  ========================= */
  useEffect(() => {
    let mounted = true;

    const loadAllPosts = async () => {
      setIsPostsLoading(true);
      try {
        // ✅ Common listing endpoint. If yours is different, update here:
        const res = await fetchWithLoading(apiUrl(`/api/blog-posts`));
        if (!res?.ok) throw new Error("Failed to fetch blog posts list");
        const payload = await res.json();

        const items = payload?.posts || payload?.data || payload?.items || [];
        if (!mounted) return;
        setApiAllPosts(Array.isArray(items) ? items : []);
      } catch (_e) {
        if (mounted) setApiAllPosts([]);
      } finally {
        if (mounted) setIsPostsLoading(false);
      }
    };

    loadAllPosts();
    return () => {
      mounted = false;
    };
  }, [fetchWithLoading]);

  /* =========================
     NORMALIZE API POST
  ========================= */
  const normalizedApiPost = useMemo(() => {
    if (!apiPost) return null;

    const summary =
      apiPost.shortDescription || apiPost.description || apiPost.subtitle || "";
    const longDescription =
      apiPost.longDescription || apiPost.description || apiPost.conclusion || "";
    const conclusion = apiPost.conclusion || "";

    const sections = [];
    if (summary) sections.push({ heading: "Summary", paragraphs: [summary] });
    if (longDescription && longDescription !== summary) {
      sections.push({
        heading: summary ? "Details" : "Overview",
        paragraphs: [longDescription],
      });
    }

    const mainImage = resolveImg(
      apiPost.coverImage || apiPost.blogImage || apiPost.heroImage || ""
    );
    const ctaImage = resolveImg(
      apiPost.ctaImage ||
      apiPost.ctaImageUrl ||
      apiPost.ctaBlobImage ||
      apiPost.blobImage ||
      apiPost.blogImage ||
      apiPost.coverImage ||
      ""
    );

    const ctaHref =
      apiPost.ctaButtonLink ||
      apiPost.ctaButtonHref ||
      apiPost.primaryCtaHref ||
      apiPost.ctaLink ||
      "/contact";

    const ctaLabel =
      apiPost.ctaButtonText ||
      apiPost.ctaButtonLabel ||
      apiPost.primaryCtaLabel ||
      "Contact us";

    // normalize tags to array of strings
    const tags = Array.isArray(apiPost.tags)
      ? apiPost.tags
        .map((t) => (typeof t === "string" ? t : t?.name))
        .filter(Boolean)
      : [];

    return {
      id: apiPost.id,
      title: apiPost.title || "",
      subtitle: apiPost.subtitle || "",
      slug: apiPost.slug || slug || "",
      category: apiPost.category?.name || apiPost.category || "Uncategorized",
      tags,
      image: mainImage,
      heroImage: mainImage,
      publishedOn: apiPost.publishDate || apiPost.createdAt || "",

      sections,

      conclusion: {
        heading: "Conclusion",
        paragraphs: conclusion ? [conclusion] : [],
      },

      cta: {
        heading: apiPost.shortDescription || "Explore Our Tech Expertise Further",
        description:
          apiPost.longDescription ||
          "Let Vedx Solution be your trusted tech partner to build fast, reliable solutions tailored to your needs.",
        primaryCtaLabel: ctaLabel,
        primaryCtaHref: ctaHref,
        image: ctaImage,
      },
    };
  }, [apiPost, resolveImg, slug]);

  const post = normalizedApiPost;

  /* =========================
     ✅ IMPORTANT: Hooks BEFORE returns
  ========================= */
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [slug]);

  // ✅ Local helper to get related posts (NO missing function crash)
  const getRelatedPostsLocal = useCallback(
    (currentSlug, category, tags) => {
      const tagSet = new Set((tags || []).map((t) => String(t).toLowerCase()));

      const normalized = (apiAllPosts || [])
        .map((p) => ({
          ...p,
          slug: p.slug || "",
          title: p.title || "",
          subtitle: p.subtitle || "",
          publishedOn: p.publishDate || p.createdAt || "",
          category: p.category?.name || p.category || "Uncategorized",
          tags: Array.isArray(p.tags)
            ? p.tags
              .map((t) => (typeof t === "string" ? t : t?.name))
              .filter(Boolean)
            : [],
          image: resolveImg(p.coverImage || p.blogImage || p.heroImage || ""),
        }))
        .filter((p) => p.slug && p.slug !== currentSlug);

      // score by same category + matching tags
      const scored = normalized
        .map((p) => {
          const sameCategory =
            String(p.category || "").toLowerCase() ===
            String(category || "").toLowerCase();

          const postTags = (p.tags || []).map((t) => String(t).toLowerCase());
          const commonTags = postTags.filter((t) => tagSet.has(t)).length;

          const score = (sameCategory ? 3 : 0) + commonTags;
          return { p, score };
        })
        .sort((a, b) => b.score - a.score);

      return scored
        .filter((x) => x.score > 0)
        .slice(0, 6)
        .map((x) => x.p);
    },
    [apiAllPosts, resolveImg]
  );

  const relatedPosts = useMemo(() => {
    const safeSlug = post?.slug || "";
    const safeCategory = post?.category || "";
    const safeTags = Array.isArray(post?.tags) ? post.tags : [];
    if (!safeSlug) return [];
    return getRelatedPostsLocal(safeSlug, safeCategory, safeTags) || [];
  }, [getRelatedPostsLocal, post?.category, post?.slug, post?.tags]);

  // ✅ Recent posts for sidebar (3 items)
  const recentArticles = useMemo(() => {
    const currentSlug = post?.slug || "";
    const normalized = (apiAllPosts || [])
      .map((p) => ({
        slug: p.slug || "",
        title: p.title || "",
        publishedOn: p.publishDate || p.createdAt || "",
      }))
      .filter((p) => p.slug && p.slug !== currentSlug);

    // sort by date desc
    normalized.sort((a, b) => {
      const da = new Date(a.publishedOn).getTime();
      const db = new Date(b.publishedOn).getTime();
      return (Number.isNaN(db) ? 0 : db) - (Number.isNaN(da) ? 0 : da);
    });

    return normalized.slice(0, 3);
  }, [apiAllPosts, post?.slug]);

  useEffect(() => {
    if (!post && !isApiLoading) {
      navigate("/blog", { replace: true });
    }
  }, [isApiLoading, navigate, post]);

  /* =========================
     EARLY RETURNS (after hooks)
  ========================= */
  if (!post && isApiLoading) return null;
  if (!post) return null;

  /* =========================
     UI TOKENS
  ========================= */
  const subtleText = alpha(theme.palette.text.secondary, isDark ? 0.9 : 0.75);
  const accentColor = isDark ? "#67e8f9" : theme.palette.primary.main;
  const dividerColor = alpha(theme.palette.divider, isDark ? 0.5 : 0.3);

  // ✅ HERO IMAGE (exact binding)
  const heroImage = post.heroImage || post.image || "";
  const heroHasImage = Boolean(heroImage);

  // ✅ Breadcrumb label + Title bind
  const heroTitle = post.title || "";

  const onContact = () => navigateToContactTop("/contact");

  return (
    <Box sx={{ bgcolor: "background.default" }}>
      {/* =========================
          HERO
      ========================= */}
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          minHeight: { xs: "60vh", md: "70vh" },
          display: "flex",
          alignItems: "center",
          pb: { xs: 12, md: 14 },
          pt: { xs: 14, md: 18 },
        }}
      >
        {/* Background Image */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundImage: heroHasImage
              ? `url(${heroImage})`
              : isDark
                ? "linear-gradient(135deg, rgba(2,6,23,1) 0%, rgba(15,23,42,1) 50%, rgba(2,6,23,1) 100%)"
                : "linear-gradient(135deg, rgba(241,245,249,1) 0%, rgba(226,232,240,1) 50%, rgba(241,245,249,1) 100%)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            transform: "scale(1.05)",
            // ✅ light mode: keep image brighter so black text is readable
            filter: heroHasImage
              ? isDark
                ? "brightness(0.85)"
                : "brightness(0.95)"
              : "none",
          }}
        />

        {/* Overlay */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            // ✅ dark = dark overlay, light = white overlay
            background: isDark
              ? `linear-gradient(
            90deg,
            rgba(5,9,18,0.85) 0%,
            rgba(5,9,18,0.65) 40%,
            rgba(5,9,18,0.2) 70%,
            rgba(5,9,18,0) 100%
          )`
              : `linear-gradient(
            90deg,
            rgba(255,255,255,0.92) 0%,
            rgba(255,255,255,0.75) 40%,
            rgba(255,255,255,0.35) 70%,
            rgba(255,255,255,0) 100%
          )`,
          }}
        />

        <Container
          maxWidth={false}
          sx={{
            position: "relative",
            zIndex: 1,
            px: { xs: 3, md: 14 },
          }}
        >
          <Stack spacing={2.2}>
            {/* ✅ Breadcrumbs (theme based) */}
            <Breadcrumbs
              separator={
                <NavigateNextIcon
                  fontSize="small"
                  sx={{
                    color: isDark ? alpha("#ffffff", 0.9) : alpha("#0f172a", 0.65),
                  }}
                />
              }
              aria-label="breadcrumb"
              sx={{
                color: isDark ? alpha("#ffffff", 0.85) : alpha("#0f172a", 0.85),
                fontSize: { xs: 12, sm: 18 },
                "& .MuiBreadcrumbs-ol": {
                  flexWrap: "wrap",
                  justifyContent: { xs: "center", md: "flex-start" },
                },
                "& .MuiBreadcrumbs-li": {
                  display: "flex",
                  alignItems: "center",
                },
                "& a, & p": {
                  fontSize: { xs: 12, sm: 18 },
                  textAlign: { xs: "center", md: "left" },
                },
                "& a": {
                  fontWeight: 600,
                  textDecoration: "none",
                  "&:hover": {
                    textDecoration: "underline",
                    textDecorationColor: isDark
                      ? alpha("#ffffff", 0.35)
                      : alpha("#0f172a", 0.35),
                  },
                },
              }}
            >
              <MuiLink component={RouterLink} underline="hover" color="inherit" to="/">
                Home
              </MuiLink>
              <MuiLink component={RouterLink} underline="hover" color="inherit" to="/blog">
                Blog
              </MuiLink>
              <Typography color="inherit" sx={{ fontWeight: 700 }}>
                {post.title}
              </Typography>
            </Breadcrumbs>

            {/* Category pill */}
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                px: 2,
                py: 1,
                borderRadius: 0.5,
                border: `1px solid ${isDark ? alpha("#ffffff", 0.12) : alpha("#0f172a", 0.12)
                  }`,
                background: !isDark
                    ? alpha('#ddddddff', 0.9)
                    : alpha('#0000007c', 0.9),
                color: alpha(accentColor, 0.9),
                fontWeight: 700,
                letterSpacing: 1,
                textTransform: "uppercase",
                fontSize: 11,
                lineHeight: 1.3,
                width: "fit-content",
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
                {post.category}
              </Box>
            </Box>

            {/* ✅ Big Title (theme based as you asked) */}
            <Typography
              variant="h1"
              sx={{
                color: isDark ? "#fff" : "#0f172a",
                fontWeight: 800,
                lineHeight: 1.08,
                letterSpacing: -0.5,
                fontSize: { xs: 30, sm: 38, md: 56 },
                maxWidth: { xs: "100%", md: 980 },
                textAlign: { xs: "center", md: "left" },
              }}
            >
              {heroTitle}
            </Typography>

          

            {/* Published date */}
            {post.publishedOn ? (
              <Typography
                variant="body1"
                sx={{
                  color: isDark ? alpha("#f8fafc", 0.85) : alpha("#0f172a", 0.7),
                  fontWeight: 600,
                }}
              >
                {formatDate(post.publishedOn)}
              </Typography>
            ) : null}

            {/* Contact button */}
            <Box>
              <AppButton
                variant="contained"
                size="large"
                onClick={onContact}
                sx={{
                  background: "linear-gradient(90deg, #FF5E5E 0%, #A84DFF 100%)",
                  color: "#fff",
                  borderRadius: "12px",
                  textTransform: "none",
                  fontWeight: 700,
                  px: { xs: 4, md: 6 },
                  py: { xs: 1.25, md: 1.5 },
                  "&:hover": {
                    background: "linear-gradient(90deg, #FF4C4C 0%, #9939FF 100%)",
                  },
                }}
              >
                Contact us
              </AppButton>
            </Box>
          </Stack>
        </Container>
      </Box>
      {/* =========================
          MAIN CONTENT
      ========================= */}
      <Container
        maxWidth={false}
        sx={{
          zIndex: 1,
          px: { xs: 3, md: 14 },
          py: { xs: 7, md: 10 },
        }}
      >
        <Box my={4}>
          <Grid container spacing={{ xs: 7, md: 9 }}>
            {/* Left */}
            <Grid
              item
              xs={12}
              md={8}
              sx={{
                opacity: 0,
                animation: `${slideInLeft} 0.7s ease-out forwards`,
                animationDelay: "0.1s",
              }}
            >
              <Stack spacing={5}>
                {/* Subtitle */}
                {post.subtitle ? (
                  <Typography
                    variant="h6"
                    component="div"
                    sx={{
                      maxWidth: 780,
                      color: alpha(
                        theme.palette.text.primary,
                        isDark ? 0.92 : 0.9
                      ),
                      lineHeight: 1.8,
                    }}
                    dangerouslySetInnerHTML={buildHtml(post.subtitle)}
                  />
                ) : null}

                <Divider sx={{ borderColor: dividerColor }} />

                {/* Conclusion */}
                <Stack spacing={2.2}>
                  <Typography
                    variant="h4"
                    sx={{ fontSize: { xs: 24, md: 32 }, fontWeight: 800 }}
                  >
                    {post.conclusion?.heading || "Conclusion"}
                  </Typography>

                  {(post.conclusion?.paragraphs || []).map((p, i) => (
                    <Typography
                      key={i}
                      variant="body1"
                      component="div"
                      sx={{ color: subtleText, lineHeight: 1.85 }}
                      dangerouslySetInnerHTML={buildHtml(p)}
                    />
                  ))}
                </Stack>

                {/* CTA */}
                <Box
                  sx={{
                    position: "relative",
                    overflow: "hidden",
                    borderRadius: 0.5,
                    border: `1px solid ${alpha(
                      theme.palette.divider,
                      isDark ? 0.5 : 0.2
                    )}`,
                    p: { xs: 3, md: 4 },
                    backgroundImage: post.cta?.image ? `url(${post.cta.image})` : "none",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                  }}
                >
                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      zIndex: 0,
                      pointerEvents: "none",
                      background: isDark
                        ? `linear-gradient(90deg, rgba(2,6,23,0.92) 0%, rgba(2,6,23,0.72) 45%, rgba(2,6,23,0.45) 100%)`
                        : `linear-gradient(90deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.75) 45%, rgba(255,255,255,0.55) 100%)`,
                    }}
                  />

                  <Grid
                    container
                    spacing={3}
                    alignItems="center"
                    sx={{ position: "relative", zIndex: 1 }}
                  >
                    <Grid item xs={12} md={7}>
                      <Stack spacing={2.3}>
                        <Typography
                          variant="h4"
                          sx={{
                            fontSize: { xs: 22, md: 28 },
                            fontWeight: 800,
                          }}
                        >
                          {post.cta?.heading}
                        </Typography>

                        <Typography
                          variant="body1"
                          sx={{ color: subtleText, lineHeight: 1.8 }}
                        >
                          {post.cta?.description}
                        </Typography>

                        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                          <AppButton
                            variant="contained"
                            size="large"
                            onClick={() =>
                              navigateToContactTop(post.cta?.primaryCtaHref || "/contact")
                            }
                            endIcon={<ArrowForwardIcon />}
                            sx={{
                              background:
                                "linear-gradient(90deg, #FF5E5E 0%, #A84DFF 100%)",
                              color: "#fff",
                              borderRadius: "12px",
                              textTransform: "none",
                              fontWeight: 700,
                              "&:hover": {
                                background:
                                  "linear-gradient(90deg, #FF4C4C 0%, #9939FF 100%)",
                              },
                            }}
                          >
                            {post.cta?.primaryCtaLabel || "Contact us"}
                          </AppButton>
                        </Stack>
                      </Stack>
                    </Grid>
                  </Grid>
                </Box>
              </Stack>
            </Grid>

            {/* Right */}
            <Grid
              item
              xs={12}
              md={4}
              sx={{
                opacity: 0,
                animation: `${slideInRight} 0.7s ease-out forwards`,
                animationDelay: "0.25s",
              }}
            >
              <Stack spacing={2}>


                {/* ✅ Recent Articles (API) */}
                <Box
                  sx={{
                    borderRadius: 0.5,
                    border: `1px solid ${alpha(
                      theme.palette.divider,
                      isDark ? 0.5 : 0.22
                    )}`,
                    backgroundColor: alpha(
                      theme.palette.background.paper,
                      isDark ? 0.6 : 0.96
                    ),
                    p: 2,
                  }}
                >
                  <Stack spacing={2.3}>
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 800, letterSpacing: 0.5 }}
                    >
                      Recent Articles
                    </Typography>

                    <Stack spacing={2.2}>
                      {isPostsLoading ? (
                        <Typography variant="caption" sx={{ color: subtleText }}>
                          Loading...
                        </Typography>
                      ) : recentArticles.length ? (
                        recentArticles.map((item) => (
                          <Stack key={item.slug} spacing={0.5}>
                            <Typography
                              component={RouterLink}
                              to={`/blog/${item.slug}`}
                              sx={{
                                textDecoration: "none",
                                color: theme.palette.text.primary,
                                fontWeight: 700,
                                transition: "all 0.3s ease",
                                "&:hover": {
                                  background:
                                    "linear-gradient(90deg, #FF4C4C 0%, #9939FF 100%)",
                                  WebkitBackgroundClip: "text",
                                  WebkitTextFillColor: "transparent",
                                },
                              }}
                            >
                              {item.title}
                            </Typography>
                            <Typography variant="caption" sx={{ color: subtleText }}>
                              {item.publishedOn ? formatDate(item.publishedOn) : "—"}
                            </Typography>
                          </Stack>
                        ))
                      ) : (
                        <Typography variant="caption" sx={{ color: subtleText }}>
                          No recent articles
                        </Typography>
                      )}
                    </Stack>
                  </Stack>
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ borderColor: dividerColor }} />

        {/* Related Posts */}
        {relatedPosts.length > 0 ? (
          <Box mt={10}>
            <ServicesBlog headingText="Related Blogs" posts={relatedPosts} limit={3} />
          </Box>
        ) : null}
      </Container>
    </Box>
  );
};

export default BlogDetailPage;

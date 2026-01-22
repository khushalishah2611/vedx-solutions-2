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

import { blogPosts, getBlogBySlug, getRelatedPosts } from "../../data/blogs.js";
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
   OPTIONAL: date formatter
========================= */
const formatDate = (value) => {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });
};

const BlogDetailPage = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const navigate = useNavigate();
  const { slug } = useParams();
  const { fetchWithLoading } = useLoadingFetch();

  const [apiPost, setApiPost] = useState(null);
  const [isApiLoading, setIsApiLoading] = useState(true);

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

  /* =========================
     FETCH API POST
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
     FALLBACK POST (static)
  ========================= */
  const fallbackPost = useMemo(() => {
    return getBlogBySlug(slug ?? "");
  }, [slug]);

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

    const mainImage = resolveImg(apiPost.coverImage || apiPost.blogImage || apiPost.heroImage || "");
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

    return {
      id: apiPost.id,
      title: apiPost.title || "",
      subtitle: apiPost.subtitle || "",
      slug: apiPost.slug || slug || "",
      category: apiPost.category?.name || "Uncategorized",
      tags: Array.isArray(apiPost.tags) ? apiPost.tags : [],
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

  const post = normalizedApiPost ?? fallbackPost;

  /* =========================
     ✅ IMPORTANT: Hooks BEFORE returns
  ========================= */
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [slug]);

  const relatedPosts = useMemo(() => {
    const safeSlug = post?.slug || "";
    const safeCategory = post?.category || "";
    const safeTags = Array.isArray(post?.tags) ? post.tags : [];
    if (!safeSlug) return [];
    try {
      return getRelatedPosts(safeSlug, safeCategory, safeTags) || [];
    } catch (_e) {
      return [];
    }
  }, [post?.slug, post?.category, post?.tags]);

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
  const heroCategory = post.category || "Blog";

  const onContact = () => navigate("/contact");

  return (
    <Box sx={{ bgcolor: "background.default" }}>
      {/* =========================
          HERO (Screenshot style)
      ========================= */}
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          minHeight: { xs: '60vh', md: '70vh' },
          display: 'flex',
          alignItems: 'center',
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
              : "linear-gradient(135deg, rgba(2,6,23,1) 0%, rgba(15,23,42,1) 50%, rgba(2,6,23,1) 100%)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            transform: "scale(1.05)",
            filter: isDark ? "brightness(0.85)" : "brightness(0.7)",
          }}
        />

        {/* Overlay (deep like screenshot) */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background: `
              linear-gradient(
                90deg,
                rgba(2,6,23,0.92) 0%,
                rgba(2,6,23,0.78) 40%,
                rgba(2,6,23,0.35) 100%
              )
            `,
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
            {/* Breadcrumbs */}
            <Breadcrumbs
              separator={<NavigateNextIcon fontSize="small" sx={{ color: alpha("#e2e8f0", 0.9) }} />}
              aria-label="breadcrumb"
              sx={{
                color: alpha('#fff', 0.85),
                fontSize: { xs: 12, sm: 18 },
                '& .MuiBreadcrumbs-ol': {
                  flexWrap: 'wrap',
                  justifyContent: { xs: 'center', md: 'flex-start' },
                },
                '& .MuiBreadcrumbs-li': {
                  display: 'flex',
                  alignItems: 'center',
                },
                '& a, & p': {
                  fontSize: { xs: 12, sm: 18 },
                  textAlign: { xs: 'center', md: 'left' },
                },
              }}
            >
              <MuiLink component={RouterLink} underline="hover" color="inherit" to="/">
                Home
              </MuiLink>
              <MuiLink component={RouterLink} underline="hover" color="inherit" to="/blog">
                Blog
              </MuiLink>
              <Typography color="inherit">{post.title}</Typography>
            </Breadcrumbs>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                px: 2,
                py: 1,
                borderRadius: 0.5,
                border: `1px solid ${alpha('#ffffff', 0.1)}`,
                background: !isDark ? alpha('#ddddddff', 0.9) : alpha('#0000007c', 0.9),
                color: alpha(accentColor, 0.9),
                fontWeight: 600,
                letterSpacing: 1,
                textTransform: 'uppercase',
                fontSize: 11,
                lineHeight: 1.3,
                width: 'fit-content',
              }}
            >
              <Box
                component="span"
                sx={{
                  background: 'linear-gradient(90deg, #9c27b0 0%, #2196f3 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {post.category}
              </Box>
            </Box>
            {/* Big Title (bind) */}
            <Typography
              variant="h1"
              sx={{
                color: "#fff",
                fontWeight: 800,
                lineHeight: 1.08,
                letterSpacing: -0.5,
                fontSize: { xs: 30, sm: 38, md: 56 }, // screenshot vibe
                maxWidth: { xs: "100%", md: 980 },
              }}
            >
              {heroTitle}
            </Typography>

            {/* Published date (optional) */}
            {post.publishedOn ? (
              <Typography
                variant="body1"
                sx={{ color: alpha("#f8fafc", 0.85), fontWeight: 500 }}
              >
                {formatDate(post.publishedOn)}
              </Typography>
            ) : null}

            {/* Contact button -> /contact */}
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
                      color: alpha(theme.palette.text.primary, isDark ? 0.92 : 0.9),
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
                    border: `1px solid ${alpha(theme.palette.divider, isDark ? 0.5 : 0.2)}`,
                    p: { xs: 3, md: 4 },

                    // ✅ Background image (IMPORTANT)
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
                        ? `linear-gradient(90deg,
            rgba(2,6,23,0.92) 0%,
            rgba(2,6,23,0.72) 45%,
            rgba(2,6,23,0.45) 100%)`
                        : `linear-gradient(90deg,
            rgba(255,255,255,0.95) 0%,
            rgba(255,255,255,0.75) 45%,
            rgba(255,255,255,0.55) 100%)`,
                    }}
                  />

                  {/* ✅ Content should be above overlay */}
                  <Grid container spacing={3} alignItems="center" sx={{ position: "relative", zIndex: 1 }}>
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

                        <Typography variant="body1" sx={{ color: subtleText, lineHeight: 1.8 }}>
                          {post.cta?.description}
                        </Typography>

                        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                          <AppButton
                            variant="contained"
                            size="large"
                            onClick={() => navigate(post.cta?.primaryCtaHref || "/contact")}
                            endIcon={<ArrowForwardIcon />}
                            sx={{
                              background: "linear-gradient(90deg, #FF5E5E 0%, #A84DFF 100%)",
                              color: "#fff",
                              borderRadius: "12px",
                              textTransform: "none",
                              fontWeight: 700,
                              "&:hover": {
                                background: "linear-gradient(90deg, #FF4C4C 0%, #9939FF 100%)",
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
                {/* Tags */}
                <Box
                  sx={{
                    borderRadius: 0.5,
                    border: `1px solid ${alpha(theme.palette.divider, isDark ? 0.5 : 0.22)}`,
                    backgroundColor: alpha(theme.palette.background.paper, isDark ? 0.6 : 0.96),
                    p: 2,
                  }}
                >
                  <Stack spacing={2}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, letterSpacing: 0.5 }}>
                      Tags
                    </Typography>

                    <Stack direction="row" flexWrap="wrap" gap={1.2}>
                      {(post.tags || []).length ? (
                        (post.tags || []).map((tag) => (
                          <Box
                            key={tag}
                            sx={{
                              display: "inline-flex",
                              alignItems: "center",
                              px: 2,
                              py: 1,
                              borderRadius: 0.5,
                              border: `1px solid ${alpha("#ffffff", 0.1)}`,
                              background: !isDark ? alpha("#ddddddff", 0.9) : alpha("#0000007c", 0.9),
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
                              {tag}
                            </Box>
                          </Box>
                        ))
                      ) : (
                        <Typography variant="caption" sx={{ color: subtleText }}>
                          No tags
                        </Typography>
                      )}
                    </Stack>
                  </Stack>
                </Box>

                {/* Recent Articles (static) */}
                <Box
                  sx={{
                    borderRadius: 0.5,
                    border: `1px solid ${alpha(theme.palette.divider, isDark ? 0.5 : 0.22)}`,
                    backgroundColor: alpha(theme.palette.background.paper, isDark ? 0.6 : 0.96),
                    p: 2,
                  }}
                >
                  <Stack spacing={2.3}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, letterSpacing: 0.5 }}>
                      Recent Articles
                    </Typography>

                    <Stack spacing={2.2}>
                      {blogPosts.slice(0, 3).map((item) => (
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
                                background: "linear-gradient(90deg, #FF4C4C 0%, #9939FF 100%)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                              },
                            }}
                          >
                            {item.title}
                          </Typography>
                          <Typography variant="caption" sx={{ color: subtleText }}>
                            {item.publishedOn ?? "—"}
                          </Typography>
                        </Stack>
                      ))}
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
            <Container maxWidth="lg">
              <Stack sx={{ mb: 6, alignItems: "center", textAlign: "center" }}>
                <Typography variant="h4" sx={{ fontSize: { xs: 26, md: 36 }, fontWeight: 800 }}>
                  Related Blogs
                </Typography>
                <Typography variant="body1" sx={{ color: subtleText, maxWidth: 600 }}>
                  Continue exploring insights curated by our full stack engineers,
                  product strategists, and UX experts.
                </Typography>
              </Stack>
            </Container>

            <ServicesBlog showHeading={true} posts={relatedPosts} limit={4} />
          </Box>
        ) : (
          <Box >
           
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default BlogDetailPage;

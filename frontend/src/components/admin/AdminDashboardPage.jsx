"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Box, Card, CardContent, CardHeader, Divider, FormControlLabel, Grid, IconButton, MenuItem, Pagination, Stack, Switch, Tab, Tabs, Table, TableBody, TableCell, TableHead, TableRow, TableContainer, Tooltip, Typography, Chip } from '@mui/material';
import { AppButton, AppDialog, AppDialogActions, AppDialogContent, AppDialogTitle, AppSelectField, AppTextField } from '../shared/FormControls.jsx';

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { apiUrl } from "../../utils/const.js";

const BANNER_TYPE_ORDER = [
  "home",
  "about",
  "blogs",
  "case-study",
  "contact",
  "career",
  "privacy-policy",
  "terms-and-condition",
];

const BANNER_TYPE_LABELS = {
  home: "Home",
  about: "About",
  blogs: "Blogs",
  "case-study": "Case study",
  contact: "Contact",
  career: "Career",
  "privacy-policy": "Privacy policy",
  "terms-and-condition": "Terms and condition",
};

/* =======================
 * Image upload helper
 * ======================= */

const ImageUpload = ({ label, value, onChange, required }) => {
  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        onChange(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <Stack spacing={1.5}>
      <Typography variant="subtitle2">{label}</Typography>
      <Box
        sx={{
          width: "100%",
          borderRadius: 1,
          border: "1px dashed",
          borderColor: "divider",
          p: 1,
          backgroundColor: "background.default",
          minHeight: 220,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {value ? (
          <Box
            component="img"
            src={value}
            alt={`${label} preview`}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: 1,
            }}
          />
        ) : (
          <Typography
            variant="body2"
            color="text.secondary"
            textAlign="center"
            px={2}
          >
            Banner preview will appear here once you add a title and choose an
            image.
          </Typography>
        )}
      </Box>
      <AppButton variant="outlined" component="label" sx={{ alignSelf: "flex-start" }}>
        Choose image
        <input
          type="file"
          accept="image/*"
          hidden
          required={required}
          onChange={handleFileChange}
        />
      </AppButton>
    </Stack>
  );
};

/* =======================
 * Main component
 * ======================= */

const AdminDashboardPage = () => {
  const [activeTab, setActiveTab] = useState(
    "banner" // "banner" | "process" | "our-services" | "industries" | "why-vedx" | "tech-solutions" | "expertise" | "hire"
  );
  const rowsPerPage = 5;

  const getAdminAuthHeaders = () => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      throw new Error("Your session expired. Please log in again.");
    }
    return { Authorization: `Bearer ${token}` };
  };

  const fileInputRef = useRef(null);
  const industryFileInputRef = useRef(null);
  const processFileInputRef = useRef(null);
  const expertiseFileInputRef = useRef(null);

  /* --------------------------
   * BANNERS
   * -------------------------- */
  const [banners, setBanners] = useState([]);
  const [bannerForm, setBannerForm] = useState({
    title: "",
    image: "",
    images: [],
    type: "",
    contactLabel: "",
    sortOrder: 0,
    isActive: true,
  });
  const [editingBannerId, setEditingBannerId] = useState(null);
  const [bannerPage, setBannerPage] = useState(1);

  /* --------------------------
   * DASHBOARD STORY
   * -------------------------- */
  const [dashboardStoryForm, setDashboardStoryForm] = useState({
    title: "",
    description: "",
    extendedDescription: "",
    imageBase: "",
    imageOverlay: "",
  });
  const [dashboardStorySaved, setDashboardStorySaved] = useState(false);

  /* --------------------------
   * PROCESS
   * -------------------------- */
  const [processList, setProcessList] = useState([]);
  const [processForm, setProcessForm] = useState({
    title: "",
    description: "",
    image: "",
    sortOrder: 0,
    isActive: true,
  });
  const [processDialogOpen, setProcessDialogOpen] = useState(false);
  const [editingProcessId, setEditingProcessId] = useState(null);
  const [processPage, setProcessPage] = useState(1);

  /* --------------------------
   * OUR SERVICES - sliders + services
   * -------------------------- */
  const [ourServicesSliders, setOurServicesSliders] = useState([]);
  const [ourServicesHeroForm, setOurServicesHeroForm] = useState({
    sliderTitle: "",
    sliderDescription: "",
    sliderImage: "",
    sortOrder: 0,
    isActive: true,
  });
  const [editingSliderId, setEditingSliderId] = useState(null);
  const [ourServicesSliderPage, setOurServicesSliderPage] = useState(1);
  const [ourHeaderSaved, setOurHeaderSaved] = useState(false);
  const [sliderDialogOpen, setSliderDialogOpen] = useState(false);

  const [services, setServices] = useState([]);
  const [ourServiceForm, setOurServiceForm] = useState({
    title: "",
    sliderId: "",
    sortOrder: 0,
  });

  const [ourServiceDialogOpen, setOurServiceDialogOpen] = useState(false);
  const [editingOurServiceId, setEditingOurServiceId] = useState(null);
  const [ourServiceDeleteDialogOpen, setOurServiceDeleteDialogOpen] = useState(false);
  const [ourServicePendingDelete, setOurServicePendingDelete] = useState(null);
  const [ourServicePage, setOurServicePage] = useState(1);
  const [sliderPickerOpen, setSliderPickerOpen] = useState(false);

  /* --------------------------
   * INDUSTRIES
   * -------------------------- */
  const [industriesConfig, setIndustriesConfig] = useState({
    title: "",
    description: "",
  });
  const [industriesItems, setIndustriesItems] = useState([]);
  const [industryForm, setIndustryForm] = useState({
    title: "",
    description: "",
    image: "",
    sortOrder: 0,
    isActive: true,
  });
  const [industrySaved, setIndustrySaved] = useState(false);
  const [industryDialogOpen, setIndustryDialogOpen] = useState(false);
  const [editingIndustryId, setEditingIndustryId] = useState(null);
  const [industryPage, setIndustryPage] = useState(1);

  /* --------------------------
   * WHY VEDX SOLUTIONS
   * -------------------------- */
  const [whyVedxConfig, setWhyVedxConfig] = useState({
    title: "",
    description: "",
  });
  const [whyVedxConfigSaved, setWhyVedxConfigSaved] = useState(false);
  const [whyVedxReasons, setWhyVedxReasons] = useState([]);
  const [whyVedxReasonForm, setWhyVedxReasonForm] = useState({
    title: "",
    description: "",
    image: "",
    sortOrder: 0,
    isActive: true,
  });
  const [editingWhyVedxReasonId, setEditingWhyVedxReasonId] = useState(null);
  const [whyVedxReasonDialogOpen, setWhyVedxReasonDialogOpen] = useState(false);
  const [whyVedxReasonDeleteDialogOpen, setWhyVedxReasonDeleteDialogOpen] = useState(false);
  const [whyVedxReasonPendingDelete, setWhyVedxReasonPendingDelete] = useState(null);
  const [whyVedxReasonPage, setWhyVedxReasonPage] = useState(1);

  /* --------------------------
   * TECH SOLUTIONS
   * -------------------------- */
  const [techSolutionsConfig, setTechSolutionsConfig] = useState({
    title: "",
    description: "",
  });
  const [techSolutionsList, setTechSolutionsList] = useState([]);
  const [techSolutionForm, setTechSolutionForm] = useState({
    title: "",
    description: "",
    sortOrder: 0,
    isActive: true,
  });
  const [techSolutionsSaved, setTechSolutionsSaved] = useState(false);
  const [techSolutionDialogOpen, setTechSolutionDialogOpen] = useState(false);
  const [editingTechSolutionId, setEditingTechSolutionId] = useState(null);
  const [techSolutionPage, setTechSolutionPage] = useState(1);

  /* --------------------------
   * EXPERTISE
   * -------------------------- */
  const [expertiseConfig, setExpertiseConfig] = useState({
    title: "",
    description: "",
  });
  const [expertiseItems, setExpertiseItems] = useState([]);
  const [expertiseForm, setExpertiseForm] = useState({
    title: "",
    description: "",
    image: "",
    sortOrder: 0,
    isActive: true,
  });
  const [expertiseSaved, setExpertiseSaved] = useState(false);
  const [expertiseDialogOpen, setExpertiseDialogOpen] = useState(false);
  const [editingExpertiseId, setEditingExpertiseId] = useState(null);
  const [expertisePage, setExpertisePage] = useState(1);

  /* --------------------------
   * TECHNOLOGIES
   * -------------------------- */
  const [technologies, setTechnologies] = useState([]);
  const [technologyForm, setTechnologyForm] = useState({ id: "", title: "", image: "", items: [] });
  const [technologyDialogOpen, setTechnologyDialogOpen] = useState(false);
  const [technologyDialogMode, setTechnologyDialogMode] = useState("create");
  const [technologyDialogError, setTechnologyDialogError] = useState("");
  const [technologyToDelete, setTechnologyToDelete] = useState(null);
  const [technologyPage, setTechnologyPage] = useState(1);
  const [savingTechnology, setSavingTechnology] = useState(false);

  /* --------------------------
   * Derived selections
   * -------------------------- */
  const selectedSliderForServiceDialog =
    ourServicesSliders.find((s) => s.id === ourServiceForm.sliderId) || null;

  const sortedOurServicesSliders = useMemo(() => {
    return [...ourServicesSliders].sort((a, b) => {
      const sortDiff = (a.sortOrder ?? 0) - (b.sortOrder ?? 0);
      if (sortDiff !== 0) return sortDiff;
      const aUpdated = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
      const bUpdated = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
      return bUpdated - aUpdated;
    });
  }, [ourServicesSliders]);

  const sortedWhyVedxReasons = useMemo(() => {
    return [...whyVedxReasons].sort((a, b) => {
      const sortDiff = (a.sortOrder ?? 0) - (b.sortOrder ?? 0);
      if (sortDiff !== 0) return sortDiff;
      const aUpdated = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
      const bUpdated = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
      return bUpdated - aUpdated;
    });
  }, [whyVedxReasons]);

  const bannerCountsByType = useMemo(() => {
    const counts = {};
    banners.forEach((item) => {
      const type = item.type || "other";
      counts[type] = (counts[type] || 0) + 1;
    });
    return counts;
  }, [banners]);

  const sortedBanners = useMemo(() => {
    const getTypeOrder = (type) => {
      const index = BANNER_TYPE_ORDER.indexOf(type);
      return index === -1 ? BANNER_TYPE_ORDER.length : index;
    };

    return [...banners].sort((a, b) => {
      const typeDiff = getTypeOrder(a.type) - getTypeOrder(b.type);
      if (typeDiff !== 0) return typeDiff;

      const sortDiff = (a.sortOrder ?? 0) - (b.sortOrder ?? 0);
      if (sortDiff !== 0) return sortDiff;

      const aUpdated = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
      const bUpdated = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;

      return bUpdated - aUpdated;
    });
  }, [banners]);

  /* ------------------------------------------------
   * INITIAL LOAD – fetch all sections from backend
   * ------------------------------------------------ */
  useEffect(() => {
    const loadAll = async () => {
      try {
        await Promise.all([
          loadBanners(),
          loadDashboardStory(),
          loadProcessSteps(),
          loadOurServices(),
          loadIndustries(),
          loadWhyVedxConfig(),
          loadWhyVedxReasons(),
          loadTechSolutions(),
          loadExpertise(),
          loadTechnologies(),
        ]);
      } catch (err) {
        console.error("Initial load error", err);
      }
    };

    loadAll();
  }, []);

  /* --------------------------
   * Load helpers
   * -------------------------- */
  const loadBanners = async () => {
    try {
      const res = await fetch(apiUrl("/api/banners"));
      if (!res.ok) throw new Error("Failed to fetch banners");
      const data = await res.json();
      setBanners(data);
    } catch (err) {
      console.error("loadBanners error", err);
    }
  };

  const loadDashboardStory = async () => {
    try {
      const res = await fetch(apiUrl("/api/dashboard/story"));
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Unable to load dashboard story");
      if (data) {
        setDashboardStoryForm({
          title: data.title || "",
          description: data.description || "",
          extendedDescription: data.extendedDescription || "",
          imageBase: data.imageBase || "",
          imageOverlay: data.imageOverlay || "",
        });
      }
    } catch (err) {
      console.error("loadDashboardStory error", err);
    }
  };

  const handleDashboardStorySave = async () => {
    try {
      setDashboardStorySaved(false);
      const response = await fetch(apiUrl("/api/dashboard/story"), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...getAdminAuthHeaders(),
        },
        body: JSON.stringify(dashboardStoryForm),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "Unable to save dashboard story");
      }

      setDashboardStoryForm({
        title: data.title || "",
        description: data.description || "",
        extendedDescription: data.extendedDescription || "",
        imageBase: data.imageBase || "",
        imageOverlay: data.imageOverlay || "",
      });
      setDashboardStorySaved(true);
    } catch (error) {
      console.error("Failed to save dashboard story", error);
    }
  };

  const loadProcessSteps = async () => {
    try {
      const res = await fetch(apiUrl("/api/process-steps"));
      if (!res.ok) throw new Error("Failed to fetch process steps");
      const data = await res.json();
      setProcessList(data);
    } catch (err) {
      console.error("loadProcessSteps error", err);
    }
  };

  const loadOurServices = async () => {
    try {
      const [slidersRes, servicesRes] = await Promise.all([
        fetch(apiUrl("/api/our-services/sliders")),
        fetch(apiUrl("/api/our-services/services")),
      ]);
      if (!slidersRes.ok) throw new Error("Failed to fetch sliders");
      if (!servicesRes.ok) throw new Error("Failed to fetch services");

      const slidersData = await slidersRes.json();
      const servicesData = await servicesRes.json();

      setOurServicesSliders(slidersData);
      setServices(servicesData);

      if (slidersData.length && ourServiceForm.sliderId === "") {
        setOurServiceForm((prev) => ({ ...prev, sliderId: slidersData[0].id }));
      }
    } catch (err) {
      console.error("loadOurServices error", err);
    }
  };

  const loadIndustries = async () => {
    try {
      const [configRes, itemsRes] = await Promise.all([
        fetch(apiUrl("/api/industries/config")),
        fetch(apiUrl("/api/industries")),
      ]);
      if (!configRes.ok) throw new Error("Failed to fetch industries config");
      if (!itemsRes.ok) throw new Error("Failed to fetch industries");

      const config = await configRes.json();
      const items = await itemsRes.json();

      setIndustriesConfig({
        title: config.title ?? "",
        description: config.description ?? "",
      });
      setIndustriesItems(items);
    } catch (err) {
      console.error("loadIndustries error", err);
    }
  };

  const loadWhyVedxConfig = async () => {
    try {
      const response = await fetch(apiUrl("/api/homes/why-vedx-config"));
      if (!response.ok) throw new Error("Failed to fetch why VEDX config");
      const data = await response.json();
      setWhyVedxConfig({
        title: data?.title ?? "",
        description: data?.description ?? "",
      });
    } catch (err) {
      console.error("loadWhyVedxConfig error", err);
    }
  };

  const loadWhyVedxReasons = async () => {
    try {
      const headers = getAdminAuthHeaders();
      const res = await fetch(apiUrl("/api/homes/why-vedx-reasons"), { headers });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || data?.message || "Failed to fetch reasons");

      setWhyVedxReasons(data?.reasons || []);
    } catch (err) {
      console.error("loadWhyVedxReasons error", err);
    }
  };

  const loadTechSolutions = async () => {
    try {
      const [configRes, itemsRes] = await Promise.all([
        fetch(apiUrl("/api/tech-solutions/config")),
        fetch(apiUrl("/api/tech-solutions")),
      ]);
      if (!configRes.ok) throw new Error("Failed to fetch tech solutions config");
      if (!itemsRes.ok) throw new Error("Failed to fetch tech solutions");

      const config = await configRes.json();
      const items = await itemsRes.json();

      setTechSolutionsConfig({
        title: config.title ?? "",
        description: config.description ?? "",
      });
      setTechSolutionsList(items);
    } catch (err) {
      console.error("loadTechSolutions error", err);
    }
  };

  const loadExpertise = async () => {
    try {
      const headers = getAdminAuthHeaders();
      const [configRes, itemsRes] = await Promise.all([
        fetch(apiUrl("/api/expertise/config"), { headers }),
        fetch(apiUrl("/api/expertise"), { headers }),
      ]);
      if (!configRes.ok) throw new Error("Failed to fetch expertise config");
      if (!itemsRes.ok) throw new Error("Failed to fetch expertise");

      const config = await configRes.json();
      const items = await itemsRes.json();

      setExpertiseConfig({
        title: config.title ?? "",
        description: config.description ?? "",
      });
      setExpertiseItems(items);
    } catch (err) {
      console.error("loadExpertise error", err);
    }
  };

  const loadTechnologies = async () => {
    try {
      const headers = getAdminAuthHeaders();
      const res = await fetch(apiUrl("/api/technologies"), { headers });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to fetch technologies");
      setTechnologies(data || []);
    } catch (err) {
      console.error("loadTechnologies error", err);
    }
  };

  /* -----------------------------------
   * BANNER handlers
   * ----------------------------------- */
  const handleBannerImageChange = (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    if (bannerForm.type === "home") {
      Promise.all(
        files.map(
          (file) =>
            new Promise((resolve) => {
              const reader = new FileReader();
              reader.onload = () => {
                if (typeof reader.result === "string") {
                  resolve(reader.result);
                } else {
                  resolve("");
                }
              };
              reader.readAsDataURL(file);
            })
        )
      ).then((images) => setBannerForm((prev) => ({ ...prev, images })));
      return;
    }

    const file = files[0];
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setBannerForm((prev) => ({ ...prev, image: reader.result, images: [] }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleBannerTypeChange = (event) => {
    const nextType = event.target.value;
    const nextImages =
      nextType === "home"
        ? bannerForm.images.length
          ? bannerForm.images
          : bannerForm.image
            ? [bannerForm.image]
            : []
        : [];
    setBannerForm((prev) => ({
      ...prev,
      type: nextType,
      image: nextType === "home" ? "" : prev.image,
      images: nextImages,
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAddOrUpdateBanner = async () => {
    const isHome = bannerForm.type === "home";
    const hasImage = isHome ? bannerForm.images.length > 0 : Boolean(bannerForm.image);
    if (!bannerForm.title.trim() || !bannerForm.type || !hasImage) return;

    const payload = {
      title: bannerForm.title.trim(),
      type: bannerForm.type,
      contactLabel:
        bannerForm.type === "home" ? bannerForm.contactLabel?.trim() || null : null,
      image: isHome ? null : bannerForm.image || null,
      images: isHome ? bannerForm.images : [],
      sortOrder: Number.isFinite(Number(bannerForm.sortOrder))
        ? Number(bannerForm.sortOrder)
        : 0,
      isActive: Boolean(bannerForm.isActive),
    };

    try {
      if (editingBannerId != null) {
        const res = await fetch(apiUrl(`/api/banners/${editingBannerId}`), {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Failed to update banner");
        const updated = await res.json();
        setBanners((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
      } else {
        const res = await fetch(apiUrl("/api/banners"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Failed to create banner");
        const created = await res.json();
        setBanners((prev) => [created, ...prev]);
        setBannerPage(1);
      }
    } catch (err) {
      console.error("handleAddOrUpdateBanner error", err);
    }

    setBannerForm({ title: "", image: "", images: [], type: "", contactLabel: "", sortOrder: 0, isActive: true });
    setEditingBannerId(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleEditBanner = (id) => {
    const match = banners.find((item) => item.id === id);
    if (!match) return;
    setBannerForm({
      title: match.title,
      image: match.image || "",
      images: match.images || [],
      type: match.type,
      contactLabel: match.contactLabel || "",
      sortOrder: Number.isFinite(Number(match.sortOrder)) ? Number(match.sortOrder) : 0,
      isActive: Boolean(match.isActive ?? true),
    });
    setEditingBannerId(id);
  };

  const handleDeleteBanner = async (id) => {
    try {
      const res = await fetch(apiUrl(`/api/banners/${id}`), { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete banner");
      setBanners((prev) => {
        const updated = prev.filter((item) => item.id !== id);
        setBannerPage((prevPage) => {
          const totalPages = Math.max(1, Math.ceil(updated.length / rowsPerPage));
          return Math.min(prevPage, totalPages);
        });
        return updated;
      });
      if (editingBannerId === id) {
        setEditingBannerId(null);
        setBannerForm({ title: "", image: "", images: [], type: "", contactLabel: "", sortOrder: 0, isActive: true });
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    } catch (err) {
      console.error("handleDeleteBanner error", err);
    }
  };

  /* -----------------------------------
   * PROCESS handlers
   * ----------------------------------- */
  const openProcessDialog = (item = null) => {
    if (item) {
      setProcessForm({
        title: item.title || "",
        description: item.description || "",
        image: item.image || "",
        sortOrder: Number.isFinite(Number(item.sortOrder)) ? Number(item.sortOrder) : 0,
        isActive: item.isActive ?? true,
      });
      setEditingProcessId(item.id);
    } else {
      setProcessForm({ title: "", description: "", image: "", sortOrder: 0, isActive: true });
      setEditingProcessId(null);
    }
    setProcessDialogOpen(true);
    if (processFileInputRef.current) {
      processFileInputRef.current.value = "";
    }
  };

  const closeProcessDialog = () => {
    setProcessDialogOpen(false);
    setEditingProcessId(null);
    setProcessForm({ title: "", description: "", image: "", sortOrder: 0, isActive: true });
    if (processFileInputRef.current) {
      processFileInputRef.current.value = "";
    }
  };

  const handleProcessImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () =>
      typeof reader.result === "string" &&
      setProcessForm((prev) => ({ ...prev, image: reader.result }));
    reader.readAsDataURL(file);
  };

  const handleProcessSave = async () => {
    if (!processForm.title.trim() || !processForm.image) return;

    const payload = {
      title: processForm.title.trim(),
      description: processForm.description || null,
      image: processForm.image || null,
      sortOrder: Number(processForm.sortOrder) || 0,
      isActive: Boolean(processForm.isActive),
    };

    try {
      if (editingProcessId != null) {
        const res = await fetch(apiUrl(`/api/process-steps/${editingProcessId}`), {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Failed to update process step");
        const updated = await res.json();
        setProcessList((prev) =>
          prev.map((item) => (item.id === updated.id ? updated : item))
        );
      } else {
        const res = await fetch(apiUrl("/api/process-steps"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Failed to create process step");
        const created = await res.json();
        setProcessList((prev) => [created, ...prev]);
        setProcessPage(1);
      }
      closeProcessDialog();
    } catch (err) {
      console.error("handleProcessSave error", err);
    }
  };

  const handleDeleteProcess = async (id) => {
    try {
      const res = await fetch(apiUrl(`/api/process-steps/${id}`), { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete process step");
      setProcessList((prev) => {
        const updated = prev.filter((item) => item.id !== id);
        setProcessPage((prevPage) => {
          const totalPages = Math.max(1, Math.ceil(updated.length / rowsPerPage));
          return Math.min(prevPage, totalPages);
        });
        return updated;
      });
    } catch (err) {
      console.error("handleDeleteProcess error", err);
    }
  };

  /* -----------------------------------
   * Our services – SLIDER handlers
   * ----------------------------------- */
  const handleOurServicesHeroChange = (field, value) => {
    setOurServicesHeroForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreateNewSlider = () => {
    setOurServicesHeroForm({
      sliderTitle: "",
      sliderDescription: "",
      sliderImage: "",
      sortOrder: 0,
      isActive: true,
    });
    setEditingSliderId(null);
    setSliderDialogOpen(true);
  };

  const closeSliderDialog = () => {
    setSliderDialogOpen(false);
    setEditingSliderId(null);
    setOurServicesHeroForm({
      sliderTitle: "",
      sliderDescription: "",
      sliderImage: "",
      sortOrder: 0,
      isActive: true,
    });
  };

  const handleOurServicesHeroSave = async (event) => {
    if (event) event.preventDefault();
    if (!ourServicesHeroForm.sliderTitle.trim() || !ourServicesHeroForm.sliderImage) {
      return;
    }

    const payload = {
      sliderTitle: ourServicesHeroForm.sliderTitle.trim(),
      sliderDescription: ourServicesHeroForm.sliderDescription || null,
      sliderImage: ourServicesHeroForm.sliderImage || null,
      sortOrder: Number(ourServicesHeroForm.sortOrder) || 0,
      isActive: Boolean(ourServicesHeroForm.isActive),
    };

    try {
      if (editingSliderId != null) {
        const res = await fetch(apiUrl(`/api/our-services/sliders/${editingSliderId}`), {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Failed to update slider");
        const updated = await res.json();
        setOurServicesSliders((prev) =>
          prev.map((slider) => (slider.id === updated.id ? updated : slider))
        );
      } else {
        const res = await fetch(apiUrl("/api/our-services/sliders"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Failed to create slider");
        const created = await res.json();
        setOurServicesSliders((prev) => [created, ...prev]);
        setOurServicesSliderPage(1);
        setEditingSliderId(created.id);
        setOurServiceForm((prev) => ({
          ...prev,
          sliderId: prev.sliderId || created.id,
        }));
      }
      setOurHeaderSaved(true);
      setTimeout(() => setOurHeaderSaved(false), 2000);
      setSliderDialogOpen(false);
    } catch (err) {
      console.error("handleOurServicesHeroSave error", err);
    }
  };

  const handleEditOurServiceSlider = (slider) => {
    setOurServicesHeroForm({
      sliderTitle: slider.sliderTitle,
      sliderDescription: slider.sliderDescription ?? "",
      sliderImage: slider.sliderImage ?? "",
      sortOrder: Number.isFinite(Number(slider.sortOrder)) ? Number(slider.sortOrder) : 0,
      isActive: slider.isActive ?? true,
    });
    setEditingSliderId(slider.id);
    setSliderDialogOpen(true);
  };

  const handleDeleteOurServiceSlider = async (id) => {
    try {
      const res = await fetch(apiUrl(`/api/our-services/sliders/${id}`), {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete slider");

      setOurServicesSliders((prev) => {
        const remaining = prev.filter((slider) => slider.id !== id);

        if (editingSliderId === id) {
          if (remaining.length) {
            const first = remaining[0];
            setEditingSliderId(first.id);
            setOurServicesHeroForm({
              sliderTitle: first.sliderTitle,
              sliderDescription: first.sliderDescription ?? "",
              sliderImage: first.sliderImage ?? "",
              sortOrder: Number.isFinite(Number(first.sortOrder)) ? Number(first.sortOrder) : 0,
              isActive: first.isActive ?? true,
            });
          } else {
            setEditingSliderId(null);
            setOurServicesHeroForm({
              sliderTitle: "",
              sliderDescription: "",
              sliderImage: "",
              sortOrder: 0,
              isActive: true,
            });
          }
        }

        return remaining;
      });

      setServices((prev) => prev.filter((service) => service.sliderId !== id));
      setOurServiceForm((prev) => ({
        ...prev,
        sliderId:
          prev.sliderId === id
            ? ourServicesSliders.find((s) => s.id !== id)?.id ?? ""
            : prev.sliderId,
      }));
    } catch (err) {
      console.error("handleDeleteOurServiceSlider error", err);
    }
  };

  /* -----------------------------------
   * Our services – SERVICE handlers
   * ----------------------------------- */
  // ADD new service card
  const openOurServiceCreateDialog = () => {
    setEditingOurServiceId(null);

    setOurServiceForm((prev) => ({
      title: "",
      // don't pick default here (sliders may not be loaded yet)
      sliderId: "",
      sortOrder: 0,
    }));

    setOurServiceDialogOpen(true);
  };

  // EDIT existing service card
  const openOurServiceEditDialog = (service) => {
    setEditingOurServiceId(service.id);
    setOurServiceForm({
      title: service.title ?? "",
      sliderId: service.sliderId ?? "",
      sortOrder: Number.isFinite(Number(service.sortOrder)) ? Number(service.sortOrder) : 0,
    });
    setOurServiceDialogOpen(true);
  };

  const closeOurServiceDialog = () => {
    setOurServiceDialogOpen(false);
    setEditingOurServiceId(null);
    setOurServiceForm({
      title: "",
      sliderId: "",
      sortOrder: 0,
    });
  };


  const handleSaveOurService = async () => {
    const title = ourServiceForm.title.trim();
    const sliderId = ourServiceForm.sliderId?.toString().trim();
    if (!title || !sliderId) return;

    const payload = {
      title,
      sliderId,
      sortOrder: Number(ourServiceForm.sortOrder) || 0,
    };

    try {
      if (editingOurServiceId != null) {
        const res = await fetch(
          apiUrl(`/api/our-services/services/${editingOurServiceId}`),
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );
        if (!res.ok) throw new Error("Failed to update service");
        const updated = await res.json();
        setServices((prev) =>
          prev.map((item) => (item.id === updated.id ? updated : item))
        );
      } else {
        const res = await fetch(apiUrl("/api/our-services/services"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Failed to create service");
        const created = await res.json();
        setServices((prev) => [created, ...prev]);
        setOurServicePage(1);
      }

      closeOurServiceDialog();
    } catch (err) {
      console.error("handleSaveOurService error", err);
    }
  };

  const openOurServiceDeleteDialog = (item) => {
    setOurServicePendingDelete(item);
    setOurServiceDeleteDialogOpen(true);
  };

  const closeOurServiceDeleteDialog = () => {
    setOurServicePendingDelete(null);
    setOurServiceDeleteDialogOpen(false);
  };

  const handleConfirmDeleteOurService = async () => {
    if (!ourServicePendingDelete) return;
    try {
      const res = await fetch(
        apiUrl(`/api/our-services/services/${ourServicePendingDelete.id}`),
        {
          method: "DELETE",
        }
      );
      if (!res.ok) throw new Error("Failed to delete service");

      setServices((prev) => {
        const updated = prev.filter((item) => item.id !== ourServicePendingDelete.id);
        const nextLength = updated.length;
        setOurServicePage((prevPage) => {
          const totalPages = Math.max(1, Math.ceil(nextLength / rowsPerPage));
          return Math.min(prevPage, totalPages);
        });
        return updated;
      });

      closeOurServiceDeleteDialog();
    } catch (err) {
      console.error("handleConfirmDeleteOurService error", err);
    }
  };

  /* -----------------------------------
   * Industries handlers (config + items)
   * ----------------------------------- */
  const handleIndustrySave = async () => {
    try {
      const res = await fetch(apiUrl("/api/industries/config"), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: industriesConfig.title,
          description: industriesConfig.description,
        }),
      });
      if (!res.ok) throw new Error("Failed to save industries config");
      const updated = await res.json();
      setIndustriesConfig({
        title: updated.title ?? "",
        description: updated.description ?? "",
      });
      setIndustrySaved(true);
      setTimeout(() => setIndustrySaved(false), 2000);
    } catch (err) {
      console.error("handleIndustrySave error", err);
    }
  };

  const openIndustryDialog = (item = null) => {
    if (item) {
      setIndustryForm({
        title: item.title || "",
        description: item.description || "",
        image: item.image || "",
        sortOrder: Number.isFinite(Number(item.sortOrder)) ? Number(item.sortOrder) : 0,
        isActive: item.isActive ?? true,
      });
      setEditingIndustryId(item.id);
    } else {
      setIndustryForm({ title: "", description: "", image: "", sortOrder: 0, isActive: true });
      setEditingIndustryId(null);
    }
    setIndustryDialogOpen(true);
    if (industryFileInputRef.current) {
      industryFileInputRef.current.value = "";
    }
  };

  const closeIndustryDialog = () => {
    setIndustryDialogOpen(false);
    setEditingIndustryId(null);
    setIndustryForm({ title: "", description: "", image: "", sortOrder: 0, isActive: true });
    if (industryFileInputRef.current) {
      industryFileInputRef.current.value = "";
    }
  };

  const handleIndustryImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setIndustryForm((prev) => ({ ...prev, image: reader.result }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleIndustrySubmit = async () => {
    if (!industryForm.title.trim() || !industryForm.image) return;

    const payload = {
      title: industryForm.title.trim(),
      description: industryForm.description || null,
      image: industryForm.image || null,
      sortOrder: Number(industryForm.sortOrder) || 0,
      isActive: Boolean(industryForm.isActive),
    };

    try {
      if (editingIndustryId != null) {
        const res = await fetch(apiUrl(`/api/industries/${editingIndustryId}`), {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Failed to update industry");
        const updated = await res.json();
        setIndustriesItems((prev) =>
          prev.map((item) => (item.id === updated.id ? updated : item))
        );
      } else {
        const res = await fetch(apiUrl("/api/industries"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Failed to create industry");
        const created = await res.json();
        setIndustriesItems((prev) => [created, ...prev]);
        setIndustryPage(1);
      }

      closeIndustryDialog();
    } catch (err) {
      console.error("handleIndustrySubmit error", err);
    }
  };

  const handleDeleteIndustry = async (id) => {
    try {
      const res = await fetch(apiUrl(`/api/industries/${id}`), { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete industry");
      setIndustriesItems((prev) => {
        const updated = prev.filter((item) => item.id !== id);
        setIndustryPage((prevPage) => {
          const totalPages = Math.max(1, Math.ceil(updated.length / rowsPerPage));
          return Math.min(prevPage, totalPages);
        });
        return updated;
      });
      if (editingIndustryId === id) {
        closeIndustryDialog();
      }
    } catch (err) {
      console.error("handleDeleteIndustry error", err);
    }
  };

  /* -----------------------------------
   * Why VEDX config handlers
   * ----------------------------------- */
  const handleWhyVedxConfigSave = async () => {
    try {
      const headers = getAdminAuthHeaders();
      const res = await fetch(apiUrl("/api/homes/why-vedx-config"), {
        method: "PUT",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify({
          title: whyVedxConfig.title,
          description: whyVedxConfig.description,
        }),
      });
      if (!res.ok) throw new Error("Failed to save why VEDX config");
      const updated = await res.json();
      setWhyVedxConfig({
        title: updated.title ?? "",
        description: updated.description ?? "",
      });
      setWhyVedxConfigSaved(true);
      setTimeout(() => setWhyVedxConfigSaved(false), 2000);
    } catch (err) {
      console.error("handleWhyVedxConfigSave error", err);
    }
  };

  /* -----------------------------------
   * Why VEDX reasons handlers
   * ----------------------------------- */
  const openWhyVedxReasonDialog = (item = null) => {
    if (item) {
      setWhyVedxReasonForm({
        title: item.title,
        description: item.description,
        image: item.image,
        sortOrder: Number.isFinite(Number(item.sortOrder)) ? Number(item.sortOrder) : 0,
        isActive: item.isActive ?? true,
      });
      setEditingWhyVedxReasonId(item.id);
    } else {
      setWhyVedxReasonForm({ title: "", description: "", image: "", sortOrder: 0, isActive: true });
      setEditingWhyVedxReasonId(null);
    }
    setWhyVedxReasonDialogOpen(true);
  };

  const closeWhyVedxReasonDialog = () => {
    setWhyVedxReasonDialogOpen(false);
    setWhyVedxReasonForm({ title: "", description: "", image: "", sortOrder: 0, isActive: true });
    setEditingWhyVedxReasonId(null);
  };

  const handleWhyVedxReasonSubmit = async () => {
    try {
      const headers = { "Content-Type": "application/json", ...getAdminAuthHeaders() };
      const url = editingWhyVedxReasonId
        ? apiUrl(`/api/homes/why-vedx-reasons/${editingWhyVedxReasonId}`)
        : apiUrl("/api/homes/why-vedx-reasons");
      const method = editingWhyVedxReasonId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(whyVedxReasonForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || data?.message || "Failed to save reason");

      await loadWhyVedxReasons();
      closeWhyVedxReasonDialog();
    } catch (err) {
      console.error("handleWhyVedxReasonSubmit error", err);
    }
  };

  const openWhyVedxReasonDeleteDialog = (item) => {
    setWhyVedxReasonPendingDelete(item);
    setWhyVedxReasonDeleteDialogOpen(true);
  };

  const closeWhyVedxReasonDeleteDialog = () => {
    setWhyVedxReasonDeleteDialogOpen(false);
    setWhyVedxReasonPendingDelete(null);
  };

  const handleConfirmDeleteWhyVedxReason = async () => {
    if (!whyVedxReasonPendingDelete) return;

    try {
      const headers = getAdminAuthHeaders();
      const res = await fetch(
        apiUrl(`/api/homes/why-vedx-reasons/${whyVedxReasonPendingDelete.id}`),
        {
          method: "DELETE",
          headers,
        }
      );
      if (!res.ok) throw new Error("Failed to delete reason");

      setWhyVedxReasons((prev) => {
        const updated = prev.filter((item) => item.id !== whyVedxReasonPendingDelete.id);
        setWhyVedxReasonPage((prevPage) => {
          const totalPages = Math.max(1, Math.ceil(updated.length / rowsPerPage));
          return Math.min(prevPage, totalPages);
        });
        return updated;
      });
      closeWhyVedxReasonDeleteDialog();
    } catch (err) {
      console.error("handleConfirmDeleteWhyVedxReason error", err);
    }
  };

  /* -----------------------------------
   * Tech solutions handlers
   * ----------------------------------- */
  const handleTechSolutionsSave = async () => {
    try {
      const res = await fetch(apiUrl("/api/tech-solutions/config"), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: techSolutionsConfig.title,
          description: techSolutionsConfig.description,
        }),
      });
      if (!res.ok) throw new Error("Failed to save tech solutions config");
      const updated = await res.json();
      setTechSolutionsConfig({
        title: updated.title ?? "",
        description: updated.description ?? "",
      });
      setTechSolutionsSaved(true);
      setTimeout(() => setTechSolutionsSaved(false), 2000);
    } catch (err) {
      console.error("handleTechSolutionsSave error", err);
    }
  };

  const openTechSolutionDialog = (item = null) => {
    if (item) {
      setTechSolutionForm({
        title: item.title,
        description: item.description ?? "",
        sortOrder: Number.isFinite(Number(item.sortOrder)) ? Number(item.sortOrder) : 0,
        isActive: item.isActive ?? true,
      });
      setEditingTechSolutionId(item.id);
    } else {
      setTechSolutionForm({ title: "", description: "", sortOrder: 0, isActive: true });
      setEditingTechSolutionId(null);
    }
    setTechSolutionDialogOpen(true);
  };

  const closeTechSolutionDialog = () => {
    setTechSolutionDialogOpen(false);
    setEditingTechSolutionId(null);
    setTechSolutionForm({ title: "", description: "", sortOrder: 0, isActive: true });
  };

  const handleTechSolutionSave = async () => {
    if (!techSolutionForm.title.trim()) return;

    const payload = {
      title: techSolutionForm.title.trim(),
      description: techSolutionForm.description || null,
      sortOrder: Number(techSolutionForm.sortOrder) || 0,
      isActive: Boolean(techSolutionForm.isActive),
    };

    try {
      if (editingTechSolutionId != null) {
        const res = await fetch(apiUrl(`/api/tech-solutions/${editingTechSolutionId}`), {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Failed to update solution");
        const updated = await res.json();
        setTechSolutionsList((prev) =>
          prev.map((item) => (item.id === updated.id ? updated : item))
        );
      } else {
        const res = await fetch(apiUrl("/api/tech-solutions"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Failed to create solution");
        const created = await res.json();
        setTechSolutionsList((prev) => [created, ...prev]);
        setTechSolutionPage(1);
      }
      closeTechSolutionDialog();
    } catch (err) {
      console.error("handleTechSolutionSave error", err);
    }
  };

  const handleDeleteTechSolution = async (id) => {
    try {
      const res = await fetch(apiUrl(`/api/tech-solutions/${id}`), { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete solution");
      setTechSolutionsList((prev) => {
        const updated = prev.filter((item) => item.id !== id);
        setTechSolutionPage((prevPage) => {
          const totalPages = Math.max(1, Math.ceil(updated.length / rowsPerPage));
          return Math.min(prevPage, totalPages);
        });
        return updated;
      });
    } catch (err) {
      console.error("handleDeleteTechSolution error", err);
    }
  };

  /* -----------------------------------
   * Expertise handlers
   * ----------------------------------- */
  const handleExpertiseSave = async () => {
    try {
      const res = await fetch(apiUrl("/api/expertise/config"), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...getAdminAuthHeaders(),
        },
        body: JSON.stringify({
          title: expertiseConfig.title,
          description: expertiseConfig.description,
        }),
      });
      if (!res.ok) throw new Error("Failed to save expertise config");
      const updated = await res.json();
      setExpertiseConfig({
        title: updated.title ?? "",
        description: updated.description ?? "",
      });
      setExpertiseSaved(true);
      setTimeout(() => setExpertiseSaved(false), 2000);
    } catch (err) {
      console.error("handleExpertiseSave error", err);
    }
  };

  const openExpertiseDialog = (item = null) => {
    if (item) {
      setExpertiseForm({
        title: item.title || "",
        description: item.description || "",
        image: item.image || "",
        sortOrder: Number.isFinite(Number(item.sortOrder)) ? Number(item.sortOrder) : 0,
        isActive: item.isActive ?? true,
      });
      setEditingExpertiseId(item.id);
    } else {
      setExpertiseForm({ title: "", description: "", image: "", sortOrder: 0, isActive: true });
      setEditingExpertiseId(null);
    }
    setExpertiseDialogOpen(true);
    if (expertiseFileInputRef.current) {
      expertiseFileInputRef.current.value = "";
    }
  };

  const closeExpertiseDialog = () => {
    setExpertiseDialogOpen(false);
    setEditingExpertiseId(null);
    setExpertiseForm({ title: "", description: "", image: "", sortOrder: 0, isActive: true });
    if (expertiseFileInputRef.current) {
      expertiseFileInputRef.current.value = "";
    }
  };

  const handleExpertiseImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () =>
      typeof reader.result === "string" &&
      setExpertiseForm((prev) => ({ ...prev, image: reader.result }));
    reader.readAsDataURL(file);
  };

  const handleExpertiseSubmit = async () => {
    if (!expertiseForm.title.trim() || !expertiseForm.image) return;

    const payload = {
      title: expertiseForm.title.trim(),
      description: expertiseForm.description || null,
      image: expertiseForm.image || null,
      sortOrder: Number(expertiseForm.sortOrder) || 0,
      isActive: Boolean(expertiseForm.isActive),
    };

    try {
      if (editingExpertiseId != null) {
        const res = await fetch(apiUrl(`/api/expertise/${editingExpertiseId}`), {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...getAdminAuthHeaders(),
          },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Failed to update expertise");
        const updated = await res.json();
        setExpertiseItems((prev) =>
          prev.map((item) => (item.id === updated.id ? updated : item))
        );
      } else {
        const res = await fetch(apiUrl("/api/expertise"), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...getAdminAuthHeaders(),
          },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Failed to create expertise");
        const created = await res.json();
        setExpertiseItems((prev) => [created, ...prev]);
        setExpertisePage(1);
      }

      closeExpertiseDialog();
    } catch (err) {
      console.error("handleExpertiseSubmit error", err);
    }
  };

  const handleDeleteExpertise = async (id) => {
    try {
      const res = await fetch(apiUrl(`/api/expertise/${id}`), {
        method: "DELETE",
        headers: getAdminAuthHeaders(),
      });
      if (!res.ok) throw new Error("Failed to delete expertise");
      setExpertiseItems((prev) => {
        const updated = prev.filter((item) => item.id !== id);
        setExpertisePage((prevPage) => {
          const totalPages = Math.max(1, Math.ceil(updated.length / rowsPerPage));
          return Math.min(prevPage, totalPages);
        });
        return updated;
      });
      if (editingExpertiseId === id) {
        closeExpertiseDialog();
      }
    } catch (err) {
      console.error("handleDeleteExpertise error", err);
    }
  };

  /* -----------------------------------
   * Technology handlers
   * ----------------------------------- */
  const openTechnologyDialog = (item = null) => {
    setTechnologyDialogError("");
    if (item) {
      setTechnologyDialogMode("edit");
      setTechnologyForm({
        id: item.id,
        title: item.title || "",
        image: item.image || "",
        items: Array.isArray(item.items) ? item.items : [],
      });
    } else {
      setTechnologyDialogMode("create");
      setTechnologyForm({ id: "", title: "", image: "", items: [] });
    }
    setTechnologyDialogOpen(true);
  };

  const closeTechnologyDialog = () => {
    setTechnologyDialogOpen(false);
    setTechnologyDialogError("");
    setTechnologyForm({ id: "", title: "", image: "", items: [] });
  };

  const handleTechnologySubmit = async (event) => {
    event?.preventDefault();
    setTechnologyDialogError("");
    const trimmedTitle = technologyForm.title.trim();

    if (!trimmedTitle || !technologyForm.image) {
      setTechnologyDialogError("Title and image are required.");
      return;
    }

    setSavingTechnology(true);

    try {
      const payload = {
        title: trimmedTitle,
        image: technologyForm.image,
        items: Array.isArray(technologyForm.items) ? technologyForm.items : [],
      };

      const isEdit = technologyDialogMode === "edit" && technologyForm.id;
      const res = await fetch(
        isEdit ? apiUrl(`/api/technologies/${technologyForm.id}`) : apiUrl("/api/technologies"),
        {
          method: isEdit ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            ...getAdminAuthHeaders(),
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to save technology");

      if (isEdit) {
        setTechnologies((prev) => prev.map((item) => (item.id === data.id ? data : item)));
      } else {
        setTechnologies((prev) => [data, ...prev]);
        setTechnologyPage(1);
      }

      closeTechnologyDialog();
    } catch (err) {
      console.error("handleTechnologySubmit error", err);
      setTechnologyDialogError(err?.message || "Unable to save technology.");
    } finally {
      setSavingTechnology(false);
    }
  };

  const confirmDeleteTechnology = async () => {
    if (!technologyToDelete) return;
    try {
      const res = await fetch(apiUrl(`/api/technologies/${technologyToDelete.id}`), {
        method: "DELETE",
        headers: getAdminAuthHeaders(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to delete technology");
      setTechnologies((prev) => {
        const updated = prev.filter((item) => item.id !== technologyToDelete.id);
        setTechnologyPage((prevPage) => {
          const totalPages = Math.max(1, Math.ceil(updated.length / rowsPerPage));
          return Math.min(prevPage, totalPages);
        });
        return updated;
      });
      setTechnologyToDelete(null);
    } catch (err) {
      console.error("confirmDeleteTechnology error", err);
    }
  };

  /* -----------------------------------
   * Pagination slices
   * ----------------------------------- */
  const paginatedBanners = sortedBanners.slice(
    (bannerPage - 1) * rowsPerPage,
    bannerPage * rowsPerPage
  );
  const paginatedProcessList = processList.slice(
    (processPage - 1) * rowsPerPage,
    processPage * rowsPerPage
  );
  const paginatedIndustries = industriesItems.slice(
    (industryPage - 1) * rowsPerPage,
    industryPage * rowsPerPage
  );
  const paginatedWhyVedxReasons = sortedWhyVedxReasons.slice(
    (whyVedxReasonPage - 1) * rowsPerPage,
    whyVedxReasonPage * rowsPerPage
  );
  const paginatedTechSolutions = techSolutionsList.slice(
    (techSolutionPage - 1) * rowsPerPage,
    techSolutionPage * rowsPerPage
  );
  const paginatedExpertise = expertiseItems.slice(
    (expertisePage - 1) * rowsPerPage,
    expertisePage * rowsPerPage
  );
  const paginatedTechnologies = technologies.slice(
    (technologyPage - 1) * rowsPerPage,
    technologyPage * rowsPerPage
  );
  const paginatedServices = services.slice(
    (ourServicePage - 1) * rowsPerPage,
    ourServicePage * rowsPerPage
  );
  const paginatedOurServiceSliders = sortedOurServicesSliders.slice(
    (ourServicesSliderPage - 1) * rowsPerPage,
    ourServicesSliderPage * rowsPerPage
  );
 
  /* ====================================================================
   * RENDER
   * ==================================================================== */
  return (
    <>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Configure cross-page modules including process, services, industries, and
            expertise content.
          </Typography>
        </Box>

        <Box
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 1,
            bgcolor: "background.paper",
          }}
        >
          <Tabs
            value={activeTab}
            onChange={(_, value) => setActiveTab(value)}
            variant="scrollable"
            scrollButtons="auto"
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab value="banner" label="Dashboard banner" />
            <Tab value="creative-agency" label="Creative agency" />
            <Tab value="process" label="Process" />
            <Tab value="our-services" label="Our services" />
            <Tab value="industries" label="Industries we serve" />
            <Tab value="why-vedx" label="Why VEDX solutions" />
            <Tab value="tech-solutions" label="Tech solutions" />
            <Tab value="expertise" label="Expertise models" />
            {/* <Tab value="technologies" label="Technologies" /> */}
      
          </Tabs>
        </Box>

        {/* BANNER TAB */}
        {activeTab === "banner" && (
          <Card sx={{ borderRadius: 0.5, border: "1px solid", borderColor: "divider" }}>
            <CardHeader
              title="Dashboard banner"
              subheader="Set the hero banner title and artwork for the dashboard."
            />
            <Divider />
            <CardContent>
              <Stack
                spacing={2}
                direction={{ xs: "column", md: "row" }}
                alignItems={{ xs: "stretch", md: "flex-start" }}
              >
                <Box
                  sx={{
                    flex: 1,
                    border: "1px dashed",
                    borderColor: "divider",
                    borderRadius: 1,
                    overflow: "hidden",
                    minHeight: 180,
                    backgroundColor: "background.default",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {bannerForm.type === "home" ? (
                    bannerForm.images.length ? (
                      <Stack
                        direction="row"
                        spacing={1.5}
                        sx={{ width: "100%", overflowX: "auto", p: 2 }}
                      >
                        {bannerForm.images.map((src, index) => (
                          <Box
                            key={index}
                            component="img"
                            src={src}
                            alt={(bannerForm.title || "Banner preview") + ` ${index + 1}`}
                            sx={{
                              height: 140,
                              width: 240,
                              objectFit: "cover",
                              borderRadius: 1,
                              border: "1px solid",
                              borderColor: "divider",
                            }}
                          />
                        ))}
                      </Stack>
                    ) : (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        align="center"
                        px={2}
                      >
                        Banner preview will appear here once you add a title and choose
                        an image.
                      </Typography>
                    )
                  ) : bannerForm.image ? (
                    <Box
                      component="img"
                      src={bannerForm.image}
                      alt={bannerForm.title || "Banner preview"}
                      sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <Typography variant="body2" color="text.secondary" align="center" px={2}>
                      Banner preview will appear here once you add a title and choose an
                      image.
                    </Typography>
                  )}
                </Box>

                <Stack spacing={2} flex={1} minWidth={{ xs: "auto", md: 360 }}>
                  <AppTextField
                    label="Title"
                    value={bannerForm.title}
                    onChange={(event) =>
                      setBannerForm((prev) => ({ ...prev, title: event.target.value }))
                    }
                    fullWidth
                  />

                  {bannerForm.type === "home" && (
                    <AppTextField
                      label="Contact button label"
                      value={bannerForm.contactLabel}
                      onChange={(event) =>
                        setBannerForm((prev) => ({ ...prev, contactLabel: event.target.value }))
                      }
                      fullWidth
                      helperText="This label is shown on the home hero banner button."
                    />
                  )}

                  <AppSelectField
                   
                    label="Type"
                    value={bannerForm.type}
                    onChange={handleBannerTypeChange}
                    fullWidth
                    helperText="Choose where this banner will be used"
                  >
                    <MenuItem value="home">Home</MenuItem>
                    <MenuItem value="about">About</MenuItem>
                    <MenuItem value="blogs">Blogs</MenuItem>
                    <MenuItem value="case-study">Case study</MenuItem>
                    <MenuItem value="contact">Contact</MenuItem>
                    <MenuItem value="career">Career</MenuItem>
                    <MenuItem value="privacy-policy">Privacy policy</MenuItem>
                    <MenuItem value="terms-and-condition">Terms and condition</MenuItem>
                  </AppSelectField>

                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center">
                    <AppTextField
                      label="Sort order"
                      type="number"
                      value={bannerForm.sortOrder}
                      onChange={(event) =>
                        setBannerForm((prev) => ({
                          ...prev,
                          sortOrder: event.target.value,
                        }))
                      }
                      inputProps={{ min: 0 }}
                      fullWidth
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={Boolean(bannerForm.isActive)}
                          onChange={(event) =>
                            setBannerForm((prev) => ({
                              ...prev,
                              isActive: event.target.checked,
                            }))
                          }
                          color="primary"
                        />
                      }
                      label={bannerForm.isActive ? "Active" : "Inactive"}
                      sx={{ whiteSpace: "nowrap" }}
                    />
                  </Stack>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple={bannerForm.type === "home"}
                    style={{ display: "none" }}
                    onChange={handleBannerImageChange}
                  />
                  <AppButton
                    variant="outlined"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={!bannerForm.type}
                  >
                    {bannerForm.type === "home" ? "Choose images" : "Choose image"}
                  </AppButton>
                  <Typography variant="caption" color="text.secondary">
                    {!bannerForm.type
                      ? "Select a banner type to enable image selection. Home supports multiple images; other types use a single image."
                      : bannerForm.type === "home"
                        ? "Home banners allow selecting multiple images for the slider."
                        : "Other banner types accept a single image."}
                  </Typography>

                  <AppButton variant="contained" onClick={handleAddOrUpdateBanner}>
                    {editingBannerId ? "Update banner" : "Add banner"}
                  </AppButton>
                </Stack>
              </Stack>

              <Table size="small" sx={{ mt: 3 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Type</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>Sort order</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Image(s)</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedBanners.map((item, index) => {
                    const typeLabel = BANNER_TYPE_LABELS[item.type] || item.type;
                    const previousType = paginatedBanners[index - 1]?.type;
                    const showTypeHeader = previousType !== item.type;

                    return (
                      <React.Fragment key={item.id}>
                        {showTypeHeader && (
                          <TableRow sx={{ backgroundColor: "background.default" }}>
                            <TableCell colSpan={6} sx={{ fontWeight: 700, color: "text.secondary" }}>
                              {typeLabel} ({bannerCountsByType[item.type] || 0})
                            </TableCell>
                          </TableRow>
                        )}
                        <TableRow hover>
                          <TableCell sx={{ textTransform: "capitalize" }}>{typeLabel}</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>{item.title}</TableCell>
                          <TableCell>{item.sortOrder ?? 0}</TableCell>
                          <TableCell>
                            <Chip
                              label={item.isActive ? "Active" : "Inactive"}
                              color={item.isActive ? "success" : "default"}
                              size="small"
                              variant={item.isActive ? "filled" : "outlined"}
                            />
                          </TableCell>
                          <TableCell sx={{ maxWidth: 320 }}>
                            {item.type === "home" ? (
                              item.images?.length ? (
                                <Stack direction="row" spacing={1} sx={{ overflowX: "auto" }}>
                                  {item.images.map((src, imgIndex) => (
                                    <Box
                                      key={imgIndex}
                                      component="img"
                                      src={src}
                                      alt={`${item.title} ${imgIndex + 1}`}
                                      sx={{
                                        width: 120,
                                        height: 60,
                                        borderRadius: 1,
                                        objectFit: "cover",
                                        border: "1px solid",
                                        borderColor: "divider",
                                      }}
                                    />
                                  ))}
                                </Stack>
                              ) : (
                                <Typography variant="body2" color="text.secondary">
                                  No images selected
                                </Typography>
                              )
                            ) : item.image ? (
                              <Box
                                component="img"
                                src={item.image}
                                alt={item.title}
                                sx={{
                                  width: 140,
                                  height: 60,
                                  borderRadius: 1,
                                  objectFit: "cover",
                                  border: "1px solid",
                                  borderColor: "divider",
                                }}
                              />
                            ) : (
                              <Typography variant="body2" color="text.secondary">
                                -
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell align="right">
                            <Stack direction="row" spacing={1} justifyContent="flex-end">
                              <Tooltip title="Edit">
                                <IconButton size="small" onClick={() => handleEditBanner(item.id)}>
                                  <EditOutlinedIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete">
                                <IconButton
                                  color="error"
                                  size="small"
                                  onClick={() => handleDeleteBanner(item.id)}
                                >
                                  <DeleteOutlineIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      </React.Fragment>
                    );
                  })}
                  {!banners.length && (
                    <TableRow>
                      <TableCell colSpan={6}>
                        <Typography variant="body2" color="text.secondary" align="center">
                          No banner entries yet.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              <Stack mt={2} alignItems="flex-end">
                <Pagination
                  count={Math.max(1, Math.ceil(banners.length / rowsPerPage))}
                  page={bannerPage}
                  onChange={(_, page) => setBannerPage(page)}
                  color="primary"
                  size="small"
                />
              </Stack>
            </CardContent>
          </Card>
        )}

        {/* CREATIVE AGENCY TAB */}
        {activeTab === "creative-agency" && (
          <Card sx={{ borderRadius: 0.5, border: "1px solid", borderColor: "divider" }}>
            <CardHeader
              title="Creative agency section"
              subheader="Update the two images and copy used in the homepage creative agency section."
            />
            <Divider />
            <CardContent>
              <Stack spacing={3}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <ImageUpload
                      label="Base image"
                      value={dashboardStoryForm.imageBase}
                      onChange={(value) =>
                        setDashboardStoryForm((prev) => ({ ...prev, imageBase: value }))
                      }
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <ImageUpload
                      label="Overlay image"
                      value={dashboardStoryForm.imageOverlay}
                      onChange={(value) =>
                        setDashboardStoryForm((prev) => ({ ...prev, imageOverlay: value }))
                      }
                    />
                  </Grid>
                </Grid>

                <AppTextField
                  label="Title"
                  value={dashboardStoryForm.title}
                  onChange={(event) =>
                    setDashboardStoryForm((prev) => ({ ...prev, title: event.target.value }))
                  }
                  fullWidth
                />

                <AppTextField
                  label="Description"
                  value={dashboardStoryForm.description}
                  onChange={(event) =>
                    setDashboardStoryForm((prev) => ({ ...prev, description: event.target.value }))
                  }
                  multiline
                  rows={4}
                  fullWidth
                />

               

                <Stack direction="row" spacing={2} alignItems="center">
                  <AppButton variant="contained" onClick={handleDashboardStorySave}>
                    Save creative agency content
                  </AppButton>
                  {dashboardStorySaved ? <Chip label="Saved" color="success" size="small" /> : null}
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        )}

        {/* PROCESS TAB */}
        {activeTab === "process" && (
          <Card sx={{ borderRadius: 0.5, border: "1px solid", borderColor: "divider" }}>
            <CardHeader title="Process" subheader="Capture key delivery steps." />
            <Divider />
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="subtitle1" color="text.secondary">
                  Add and edit process steps with titles, descriptions, and preview imagery.
                </Typography>
                <AppButton
                  variant="contained"
                  startIcon={<AddCircleOutlineIcon />}
                  onClick={() => openProcessDialog()}
                >
                  Add step
                </AppButton>
              </Stack>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Image</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Sort order</TableCell>
                    <TableCell>Active</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedProcessList.map((item) => (
                    <TableRow key={item.id} hover>
                      <TableCell width={120}>
                        {item.image ? (
                          <Box
                            component="img"
                            src={item.image}
                            alt={item.title || "Process preview"}
                            sx={{
                              width: 88,
                              height: 56,
                              objectFit: "cover",
                              borderRadius: 1,
                              border: "1px solid",
                              borderColor: "divider",
                            }}
                          />
                        ) : (
                          <Typography variant="caption" color="text.secondary">
                            No image
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>{item.title}</TableCell>
                      <TableCell sx={{ maxWidth: 320 }}>
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {item.description || "-"}
                        </Typography>
                      </TableCell>
                      <TableCell>{Number.isFinite(Number(item.sortOrder)) ? item.sortOrder : 0}</TableCell>
                      <TableCell>{item.isActive ? "Yes" : "No"}</TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <Tooltip title="Edit">
                            <IconButton size="small" onClick={() => openProcessDialog(item)}>
                              <EditOutlinedIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              color="error"
                              size="small"
                              onClick={() => handleDeleteProcess(item.id)}
                            >
                              <DeleteOutlineIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                  {!processList.length && (
                    <TableRow>
                      <TableCell colSpan={6}>
                        <Typography variant="body2" color="text.secondary" align="center">
                          No process steps configured yet.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              <Stack mt={2} alignItems="flex-end">
                <Pagination
                  count={Math.max(1, Math.ceil(processList.length / rowsPerPage))}
                  page={processPage}
                  onChange={(_, page) => setProcessPage(page)}
                  color="primary"
                  size="small"
                />
              </Stack>
            </CardContent>
          </Card>
        )}

        {/* OUR SERVICES TAB */}
        {activeTab === "our-services" && (
          <Card sx={{ borderRadius: 0.5, border: "1px solid", borderColor: "divider" }}>
            <CardHeader
              title="Our services"
              subheader="Manage slider title/description and the list of showcased services."
            />
            <Divider />
            <CardContent>
              <Stack spacing={3}>
                {/* Slider list */}
                <Box>
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    justifyContent="space-between"
                    alignItems={{ xs: "flex-start", sm: "center" }}
                    mb={1}
                  >
                    <Box>
                      <Typography variant="h6">Saved sliders</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Manage multiple slider variants for different contexts.
                      </Typography>
                    </Box>

                    <AppButton
                      variant="contained"
                      startIcon={<AddCircleOutlineIcon />}
                      onClick={handleCreateNewSlider}
                    >
                      New slider
                    </AppButton>
                  </Stack>

                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Image</TableCell>
                          <TableCell>Title</TableCell>
                          <TableCell>Description</TableCell>
                          <TableCell>Sort order</TableCell>
                          <TableCell>Active</TableCell>
                          <TableCell align="right">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {paginatedOurServiceSliders.map((slider) => (
                          <TableRow key={slider.id} hover>
                            <TableCell width={120}>
                              {slider.sliderImage ? (
                                <Box
                                  component="img"
                                  src={slider.sliderImage}
                                  alt={slider.sliderTitle}
                                  sx={{
                                    width: 88,
                                    height: 56,
                                    objectFit: "cover",
                                    borderRadius: 1,
                                    border: "1px solid",
                                    borderColor: "divider",
                                  }}
                                />
                              ) : (
                                <Typography variant="caption" color="text.secondary">
                                  No image
                                </Typography>
                              )}
                            </TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>
                              {slider.sliderTitle}
                            </TableCell>
                            <TableCell sx={{ maxWidth: 360 }}>
                              <Typography variant="body2" color="text.secondary" noWrap>
                                {slider.sliderDescription || "-"}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              {Number.isFinite(Number(slider.sortOrder)) ? slider.sortOrder : 0}
                            </TableCell>
                            <TableCell>{slider.isActive ? "Yes" : "No"}</TableCell>
                            <TableCell align="right">
                              <Stack direction="row" spacing={1} justifyContent="flex-end">
                                <Tooltip title="Edit slider">
                                  <IconButton
                                    size="small"
                                    color="primary"
                                    onClick={() => handleEditOurServiceSlider(slider)}
                                  >
                                    <EditOutlinedIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete slider">
                                  <IconButton
                                    size="small"
                                    color="error"
                                    onClick={() => handleDeleteOurServiceSlider(slider.id)}
                                    disabled={ourServicesSliders.length === 1}
                                  >
                                    <DeleteOutlineIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </Stack>
                            </TableCell>
                          </TableRow>
                        ))}
                        {ourServicesSliders.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={6}>
                              <Typography variant="body2" color="text.secondary" align="center">
                                No sliders configured yet.
                              </Typography>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  <Stack mt={2} alignItems="flex-end">
                    <Pagination
                      count={Math.max(
                        1,
                        Math.ceil(ourServicesSliders.length / rowsPerPage)
                      )}
                      page={ourServicesSliderPage}
                      onChange={(_, page) => setOurServicesSliderPage(page)}
                      color="primary"
                      size="small"
                    />
                  </Stack>
                  {ourHeaderSaved && (
                    <Typography mt={1} variant="body2" color="success.main">
                      Slider saved
                    </Typography>
                  )}
                </Box>

                <Divider />

                {/* Service cards */}
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  justifyContent="space-between"
                  alignItems={{ xs: "flex-start", sm: "center" }}
                >
                  <Box>
                    <Typography variant="h6">Service cards</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Add the services that appear in the carousel with titles and slider
                      mapping.
                    </Typography>
                  </Box>
                  <AppButton
                    variant="contained"
                    startIcon={<AddCircleOutlineIcon />}
                    onClick={openOurServiceCreateDialog}
                    sx={{ mt: { xs: 1, sm: 0 } }}
                    disabled={!ourServicesSliders.length}
                  >
                    Add service card
                  </AppButton>
                </Stack>

                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Title</TableCell>
                        <TableCell>Slider</TableCell>
                        <TableCell>Sort order</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paginatedServices.map((item) => {
                        const slider =
                          item.slider ??
                          ourServicesSliders.find((s) => s.id === item.sliderId) ??
                          null;
                        return (
                          <TableRow key={item.id} hover>
                            <TableCell sx={{ fontWeight: 700 }}>{item.title}</TableCell>
                            <TableCell>
                              <Typography variant="body2" color="text.secondary">
                                {slider?.sliderTitle || "-"}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              {Number.isFinite(Number(item.sortOrder)) ? item.sortOrder : 0}
                            </TableCell>
                            <TableCell align="right">
                              <Stack direction="row" spacing={1} justifyContent="flex-end">
                                <Tooltip title="Edit">
                                  <IconButton
                                    size="small"
                                    color="primary"
                                    onClick={() => openOurServiceEditDialog(item)}
                                  >
                                    <EditOutlinedIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete">
                                  <IconButton
                                    size="small"
                                    color="error"
                                    onClick={() => openOurServiceDeleteDialog(item)}
                                  >
                                    <DeleteOutlineIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </Stack>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                      {services.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={4}>
                            <Typography variant="body2" color="text.secondary" align="center">
                              No service cards configured yet.
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>

                <Stack mt={2} alignItems="flex-end">
                  <Pagination
                    count={Math.max(1, Math.ceil(services.length / rowsPerPage))}
                    page={ourServicePage}
                    onChange={(_, page) => setOurServicePage(page)}
                    color="primary"
                    size="small"
                  />
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        )}

        {/* INDUSTRIES TAB */}
        {activeTab === "industries" && (
          <Card sx={{ borderRadius: 0.5, border: "1px solid", borderColor: "divider" }}>
            <CardHeader
              title="Industries we serve"
              subheader="Set the headline and list of industries with descriptions."
            />
            <Divider />
            <CardContent>
              <Stack
                spacing={2}
                mb={3}
                direction={{ xs: "column", md: "row" }}
                alignItems={{ xs: "stretch", md: "flex-end" }}
              >
                <AppTextField
                  label="Title"
                  value={industriesConfig.title}
                  onChange={(event) =>
                    setIndustriesConfig((prev) => ({
                      ...prev,
                      title: event.target.value,
                    }))
                  }
                  fullWidth
                />
                <AppTextField
                  label="Description"
                  value={industriesConfig.description}
                  onChange={(event) =>
                    setIndustriesConfig((prev) => ({
                      ...prev,
                      description: event.target.value,
                    }))
                  }
                  fullWidth
                />
                <Stack direction="row" spacing={2} alignItems="center">
                  <AppButton variant="contained" onClick={handleIndustrySave}>
                    Save header
                  </AppButton>

                  {industrySaved && (
                    <Typography variant="body2" color="success.main">
                      Saved
                    </Typography>
                  )}
                </Stack>
              </Stack>

              <Stack direction="row" justifyContent="flex-end" mb={1}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <AppButton
                    variant="contained"
                    startIcon={<AddCircleOutlineIcon />}
                    onClick={() => openIndustryDialog()}
                  >
                    Add industry
                  </AppButton>
                </Stack>
              </Stack>

              <Table size="small" sx={{ mt: 2 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Image</TableCell>
                    <TableCell>Sort order</TableCell>
                    <TableCell>Active</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedIndustries.map((item) => (
                    <TableRow key={item.id} hover>
                      <TableCell sx={{ fontWeight: 700 }}>{item.title}</TableCell>
                      <TableCell sx={{ maxWidth: 360 }}>
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {item.description}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ maxWidth: 200 }}>
                        {item.image ? (
                          <Box
                            component="img"
                            src={item.image}
                            alt={item.title}
                            sx={{
                              width: 96,
                              height: 56,
                              objectFit: "cover",
                              borderRadius: 1,
                              border: "1px solid",
                              borderColor: "divider",
                            }}
                          />
                        ) : (
                          <Typography variant="body2" color="text.secondary" noWrap>
                            -
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>{Number.isFinite(Number(item.sortOrder)) ? item.sortOrder : 0}</TableCell>
                      <TableCell>{item.isActive ? "Yes" : "No"}</TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <Tooltip title="Edit">
                            <IconButton size="small" onClick={() => openIndustryDialog(item)}>
                              <EditOutlinedIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              color="error"
                              size="small"
                              onClick={() => handleDeleteIndustry(item.id)}
                            >
                              <DeleteOutlineIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                  {!industriesItems.length && (
                    <TableRow>
                      <TableCell colSpan={6}>
                        <Typography variant="body2" color="text.secondary" align="center">
                          No industries configured yet.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              <Stack mt={2} alignItems="flex-end">
                <Pagination
                  count={Math.max(1, Math.ceil(industriesItems.length / rowsPerPage))}
                  page={industryPage}
                  onChange={(_, page) => setIndustryPage(page)}
                  color="primary"
                  size="small"
                />
              </Stack>
            </CardContent>
          </Card>
        )}

        {/* WHY VEDX TAB */}
        {activeTab === "why-vedx" && (
          <Card sx={{ borderRadius: 0.5, border: "1px solid", borderColor: "divider" }}>
            <CardHeader
              title="Why VEDX solutions"
              subheader="Manage the reasons shown on the home page to explain why customers choose VEDX."
            />
            <Divider />
            <CardContent>
              <Stack
                spacing={2}
                mb={3}
                direction={{ xs: "column", md: "row" }}
                alignItems={{ xs: "stretch", md: "flex-end" }}
              >
                <AppTextField
                  label="Title"
                  value={whyVedxConfig.title}
                  onChange={(event) =>
                    setWhyVedxConfig((prev) => ({
                      ...prev,
                      title: event.target.value,
                    }))
                  }
                  fullWidth
                />
                <AppTextField
                  label="Description"
                  value={whyVedxConfig.description}
                  onChange={(event) =>
                    setWhyVedxConfig((prev) => ({
                      ...prev,
                      description: event.target.value,
                    }))
                  }
                  fullWidth
                />
                <Stack direction="row" spacing={2} alignItems="center">
                  <AppButton variant="contained" onClick={handleWhyVedxConfigSave}>
                    Save header
                  </AppButton>

                  {whyVedxConfigSaved && (
                    <Typography variant="body2" color="success.main">
                      Saved
                    </Typography>
                  )}
                </Stack>
              </Stack>

              <Stack direction="row" justifyContent="flex-end" mb={1}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <AppButton
                    variant="contained"
                    startIcon={<AddCircleOutlineIcon />}
                    onClick={() => openWhyVedxReasonDialog()}
                  >
                  Add reason
                </AppButton>
                </Stack>
              </Stack>
            
              <Table size="small" sx={{ mt: 2 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Image</TableCell>
                    <TableCell>Sort order</TableCell>
                    <TableCell>Active</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedWhyVedxReasons.map((item) => (
                    <TableRow key={item.id} hover>
                      <TableCell sx={{ fontWeight: 700 }}>{item.title}</TableCell>
                      <TableCell sx={{ maxWidth: 360 }}>
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {item.description}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ maxWidth: 200 }}>
                        {item.image ? (
                          <Box
                            component="img"
                            src={item.image}
                            alt={item.title}
                            sx={{
                              width: 96,
                              height: 56,
                              objectFit: "cover",
                              borderRadius: 1,
                              border: "1px solid",
                              borderColor: "divider",
                            }}
                          />
                        ) : (
                          <Typography variant="body2" color="text.secondary" noWrap>
                            -
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>{Number.isFinite(Number(item.sortOrder)) ? item.sortOrder : 0}</TableCell>
                      <TableCell>{item.isActive ? "Yes" : "No"}</TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <Tooltip title="Edit">
                            <IconButton size="small" onClick={() => openWhyVedxReasonDialog(item)}>
                              <EditOutlinedIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              color="error"
                              size="small"
                              onClick={() => openWhyVedxReasonDeleteDialog(item)}
                            >
                              <DeleteOutlineIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                  {!whyVedxReasons.length && (
                    <TableRow>
                      <TableCell colSpan={6}>
                        <Typography variant="body2" color="text.secondary" align="center">
                          No reasons added yet.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              <Stack mt={2} alignItems="flex-end">
                <Pagination
                  count={Math.max(1, Math.ceil(whyVedxReasons.length / rowsPerPage))}
                  page={whyVedxReasonPage}
                  onChange={(_, page) => setWhyVedxReasonPage(page)}
                  color="primary"
                  size="small"
                />
              </Stack>
            </CardContent>
          </Card>
        )}

        {/* TECH SOLUTIONS TAB */}
        {activeTab === "tech-solutions" && (
          <Card sx={{ borderRadius: 0.5, border: "1px solid", borderColor: "divider" }}>
            <CardHeader
              title="Tech solutions for all business types"
              subheader="Control heading, copy, and business-type specific solutions."
            />
            <Divider />
            <CardContent>
              <Stack
                spacing={2}
                mb={3}
                direction={{ xs: "column", md: "row" }}
                alignItems={{ xs: "stretch", md: "flex-end" }}
              >
                <AppTextField
                  label="Title"
                  value={techSolutionsConfig.title}
                  onChange={(event) =>
                    setTechSolutionsConfig((prev) => ({
                      ...prev,
                      title: event.target.value,
                    }))
                  }
                  fullWidth
                />
                <AppTextField
                  label="Description"
                  value={techSolutionsConfig.description}
                  onChange={(event) =>
                    setTechSolutionsConfig((prev) => ({
                      ...prev,
                      description: event.target.value,
                    }))
                  }
                  fullWidth
                />
              </Stack>

              <Stack direction="row" justifyContent="flex-end" mb={1} spacing={2}>
                <AppButton variant="contained" onClick={handleTechSolutionsSave}>
                  Save header
                </AppButton>

                {techSolutionsSaved && (
                  <Typography variant="body2" color="success.main">
                    Saved
                  </Typography>
                )}

                <AppButton
                  variant="contained"
                  startIcon={<AddCircleOutlineIcon />}
                  onClick={() => openTechSolutionDialog()}
                >
                  Add solution
                </AppButton>
              </Stack>

              <Table size="small" sx={{ mt: 2 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Sort order</TableCell>
                    <TableCell>Active</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedTechSolutions.map((item) => (
                    <TableRow key={item.id} hover>
                      <TableCell sx={{ fontWeight: 700 }}>{item.title}</TableCell>
                      <TableCell sx={{ maxWidth: 360 }}>
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {item.description}
                        </Typography>
                      </TableCell>
                      <TableCell>{Number.isFinite(Number(item.sortOrder)) ? item.sortOrder : 0}</TableCell>
                      <TableCell>{item.isActive ? "Yes" : "No"}</TableCell>
                      <TableCell align="right">
                        <Tooltip title="Edit">
                          <IconButton size="small" onClick={() => openTechSolutionDialog(item)}>
                            <EditOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            color="error"
                            size="small"
                            onClick={() => handleDeleteTechSolution(item.id)}
                          >
                            <DeleteOutlineIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                  {!techSolutionsList.length && (
                    <TableRow>
                      <TableCell colSpan={5}>
                        <Typography variant="body2" color="text.secondary" align="center">
                          No solutions configured yet.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              <Stack mt={2} alignItems="flex-end">
                <Pagination
                  count={Math.max(1, Math.ceil(techSolutionsList.length / rowsPerPage))}
                  page={techSolutionPage}
                  onChange={(_, page) => setTechSolutionPage(page)}
                  color="primary"
                  size="small"
                />
              </Stack>
            </CardContent>
          </Card>
        )}

        {/* EXPERTISE TAB */}
        {activeTab === "expertise" && (
          <Card sx={{ borderRadius: 0.5, border: "1px solid", borderColor: "divider" }}>
            <CardHeader
              title="Ways to choose our expertise"
              subheader="Manage collaboration models and proof points."
            />
            <Divider />
            <CardContent>
              <Stack
                spacing={2}
                mb={3}
                direction={{ xs: "column", md: "row" }}
                alignItems={{ xs: "stretch", md: "flex-end" }}
              >
                <AppTextField
                  label="Title"
                  value={expertiseConfig.title}
                  onChange={(event) =>
                    setExpertiseConfig((prev) => ({
                      ...prev,
                      title: event.target.value,
                    }))
                  }
                  fullWidth
                />
                <AppTextField
                  label="Description"
                  value={expertiseConfig.description}
                  onChange={(event) =>
                    setExpertiseConfig((prev) => ({
                      ...prev,
                      description: event.target.value,
                    }))
                  }
                  fullWidth
                />
              </Stack>

              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mb={1}
              >
                <Typography variant="subtitle1" color="text.secondary">
                  Add industry-style expertise options with title, description, and imagery.
                </Typography>

                <Stack direction="row" alignItems="center" spacing={2}>
                  <AppButton variant="contained" onClick={handleExpertiseSave}>
                    Save header
                  </AppButton>

                  {expertiseSaved && (
                    <Typography variant="body2" color="success.main">
                      Saved
                    </Typography>
                  )}

                  <AppButton
                    variant="contained"
                    startIcon={<AddCircleOutlineIcon />}
                    onClick={() => openExpertiseDialog()}
                  >
                    Add expertise
                  </AppButton>
                </Stack>
              </Stack>

              <Table size="small" sx={{ mt: 2 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Image</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Sort order</TableCell>
                    <TableCell>Active</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedExpertise.map((item) => (
                    <TableRow key={item.id} hover>
                      <TableCell width={120}>
                        {item.image ? (
                          <Box
                            component="img"
                            src={item.image}
                            alt={item.title || "Expertise preview"}
                            sx={{
                              width: 88,
                              height: 56,
                              objectFit: "cover",
                              borderRadius: 1,
                              border: "1px solid",
                              borderColor: "divider",
                            }}
                          />
                        ) : (
                          <Typography variant="caption" color="text.secondary">
                            No image
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>{item.title}</TableCell>
                      <TableCell sx={{ maxWidth: 360 }}>
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {item.description}
                        </Typography>
                      </TableCell>
                      <TableCell>{Number.isFinite(Number(item.sortOrder)) ? item.sortOrder : 0}</TableCell>
                      <TableCell>{item.isActive ? "Yes" : "No"}</TableCell>
                      <TableCell align="right">
                        <Tooltip title="Edit">
                          <IconButton size="small" onClick={() => openExpertiseDialog(item)}>
                            <EditOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            color="error"
                            size="small"
                            onClick={() => handleDeleteExpertise(item.id)}
                          >
                            <DeleteOutlineIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                  {!expertiseItems.length && (
                    <TableRow>
                      <TableCell colSpan={6}>
                        <Typography variant="body2" color="text.secondary" align="center">
                          No expertise options configured yet.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              <Stack mt={2} alignItems="flex-end">
                <Pagination
                  count={Math.max(1, Math.ceil(expertiseItems.length / rowsPerPage))}
                  page={expertisePage}
                  onChange={(_, page) => setExpertisePage(page)}
                  color="primary"
                  size="small"
                />
              </Stack>
            </CardContent>
          </Card>
        )}

        {/* TECHNOLOGIES TAB */}
        {activeTab === "technologies" && (
          <Card sx={{ borderRadius: 0.5, border: "1px solid", borderColor: "divider" }}>
            <CardHeader
              title="Technologies"
              subheader="Create technology cards with a title and image."
              action={
                <AppButton
                  variant="contained"
                  startIcon={<AddCircleOutlineIcon />}
                  onClick={() => openTechnologyDialog()}
                >
                  Add technology
                </AppButton>
              }
            />
            <Divider />
            <CardContent>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Image</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedTechnologies.map((item) => (
                    <TableRow key={item.id} hover>
                      <TableCell width={120}>
                        {item.image ? (
                          <Box
                            component="img"
                            src={item.image}
                            alt={item.title || "Technology preview"}
                            sx={{
                              width: 88,
                              height: 56,
                              objectFit: "cover",
                              borderRadius: 1,
                              border: "1px solid",
                              borderColor: "divider",
                            }}
                          />
                        ) : (
                          <Typography variant="caption" color="text.secondary">
                            No image
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>{item.title}</TableCell>
                      <TableCell align="right">
                        <Tooltip title="Edit">
                          <IconButton size="small" onClick={() => openTechnologyDialog(item)}>
                            <EditOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            color="error"
                            size="small"
                            onClick={() => setTechnologyToDelete(item)}
                          >
                            <DeleteOutlineIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                  {!technologies.length && (
                    <TableRow>
                      <TableCell colSpan={3}>
                        <Typography variant="body2" color="text.secondary" align="center">
                          No technologies added yet.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              <Stack mt={2} alignItems="flex-end">
                <Pagination
                  count={Math.max(1, Math.ceil(technologies.length / rowsPerPage))}
                  page={technologyPage}
                  onChange={(_, page) => setTechnologyPage(page)}
                  color="primary"
                  size="small"
                />
              </Stack>
            </CardContent>
          </Card>
        )}

      </Stack>

      {/* Our services slider dialog */}
      <AppDialog open={sliderDialogOpen} onClose={closeSliderDialog} maxWidth="md" fullWidth>
        <AppDialogTitle>{editingSliderId ? "Edit slider" : "Add slider"}</AppDialogTitle>
        <AppDialogContent dividers>
          <Box component="form" onSubmit={handleOurServicesHeroSave} sx={{ mt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <AppTextField
                  label="Slider title"
                  value={ourServicesHeroForm.sliderTitle}
                  onChange={(event) =>
                    handleOurServicesHeroChange("sliderTitle", event.target.value)
                  }
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <AppTextField
                  label="Slider description"
                  value={ourServicesHeroForm.sliderDescription}
                  onChange={(event) =>
                    handleOurServicesHeroChange("sliderDescription", event.target.value)
                  }
                  fullWidth
                  multiline
                  minRows={2}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <ImageUpload
                  label="Slider image"
                  value={ourServicesHeroForm.sliderImage}
                  onChange={(value) => handleOurServicesHeroChange("sliderImage", value)}
                  required
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <AppSelectField
                  label="Active status"
                  value={ourServicesHeroForm.isActive ? "yes" : "no"}
                  onChange={(event) =>
                    handleOurServicesHeroChange("isActive", event.target.value === "yes")
                  }
                  fullWidth
                >
                  <MenuItem value="yes">Active</MenuItem>
                  <MenuItem value="no">Inactive</MenuItem>
                </AppSelectField>
              </Grid>
              <Grid item xs={12} md={4}>
                <AppTextField
                  type="number"
                  label="Sort order"
                  value={ourServicesHeroForm.sortOrder}
                  onChange={(event) =>
                    handleOurServicesHeroChange("sortOrder", Number(event.target.value))
                  }
                  fullWidth
                  inputProps={{ min: 0 }}
                />
              </Grid>
            </Grid>
          </Box>
        </AppDialogContent>
        <AppDialogActions>
          <AppButton onClick={closeSliderDialog} color="inherit">
            Cancel
          </AppButton>
          <AppButton onClick={handleOurServicesHeroSave} variant="contained">
            {editingSliderId ? "Save slider" : "Add slider"}
          </AppButton>
        </AppDialogActions>
      </AppDialog>

      {/* Our services dialog - service */}
      <AppDialog
        open={ourServiceDialogOpen}
        onClose={closeOurServiceDialog}
        maxWidth="sm"
        fullWidth
      >
        <AppDialogTitle>
          {editingOurServiceId ? "Edit service card" : "Add service card"}
        </AppDialogTitle>

        <AppDialogContent>
          <Stack spacing={2} mt={1}>
            {/* slider selection row */}
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.5}
              alignItems={{ xs: "stretch", sm: "flex-end" }}
            >
              <AppSelectField
               
                label="Slider"
                required
                // 👇 never let it be null/undefined
                value={ourServiceForm.sliderId || ""}
                onChange={(event) =>
                  setOurServiceForm((prev) => ({
                    ...prev,
                    sliderId: event.target.value,
                  }))
                }
                fullWidth
                helperText="Choose which slider this service belongs to"
              >
                {sortedOurServicesSliders.map((slider) => (
                  <MenuItem key={slider.id} value={slider.id}>
                    {slider.sliderTitle}
                  </MenuItem>
                ))}
              </AppSelectField>

              <AppButton
                variant="outlined"
                onClick={() => setSliderPickerOpen(true)}
                sx={{ minWidth: { xs: "100%", sm: 160 } }}
                disabled={!ourServicesSliders.length}
              >
                Choose by image
              </AppButton>
            </Stack>

            {/* current selected slider preview */}
            {selectedSliderForServiceDialog && (
              <Box
                sx={{
                  border: "1px dashed",
                  borderColor: "divider",
                  borderRadius: 1,
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  p: 1,
                }}
              >
                {selectedSliderForServiceDialog.sliderImage ? (
                  <Box
                    component="img"
                    src={selectedSliderForServiceDialog.sliderImage}
                    alt={selectedSliderForServiceDialog.sliderTitle}
                    sx={{
                      width: 96,
                      height: 64,
                      objectFit: "cover",
                      borderRadius: 1,
                      border: "1px solid",
                      borderColor: "divider",
                      mr: 2,
                    }}
                  />
                ) : null}
                <Box>
                  <Typography variant="subtitle2">
                    {selectedSliderForServiceDialog.sliderTitle}
                  </Typography>
                  {selectedSliderForServiceDialog.sliderDescription && (
                    <Typography variant="caption" color="text.secondary" noWrap>
                      {selectedSliderForServiceDialog.sliderDescription}
                    </Typography>
                  )}
                </Box>
              </Box>
            )}

            <AppTextField
              label="Service title"
              required
              value={ourServiceForm.title}
              onChange={(event) =>
                setOurServiceForm((prev) => ({ ...prev, title: event.target.value }))
              }
              fullWidth
            />

            <AppTextField
              type="number"
              label="Sort order"
              value={ourServiceForm.sortOrder}
              onChange={(event) =>
                setOurServiceForm((prev) => ({ ...prev, sortOrder: Number(event.target.value) }))
              }
              fullWidth
              inputProps={{ min: 0 }}
            />
          </Stack>
        </AppDialogContent>

        <AppDialogActions>
          <AppButton onClick={closeOurServiceDialog} color="inherit">
            Cancel
          </AppButton>
          <AppButton
            onClick={handleSaveOurService}
            variant="contained"
            // 👇 ensure sliderId must be truthy (no 0 / "")
            disabled={!ourServiceForm.sliderId}
          >
            {editingOurServiceId ? "Update service" : "Add service"}
          </AppButton>
        </AppDialogActions>
      </AppDialog>


      {/* Slider picker dialog */}
      <AppDialog
        open={sliderPickerOpen}
        onClose={() => setSliderPickerOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <AppDialogTitle>Choose slider</AppDialogTitle>
        <AppDialogContent dividers>
          <Grid container spacing={2} mt={0.5}>
            {sortedOurServicesSliders.map((slider) => (
              <Grid item xs={12} sm={6} md={4} key={slider.id}>
                <Card
                  onClick={() => {
                    setOurServiceForm((prev) => ({ ...prev, sliderId: slider.id }));
                    setSliderPickerOpen(false);
                  }}
                  sx={{
                    cursor: "pointer",
                    border:
                      slider.id === ourServiceForm.sliderId ? "2px solid" : "1px solid",
                    borderColor:
                      slider.id === ourServiceForm.sliderId
                        ? "primary.main"
                        : "divider",
                  }}
                >
                  {slider.sliderImage && (
                    <Box
                      component="img"
                      src={slider.sliderImage}
                      alt={slider.sliderTitle}
                      sx={{
                        width: "100%",
                        height: 120,
                        objectFit: "cover",
                      }}
                    />
                  )}
                  <CardContent>
                    <Typography variant="subtitle2" gutterBottom noWrap>
                      {slider.sliderTitle}
                    </Typography>
                    {slider.sliderDescription && (
                      <Typography variant="caption" color="text.secondary" noWrap>
                        {slider.sliderDescription}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
            {!ourServicesSliders.length && (
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">
                  No sliders available. Please create a slider first.
                </Typography>
              </Grid>
            )}
          </Grid>
        </AppDialogContent>
        <AppDialogActions>
          <AppButton onClick={() => setSliderPickerOpen(false)}>Close</AppButton>
        </AppDialogActions>
      </AppDialog>

      {/* Delete service dialog */}
      <AppDialog
        open={ourServiceDeleteDialogOpen}
        onClose={closeOurServiceDeleteDialog}
        maxWidth="xs"
        fullWidth
      >
        <AppDialogTitle>Delete service card</AppDialogTitle>
        <AppDialogContent>
          <Typography variant="body2" color="text.secondary">
            Are you sure you want to delete &quot;{ourServicePendingDelete?.title}
            &quot;? This action cannot be undone.
          </Typography>
        </AppDialogContent>
      <AppDialogActions>
        <AppButton onClick={closeOurServiceDeleteDialog} color="inherit">
          Cancel
        </AppButton>
        <AppButton onClick={handleConfirmDeleteOurService} color="error" variant="contained">
          Delete
        </AppButton>
      </AppDialogActions>
    </AppDialog>

      {/* Why VEDX reason dialog */}
      <AppDialog
        open={whyVedxReasonDialogOpen}
        onClose={closeWhyVedxReasonDialog}
        maxWidth="sm"
        fullWidth
      >
        <AppDialogTitle>{editingWhyVedxReasonId ? "Edit reason" : "Add reason"}</AppDialogTitle>
        <AppDialogContent>
          <Stack spacing={2} mt={1}>
            <AppTextField
              label="Title"
              required
              value={whyVedxReasonForm.title}
              onChange={(event) =>
                setWhyVedxReasonForm((prev) => ({ ...prev, title: event.target.value }))
              }
              fullWidth
            />
            <AppTextField
              label="Description"
              required
              value={whyVedxReasonForm.description}
              onChange={(event) =>
                setWhyVedxReasonForm((prev) => ({
                  ...prev,
                  description: event.target.value,
                }))
              }
              fullWidth
              multiline
              minRows={3}
            />

            <ImageUpload
              label="Reason image"
              value={whyVedxReasonForm.image}
              onChange={(value) => setWhyVedxReasonForm((prev) => ({ ...prev, image: value }))}
              required
            />
            <AppTextField
              type="number"
              label="Sort order"
              value={whyVedxReasonForm.sortOrder}
              onChange={(event) =>
                setWhyVedxReasonForm((prev) => ({
                  ...prev,
                  sortOrder: Number(event.target.value),
                }))
              }
              fullWidth
              inputProps={{ min: 0 }}
            />
            <AppSelectField
              label="Active status"
              value={whyVedxReasonForm.isActive ? "yes" : "no"}
              onChange={(event) =>
                setWhyVedxReasonForm((prev) => ({
                  ...prev,
                  isActive: event.target.value === "yes",
                }))
              }
              fullWidth
            >
              <MenuItem value="yes">Active</MenuItem>
              <MenuItem value="no">Inactive</MenuItem>
            </AppSelectField>
          </Stack>
        </AppDialogContent>
        <AppDialogActions>
          <AppButton onClick={closeWhyVedxReasonDialog} color="inherit">
            Cancel
          </AppButton>
          <AppButton onClick={handleWhyVedxReasonSubmit} variant="contained">
            {editingWhyVedxReasonId ? "Update reason" : "Add reason"}
          </AppButton>
        </AppDialogActions>
      </AppDialog>

      {/* Delete why VEDX reason dialog */}
      <AppDialog
        open={whyVedxReasonDeleteDialogOpen}
        onClose={closeWhyVedxReasonDeleteDialog}
        maxWidth="xs"
        fullWidth
      >
        <AppDialogTitle>Delete reason</AppDialogTitle>
        <AppDialogContent>
          <Typography variant="body2" color="text.secondary">
            Are you sure you want to delete "{whyVedxReasonPendingDelete?.title}"? This action
            cannot be undone.
          </Typography>
        </AppDialogContent>
        <AppDialogActions>
          <AppButton onClick={closeWhyVedxReasonDeleteDialog} color="inherit">
            Cancel
          </AppButton>
          <AppButton onClick={handleConfirmDeleteWhyVedxReason} color="error" variant="contained">
            Delete
          </AppButton>
        </AppDialogActions>
      </AppDialog>

      {/* Industry dialog */}
      <AppDialog
        open={industryDialogOpen}
        onClose={closeIndustryDialog}
        maxWidth="sm"
        fullWidth
      >
        <AppDialogTitle>{editingIndustryId ? "Edit industry" : "Add industry"}</AppDialogTitle>
        <AppDialogContent>
          <Stack spacing={2} mt={1}>
            <AppTextField
              label="Industry title"
              required
              value={industryForm.title}
              onChange={(event) =>
                setIndustryForm((prev) => ({ ...prev, title: event.target.value }))
              }
              fullWidth
            />
            <AppTextField
              label="Description"
              value={industryForm.description}
              onChange={(event) =>
                setIndustryForm((prev) => ({
                  ...prev,
                  description: event.target.value,
                }))
              }
              fullWidth
              multiline
              minRows={3}
              placeholder="Add optional details for the industry"
            />
            <Box
              sx={{
                border: "1px dashed",
                borderColor: "divider",
                borderRadius: 1,
                minHeight: 140,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "background.default",
                overflow: "hidden",
                cursor: "pointer",
              }}
              onClick={() => industryFileInputRef.current?.click()}
            >
              {industryForm.image ? (
                <Box
                  component="img"
                  src={industryForm.image}
                  alt={industryForm.title || "Industry preview"}
                  sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <Typography variant="body2" color="text.secondary" align="center" px={2}>
                  Banner preview will appear here once you add a title and choose an
                  image.
                </Typography>
              )}
            </Box>
            <Stack spacing={1}>
              <AppButton variant="outlined" onClick={() => industryFileInputRef.current?.click()}>
                Choose image
              </AppButton>
              <Typography variant="caption" color="text.secondary">
                Select a single image to represent the industry.
              </Typography>
              <input
                type="file"
                accept="image/*"
                hidden
                ref={industryFileInputRef}
                onChange={handleIndustryImageChange}
              />
            </Stack>
            <AppTextField
              type="number"
              label="Sort order"
              value={industryForm.sortOrder}
              onChange={(event) =>
                setIndustryForm((prev) => ({
                  ...prev,
                  sortOrder: Number(event.target.value),
                }))
              }
              fullWidth
              inputProps={{ min: 0 }}
            />
            <AppSelectField
              label="Active status"
              value={industryForm.isActive ? "yes" : "no"}
              onChange={(event) =>
                setIndustryForm((prev) => ({
                  ...prev,
                  isActive: event.target.value === "yes",
                }))
              }
              fullWidth
            >
              <MenuItem value="yes">Active</MenuItem>
              <MenuItem value="no">Inactive</MenuItem>
            </AppSelectField>
          </Stack>
        </AppDialogContent>
        <AppDialogActions>
          <AppButton onClick={closeIndustryDialog} color="inherit">
            Cancel
          </AppButton>
          <AppButton onClick={handleIndustrySubmit} variant="contained">
            {editingIndustryId ? "Update industry" : "Add industry"}
          </AppButton>
        </AppDialogActions>
      </AppDialog>

      {/* Tech solution dialog */}
      <AppDialog
        open={techSolutionDialogOpen}
        onClose={closeTechSolutionDialog}
        maxWidth="sm"
        fullWidth
      >
        <AppDialogTitle>{editingTechSolutionId ? "Edit solution" : "Add solution"}</AppDialogTitle>
        <AppDialogContent>
          <Stack spacing={2} mt={1}>
            <AppTextField
              label="Solution title"
              required
              value={techSolutionForm.title}
              onChange={(event) =>
                setTechSolutionForm((prev) => ({ ...prev, title: event.target.value }))
              }
              fullWidth
            />
            <AppTextField
              label="Description"
              value={techSolutionForm.description}
              onChange={(event) =>
                setTechSolutionForm((prev) => ({
                  ...prev,
                  description: event.target.value,
                }))
              }
              fullWidth
              multiline
              minRows={3}
              placeholder="Add optional details about the solution"
            />
            <AppTextField
              type="number"
              label="Sort order"
              value={techSolutionForm.sortOrder}
              onChange={(event) =>
                setTechSolutionForm((prev) => ({
                  ...prev,
                  sortOrder: Number(event.target.value),
                }))
              }
              fullWidth
              inputProps={{ min: 0 }}
            />
            <AppSelectField
              label="Active status"
              value={techSolutionForm.isActive ? "yes" : "no"}
              onChange={(event) =>
                setTechSolutionForm((prev) => ({
                  ...prev,
                  isActive: event.target.value === "yes",
                }))
              }
              fullWidth
            >
              <MenuItem value="yes">Active</MenuItem>
              <MenuItem value="no">Inactive</MenuItem>
            </AppSelectField>
          </Stack>
        </AppDialogContent>
        <AppDialogActions>
          <AppButton onClick={closeTechSolutionDialog} color="inherit">
            Cancel
          </AppButton>
          <AppButton onClick={handleTechSolutionSave} variant="contained">
            {editingTechSolutionId ? "Update solution" : "Add solution"}
          </AppButton>
        </AppDialogActions>
      </AppDialog>

      {/* Expertise dialog */}
      <AppDialog
        open={expertiseDialogOpen}
        onClose={closeExpertiseDialog}
        maxWidth="sm"
        fullWidth
      >
        <AppDialogTitle>{editingExpertiseId ? "Edit expertise" : "Add expertise"}</AppDialogTitle>
        <AppDialogContent>
          <Stack spacing={2} mt={1}>
            <AppTextField
              label="Title"
              required
              value={expertiseForm.title}
              onChange={(event) =>
                setExpertiseForm((prev) => ({ ...prev, title: event.target.value }))
              }
              fullWidth
            />
            <AppTextField
              label="Description"
              value={expertiseForm.description}
              onChange={(event) =>
                setExpertiseForm((prev) => ({
                  ...prev,
                  description: event.target.value,
                }))
              }
              fullWidth
              multiline
              minRows={3}
              placeholder="Add optional details for the expertise option"
            />
            <Box
              sx={{
                border: "1px dashed",
                borderColor: "divider",
                borderRadius: 1,
                minHeight: 140,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "background.default",
                overflow: "hidden",
                cursor: "pointer",
              }}
              onClick={() => expertiseFileInputRef.current?.click()}
            >
              {expertiseForm.image ? (
                <Box
                  component="img"
                  src={expertiseForm.image}
                  alt={expertiseForm.title || "Expertise preview"}
                  sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <Typography variant="body2" color="text.secondary" align="center" px={2}>
                  Banner preview will appear here once you add a title and choose an
                  image.
                </Typography>
              )}
            </Box>
            <Stack spacing={1}>
              <AppButton
                variant="outlined"
                onClick={() => expertiseFileInputRef.current?.click()}
                fullWidth
              >
                Choose image
              </AppButton>
              <Typography variant="caption" color="text.secondary">
                Select a single image to highlight this expertise option.
              </Typography>
              <input
                type="file"
                accept="image/*"
                hidden
                ref={expertiseFileInputRef}
                onChange={handleExpertiseImageChange}
              />
            </Stack>
            <AppTextField
              type="number"
              label="Sort order"
              value={expertiseForm.sortOrder}
              onChange={(event) =>
                setExpertiseForm((prev) => ({
                  ...prev,
                  sortOrder: Number(event.target.value),
                }))
              }
              fullWidth
              inputProps={{ min: 0 }}
            />
            <AppSelectField
              label="Active status"
              value={expertiseForm.isActive ? "yes" : "no"}
              onChange={(event) =>
                setExpertiseForm((prev) => ({
                  ...prev,
                  isActive: event.target.value === "yes",
                }))
              }
              fullWidth
            >
              <MenuItem value="yes">Active</MenuItem>
              <MenuItem value="no">Inactive</MenuItem>
            </AppSelectField>
          </Stack>
        </AppDialogContent>
      <AppDialogActions>
          <AppButton onClick={closeExpertiseDialog} color="inherit">
            Cancel
          </AppButton>
          <AppButton onClick={handleExpertiseSubmit} variant="contained">
            {editingExpertiseId ? "Update expertise" : "Add expertise"}
          </AppButton>
        </AppDialogActions>
      </AppDialog>

      {/* Technology dialog */}
      <AppDialog
        open={technologyDialogOpen}
        onClose={closeTechnologyDialog}
        maxWidth="sm"
        fullWidth
      >
        <AppDialogTitle>
          {technologyDialogMode === "edit" ? "Edit technology" : "Add technology"}
        </AppDialogTitle>
        <AppDialogContent>
          <Stack spacing={2} mt={1} component="form" onSubmit={handleTechnologySubmit}>
            <AppTextField
              label="Title"
              required
              value={technologyForm.title}
              onChange={(event) =>
                setTechnologyForm((prev) => ({ ...prev, title: event.target.value }))
              }
              fullWidth
            />
            <ImageUpload
              label="Technology image"
              value={technologyForm.image}
              onChange={(value) => setTechnologyForm((prev) => ({ ...prev, image: value }))}
              required
            />
            {technologyDialogError ? (
              <Typography variant="body2" color="error.main">
                {technologyDialogError}
              </Typography>
            ) : null}
          </Stack>
        </AppDialogContent>
        <AppDialogActions>
          <AppButton onClick={closeTechnologyDialog} color="inherit">
            Cancel
          </AppButton>
          <AppButton onClick={handleTechnologySubmit} variant="contained" disabled={savingTechnology}>
            {technologyDialogMode === "edit" ? "Save changes" : "Add technology"}
          </AppButton>
        </AppDialogActions>
      </AppDialog>

      {/* Delete technology dialog */}
      <AppDialog
        open={Boolean(technologyToDelete)}
        onClose={() => setTechnologyToDelete(null)}
        maxWidth="xs"
        fullWidth
      >
        <AppDialogTitle>Delete technology</AppDialogTitle>
        <AppDialogContent>
          <Typography variant="body2" color="text.secondary">
            Are you sure you want to delete "{technologyToDelete?.title}"? This action cannot be
            undone.
          </Typography>
        </AppDialogContent>
        <AppDialogActions>
          <AppButton onClick={() => setTechnologyToDelete(null)} color="inherit">
            Cancel
          </AppButton>
          <AppButton onClick={confirmDeleteTechnology} color="error" variant="contained">
            Delete
          </AppButton>
        </AppDialogActions>
      </AppDialog>

      {/* Process dialog */}
      <AppDialog
        open={processDialogOpen}
        onClose={closeProcessDialog}
        maxWidth="sm"
        fullWidth
      >
        <AppDialogTitle>{editingProcessId ? "Edit process step" : "Add process step"}</AppDialogTitle>
        <AppDialogContent>
          <Stack spacing={2} mt={1}>
            <AppTextField
              label="Title"
              required
              value={processForm.title}
              onChange={(event) =>
                setProcessForm((prev) => ({ ...prev, title: event.target.value }))
              }
              fullWidth
            />
            <AppTextField
              label="Description"
              value={processForm.description}
              onChange={(event) =>
                setProcessForm((prev) => ({
                  ...prev,
                  description: event.target.value,
                }))
              }
              fullWidth
              multiline
              minRows={3}
              placeholder="Add optional details for the process step"
            />
            <AppTextField
              type="number"
              label="Sort order"
              value={processForm.sortOrder}
              onChange={(event) =>
                setProcessForm((prev) => ({
                  ...prev,
                  sortOrder: Number(event.target.value),
                }))
              }
              fullWidth
              inputProps={{ min: 0 }}
            />
            <AppSelectField
              label="Active status"
              value={processForm.isActive ? "yes" : "no"}
              onChange={(event) =>
                setProcessForm((prev) => ({
                  ...prev,
                  isActive: event.target.value === "yes",
                }))
              }
              fullWidth
            >
              <MenuItem value="yes">Active</MenuItem>
              <MenuItem value="no">Inactive</MenuItem>
            </AppSelectField>
            <Box
              sx={{
                border: "1px dashed",
                borderColor: "divider",
                borderRadius: 1,
                minHeight: 140,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "background.default",
                overflow: "hidden",
                cursor: "pointer",
              }}
              onClick={() => processFileInputRef.current?.click()}
            >
              {processForm.image ? (
                <Box
                  component="img"
                  src={processForm.image}
                  alt={processForm.title || "Process preview"}
                  sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <Typography variant="body2" color="text.secondary" align="center" px={2}>
                  Banner preview will appear here once you add a title and choose an
                  image.
                </Typography>
              )}
            </Box>
            <Stack spacing={1}>
              <AppButton
                variant="outlined"
                onClick={() => processFileInputRef.current?.click()}
                fullWidth
              >
                Choose image
              </AppButton>
              <Typography variant="caption" color="text.secondary">
                Select a relevant image to accompany this process step.
              </Typography>
              <input
                type="file"
                accept="image/*"
                hidden
                ref={processFileInputRef}
                onChange={handleProcessImageChange}
              />
            </Stack>
          </Stack>
        </AppDialogContent>
        <AppDialogActions>
          <AppButton onClick={closeProcessDialog} color="inherit">
            Cancel
          </AppButton>
          <AppButton onClick={handleProcessSave} variant="contained">
            {editingProcessId ? "Update step" : "Add step"}
          </AppButton>
        </AppDialogActions>
      </AppDialog>
    </>
  );
};

export default AdminDashboardPage;

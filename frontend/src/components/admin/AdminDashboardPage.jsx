"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  MenuItem,
  Pagination,
  Stack,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  TextField,
  Tooltip,
  Typography,
  Chip,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { apiUrl } from "../../utils/const.js";

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
      <Button variant="outlined" component="label" sx={{ alignSelf: "flex-start" }}>
        Choose image
        <input
          type="file"
          accept="image/*"
          hidden
          required={required}
          onChange={handleFileChange}
        />
      </Button>
    </Stack>
  );
};

/* =======================
 * Main component
 * ======================= */

const AdminDashboardPage = () => {
  const [activeTab, setActiveTab] = useState(
    "banner" // "banner" | "process" | "our-services" | "industries" | "tech-solutions" | "expertise" | "hire"
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
  });
  const [editingBannerId, setEditingBannerId] = useState(null);
  const [bannerPage, setBannerPage] = useState(1);

  /* --------------------------
   * PROCESS
   * -------------------------- */
  const [processList, setProcessList] = useState([]);
  const [processForm, setProcessForm] = useState({
    title: "",
    description: "",
    image: "",
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
  });
  const [editingSliderId, setEditingSliderId] = useState(null);
  const [ourServicesSliderPage, setOurServicesSliderPage] = useState(1);
  const [ourHeaderSaved, setOurHeaderSaved] = useState(false);
  const [sliderDialogOpen, setSliderDialogOpen] = useState(false);

  const [services, setServices] = useState([]);
  const [ourServiceForm, setOurServiceForm] = useState({
    title: "",
    sliderId: "",
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
  });
  const [industrySaved, setIndustrySaved] = useState(false);
  const [industryDialogOpen, setIndustryDialogOpen] = useState(false);
  const [editingIndustryId, setEditingIndustryId] = useState(null);
  const [industryPage, setIndustryPage] = useState(1);

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
  });
  const [expertiseSaved, setExpertiseSaved] = useState(false);
  const [expertiseDialogOpen, setExpertiseDialogOpen] = useState(false);
  const [editingExpertiseId, setEditingExpertiseId] = useState(null);
  const [expertisePage, setExpertisePage] = useState(1);

  /* --------------------------
   * Derived selections
   * -------------------------- */
  const selectedSliderForServiceDialog =
    ourServicesSliders.find((s) => s.id === ourServiceForm.sliderId) || null;

  /* ------------------------------------------------
   * INITIAL LOAD – fetch all sections from backend
   * ------------------------------------------------ */
  useEffect(() => {
    const loadAll = async () => {
      try {
        await Promise.all([
          loadBanners(),
          loadProcessSteps(),
          loadOurServices(),
          loadIndustries(),
          loadTechSolutions(),
          loadExpertise(),
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
      image: isHome ? null : bannerForm.image || null,
      images: isHome ? bannerForm.images : [],
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

    setBannerForm({ title: "", image: "", images: [], type: "" });
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
        setBannerForm({ title: "", image: "", images: [], type: "" });
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
      });
      setEditingProcessId(item.id);
    } else {
      setProcessForm({ title: "", description: "", image: "" });
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
    setProcessForm({ title: "", description: "", image: "" });
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
            });
          } else {
            setEditingSliderId(null);
            setOurServicesHeroForm({
              sliderTitle: "",
              sliderDescription: "",
              sliderImage: "",
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
    }));

    setOurServiceDialogOpen(true);
  };

  // EDIT existing service card
  const openOurServiceEditDialog = (service) => {
    setEditingOurServiceId(service.id);
    setOurServiceForm({
      title: service.title ?? "",
      sliderId: service.sliderId ?? "",
    });
    setOurServiceDialogOpen(true);
  };

  const closeOurServiceDialog = () => {
    setOurServiceDialogOpen(false);
    setEditingOurServiceId(null);
    setOurServiceForm({
      title: "",
      sliderId: "",
    });
  };


  const handleSaveOurService = async () => {
    const title = ourServiceForm.title.trim();
    const sliderId = ourServiceForm.sliderId?.toString().trim();
    if (!title || !sliderId) return;

    const payload = {
      title,
      sliderId,
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
      });
      setEditingIndustryId(item.id);
    } else {
      setIndustryForm({ title: "", description: "", image: "" });
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
    setIndustryForm({ title: "", description: "", image: "" });
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
      setTechSolutionForm({ title: item.title, description: item.description ?? "" });
      setEditingTechSolutionId(item.id);
    } else {
      setTechSolutionForm({ title: "", description: "" });
      setEditingTechSolutionId(null);
    }
    setTechSolutionDialogOpen(true);
  };

  const closeTechSolutionDialog = () => {
    setTechSolutionDialogOpen(false);
    setEditingTechSolutionId(null);
    setTechSolutionForm({ title: "", description: "" });
  };

  const handleTechSolutionSave = async () => {
    if (!techSolutionForm.title.trim()) return;

    const payload = {
      title: techSolutionForm.title.trim(),
      description: techSolutionForm.description || null,
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
      });
      setEditingExpertiseId(item.id);
    } else {
      setExpertiseForm({ title: "", description: "", image: "" });
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
    setExpertiseForm({ title: "", description: "", image: "" });
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
   * Pagination slices
   * ----------------------------------- */
  const paginatedBanners = banners.slice(
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
  const paginatedTechSolutions = techSolutionsList.slice(
    (techSolutionPage - 1) * rowsPerPage,
    techSolutionPage * rowsPerPage
  );
  const paginatedExpertise = expertiseItems.slice(
    (expertisePage - 1) * rowsPerPage,
    expertisePage * rowsPerPage
  );
  const paginatedServices = services.slice(
    (ourServicePage - 1) * rowsPerPage,
    ourServicePage * rowsPerPage
  );
  const paginatedOurServiceSliders = ourServicesSliders.slice(
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
            <Tab value="process" label="Process" />
            <Tab value="our-services" label="Our services" />
            <Tab value="industries" label="Industries we serve" />
            <Tab value="tech-solutions" label="Tech solutions" />
            <Tab value="expertise" label="Expertise models" />
      
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
                  <TextField
                    label="Title"
                    value={bannerForm.title}
                    onChange={(event) =>
                      setBannerForm((prev) => ({ ...prev, title: event.target.value }))
                    }
                    fullWidth
                  />

                  <TextField
                    select
                    label="Type"
                    value={bannerForm.type}
                    onChange={handleBannerTypeChange}
                    fullWidth
                    helperText="Choose where this banner will be used"
                  >
                    <MenuItem value="home">Home</MenuItem>
                    <MenuItem value="about">About</MenuItem>
                    <MenuItem value="blogs">Blogs</MenuItem>
                    <MenuItem value="contact">Contact</MenuItem>
                    <MenuItem value="career">Career</MenuItem>
                  </TextField>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple={bannerForm.type === "home"}
                    style={{ display: "none" }}
                    onChange={handleBannerImageChange}
                  />
                  <Button
                    variant="outlined"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={!bannerForm.type}
                  >
                    {bannerForm.type === "home" ? "Choose images" : "Choose image"}
                  </Button>
                  <Typography variant="caption" color="text.secondary">
                    {!bannerForm.type
                      ? "Select a banner type to enable image selection. Home supports multiple images; other types use a single image."
                      : bannerForm.type === "home"
                        ? "Home banners allow selecting multiple images for the slider."
                        : "Other banner types accept a single image."}
                  </Typography>

                  <Button variant="contained" onClick={handleAddOrUpdateBanner}>
                    {editingBannerId ? "Update banner" : "Add banner"}
                  </Button>
                </Stack>
              </Stack>

              <Table size="small" sx={{ mt: 3 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Type</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>Image(s)</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedBanners.map((item) => (
                    <TableRow key={item.id} hover>
                      <TableCell sx={{ textTransform: "capitalize" }}>{item.type}</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>{item.title}</TableCell>
                      <TableCell sx={{ maxWidth: 320 }}>
                        {item.type === "home" ? (
                          item.images?.length ? (
                            <Stack direction="row" spacing={1} sx={{ overflowX: "auto" }}>
                              {item.images.map((src, index) => (
                                <Box
                                  key={index}
                                  component="img"
                                  src={src}
                                  alt={`${item.title} ${index + 1}`}
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
                  ))}
                  {!banners.length && (
                    <TableRow>
                      <TableCell colSpan={4}>
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
                <Button
                  variant="contained"
                  startIcon={<AddCircleOutlineIcon />}
                  onClick={() => openProcessDialog()}
                >
                  Add step
                </Button>
              </Stack>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Image</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>Description</TableCell>
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
                      <TableCell colSpan={4}>
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

                    <Button
                      variant="contained"
                      startIcon={<AddCircleOutlineIcon />}
                      onClick={handleCreateNewSlider}
                    >
                      New slider
                    </Button>
                  </Stack>

                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Image</TableCell>
                          <TableCell>Title</TableCell>
                          <TableCell>Description</TableCell>
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
                            <TableCell colSpan={4}>
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
                  <Button
                    variant="contained"
                    startIcon={<AddCircleOutlineIcon />}
                    onClick={openOurServiceCreateDialog}
                    sx={{ mt: { xs: 1, sm: 0 } }}
                    disabled={!ourServicesSliders.length}
                  >
                    Add service card
                  </Button>
                </Stack>

                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Title</TableCell>
                        <TableCell>Slider</TableCell>
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
                          <TableCell colSpan={3}>
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
                <TextField
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
                <TextField
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
              </Stack>

              <Stack direction="row" justifyContent="flex-end" mb={1}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Button variant="contained" onClick={handleIndustrySave}>
                    Save header
                  </Button>

                  {industrySaved && (
                    <Typography variant="body2" color="success.main">
                      Saved
                    </Typography>
                  )}

                  <Button
                    variant="contained"
                    startIcon={<AddCircleOutlineIcon />}
                    onClick={() => openIndustryDialog()}
                  >
                    Add industry
                  </Button>
                </Stack>
              </Stack>

              <Table size="small" sx={{ mt: 2 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Image</TableCell>
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
                      <TableCell colSpan={4}>
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
                <TextField
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
                <TextField
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
                <Button variant="contained" onClick={handleTechSolutionsSave}>
                  Save header
                </Button>

                {techSolutionsSaved && (
                  <Typography variant="body2" color="success.main">
                    Saved
                  </Typography>
                )}

                <Button
                  variant="contained"
                  startIcon={<AddCircleOutlineIcon />}
                  onClick={() => openTechSolutionDialog()}
                >
                  Add solution
                </Button>
              </Stack>

              <Table size="small" sx={{ mt: 2 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Description</TableCell>
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
                      <TableCell colSpan={3}>
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
                <TextField
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
                <TextField
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
                  <Button variant="contained" onClick={handleExpertiseSave}>
                    Save header
                  </Button>

                  {expertiseSaved && (
                    <Typography variant="body2" color="success.main">
                      Saved
                    </Typography>
                  )}

                  <Button
                    variant="contained"
                    startIcon={<AddCircleOutlineIcon />}
                    onClick={() => openExpertiseDialog()}
                  >
                    Add expertise
                  </Button>
                </Stack>
              </Stack>

              <Table size="small" sx={{ mt: 2 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Image</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>Description</TableCell>
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
                      <TableCell colSpan={4}>
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

      </Stack>

      {/* Our services slider dialog */}
      <Dialog open={sliderDialogOpen} onClose={closeSliderDialog} maxWidth="md" fullWidth>
        <DialogTitle>{editingSliderId ? "Edit slider" : "Add slider"}</DialogTitle>
        <DialogContent dividers>
          <Box component="form" onSubmit={handleOurServicesHeroSave} sx={{ mt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField
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
                <TextField
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
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeSliderDialog} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleOurServicesHeroSave} variant="contained">
            {editingSliderId ? "Save slider" : "Add slider"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Our services dialog - service */}
      <Dialog
        open={ourServiceDialogOpen}
        onClose={closeOurServiceDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingOurServiceId ? "Edit service card" : "Add service card"}
        </DialogTitle>

        <DialogContent>
          <Stack spacing={2} mt={1}>
            {/* slider selection row */}
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.5}
              alignItems={{ xs: "stretch", sm: "flex-end" }}
            >
              <TextField
                select
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
                {ourServicesSliders.map((slider) => (
                  <MenuItem key={slider.id} value={slider.id}>
                    {slider.sliderTitle}
                  </MenuItem>
                ))}
              </TextField>

              <Button
                variant="outlined"
                onClick={() => setSliderPickerOpen(true)}
                sx={{ minWidth: { xs: "100%", sm: 160 } }}
                disabled={!ourServicesSliders.length}
              >
                Choose by image
              </Button>
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

            <TextField
              label="Service title"
              required
              value={ourServiceForm.title}
              onChange={(event) =>
                setOurServiceForm((prev) => ({ ...prev, title: event.target.value }))
              }
              fullWidth
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={closeOurServiceDialog} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleSaveOurService}
            variant="contained"
            // 👇 ensure sliderId must be truthy (no 0 / "")
            disabled={!ourServiceForm.sliderId}
          >
            {editingOurServiceId ? "Update service" : "Add service"}
          </Button>
        </DialogActions>
      </Dialog>


      {/* Slider picker dialog */}
      <Dialog
        open={sliderPickerOpen}
        onClose={() => setSliderPickerOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Choose slider</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} mt={0.5}>
            {ourServicesSliders.map((slider) => (
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
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSliderPickerOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Delete service dialog */}
      <Dialog
        open={ourServiceDeleteDialogOpen}
        onClose={closeOurServiceDeleteDialog}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Delete service card</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Are you sure you want to delete &quot;{ourServicePendingDelete?.title}
            &quot;? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeOurServiceDeleteDialog} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleConfirmDeleteOurService} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Industry dialog */}
      <Dialog
        open={industryDialogOpen}
        onClose={closeIndustryDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{editingIndustryId ? "Edit industry" : "Add industry"}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Industry title"
              required
              value={industryForm.title}
              onChange={(event) =>
                setIndustryForm((prev) => ({ ...prev, title: event.target.value }))
              }
              fullWidth
            />
            <TextField
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
              <Button variant="outlined" onClick={() => industryFileInputRef.current?.click()}>
                Choose image
              </Button>
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
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeIndustryDialog} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleIndustrySubmit} variant="contained">
            {editingIndustryId ? "Update industry" : "Add industry"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Tech solution dialog */}
      <Dialog
        open={techSolutionDialogOpen}
        onClose={closeTechSolutionDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{editingTechSolutionId ? "Edit solution" : "Add solution"}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Solution title"
              required
              value={techSolutionForm.title}
              onChange={(event) =>
                setTechSolutionForm((prev) => ({ ...prev, title: event.target.value }))
              }
              fullWidth
            />
            <TextField
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
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeTechSolutionDialog} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleTechSolutionSave} variant="contained">
            {editingTechSolutionId ? "Update solution" : "Add solution"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Expertise dialog */}
      <Dialog
        open={expertiseDialogOpen}
        onClose={closeExpertiseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{editingExpertiseId ? "Edit expertise" : "Add expertise"}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Title"
              required
              value={expertiseForm.title}
              onChange={(event) =>
                setExpertiseForm((prev) => ({ ...prev, title: event.target.value }))
              }
              fullWidth
            />
            <TextField
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
              <Button
                variant="outlined"
                onClick={() => expertiseFileInputRef.current?.click()}
                fullWidth
              >
                Choose image
              </Button>
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
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeExpertiseDialog} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleExpertiseSubmit} variant="contained">
            {editingExpertiseId ? "Update expertise" : "Add expertise"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Process dialog */}
      <Dialog
        open={processDialogOpen}
        onClose={closeProcessDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{editingProcessId ? "Edit process step" : "Add process step"}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Title"
              required
              value={processForm.title}
              onChange={(event) =>
                setProcessForm((prev) => ({ ...prev, title: event.target.value }))
              }
              fullWidth
            />
            <TextField
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
              <Button
                variant="outlined"
                onClick={() => processFileInputRef.current?.click()}
                fullWidth
              >
                Choose image
              </Button>
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
        </DialogContent>
        <DialogActions>
          <Button onClick={closeProcessDialog} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleProcessSave} variant="contained">
            {editingProcessId ? "Update step" : "Add step"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AdminDashboardPage;

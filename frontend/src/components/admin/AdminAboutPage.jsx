"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

import {
  AppButton,
  AppDialog,
  AppDialogActions,
  AppDialogContent,
  AppDialogTitle,
  AppTextField,
} from "../shared/FormControls.jsx";
import ImageUpload from "./tabs/ImageUpload.jsx";
import { apiUrl } from "../../utils/const.js";

const initialContact = {
  title: "",
  description: "",
  image: "",
};

const initialMissionVision = {
  mission: { title: "", description: "" },
  vision: { title: "", description: "" },
};

const initialWhyChooseConfig = {
  title: "",
  description: "",
};

const initialWhyChooseItem = {
  id: null,
  title: "",
  description: "",
  image: "",
  sortOrder: 0,
  isActive: true,
};

const AdminAboutPage = () => {
  const [contactForm, setContactForm] = useState(initialContact);
  const [contactId, setContactId] = useState(null);
  const [contactSaved, setContactSaved] = useState(false);

  const [missionVisionForm, setMissionVisionForm] = useState(initialMissionVision);
  const [missionSaved, setMissionSaved] = useState(false);
  const [visionSaved, setVisionSaved] = useState(false);

  const [whyChooseConfig, setWhyChooseConfig] = useState(initialWhyChooseConfig);
  const [whyChooseSaved, setWhyChooseSaved] = useState(false);

  const [whyChooseItems, setWhyChooseItems] = useState([]);
  const [itemDialogOpen, setItemDialogOpen] = useState(false);
  const [itemDialogMode, setItemDialogMode] = useState("create");
  const [activeItem, setActiveItem] = useState(initialWhyChooseItem);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const getAuthHeaders = useCallback(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) throw new Error("Your session expired. Please log in again.");
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }, []);

  const loadContactButton = useCallback(async () => {
    try {
      const res = await fetch(apiUrl("/api/contact-buttons"));
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Unable to load contact button");

      const match = (data || []).find(
        (item) => String(item?.category || "").trim().toLowerCase() === "about"
      );

      if (match) {
        setContactId(match.id);
        setContactForm({
          title: match.title || "",
          description: match.description || "",
          image: match.image || "",
        });
      }
    } catch (error) {
      console.error("Failed to load about contact button", error);
    }
  }, []);

  const loadMissionVision = useCallback(async () => {
    try {
      const res = await fetch(apiUrl("/api/about/mission-vision"));
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Unable to load mission & vision");

      setMissionVisionForm({
        mission: {
          title: data?.mission?.title || "",
          description: data?.mission?.description || "",
        },
        vision: {
          title: data?.vision?.title || "",
          description: data?.vision?.description || "",
        },
      });
    } catch (error) {
      console.error("Failed to load mission & vision", error);
    }
  }, []);

  const loadWhyChoose = useCallback(async () => {
    try {
      const [configRes, itemsRes] = await Promise.all([
        fetch(apiUrl("/api/about/why-choose/config")),
        fetch(apiUrl("/api/about/why-choose/items")),
      ]);

      const configData = await configRes.json();
      const itemsData = await itemsRes.json();

      if (configRes.ok && configData) {
        setWhyChooseConfig({
          title: configData.title || "",
          description: configData.description || "",
        });
      }

      if (itemsRes.ok && Array.isArray(itemsData)) {
        setWhyChooseItems(itemsData);
      }
    } catch (error) {
      console.error("Failed to load about why-choose content", error);
    }
  }, []);

  useEffect(() => {
    loadContactButton();
    loadMissionVision();
    loadWhyChoose();
  }, [loadContactButton, loadMissionVision, loadWhyChoose]);

  const handleContactSave = async () => {
    try {
      setContactSaved(false);

      if (!contactForm.title || !contactForm.image) {
        return;
      }

      const payload = {
        title: contactForm.title,
        description: contactForm.description || "",
        image: contactForm.image,
        category: "about",
      };

      const url = contactId
        ? apiUrl(`/api/contact-buttons/${contactId}`)
        : apiUrl("/api/contact-buttons");

      const response = await fetch(url, {
        method: contactId ? "PUT" : "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "Unable to save contact button");
      }

      setContactId(data.id);
      setContactSaved(true);
    } catch (error) {
      console.error("Failed to save contact CTA", error);
    }
  };

  const handleMissionVisionSave = async (type) => {
    try {
      const isMission = type === "mission";
      const source = isMission ? missionVisionForm.mission : missionVisionForm.vision;

      const response = await fetch(apiUrl("/api/about/mission-vision"), {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          type,
          title: source.title,
          description: source.description,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "Unable to save mission/vision");
      }

      if (isMission) setMissionSaved(true);
      else setVisionSaved(true);
    } catch (error) {
      console.error("Failed to save mission/vision", error);
    }
  };

  const handleWhyChooseConfigSave = async () => {
    try {
      const response = await fetch(apiUrl("/api/about/why-choose/config"), {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(whyChooseConfig),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "Unable to save why-choose config");
      }

      setWhyChooseConfig({
        title: data.title || "",
        description: data.description || "",
      });
      setWhyChooseSaved(true);
    } catch (error) {
      console.error("Failed to save about why-choose config", error);
    }
  };

  const openItemDialog = (mode, item = initialWhyChooseItem) => {
    setItemDialogMode(mode);
    setActiveItem({
      id: item.id || null,
      title: item.title || "",
      description: item.description || "",
      image: item.image || "",
      sortOrder: item.sortOrder ?? 0,
      isActive: item.isActive ?? true,
    });
    setItemDialogOpen(true);
  };

  const handleItemSave = async () => {
    try {
      const payload = {
        title: activeItem.title,
        description: activeItem.description,
        image: activeItem.image,
        sortOrder: activeItem.sortOrder,
        isActive: activeItem.isActive,
      };

      const url = activeItem.id
        ? apiUrl(`/api/about/why-choose/items/${activeItem.id}`)
        : apiUrl("/api/about/why-choose/items");

      const response = await fetch(url, {
        method: activeItem.id ? "PUT" : "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "Unable to save why-choose item");
      }

      setWhyChooseItems((prev) => {
        if (activeItem.id) {
          return prev.map((item) => (item.id === activeItem.id ? data : item));
        }
        return [data, ...prev];
      });

      setItemDialogOpen(false);
    } catch (error) {
      console.error("Failed to save about why-choose item", error);
    }
  };

  const handleItemDelete = async () => {
    try {
      if (!activeItem.id) return;

      const response = await fetch(apiUrl(`/api/about/why-choose/items/${activeItem.id}`), {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data?.error || "Unable to delete item");
      }

      setWhyChooseItems((prev) => prev.filter((item) => item.id !== activeItem.id));
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error("Failed to delete about why-choose item", error);
    }
  };

  const sortedItems = useMemo(
    () => [...whyChooseItems].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)),
    [whyChooseItems]
  );

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Stack spacing={3}>
        <Card sx={{ borderRadius: 0.5, border: "1px solid", borderColor: "divider" }}>
          <CardHeader title="About contact CTA" subheader="Single CTA used for the About page contact banner." />
          <Divider />
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Stack spacing={2}>
                  <AppTextField
                    label="Title"
                    value={contactForm.title}
                    onChange={(event) =>
                      setContactForm((prev) => ({ ...prev, title: event.target.value }))
                    }
                    required
                  />
                  <AppTextField
                    label="Description"
                    value={contactForm.description}
                    onChange={(event) =>
                      setContactForm((prev) => ({ ...prev, description: event.target.value }))
                    }
                    multiline
                    minRows={4}
                  />
                </Stack>
              </Grid>
              <Grid item xs={12} md={6}>
                <ImageUpload
                  label="Background image"
                  value={contactForm.image}
                  onChange={(value) => setContactForm((prev) => ({ ...prev, image: value }))}
                  required
                />
              </Grid>
            </Grid>
            <Stack direction="row" spacing={2} sx={{ mt: 3 }} alignItems="center">
              <AppButton variant="contained" onClick={handleContactSave}>
                Save contact CTA
              </AppButton>
              {contactSaved && <Alert severity="success">Contact CTA saved.</Alert>}
            </Stack>
          </CardContent>
        </Card>

        <Card sx={{ borderRadius: 0.5, border: "1px solid", borderColor: "divider" }}>
          <CardHeader title="Mission & Vision" subheader="Update the mission and vision copy displayed on About." />
          <Divider />
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Stack spacing={2}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Mission
                  </Typography>
                  <AppTextField
                    label="Mission title"
                    value={missionVisionForm.mission.title}
                    onChange={(event) =>
                      setMissionVisionForm((prev) => ({
                        ...prev,
                        mission: { ...prev.mission, title: event.target.value },
                      }))
                    }
                    required
                  />
                  <AppTextField
                    label="Mission description"
                    value={missionVisionForm.mission.description}
                    onChange={(event) =>
                      setMissionVisionForm((prev) => ({
                        ...prev,
                        mission: { ...prev.mission, description: event.target.value },
                      }))
                    }
                    multiline
                    minRows={4}
                    required
                  />
                  <Stack direction="row" spacing={2} alignItems="center">
                    <AppButton variant="contained" onClick={() => handleMissionVisionSave("mission")}>
                      Save mission
                    </AppButton>
                    {missionSaved && <Alert severity="success">Mission saved.</Alert>}
                  </Stack>
                </Stack>
              </Grid>

              <Grid item xs={12} md={6}>
                <Stack spacing={2}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Vision
                  </Typography>
                  <AppTextField
                    label="Vision title"
                    value={missionVisionForm.vision.title}
                    onChange={(event) =>
                      setMissionVisionForm((prev) => ({
                        ...prev,
                        vision: { ...prev.vision, title: event.target.value },
                      }))
                    }
                    required
                  />
                  <AppTextField
                    label="Vision description"
                    value={missionVisionForm.vision.description}
                    onChange={(event) =>
                      setMissionVisionForm((prev) => ({
                        ...prev,
                        vision: { ...prev.vision, description: event.target.value },
                      }))
                    }
                    multiline
                    minRows={4}
                    required
                  />
                  <Stack direction="row" spacing={2} alignItems="center">
                    <AppButton variant="contained" onClick={() => handleMissionVisionSave("vision")}>
                      Save vision
                    </AppButton>
                    {visionSaved && <Alert severity="success">Vision saved.</Alert>}
                  </Stack>
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Card sx={{ borderRadius: 0.5, border: "1px solid", borderColor: "divider" }}>
          <CardHeader title="Why choose Vedx" subheader="Configure the section title and description for About." />
          <Divider />
          <CardContent>
            <Stack spacing={2}>
              <AppTextField
                label="Section title"
                value={whyChooseConfig.title}
                onChange={(event) =>
                  setWhyChooseConfig((prev) => ({ ...prev, title: event.target.value }))
                }
                required
              />
              <AppTextField
                label="Section description"
                value={whyChooseConfig.description}
                onChange={(event) =>
                  setWhyChooseConfig((prev) => ({ ...prev, description: event.target.value }))
                }
                multiline
                minRows={3}
              />
              <Stack direction="row" spacing={2} alignItems="center">
                <AppButton variant="contained" onClick={handleWhyChooseConfigSave}>
                  Save section
                </AppButton>
                {whyChooseSaved && <Alert severity="success">Why choose section saved.</Alert>}
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        <Card sx={{ borderRadius: 0.5, border: "1px solid", borderColor: "divider" }}>
          <CardHeader
            title="Why choose cards"
            subheader="Manage the title, description, and image cards for About."
            action={
              <AppButton
                size="small"
                variant="outlined"
                startIcon={<AddCircleOutlineIcon />}
                onClick={() => openItemDialog("create")}
              >
                Add card
              </AppButton>
            }
          />
          <Divider />
          <CardContent>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Image</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedItems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4}>
                        <Typography variant="body2" color="text.secondary">
                          No why-choose cards added yet.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    sortedItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.title}</TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary" noWrap>
                            {item.description}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {item.image ? (
                            <Box
                              component="img"
                              src={item.image}
                              alt={item.title}
                              sx={{ width: 64, height: 40, objectFit: "cover", borderRadius: 0.5 }}
                            />
                          ) : (
                            <Typography variant="caption" color="text.secondary">
                              No image
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell align="right">
                          <Stack direction="row" spacing={1} justifyContent="flex-end">
                            <Tooltip title="Edit">
                              <IconButton onClick={() => openItemDialog("edit", item)}>
                                <EditOutlinedIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton
                                color="error"
                                onClick={() => {
                                  setActiveItem(item);
                                  setDeleteDialogOpen(true);
                                }}
                              >
                                <DeleteOutlineIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Stack>

      <AppDialog open={itemDialogOpen} onClose={() => setItemDialogOpen(false)} maxWidth="md" fullWidth>
        <AppDialogTitle>
          {itemDialogMode === "edit" ? "Edit why-choose card" : "Add why-choose card"}
        </AppDialogTitle>
        <AppDialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Stack spacing={2}>
                <AppTextField
                  label="Title"
                  value={activeItem.title}
                  onChange={(event) => setActiveItem((prev) => ({ ...prev, title: event.target.value }))}
                  required
                />
                <AppTextField
                  label="Description"
                  value={activeItem.description}
                  onChange={(event) =>
                    setActiveItem((prev) => ({ ...prev, description: event.target.value }))
                  }
                  multiline
                  minRows={4}
                />
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <ImageUpload
                label="Card image"
                value={activeItem.image}
                onChange={(value) => setActiveItem((prev) => ({ ...prev, image: value }))}
              />
            </Grid>
          </Grid>
        </AppDialogContent>
        <AppDialogActions>
          <AppButton onClick={() => setItemDialogOpen(false)} variant="outlined">
            Cancel
          </AppButton>
          <AppButton onClick={handleItemSave} variant="contained">
            {itemDialogMode === "edit" ? "Save changes" : "Add card"}
          </AppButton>
        </AppDialogActions>
      </AppDialog>

      <AppDialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="sm" fullWidth>
        <AppDialogTitle>Delete card</AppDialogTitle>
        <AppDialogContent dividers>
          <Typography>
            Are you sure you want to delete &quot;{activeItem.title}&quot;?
          </Typography>
        </AppDialogContent>
        <AppDialogActions>
          <AppButton onClick={() => setDeleteDialogOpen(false)} variant="outlined">
            Cancel
          </AppButton>
          <AppButton onClick={handleItemDelete} variant="contained" color="error">
            Delete
          </AppButton>
        </AppDialogActions>
      </AppDialog>
    </Box>
  );
};

export default AdminAboutPage;

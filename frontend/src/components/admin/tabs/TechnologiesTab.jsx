import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import PropTypes from 'prop-types';

const TechnologiesTab = ({
  groupedTechnologies,
  technologies,
  openTechnologyCreateDialog,
  openTechnologyEditDialog,
  openTechnologyDeleteDialog,
  imagePlaceholder,
}) => (
  <Card sx={{ borderRadius: 0.5, border: '1px solid', borderColor: 'divider' }}>
    <CardHeader
      title="Technologies we support"
      subheader="Group technology blocks (Frontend / Backend) and keep the services page dynamic."
      action={
        <Button variant="contained" startIcon={<AddCircleOutlineIcon />} onClick={openTechnologyCreateDialog}>
          Add technology block
        </Button>
      }
    />
    <Divider />
    <CardContent>
      <Stack spacing={2}>
        {groupedTechnologies.map((group) => (
          <Accordion
            key={group.key}
            disableGutters
            elevation={0}
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1,
              '&:before': { display: 'none' },
            }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">
                {group.key} ({group.items.length})
              </Typography>
            </AccordionSummary>

            <AccordionDetails>
              <Stack spacing={1.5}>
                {group.items.map((tech) => (
                  <Box
                    key={tech.id}
                    sx={{
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 1,
                      p: 1.5,
                    }}
                  >
                    <Stack direction="row" spacing={2} alignItems="flex-start">
                      <Stack spacing={1} flex={1}>
                        <Stack direction="row" spacing={1} flexWrap="wrap">
                          {tech.items?.length > 0 ? (
                            tech.items.map((item, index) => (
                              <Chip
                                key={index}
                                label={item}
                                size="small"
                                color="primary"
                                variant="outlined"
                              />
                            ))
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              No items added yet.
                            </Typography>
                          )}
                        </Stack>

                        <Box
                          sx={{
                            width: 180,
                            height: 100,
                            borderRadius: 1,
                            border: '1px solid',
                            borderColor: 'divider',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: 'background.default',
                          }}
                        >
                          <Box
                            component="img"
                            src={tech.image || imagePlaceholder}
                            alt={`${tech.title} preview`}
                            sx={{
                              maxWidth: '100%',
                              maxHeight: '100%',
                              objectFit: 'contain',
                            }}
                          />
                        </Box>
                      </Stack>

                      <Stack direction="row" spacing={1}>
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => openTechnologyEditDialog(tech)}
                          >
                            <EditOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => openTechnologyDeleteDialog(tech)}
                          >
                            <DeleteOutlineIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </Stack>
                  </Box>
                ))}
              </Stack>
            </AccordionDetails>
          </Accordion>
        ))}

        {groupedTechnologies.length === 0 && (
          <Typography variant="body2" color="text.secondary" align="center">
            {technologies.length === 0
              ? 'No technology blocks configured yet.'
              : 'No technology blocks found.'}
          </Typography>
        )}
      </Stack>
    </CardContent>
  </Card>
);

TechnologiesTab.propTypes = {
  groupedTechnologies: PropTypes.arrayOf(PropTypes.shape({ key: PropTypes.string, items: PropTypes.array })).isRequired,
  technologies: PropTypes.arrayOf(PropTypes.object).isRequired,
  openTechnologyCreateDialog: PropTypes.func.isRequired,
  openTechnologyEditDialog: PropTypes.func.isRequired,
  openTechnologyDeleteDialog: PropTypes.func.isRequired,
  imagePlaceholder: PropTypes.string.isRequired,
};

export default TechnologiesTab;

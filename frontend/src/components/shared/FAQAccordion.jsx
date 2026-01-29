import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Stack,
  Typography,
  alpha,
  useTheme
} from '@mui/material';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';


const FAQAccordion = ({ faqs }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const resolvedFaqs =  faqs ;

  return (
    <Stack spacing={3}>
      <Typography
        variant="h4"
        sx={{ fontWeight: 700, textAlign: 'center', mb: 1 }}
      >
        FAQs
      </Typography>

      <Stack spacing={2}>
        {resolvedFaqs.map((faq, index) => (
          <Accordion
            key={faq.question}
            defaultExpanded={index === 0}
            sx={{
              borderRadius: 0.5,
              border: `1px solid ${alpha(
                theme.palette.divider,
                isDark ? 0.4 : 0.6
              )}`,
              backgroundColor: alpha(
                theme.palette.background.paper,
                isDark ? 0.75 : 0.97
              ),
              transition:
                'transform 0.4s ease, box-shadow 0.4s ease, border-color 0.4s ease',
              '&:hover': {
                transform: 'translateY(-5px) scale(1.02)',

              },
              '&:before': {
                display: 'none'
              }
            }}
          >
            <AccordionSummary expandIcon={<ExpandMoreRoundedIcon />}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  transition: 'color 0.3s ease',

                }}
              >
                {faq.question}
              </Typography>
            </AccordionSummary>

            <AccordionDetails>
              <Typography
                variant="body2"
                sx={{ color: 'text.secondary', lineHeight: 1.6 }}
              >
                {faq.answer}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Stack>
    </Stack>
  );
};

export default FAQAccordion;

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Stack,
  Typography
} from '@mui/material';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import { faqEntries } from '../../data/content.js';

const FAQAccordion = () => {
  return (
    <Stack spacing={3}>
      <Typography variant="h4">FAQs</Typography>
      <Stack spacing={2}>
        {faqEntries.map((faq, index) => (
          <Accordion key={faq.question} defaultExpanded={index === 0}>
            <AccordionSummary expandIcon={<ExpandMoreRoundedIcon />}>
              <Typography variant="h6">{faq.question}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
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
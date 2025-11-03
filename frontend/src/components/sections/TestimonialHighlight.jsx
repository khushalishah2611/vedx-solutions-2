import { Avatar, Grid, Paper, Stack, Typography } from '@mui/material';
import FormatQuoteRoundedIcon from '@mui/icons-material/FormatQuoteRounded';
import { testimonials } from '../../data/content.js';

const TestimonialHighlight = () => {
  return (
    <Grid container spacing={3}>
      {testimonials.map((testimonial) => (
        <Grid item xs={12} md={6} key={testimonial.name}>
          <Paper sx={{ p: { xs: 3, md: 4 }, height: '100%' }}>
            <Stack spacing={3}>
              <FormatQuoteRoundedIcon color="primary" sx={{ fontSize: 48 }} />
              <Typography variant="h6" sx={{ lineHeight: 1.6 }}>
                {testimonial.quote}
              </Typography>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: 'secondary.main' }}>{testimonial.name.charAt(0)}</Avatar>
                <Stack>
                  <Typography variant="subtitle1">{testimonial.name}</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {testimonial.title}
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};
export default TestimonialHighlight;

import { Chip, Grid, Paper, Stack, Typography } from '@mui/material';
import { products } from '../../data/content.js';

const ProductShowcase = () => {
  return (
    <Stack spacing={3}>
      <Typography variant="h4">Products engineered for outcomes</Typography>
      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item xs={12} md={4} key={product.title}>
            <Paper sx={{ p: { xs: 3, md: 4 }, height: '100%' }}>
              <Stack spacing={2}>
                <Chip label={product.tag} color="secondary" variant="outlined" sx={{ alignSelf: 'flex-start' }} />
                <Typography variant="h6">{product.title}</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {product.description}
                </Typography>
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
};

export default ProductShowcase;
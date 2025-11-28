import PropTypes from 'prop-types';
import { Container, Stack } from '@mui/material';

const PageSectionsContainer = ({
  children = null,
  spacing = 0,
  maxWidth = 'lg',
  containerSx = {},
  stackProps = {},
}) => {
  return (
    <Container maxWidth={maxWidth} sx={{  ...containerSx }}>
      <Stack spacing={spacing} {...stackProps}>
        {children}
      </Stack>
    </Container>
  );
};

PageSectionsContainer.propTypes = {
  children: PropTypes.node,
  spacing: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.object,
    PropTypes.array,
  ]),
  maxWidth: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
  ]),
  containerSx: PropTypes.object,
  stackProps: PropTypes.object,
};

export default PageSectionsContainer;

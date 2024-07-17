import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import Image from 'next/image';
import useViewModel from './useViewModel';
import { IBanner } from '@/src/common/types/banner';

/** Banner

* @param header: string 
* @param subHeader: string;
* @param headerStyle?: SxProps<Theme> (optional)
* @param backgroundColor: string;
* @param imageUrl: string;
* @param buttonLabel: string;
* @param buttonClick: () => void; // Handle banner
*/

export default function Banner({
  backgroundColor,
  slogan,
  featured_image,
  name,
  buttonClick,
  buttonLabel,
}: IBanner) {
  const { model } = useViewModel({
    buttonLabel,
    backgroundColor,
    name,
    slogan,
    featured_image,
    buttonClick,
  });

  return (
    <React.Fragment>
      <Box className="banner-root" sx={model?.classes?.root} onClick={buttonClick}>
        <Box className="banner-text-wrapper">
          <Typography variant="body1" sx={model?.classes?.header}>
            {name}
          </Typography>
          <Typography variant="body1" sx={model?.classes?.subHeader}>
            {slogan}
          </Typography>
        </Box>
        <Button variant="contained" sx={model?.classes?.button}>
          {model?.buttonLabel}
        </Button>
        <Box sx={model?.classes?.imageContainer}>
          <Image
            loader={model?.imagesData?.imageLoader}
            src={model?.imagesData?.src}
            alt={model?.imagesData?.alt}
            width={model?.imagesData?.width}
            height={model?.imagesData?.height}
            style={{ ...model?.classes?.logoStyles }}
            priority
          />
        </Box>
      </Box>
    </React.Fragment>
  );
}
